import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import App from "./App.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Work from "./pages/Work.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import SoftwareDevelopment from "./pages/SoftwareDevelopment.jsx";
import WebDevelopment from "./pages/WebDevelopment.jsx";
import AppDevelopment from "./pages/AppDevelopment.jsx";
import SaaSDevelopment from "./pages/SaaSDevelopment.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/software-development"
          element={<SoftwareDevelopment />}
        />
        <Route
          path="/web-development"
          element={<WebDevelopment />}
        />
        <Route
  path="/app-development"
  element={<AppDevelopment />}
/>
        <Route
  path="/saas-development"
  element={<SaaSDevelopment />}
/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
