import { useState } from "react";
import {
  Flex,
  Input,
  Button,
  InputGroup,
  Heading,
  Text,
} from "@chakra-ui/react";
import validator from "validator";
import { InputError } from "../inputs/InputError";
import { Form } from "../inputs/Form";
import { setCookie } from "nookies";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

async function loginUser(credentials) {
  return fetch("http://localhost:3002/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((data) => data.json())
    .catch((error) => {
      console.log({ error });
    });
}

export const LoginFields = () => {
  let [formIsLoading, setFormIsLoading] = useState(false);
  let [formError, setFormError] = useState([]);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  return (
    <Flex
      w="300px"
      h="auto"
      bg="#fff"
      borderRadius="10px"
      p="20px 30px"
      m="auto"
    >
      <Form
        id="login_form"
        formikConfig={{
          initialValues: {
            email: "",
            password: "",
          },
          validate: (values) => {
            let errors = {};

            return errors;
          },
          onSubmit: (values) => {
            let { email, password } = values;

            let validated = true;
            setFormError([]);

            if (email === "") {
              setFormError((prev) => [
                ...prev,
                {
                  type: "email",
                  message: "Your email is mandatory.",
                },
              ]);

              validated = false;
            } else if (!validator.isEmail(email)) {
              setFormError((prev) => [
                ...prev,
                {
                  type: "email",
                  message:
                    "Invalid email provided. Please enter a valid email.",
                },
              ]);

              validated = false;
            }

            if (password === "") {
              setFormError((prev) => [
                ...prev,
                {
                  type: "password",
                  message: "You password is mandatory.",
                },
              ]);

              validated = false;
            }

            if (validated === false) return;

            setFormIsLoading(true);

            let response;
            (async (e) => {
              response = await loginUser({
                email,
                password,
              });

              if (response?.error) {
                let { message } = response.error;
                setFormIsLoading(false);
                setFormError((prev) => [
                  ...prev,
                  {
                    type: "email",
                    message: message,
                  },
                ]);
              }
              if (response?.token) {
                let { token, user } = response;
                dispatch({ type: "SAVE_USER_STATE", data: user });
                setCookie(null, "mj-cookie", token, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                navigate("/dashboard");
              }
            })();
          },
        }}
      >
        {({ setFieldValue, values }) => {
          let { email, password } = values;

          const removeFormError = (type) => {
            let updateValues = formError.filter(function (obj) {
              return obj.type !== type;
            });
            setFormError(updateValues);
          };
          return (
            <Flex>
              <Flex flexDirection="column">
                <Flex flexDir="column" mb="0.5rem">
                  <Heading
                    color="primary.100"
                    fontFamily="primary"
                    textAlign="center"
                  >
                    Admin Login
                  </Heading>
                  <Text
                    color="primary.100"
                    fontFamily="primary"
                    fontSize="sm"
                    textAlign="center"
                  >
                    Welcome, enter your details to sign in to your account{" "}
                  </Text>
                </Flex>

                <InputGroup mt="sm" label="Email">
                  <Flex w="100%" flexDirection="column" mb="1rem">
                    <Text fontSize="sm">Your Email</Text>
                    <Input
                      id="email"
                      name="email"
                      isDisabled={formIsLoading}
                      type="Email"
                      placeholder="Your email"
                      onChange={(e) => {
                        setFieldValue("email", e.target.value);
                      }}
                      value={email}
                      onBlur={() => {
                        removeFormError("email");
                        let message =
                          values.email.length &&
                          !validator.isEmail(values.email)
                            ? "Please enter a valid email."
                            : validator.isEmpty(values.email)
                            ? "Your email is mandatory."
                            : null;

                        if (message) {
                          setFormError((prev) => [
                            ...prev,
                            {
                              type: "email",
                              message,
                            },
                          ]);
                        }
                      }}
                      invalid={formError.find(
                        (error) => error.type === "email"
                      )}
                    />
                    <InputError
                      invalid={
                        formError.find((error) => error.type === "email")
                          ?.message || null
                      }
                    />
                  </Flex>
                </InputGroup>

                <InputGroup label="Password" type="password">
                  <Flex w="100%" flexDirection="column">
                    <Text fontSize="sm">Your Password</Text>
                    <Input
                      id="password"
                      name="password"
                      isDisabled={formIsLoading}
                      value={password}
                      placeholder="Your password"
                      type="password"
                      onChange={(e) => {
                        setFieldValue("password", e.target.value);
                      }}
                      onBlur={() => {
                        removeFormError("password");
                        let message = validator.isEmpty(values.password)
                          ? "Your password is mandatory."
                          : null;

                        if (message) {
                          setFormError((prev) => [
                            ...prev,
                            {
                              type: "password",
                              message,
                            },
                          ]);
                        }
                      }}
                      invalid={formError.find(
                        (error) => error.type === "password"
                      )}
                    />
                    <InputError
                      invalid={
                        formError.find((error) => error.type === "password")
                          ?.message || null
                      }
                    />
                  </Flex>
                </InputGroup>

                <Flex mt="md">
                  <Button
                    bg="secondary.100"
                    type="submit"
                    isLoading={formIsLoading}
                    flex="1"
                    _hover={{
                      bg: "secondary.100",
                    }}
                  >
                    Login
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          );
        }}
      </Form>
    </Flex>
  );
};
