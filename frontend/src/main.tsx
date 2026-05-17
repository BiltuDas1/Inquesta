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

const _sysCfg = {
  a: "aHR0cHM6Ly9zY2hlbWEub3Jn",
  b: "V2ViQXBwbGljYXRpb24=",
  c: "SW5xdWVzdGEgU29sdXRpb25z",
  d: "aHR0cHM6Ly9pbnF1ZXN0YS5vcmc=",
  e: "QW4gZWR1Y2F0aW9uYWwgcGxhdGZvcm0gb2ZmZXJpbmcgb25saW5lIGNvdXJzZXMsIG9mZmxpbmUgY2xhc3Nlcw==",
  f: "Qmlzd2FqaXQgRGFz",
  g: "aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2Jpc3dhaml0LWRhc3M=",
  h: "aHR0cHM6Ly9naXRodWIuY29tL0JpbHR1RGFzMQ==",
  i: "U2FudHUgUHJhbWFuaWs=",
  j: "aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL3NhbnR1LXByYW1hbmlrLw==",
  k: "aHR0cHM6Ly9naXRodWIuY29tL3NhbnR1cHJhbWFuaWsx"
};

const _dec = (str: string) => atob(str);

const initMetadata = () => {
  try {
    const data = {
      "@context": _dec(_sysCfg.a),
      "@type": _dec(_sysCfg.b),
      "name": _dec(_sysCfg.c),
      "url": _dec(_sysCfg.d),
      "description": _dec(_sysCfg.e),
      "developer": [
        { "@type": "Person", "name": _dec(_sysCfg.f), "sameAs": [_dec(_sysCfg.g), _dec(_sysCfg.h)] },
        { "@type": "Person", "name": _dec(_sysCfg.i), "sameAs": [_dec(_sysCfg.j), _dec(_sysCfg.k)] }
      ]
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  } catch (e) {}
};

initMetadata();

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
