import React, { useEffect, useState } from "react";
import useSpotifyAuth from "../../hooks/useSpotifyAuth";

export default function ArtistsCarousel() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSpotifyAuth(); // Usar o hook para obter o token do Spotify

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/user/top-artists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setArtists(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top artists:", err);
        setLoading(false);
      });
  }, [token]); // Adicionar token como dependência

  return (
    <section className="py-8">
      <h2 className="mb-6 pl-4 text-white text-3xl font-bold tracking-tight">Seus artistas favoritos</h2>
      <div className="flex items-center overflow-x-auto gap-6 px-4 pb-4">
        {loading ? (
          <p className="text-gray-400 pl-4">Carregando artistas...</p>
        ) : artists.length === 0 ? (
          <p className="text-gray-400 pl-4">Nenhum artista encontrado.</p>
        ) : (
          artists.map((artist) => (
            <div
              className="text-center min-w-[140px] flex-shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
              key={artist.id}
            >
              <a href={artist.external_urls?.spotify || "#"} className="inline-block text-white no-underline">
                <img
                  src={artist.images?.[0]?.url || "https://placehold.co/144x144/333333/ffffff?text=Artista"}
                  alt={artist.name}
                  className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-purple-500/50 shadow-xl"
                />
                <p className="font-semibold mt-3 text-white truncate">{artist.name}</p>
                {/* Exibição de seguidores aprimorada */}
                <p className="text-gray-400 text-xs mt-0.5">{artist.followers?.total ? `${(artist.followers.total / 1000000).toFixed(1)}M seguidores` : 'Desconhecido'}</p>
              </a>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
