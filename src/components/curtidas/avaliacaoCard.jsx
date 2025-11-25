import React from "react";

// Helper: gera estrelas de acordo com a nota
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating || 0);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];
  for (let i = 0; i < fullStars; i++)
    stars.push(<span key={`f${i}`} className="text-yellow-400 text-2xl leading-none">★</span>);
  if (halfStar) stars.push(<span key="h" className="text-yellow-400 text-2xl leading-none">½</span>);
  for (let i = 0; i < emptyStars; i++)
    stars.push(<span key={`e${i}`} className="text-gray-600 text-2xl leading-none">★</span>);

  return stars;
};

// Formata data de forma simples
const formatDate = (date) => {
  if (!date) return "Recentemente";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};

export default function ReviewCard({ review }) {
  // Protege caso review seja undefined
  if (!review) return null;

  const {
    // O nome do usuário agora vem do objeto populado 'usuarioId'
    usuarioId,
    itemName = "Item Desconhecido",
    tipoItem = "Item", // O campo no DB é 'tipoItem'
    itemImageUrl = "https://placehold.co/100x100/333/fff?text=?",
    nota = 0, // O campo no DB é 'nota'
    comentario = "", // O campo no DB é 'comentario'
    createdAt,
  } = review;

  const userName = usuarioId?.nome || "Usuário Anônimo";
  const userImage = usuarioId?.spotifyProfile?.images?.[0]?.url;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 transition-shadow duration-300 hover:border-purple-500/50">
      
      {/* HEADER: Usuário e Data */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-3">
        <div className="flex items-center gap-3">
          <img src={userImage || 'https://placehold.co/40x40/BA55D3/ffffff?text=U'} alt={userName} className="w-10 h-10 rounded-full object-cover" />
          <p className="text-white text-lg font-bold hover:text-purple-400 transition cursor-pointer">{userName}</p>
        </div>
        <p className="text-gray-500 text-xs italic">{formatDate(createdAt)}</p>
      </div>

      {/* ITEM, RATING e CAPA PRINCIPAIS */}
      <div className="flex gap-5 mb-5 items-start">
        <img
          src={itemImageUrl}
          alt={itemName}
          className={`w-16 h-16 object-cover shadow-lg ${tipoItem === 'artist' ? 'rounded-full' : 'rounded-lg'} flex-shrink-0`}
        />
        
        <div className="flex flex-col justify-center">
          <h3 className="text-white text-xl font-extrabold line-clamp-2 leading-tight">{itemName}</h3>
          <p className="text-purple-400 text-sm font-medium mb-1 capitalize">({tipoItem})</p>
          <div className="flex items-center space-x-1">{getStarRating(nota)}</div>
        </div>
      </div>

      {/* COMENTÁRIO */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        {comentario && (
          <p className="text-gray-300 text-base italic leading-relaxed">"{comentario}"</p>
        )}
      </div>

      {/* FOOTER: Ações de Interação */}
      <div className="flex justify-start items-center mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex gap-4 text-sm font-medium">
          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition transform hover:scale-105">
            <span className="text-xl leading-none">❤️</span> Curtir
          </button>
          <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition transform hover:scale-105">
            <span className="text-xl leading-none">💬</span> Responder
          </button>
        </div>
      </div>
    </div>
  );
}
