import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App.jsx";
import 'leaflet/dist/leaflet.css';
import theme from "./theme/theme.js";
import L from 'leaflet';

import { AuthProvider } from "./context/AuthProvider.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { ThemeProvider, CssBaseline } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

if (import.meta.env.PROD) disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  // </React.StrictMode>
);