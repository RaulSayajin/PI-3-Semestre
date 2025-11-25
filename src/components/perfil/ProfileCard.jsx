import React from "react";

export default function ProfileCard({ item, type }) {
  if (type === "artist") {
    return (
      <div className="text-center min-w-[100px] flex-shrink-0 p-2 transition-transform hover:scale-105">
        <img
          src={item?.images?.[0]?.url || item?.itemImageUrl || "https://placehold.co/100x100/333/fff?text=A"}
          alt={item?.name || item?.itemName || "Artista"}
          className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-gray-700 shadow-xl"
        />
        <p className="text-white text-sm font-semibold mt-2 truncate w-full">{item?.name || item?.itemName}</p>
        {item.avgNota && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-gray-300 text-xs font-bold">{item.avgNota.toFixed(1)}</span>
          </div>
        )}
      </div>
    );
  } else if (type === "track") {
    return (
      <div className="bg-gray-800 rounded-lg p-3 min-w-[150px] flex-shrink-0 transition-transform hover:scale-105 shadow-md border border-gray-700">
        <img
          src={item?.album?.images?.[0]?.url || "https://placehold.co/100x100/333/fff?text=T"}
          alt={item?.name || "Música"}
          className="w-full aspect-square object-cover rounded-md mb-2"
        />
        <p className="text-white text-sm font-semibold truncate">{item?.name}</p>
        <p className="text-gray-400 text-xs truncate">
          {item?.artists?.[0]?.name || "Desconhecido"}
        </p>
      </div>
    );
  }
  return null;
}