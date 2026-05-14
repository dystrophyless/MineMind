import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import { LocaleProvider } from "./app/i18n/LocaleProvider";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
