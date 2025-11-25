import React from "react";
import { getStarRating, formatDate } from "./utils";

export default function ReviewCard({ review, onEdit, onDelete }) {
  const { itemName, nota, comentario, createdAt, itemImageUrl, _id, tipoItem } = review;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4 flex-1 items-center">
          <img
            src={itemImageUrl || "https://placehold.co/64x64/333/fff?text=?"}
            alt={itemName || "Item"}
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div>
            <h3 className="text-white font-bold text-lg mb-0.5">{itemName}</h3>
            <p className="text-gray-400 text-sm">{tipoItem}</p>
          </div>
        </div>

        <div className="text-right flex flex-col justify-end items-end">
          <div className="flex items-center space-x-1">{getStarRating(nota)}</div>
          <p className="text-gray-500 text-xs mt-1">{formatDate(createdAt)}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 mb-5 border border-gray-700">
        <p className="text-gray-300 italic">"{comentario}"</p>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700/50">
        <button 
          onClick={() => onEdit(review)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(_id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}