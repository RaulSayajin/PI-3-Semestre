import React, { useState } from "react";

export default function ReviewModal({ itemData, onClose, onSaveReview }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const itemSpotifyId = itemData?.itemSpotifyId;
  const itemName = itemData?.itemName || "Item Desconhecido";
  const imageUrl =
    itemData?.imageUrl || "https://placehold.co/100x100/333/fff?text=?";
  const itemType = itemData?.itemType || "Item";

  // Renderiza estrelas interativas
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-4xl transition-colors ${
            i <= rating
              ? "text-yellow-400"
              : "text-gray-600 hover:text-yellow-500/50"
          }`}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleSave = () => {
    if (rating === 0) return;

    // Passa os dados originais do item junto com a nova avaliação
    const fullReviewData = { ...itemData, rating, comment: comment.trim() };

    console.log("Enviando avaliação do modal:", fullReviewData);

    onSaveReview(fullReviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-purple-500/50 transform transition-all duration-300">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-4">
          <h2 className="text-white text-2xl font-bold">
            Avaliar {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-light leading-none transition"
          >
            &times;
          </button>
        </div>

        {/* Item */}
        <div className="flex items-center gap-4 mb-6 bg-gray-800 p-3 rounded-lg">
          <img // Corrigido para usar imageUrl
            src={imageUrl}
            alt={itemName}
            className={`w-16 h-16 object-cover shadow-md ${
              itemType === "artist" ? "rounded-full" : "rounded-lg"
            }`}
          />
          <div className="truncate">
            <p className="text-white text-lg font-semibold truncate">
              {itemName}
            </p>
            <p className="text-purple-400 text-sm capitalize">{itemType}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="text-center mb-6">
          <p className="text-gray-300 mb-2 font-medium">Sua nota:</p>
          <div className="flex justify-center space-x-1">{renderStars()}</div>

          {rating > 0 && (
            <p className="text-sm text-yellow-500 mt-2">
              Você deu {rating} estrela(s)! ❤️
            </p>
          )}
        </div>

        {/* Comentário */}
        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-gray-300 font-medium mb-2"
          >
            Comentário (Opcional)
          </label>

          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="O que você achou deste item? (Máximo 200 caracteres)"
            maxLength={200}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500 resize-none outline-none"
          />

          <p className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/200
          </p>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={rating === 0}
            className={`px-6 py-3 rounded-full text-white font-semibold transition-colors shadow-lg ${
              rating > 0
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Salvar Avaliação
          </button>
        </div>

      </div>
    </div>
  );
}
