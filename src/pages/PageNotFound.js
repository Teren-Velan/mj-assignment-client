import { Flex, Heading, Text, Icon, Link } from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";

function PageNotFound() {
  let uri =
    process.env.NODE_ENV === "production"
      ? `https://mighty-assignment.netlify.app/`
      : `http://localhost:3000`;

  return (
    <>
      <Flex bg="#f2f2f2">
        <Flex h="100vh" w="100vw">
          <Flex align="center" flexDir="column" m="auto">
            <Icon
              mb="1rem"
              color="secondary.100"
              w={20}
              h={20}
              as={MdErrorOutline}
            />
            <Heading>Page Not Found</Heading>
            <Flex mt="sm" flexDir="column" align="center">
              <Text>The page you are looking for does not exist</Text>
              <Text>
                Click{" "}
                <Link href={uri} textDecoration="underline">
                  here
                </Link>{" "}
                to return to the login page
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default PageNotFound;
