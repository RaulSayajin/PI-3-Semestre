import React, { useEffect, useState } from "react";
import useSpotifyAuth from "../../hooks/useSpotifyAuth";

// Componente para o Card de Música (Mais Ouvidas)
const TrackCard = ({ track }) => (
  <div
    className="bg-gray-800 rounded-xl p-3 min-w-[200px] sm:min-w-[250px] flex-shrink-0 
               border border-gray-700 hover:border-purple-500 hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shadow-lg"
  >
    <img
      src={track.album?.images?.[0]?.url || "https://placehold.co/250x188/333333/ffffff?text=Música"}
      alt={track.name}
      className="w-full h-auto aspect-[4/3] object-cover rounded-lg block mb-3 shadow-md"
    />
    <div className="p-1">
      <h3 className="text-white text-base font-semibold truncate mb-1" title={track.name}>
        {track.name}
      </h3>
      <p className="text-gray-400 text-sm truncate mb-3">
        {track.artists?.map((a) => a.name).join(", ")}
      </p>
      <div className="flex items-center justify-between">
        <button className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-purple-700 transition font-medium">
          Comentar
        </button>
        <div className="text-yellow-400 font-bold flex items-center gap-1 text-sm">
          <span className="text-lg">⭐</span> {track.popularity || 0}
        </div>
      </div>
    </div>
  </div>
);

export default function MusicCarousel() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSpotifyAuth(); // Usar o hook para obter o token do Spotify

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3000/user/top-tracks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setTracks(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top tracks:", err);
        setLoading(false);
      });
  }, [token]); // Adicionar token como dependência

  return (
    <section className="py-8">
      <h2 className="mb-6 pl-4 text-white text-3xl font-bold tracking-tight">Mais ouvidas por você</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4">
        {loading ? (
          <p className="text-gray-400 pl-4">Carregando músicas...</p>
        ) : tracks.length === 0 ? (
          <p className="text-gray-400 pl-4">Nenhuma música favorita encontrada.</p>
        ) : (
          tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))
        )}
      </div>
    </section>
  );
}
