import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");
    const expires_in = urlParams.get("expires_in");
    const error = urlParams.get("error");

    if (error) {
      console.error("❌ Erro de autenticação:", error);
      navigate("/login");
      return;
    }

    if (access_token && refresh_token && expires_in) {
      // Limpeza preventiva para garantir uma sessão limpa
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_expiry");

      // Armazenar tokens do Spotify
      const expiryTime = Date.now() + parseInt(expires_in) * 1000;
      localStorage.setItem("spotify_access_token", access_token);
      localStorage.setItem("spotify_refresh_token", refresh_token);
      localStorage.setItem("spotify_expiry", expiryTime);

      console.log("✅ Tokens do Spotify armazenados com sucesso!");
      console.log("⏱️ Expira em:", new Date(expiryTime).toLocaleString("pt-BR"));

      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      console.error("❌ Tokens não encontrados na URL");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 animate-spin">
          <div className="border-4 border-purple-500 border-transparent border-t-purple-500 rounded-full w-12 h-12 mx-auto"></div>
        </div>
        <h2 className="text-white text-xl font-semibold">Autenticando...</h2>
        <p className="text-gray-400 mt-2">Aguarde enquanto processamos sua autenticação</p>
      </div>
    </div>
  );
}
