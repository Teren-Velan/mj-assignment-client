import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";

import { Flex, Divider, Box, Heading } from "@chakra-ui/react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { MdMenu } from "react-icons/md";
import { Sidebar, SidebarHeader } from "../components/sidebar/Sidebar";
import { SidebarLeftContent } from "../components/sidebar/SidebarContent";
import { Shell, ShellHeader } from "../components/layout/Shell";
import { useSelector } from "react-redux";
import {
  AddProductModal,
  UpdateProductModal,
  DeleteProductModal,
} from "../components/modal/ProductModal";
import { useAuth } from "../utils/auth";
import nookies from "nookies";
import { useNavigate } from "react-router-dom";
import { ProductDisplay } from "../components/dashboard/ProductsDisplay";

function Dashboard() {
  let navigate = useNavigate();
  useAuth({
    onError: (error) => {
      navigate("/logout");
    },
  });
  let user = useSelector((state) => state.user);

  let cookie = nookies.get();
  const token = cookie["mj-cookie"];

  let uriDomain =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_DOMAIN
      : process.env.REACT_APP_DEV_DOMAIN;

  async function fetchAllProducts() {
    return fetch(`${uriDomain}/api/product`, {
      method: "GET",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log({ error });
      });
  }
  const { data } = useQuery("fetchAllProducts", fetchAllProducts);

  useEffect(() => {
    if (user) {
      setProductList(user?.products);
    } else {
      setProductList(data);
    }
  }, [user, user?.products?.length, data]);

  // states
  let [addProductsModalOpen, setAddProductsModalOpen] = useState(false);
  let [updateProductsModalOpen, setUpdateProductsModalOpen] = useState(false);
  let [deleteProductsModalOpen, setDeleteProductsModalOpen] = useState(false);

  let [productList, setProductList] = useState([]);
  let [selectedId, setSelectedId] = useState("");
  let [sidebarInitialState, setSidebarInitialState] = useState(null);

  return (
    <>
      <AddProductModal
        token={token}
        modal={{
          addProductsModalOpen,
          setAddProductsModalOpen,
        }}
      />
      <UpdateProductModal
        token={token}
        modal={{
          updateProductsModalOpen,
          setUpdateProductsModalOpen,
        }}
        productId={selectedId}
      />
      <DeleteProductModal
        token={token}
        modal={{
          deleteProductsModalOpen,
          setDeleteProductsModalOpen,
        }}
        productId={selectedId}
      />

      <Shell
        sidebarVariantInitialState={sidebarInitialState}
        focus="right"
        renderLeft={({ isDesktopMode, showSidebarVariant }) => {
          return (
            <Sidebar
              renderHeader={() => {
                return <SidebarHeader title={user?.email} />;
              }}
              renderContent={() => {
                return <SidebarLeftContent />;
              }}
            />
          );
        }}
        renderRight={({ isDesktopMode, showSidebarVariant }) => {
          return (
            <>
              <ShellHeader
                pl={["md", "md", "md", "md", "lg", "lg"]}
                title="Dashboard"
                leftIcon={
                  !isDesktopMode
                    ? MdMenu
                    : isDesktopMode && showSidebarVariant
                    ? AiOutlineMenuUnfold
                    : AiOutlineMenuFold
                }
              />
              <Divider />
              <Box>
                <Flex
                  maxW="100vw"
                  flexDir="column"
                  px={["sm", "sm", "md", "md", "lg", "lg"]}
                  py="sm"
                >
                  <Flex
                    flexDir="column"
                    justifyContent="space-between"
                    width={"100%"}
                    mt="sm"
                  >
                    <Heading
                      fontSize="2xl"
                      fontWeight="900"
                      color="brand1.secondary.400"
                    >
                      Products
                    </Heading>
                  </Flex>
                </Flex>
                <Flex
                  p="1rem"
                  bg="#f2f2f2"
                  borderRadius="1rem"
                  mx="auto"
                  mb="1rem"
                  h="auto"
                  w="90%"
                  box-shadow="0 3px 10px rgb(0 0 0 / 0.2)"
                >
                  <ProductDisplay
                    modal={{
                      setAddProductsModalOpen,
                      setUpdateProductsModalOpen,
                      setDeleteProductsModalOpen,
                    }}
                    setSelectedId={setSelectedId}
                    productList={{ setProductList, productList }}
                  />
                </Flex>
              </Box>
            </>
          );
        }}
      ></Shell>
    </>
  );
}

export default Dashboard;
