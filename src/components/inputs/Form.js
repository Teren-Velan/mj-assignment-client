import React from "react";
import { FormControl } from "@chakra-ui/react";
import { useFormik } from "formik";

export const Form = (props) => {
  let { id, children, formikConfig } = props;
  const formik = useFormik(formikConfig);

  return (
    <FormControl>
      <form
        id={id}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formik.handleSubmit();
        }}
      >
        {typeof children === "function" ? children(formik) : children}
      </form>
    </FormControl>
  );
};
