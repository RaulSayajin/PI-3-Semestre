import React, { useEffect, useState } from "react";
import useSpotifyAuth from "../../hooks/useSpotifyAuth";

const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-lg p-3 min-w-[180px] flex-shrink-0 animate-pulse">
    <div className="w-full aspect-square bg-gray-700 rounded-md mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const RecentlyPlayedCard = ({ item }) => (
  <div
    className="bg-gray-800 rounded-lg p-3 min-w-[180px] flex-shrink-0 
               border border-transparent hover:border-purple-500 transition-all duration-300 cursor-pointer"
  >
    <img
      src={item.track.album?.images?.[0]?.url || "https://placehold.co/180x180"}
      alt={item.track.name}
      className="w-full aspect-square object-cover rounded-md mb-2 shadow-lg"
    />
    <h3 className="text-white text-sm font-semibold truncate" title={item.track.name}>
      {item.track.name}
    </h3>
    <p className="text-gray-400 text-xs truncate">
      {item.track.artists?.map((a) => a.name).join(", ")}
    </p>
  </div>
);

export default function RecentlyPlayedCarousel() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSpotifyAuth();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3000/user/recently-played?limit=15", {
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
        console.error("Error fetching recently played tracks:", err);
        setLoading(false);
      });
  }, [token]);

  return (
    <section className="py-8">
      <h2 className="mb-6 pl-4 text-white text-3xl font-bold tracking-tight">Ouvidas Recentemente</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4">
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        
        {!loading && tracks.length === 0 ? (
          <p className="text-gray-400 pl-4">Nenhuma música tocada recentemente.</p>
        ) : (
          tracks.map((item) => <RecentlyPlayedCard key={item.played_at} item={item} />)
        )}
      </div>
    </section>
  );
}