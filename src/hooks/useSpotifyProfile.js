import { useEffect, useState } from "react";

export default function useSpotifyProfile(token) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    }

    if (token) fetchProfile();
  }, [token]);

  return profile;
}
