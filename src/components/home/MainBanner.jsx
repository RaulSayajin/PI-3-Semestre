import React, { useState, useEffect } from "react";
import useSpotifyAuth from "../../hooks/useSpotifyAuth";

export default function MainBanner() {
  const [artists, setArtists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = useSpotifyAuth();

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
      })
      .catch((err) => console.error("Erro ao buscar top artists:", err));
  }, [token]); // Adicionar token como dependência

  // alterna o artista a cada 5 segundos
  useEffect(() => {
    if (artists.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artists.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [artists]);

  const currentArtist = artists[currentIndex];

  return (
    <section className="relative h-[450px] overflow-hidden w-full rounded-2xl shadow-2xl">
      {!currentArtist && (
         <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
             Carregando Banner...
         </div>
      )}

      {currentArtist && (
        <>
          <img
            key={currentArtist.id} 
            src={currentArtist.images?.[0]?.url || "https://placehold.co/1920x450/333333/ffffff?text=Banner"}
            alt={currentArtist.name}
            className="w-full h-full object-cover object-center block transition-opacity duration-1000 opacity-100 animate-fadeIn"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/10 flex items-end p-8 md:p-12">
            <div className="max-w-xl">
              <p className="text-purple-400 text-lg font-medium mb-1">Destaque do Mês</p>
              <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                {currentArtist.name}
              </h1>
              <div className="flex gap-4 mt-2">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-full cursor-pointer transition hover:bg-purple-700 shadow-md font-semibold">
                  Ver Perfil
                </button>
                <button className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-full cursor-pointer transition hover:bg-white/20 shadow-md font-semibold">
                  Comentar
                </button>
              </div>
            </div>
          </div>
          
          <header className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full flex justify-center z-10 p-4">
             <div className="relative w-full max-w-lg">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xl">🔍</span>
               <input
                 type="text"
                 placeholder="O que você procura? Músicas, Álbuns, Usuários..."
                 className="w-full py-3 pl-12 pr-6 rounded-full border-none outline-none text-base bg-white/95 text-black placeholder-gray-500 shadow-xl focus:ring-2 focus:ring-purple-500 transition"
               />
             </div>
           </header>
        </>
      )}
    </section>
  );
}
