import { useState, useEffect } from "react";
import axios from "axios";

export default function useSpotifyAuth() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Verifica se já tem no localStorage
    const storedToken = localStorage.getItem("spotify_access_token");
    const expiry = localStorage.getItem("spotify_expiry");

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      console.log("✅ Token válido encontrado no localStorage");
      setToken(storedToken);
    } else if (storedToken && expiry && Date.now() >= parseInt(expiry)) {
      // Se expirou, tenta renovar
      console.log("⏱️ Token expirado, tentando renovar...");
      const refresh = localStorage.getItem("spotify_refresh_token");
      if (refresh) {
        axios
          .post("http://localhost:3000/auth/refresh", { refresh_token: refresh })
          .then((res) => {
            const newToken = res.data.access_token;
            const newExpiry = Date.now() + res.data.expires_in * 1000;
            localStorage.setItem("spotify_access_token", newToken);
            localStorage.setItem("spotify_expiry", newExpiry);
            console.log("✅ Token renovado com sucesso!");
            setToken(newToken);
          })
          .catch((err) => {
            console.error("❌ Erro ao renovar token:", err);
            // Se a renovação falhar, é um erro crítico de autenticação.
            // Devemos limpar toda a sessão e forçar um novo login.
            localStorage.removeItem("spotify_access_token");
            localStorage.removeItem("spotify_refresh_token");
            localStorage.removeItem("spotify_expiry");
            localStorage.removeItem("app_jwt_token"); // Limpa também o token da nossa aplicação
            // Apenas redireciona se não estivermos já no processo de login para evitar loops.
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'; // Redireciona para o login
            }
          });
      }
    } else {
      console.log("⚠️ Nenhum token válido encontrado");
      // Se não houver token do Spotify, apenas definimos o estado como nulo.
      // Não devemos interferir com o app_jwt_token aqui.
      setToken(null);
    }
  }, []);

  return token;
}
