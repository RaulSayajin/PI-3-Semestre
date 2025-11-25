import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { AvaliacaoAPI } from '../../api/feedApi';

const formatDate = (timestamp) => {
  if (!timestamp) return "Recentemente";
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
      );
    }
    return stars;
};

export default function ReviewCard({ review, onDelete, onUpdateReview }) {
  const {
    _id,
    usuarioId,
    itemName,
    itemImageUrl,
    tipoItem,
    nota,
    comentario,
    createdAt,
    likes = [],
    comentarios = [],
  } = review;

  // Lógica para verificar se o usuário atual curtiu (precisaria do ID do usuário logado)
  const [isLiked, setIsLiked] = useState(false); 
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("spotify_access_token");
      const updatedReview = await AvaliacaoAPI.toggleLike(_id, token);
      onUpdateReview(updatedReview.data); // Atualiza o estado no componente pai
    } catch (error) {
      console.error("Erro ao curtir:", error);
      alert("Não foi possível processar a curtida.");
    }
  };

  const handleShare = async () => {
    try {
      await AvaliacaoAPI.shareReview(_id);
      // Copia o link para a área de transferência
      navigator.clipboard.writeText(`${window.location.origin}/review/${_id}`);
      alert("Link da avaliação copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700 transition duration-300">
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={usuarioId?.spotifyProfile?.images?.[0]?.url || "https://placehold.co/40x40"}
            alt={usuarioId?.nome}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-white">{usuarioId?.nome}</p>
            <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo da Avaliação */}
      <div className="flex gap-4 mb-4">
        <img
          src={itemImageUrl || "https://placehold.co/100x100"} // Fallback para imagem do item
          alt={itemName}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <p className="text-sm text-purple-400 font-semibold capitalize">{tipoItem}</p>
          <h3 className="text-lg font-bold text-white">{itemName}</h3>
          <div className="flex items-center">{getStarRating(nota)}</div>
        </div>
      </div>

      {comentario && (
        <div className="bg-gray-900/50 rounded-lg p-3 mb-4 border border-gray-700">
          <p className="text-gray-300 italic">"{comentario}"</p>
        </div>
      )}

      {/* Ações e Interações */}
      <div className="flex items-center justify-between text-gray-400 border-t border-gray-700 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition-colors">
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{likes.length}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <FaComment />
            <span>{comentarios.length}</span>
          </button>
        </div>
        <button onClick={handleShare} className="flex items-center gap-2 hover:text-green-400 transition-colors">
          <FaShare />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* Seção de Comentários */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-white font-semibold mb-3">Comentários</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {comentarios.length > 0 ? (
              comentarios.map(comment => (
                <div key={comment._id} className="flex items-start gap-2">
                  <img
                    src={comment.usuarioId?.spotifyProfile?.images?.[0]?.url || "https://placehold.co/32x32"}
                    alt={comment.usuarioId?.nome}
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                  <div className="bg-gray-700 rounded-lg p-2 flex-1">
                    <p className="text-sm font-bold text-white">{comment.usuarioId?.nome}</p>
                    <p className="text-sm text-gray-300">{comment.texto}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
            )}
          </div>
          {/* Formulário para novo comentário */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const texto = e.target.elements.commentText.value;
              if (!texto) return;
              try {
                const token = localStorage.getItem("spotify_access_token");
                const updatedReview = await AvaliacaoAPI.addComment(_id, texto, token);
                onUpdateReview(updatedReview.data);
                e.target.reset();
              } catch (error) {
                console.error("Erro ao comentar:", error);
                alert("Não foi possível adicionar o comentário.");
              }
            }}
            className="flex gap-2 mt-4"
          >
            <input
              name="commentText"
              type="text"
              placeholder="Adicione um comentário..."
              className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm border border-gray-600 focus:outline-none focus:border-purple-500"
            />
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}