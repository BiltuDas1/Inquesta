import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./scss/main.scss";
import App from "./app";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/inter/400.css";
import "material-symbols";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./providers/apolloclient";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./features/auth/context/authcontext";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </ApolloProvider>,
);
