import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Text, Heading, Flex, Spinner } from "@chakra-ui/react";
import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    const delayedLogoutTimer = setTimeout(() => {
      // clear cookies
      destroyCookie(null, "mj-cookie");
      // clear redux
      dispatch({ type: "LOGOUT_USER" });
      // redirect to index
      navigate("/");
    }, 2000);
  }, []);

  return (
    <>
      <Flex bg="#f2f2f2">
        <Flex h="100vh">
          <Flex m="lg" flexDir="column">
            <Heading>Logging out</Heading>
            <Flex mt="sm">
              <Spinner size="sm" p="xs" mr="sm" my="auto" />
              <Text>Please wait while we log you out of your account.</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Logout;
