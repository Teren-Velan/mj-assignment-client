import { useEffect, useState } from "react";
import {
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Box,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";

import validator from "validator";

import { Form } from "../inputs/Form";
import { InputError } from "../inputs/InputError";
import { InputWrapper } from "../inputs/InputGroup";
import { useSelector, useDispatch } from "react-redux";

let uriDomain =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_DOMAIN
    : process.env.REACT_APP_DEV_DOMAIN;

console.log({ uriDomain });

export const AddProductModal = (props) => {
  let {
    modal: { addProductsModalOpen = false, setAddProductsModalOpen },
    token,
    ...rest
  } = props;

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const onClose = () => {
    setAddProductsModalOpen(false);
  };
  const toast = useToast();

  let [formIsLoading, setFormIsLoading] = useState(false);
  let [formError, setFormError] = useState([]);

  async function AddProduct(variables) {
    return fetch(`${uriDomain}/api/product/create`, {
      method: "POST",
      mode: "cors",
      headers: {
        // "content-type": "multipart/form-data",
        authorization: token ? `Bearer ${token}` : "",
      },
      body: variables,
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log({ error });
      });
  }

  // react-redux
  let dispatch = useDispatch();
  let user = useSelector((state) => state.user);

  return (
    <Modal
      size={isLargerThan768 ? "2xl" : "full"}
      closeOnOverlayClick={false}
      isOpen={addProductsModalOpen}
      onClose={onClose}
      isCentered
      allowPinchZoom={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="secondary.200"
          pt="sm"
          pb="xs"
          px="md"
          fontWeight="normal"
          fontSize="2xl"
        >
          Add New Product
        </ModalHeader>
        <ModalBody pt="0" pb="md" px="md">
          <Form
            id="addProduct_form"
            formikConfig={{
              initialValues: {
                image: "",
                sku: "",
                title: "",
              },
              validate: (values) => {
                let errors = {};
                return errors;
              },
              onSubmit: (values) => {
                let { image, sku, title } = values;

                let validated = true;
                setFormError([]);

                if (image === "") {
                  setFormError((prev) => [
                    ...prev,
                    {
                      id: "image",
                      message: "Uploading an image is mandatory",
                    },
                  ]);

                  validated = false;
                }

                if (sku === "") {
                  setFormError((prev) => [
                    ...prev,
                    {
                      id: "sku",
                      message: "SKU field is mandatory",
                    },
                  ]);

                  validated = false;
                }
                if (title === "") {
                  setFormError((prev) => [
                    ...prev,
                    {
                      id: "title",
                      message: "Title field is mandatory",
                    },
                  ]);

                  validated = false;
                }

                if (validated === false) return;

                const formData = new FormData();
                if (image && sku && title) {
                  formData.append("image", image);
                  formData.append("sku", sku);
                  formData.append("title", title);
                }

                setFormIsLoading(true);

                let response;
                (async (e) => {
                  response = await AddProduct(formData);

                  if (response) {
                    if (response?.error) {
                      setFormIsLoading(false);
                      setAddProductsModalOpen(false);
                      toast({
                        position: "top-right",
                        title: "Error",
                        description:
                          "An unexpected error occured.Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    } else {
                      let updateUser = user;

                      setFormIsLoading(false);
                      setAddProductsModalOpen(false);
                      toast({
                        position: "top-right",
                        title: "Product Created",
                        description:
                          "Your product has been successfully created.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });

                      updateUser?.products?.unshift(response?.result);
                      dispatch({ type: "UPDATE_USER", data: updateUser });
                    }
                  } else {
                    setFormIsLoading(false);
                    setAddProductsModalOpen(false);
                    toast({
                      position: "top-right",
                      title: "Error",
                      description:
                        "An unexpected error occured.Please try again.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                })();
              },
            }}
          >
            {({ submitForm, setFieldValue, setFieldError, values }) => {
              return (
                <>
                  <Box>
                    <Flex flexDirection="column">
                      <InputWrapper
                        mt="sm"
                        label="Product Image"
                        color="brand1.secondary.400"
                      >
                        <Flex>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept=".png , .jpg , .jpeg"
                            multiple={false}
                            onChange={(event) => {
                              setFieldValue(
                                "image",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                        </Flex>

                        <InputError
                          invalid={
                            formError.find((error) => error.id === "image")
                              ?.message || null
                          }
                        />
                      </InputWrapper>

                      <InputWrapper
                        mt="sm"
                        label="Title"
                        color="brand1.secondary.400"
                      >
                        <Input
                          autoComplete="off"
                          color="brand1.secondary.400"
                          id="title"
                          name="title"
                          isDisabled={formIsLoading}
                          type="Text"
                          placeholder={"Title"}
                          onChange={(e) => {
                            setFieldValue("title", e.target.value);
                          }}
                          invalid={formError.find(
                            (error) => error.id === "title"
                          )}
                        />
                        <InputError
                          invalid={
                            formError.find((error) => error.id === "title")
                              ?.message || null
                          }
                        />
                      </InputWrapper>

                      <InputWrapper
                        mt="sm"
                        label="Storage Keeping Unit"
                        color="brand1.secondary.400"
                        // helperText="Please enter a valid Account Name as it appears in your banking records to ensure there is no delay in receiving your payout."
                      >
                        <Input
                          autoComplete="off"
                          color="brand1.secondary.400"
                          id="sku"
                          name="sku"
                          isDisabled={formIsLoading}
                          type="Text"
                          placeholder={"Stock Keeping Unit Number"}
                          onChange={(e) => {
                            setFieldValue("sku", e.target.value);
                          }}
                          invalid={formError.find(
                            (error) => error.id === "sku"
                          )}
                        />
                        <InputError
                          invalid={
                            formError.find((error) => error.id === "sku")
                              ?.message || null
                          }
                        />
                      </InputWrapper>
                    </Flex>
                  </Box>
                </>
              );
            }}
          </Form>
        </ModalBody>
        <ModalFooter p="0">
          <Button
            isDisabled={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0"
            borderBottomLeftRadius="0.4rem"
            borderTopLeftRadius="0"
            flex="1 1 0"
            onClick={() => {
              setFormError([]);
              setAddProductsModalOpen(false);
            }}
            bg="primary.100"
            color="#fff"
            _hover={{
              bg: "primary.100",
              color: "#fff",
            }}
            _active={{
              bg: "primary.100",
              color: "#fff",
            }}
          >
            Cancel
          </Button>
          <Button
            form="addProduct_form"
            type="submit"
            isLoading={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0.4rem"
            borderBottomLeftRadius="0"
            borderTopLeftRadius="0"
            flex="1 1 0"
            bg="secondary.100"
            color="#fff"
            _hover={{
              bg: "secondary.100",
              color: "#fff",
            }}
            _active={{
              bg: "secondary.100",
              color: "#fff",
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const UpdateProductModal = (props) => {
  let {
    productId,
    modal: { updateProductsModalOpen = false, setUpdateProductsModalOpen },
    token,
    ...rest
  } = props;

  // react-redux
  let dispatch = useDispatch();
  let user = useSelector((state) => state.user);

  let [productDetails, setProductDetails] = useState({
    image: "",
    title: "",
    sku: "",
  });

  let [productDetailsPlaceholder, setProductDetailsPlaceholder] = useState({
    title: "",
    sku: "",
  });

  useEffect(() => {
    let userInstance = user;
    userInstance?.products?.forEach((prod) => {
      if (prod._id === productId) {
        setProductDetailsPlaceholder({
          ...productDetailsPlaceholder,
          title: prod.title,
          sku: prod.sku,
        });
      }
    });
  }, [user, productId]);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const onClose = () => {
    setUpdateProductsModalOpen(false);
  };
  const toast = useToast();

  let [formIsLoading, setFormIsLoading] = useState(false);
  let [formError, setFormError] = useState([]);

  async function UpdateProduct(variables) {
    return fetch(`${uriDomain}/api/product/update/${productId}`, {
      method: "PUT",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      body: variables,
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log({ error });
      });
  }

  return (
    <Modal
      size={isLargerThan768 ? "2xl" : "full"}
      closeOnOverlayClick={false}
      isOpen={updateProductsModalOpen}
      onClose={onClose}
      isCentered
      allowPinchZoom={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="secondary.200"
          pt="sm"
          pb="xs"
          px="md"
          fontWeight="normal"
          fontSize="2xl"
        >
          Update Product Details
        </ModalHeader>
        <ModalBody pt="0" pb="md" px="md">
          <Form
            id="updateProduct_form"
            formikConfig={{
              initialValues: {
                image: "",
                sku: "",
                title: "",
              },
              onSubmit: (values) => {
                let { image, sku, title } = values;

                const formData = new FormData();

                if (image) {
                  formData.append("image", image);
                }
                if (sku) {
                  formData.append("sku", sku);
                }
                if (title) {
                  formData.append("title", title);
                }

                setFormIsLoading(true);

                let response;
                (async (e) => {
                  response = await UpdateProduct(formData);

                  let { updatedProductDetail } = response;

                  if (response?.error) {
                    setFormIsLoading(false);
                    setUpdateProductsModalOpen(false);
                    toast({
                      position: "top-right",
                      title: "Error",
                      description:
                        "An unexpected error occured.Please try again.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    setFormIsLoading(false);
                    setUpdateProductsModalOpen(false);
                    toast({
                      position: "top-right",
                      title: "Product Updated",
                      description:
                        "Your product has been successfully updated.",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });

                    if (updatedProductDetail) {
                      const updateUser = user;
                      updateUser?.products?.forEach((product) => {
                        if (product._id === updatedProductDetail._id) {
                          product.image = updatedProductDetail.image;
                          product.sku = updatedProductDetail.sku;
                          product.title = updatedProductDetail.title;
                        }

                        dispatch({ type: "UPDATE_USER", data: updateUser });
                      });
                    }
                  }
                })();
              },
            }}
          >
            {({ submitForm, setFieldValue, setFieldError, values }) => {
              return (
                <>
                  <Box>
                    <Flex flexDirection="column">
                      <InputWrapper
                        mt="sm"
                        label="Product Image"
                        color="brand1.secondary.400"
                      >
                        <Flex>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept=".png , .jpg , .jpeg"
                            multiple={false}
                            onChange={(event) => {
                              setFieldValue(
                                "image",
                                event.currentTarget.files[0]
                              );
                              setProductDetails({
                                ...productDetails,
                                image: URL.createObjectURL(
                                  event.currentTarget.files[0]
                                ),
                              });
                            }}
                          />
                        </Flex>

                        <InputError
                          invalid={
                            formError.find((error) => error.id === "image")
                              ?.message || null
                          }
                        />
                      </InputWrapper>

                      <InputWrapper
                        mt="sm"
                        label="Title"
                        color="brand1.secondary.400"
                      >
                        <Input
                          autoComplete="off"
                          color="brand1.secondary.400"
                          id="title"
                          name="title"
                          isDisabled={formIsLoading}
                          type="Text"
                          placeholder={
                            productDetailsPlaceholder.title || "Title"
                          }
                          onChange={(e) => {
                            setFieldValue("title", e.target.value);
                            setProductDetails({
                              ...productDetails,
                              title: e.target.value,
                            });
                          }}
                          invalid={formError.find(
                            (error) => error.id === "title"
                          )}
                        />
                        <InputError
                          invalid={
                            formError.find((error) => error.id === "title")
                              ?.message || null
                          }
                        />
                      </InputWrapper>

                      <InputWrapper
                        mt="sm"
                        label="Storage Keeping Unit"
                        color="brand1.secondary.400"
                        // helperText="Please enter a valid Account Name as it appears in your banking records to ensure there is no delay in receiving your payout."
                      >
                        <Input
                          autoComplete="off"
                          color="brand1.secondary.400"
                          id="sku"
                          name="sku"
                          isDisabled={formIsLoading}
                          type="Text"
                          placeholder={
                            productDetailsPlaceholder.sku ||
                            "Stock Keeping Unit Number"
                          }
                          onChange={(e) => {
                            setFieldValue("sku", e.target.value);
                            setProductDetails({
                              ...productDetails,
                              sku: e.target.value,
                            });
                          }}
                          invalid={formError.find(
                            (error) => error.id === "sku"
                          )}
                        />
                        <InputError
                          invalid={
                            formError.find((error) => error.id === "sku")
                              ?.message || null
                          }
                        />
                      </InputWrapper>
                    </Flex>
                  </Box>
                </>
              );
            }}
          </Form>
        </ModalBody>
        <ModalFooter p="0">
          <Button
            isDisabled={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0"
            borderBottomLeftRadius="0.4rem"
            borderTopLeftRadius="0"
            flex="1 1 0"
            onClick={() => {
              setFormError([]);
              setUpdateProductsModalOpen(false);
            }}
            bg="primary.100"
            color="#fff"
            _hover={{
              bg: "primary.100",
              color: "#fff",
            }}
            _active={{
              bg: "primary.100",
              color: "#fff",
            }}
          >
            Cancel
          </Button>
          <Button
            isDisabled={
              validator.isEmpty(productDetails.image) &&
              validator.isEmpty(productDetails.title) &&
              validator.isEmpty(productDetails.sku)
            }
            form="updateProduct_form"
            type="submit"
            isLoading={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0.4rem"
            borderBottomLeftRadius="0"
            borderTopLeftRadius="0"
            flex="1 1 0"
            bg="secondary.100"
            color="#fff"
            _hover={{
              bg: "secondary.100",
              color: "#fff",
            }}
            _active={{
              bg: "secondary.100",
              color: "#fff",
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DeleteProductModal = (props) => {
  let {
    productId,
    modal: { deleteProductsModalOpen = false, setDeleteProductsModalOpen },
    token,
    ...rest
  } = props;

  // react-redux
  let dispatch = useDispatch();
  let user = useSelector((state) => state.user);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const onClose = () => {
    setDeleteProductsModalOpen(false);
  };
  const toast = useToast();

  let [formIsLoading, setFormIsLoading] = useState(false);

  async function DeleteProduct(variables) {
    return fetch(`${uriDomain}/api/product/delete/${productId}`, {
      method: "DELETE",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      body: variables,
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log({ error });
      });
  }

  const handleSubmit = async (productId) => {
    let response = await DeleteProduct(productId);

    if (response?.error) {
      setFormIsLoading(false);
      setDeleteProductsModalOpen(false);
      toast({
        position: "top-right",
        title: "Error",
        description: "An unexpected error occured.Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      let updateUser = user;
      setFormIsLoading(false);
      setDeleteProductsModalOpen(false);
      toast({
        position: "top-right",
        title: "Product Deleted",
        description: "Your product has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (response?.deletedProduct) {
        let { deletedProduct } = response;
        let updatedUser = updateUser?.products.filter((prod) => {
          return prod._id !== deletedProduct?._id;
        });
        updateUser.products = updatedUser;
        dispatch({ type: "UPDATE_USER", data: updateUser });
      }
    }
  };

  return (
    <Modal
      size={isLargerThan768 ? "2xl" : "full"}
      closeOnOverlayClick={false}
      isOpen={deleteProductsModalOpen}
      onClose={onClose}
      isCentered
      allowPinchZoom={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="red"
          pt="sm"
          pb="xs"
          px="md"
          fontWeight="normal"
          fontSize="2xl"
        >
          Delete Product
        </ModalHeader>
        <ModalBody pt="0" pb="md" px="md">
          Are you sure you would like to delete this product?
        </ModalBody>
        <ModalFooter p="0">
          <Button
            isDisabled={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0"
            borderBottomLeftRadius="0.4rem"
            borderTopLeftRadius="0"
            flex="1 1 0"
            onClick={() => {
              setDeleteProductsModalOpen(false);
            }}
            bg="primary.100"
            color="#fff"
            _hover={{
              bg: "primary.100",
              color: "#fff",
            }}
            _active={{
              bg: "primary.100",
              color: "#fff",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setFormIsLoading(true);
              handleSubmit(productId);
            }}
            isLoading={formIsLoading}
            borderTopRightRadius="0"
            borderBottomRightRadius="0.4rem"
            borderBottomLeftRadius="0"
            borderTopLeftRadius="0"
            flex="1 1 0"
            bg="red"
            color="#fff"
            _hover={{
              bg: "red",
              color: "#fff",
            }}
            _active={{
              bg: "red",
              color: "#fff",
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
