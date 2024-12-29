import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <StrictMode>
          <App />
          <Toaster />
        </StrictMode>
      </ThemeProvider>
    </Provider>
  </HelmetProvider>
);
