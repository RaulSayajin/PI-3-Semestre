import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Login from "./pages/login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import Layout from './components/layout/Layout.jsx';
import CurtidosPage from './pages/Curtidas.jsx';
import Perfil from './pages/Perfil.jsx';
import Config from './pages/Config.jsx';
import FeedPage from './pages/Feed.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* 2. Rotas aninhadas que usarão o Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/curtidas" element={<CurtidosPage />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/config" element={<Config />} />
          <Route path="/feed" element={<FeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
