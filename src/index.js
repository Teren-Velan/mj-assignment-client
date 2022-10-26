import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { legacy_createStore as createStore } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

import { theme } from "./utils/themes";

const queryClient = new QueryClient();

const initState = {
  user: null,
};
const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "SAVE_USER_STATE":
      return { ...state, user: action.data };
    case "UPDATE_USER":
      return { ...state, user: action.data };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
const store = createStore(rootReducer, initState);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ReduxProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
