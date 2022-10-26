import React, { useState } from "react";

import {
  Flex,
  Text,
  InputGroup,
  Input,
  Button,
  Heading,
  Icon,
  InputLeftElement,
} from "@chakra-ui/react";

import { MdOutlineSearch } from "react-icons/md";

import {
  MdOutlineControlPoint,
  MdOutlineEdit,
  MdOutlineDelete,
  MdErrorOutline,
} from "react-icons/md";

export const ProductDisplay = (props) => {
  let {
    modal: {
      setAddProductsModalOpen,
      setUpdateProductsModalOpen,
      setDeleteProductsModalOpen,
    },
    setSelectedId,
    productList: { setProductList, productList },
  } = props;

  //search filter functionality
  const [searchValue, setSearchValue] = useState("");
  let filteredData = productList?.filter((prod) => {
    if (searchValue === "") {
      return prod;
    } else {
      return prod.title.includes(searchValue) || prod.sku.includes(searchValue);
    }
  });

  return (
    <Flex w="100%" flexDir="column">
      <Flex w="100%" justify="end">
        <Flex flex="3">
          <InputGroup mr="2rem">
            <InputLeftElement
              children={<MdOutlineSearch color="green.500" />}
            />
            <Input
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              value={searchValue}
              bg="#fff"
              placeholder="Search by Title or SKU"
            />
          </InputGroup>
        </Flex>

        <Flex flex="1" justify="end">
          <Button
            onClick={() => {
              setAddProductsModalOpen(true);
            }}
            _hover={{
              bg: "secondary.100",
              color: "white",
            }}
            _active={{
              bg: "secondary.100",
              color: "white",
            }}
            bg="secondary.100"
            color="white"
            leftIcon={<MdOutlineControlPoint />}
          >
            Add Product
          </Button>
        </Flex>
      </Flex>
      <Flex
        flexWrap="wrap"
        align="center"
        justify="space-evenly"
        m="0 auto"
        w="100%"
      >
        {filteredData?.length ? (
          filteredData?.map((product) => {
            let { image, sku, title, _id } = product;
            return (
              <Flex mt="2rem" flexDir="column" key={_id}>
                <Flex
                  borderTopRightRadius="1rem"
                  borderTopLeftRadius="1rem"
                  w="300px"
                  h="300px"
                  background={
                    process.env.NODE_ENV === "production"
                      ? `url(${process.env.REACT_APP_PROD_DOMAIN}/${image})`
                      : `url(${process.env.REACT_APP_DEV_DOMAIN}/${image})`
                  }
                  backgroundPosition="center"
                  backgroundSize="cover"
                  boxShadow="0 0 10px rgba(0, 0, 0, 0.315)"
                ></Flex>
                <Flex
                  borderBottomRightRadius="1rem"
                  borderBottomLeftRadius="1rem"
                  p="sm"
                  justify="center"
                  mb="1rem"
                  w="300px"
                  h="auto"
                  bg="#fff"
                >
                  <Flex
                    flexWrap="wrap"
                    justify="center"
                    flexDir="column"
                    flex="1.5"
                  >
                    <Text fontFamily="primary">Title: {title}</Text>
                    <Text fontFamily="primary">SKU: {sku}</Text>
                  </Flex>
                  <Flex align="center" justify="space-around" flex="1">
                    <Icon
                      onClick={() => {
                        setSelectedId(_id);
                        setUpdateProductsModalOpen(true);
                      }}
                      cursor="pointer"
                      p="5px"
                      w={10}
                      h={10}
                      border="1px solid green"
                      borderRadius="50%"
                      as={MdOutlineEdit}
                    />
                    <Icon
                      onClick={() => {
                        setSelectedId(_id);
                        setDeleteProductsModalOpen(true);
                      }}
                      alt="delete"
                      cursor="pointer"
                      p="5px"
                      w={10}
                      h={10}
                      border="1px solid red"
                      borderRadius="50%"
                      as={MdOutlineDelete}
                    />
                  </Flex>
                </Flex>
              </Flex>
            );
          })
        ) : (
          <Flex
            mt="md"
            w="100%"
            h="auto"
            flexDir="column"
            align="center"
            justify="center"
          >
            <Icon
              mb="1rem"
              color="secondary.100"
              w={20}
              h={20}
              as={MdErrorOutline}
            />
            <Heading
              fontFamily="primary"
              textAlign="center"
              fontSize="2xl"
              fontWeight="normal"
            >
              Click on the "Add Product" button to get started
            </Heading>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
