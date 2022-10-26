import { LoginFields } from "../components/login/LoginFields";
import { Flex } from "@chakra-ui/react";

function Login() {
  console.log({ env: process.env });
  return (
    <Flex bg="linear-gradient(to bottom right, #1425AD, #2E84CE)" h="100vh">
      <LoginFields />
    </Flex>
  );
}

export default Login;
