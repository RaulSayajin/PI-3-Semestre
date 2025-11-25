import React, { useEffect, useState, useRef } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import useSpotifyProfile from "../hooks/useSpotifyProfile";
import { AvaliacaoAPI } from "../api/feedApi";
import { formatCount } from "../components/perfil/utils";
import ReviewCard from "../components/perfil/ReviewCard";
import ProfileCard from "../components/perfil/ProfileCard";
import EditModal from "../components/perfil/EditModal";

// --- COMPONENTE PRINCIPAL ---
export default function Perfil() {
  const token = useSpotifyAuth();
  const userProfile = useSpotifyProfile(token);

  const [reviews, setReviews] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [capaUrl, setCapaUrl] = useState("https://placehold.co/1920x256/800080/ffffff?text=Capa+Personalizavel");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [reviewsData, artistsData, tracksData] = await Promise.all([
          AvaliacaoAPI.getUserReviews(token),
          AvaliacaoAPI.getUserTopArtists(token),
          AvaliacaoAPI.getUserTopTracks(token),
        ]);

        setReviews(reviewsData?.data || []);
        setTopArtists(artistsData?.data || []);
        setTopTracks(tracksData?.data || []);

      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        alert("Erro ao carregar dados do perfil. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (token && userProfile?.id) {
      fetchProfileData();
    }
  }, [token, userProfile?.id]);

  // Função para editar avaliação
  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  // Função para salvar edição (UPDATE)
  const handleSaveEdit = async (reviewId, formData) => {
    try {
      setActionLoading(true);
      const response = await AvaliacaoAPI.updateRating(reviewId, formData, token);

      console.log("Resposta da atualização:", response);
      
      // Atualiza a lista localmente
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { 
              ...review, 
              nota: formData.nota, 
              comentario: formData.comentario,
              updatedAt: new Date().toISOString()
            }
          : review
      ));
      
      setIsEditModalOpen(false);
      setEditingReview(null);
      
      alert("Avaliação atualizada com sucesso! ✅");
      
    } catch (error) {
      console.error("Erro ao editar avaliação:", error);
      const errorMessage = error.message || "Erro ao editar avaliação. Tente novamente.";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Função para excluir avaliação (DELETE)
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?\nEsta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setActionLoading(true);
      
      console.log("Excluindo avaliação:", reviewId);

      const response = await AvaliacaoAPI.deleteRating(reviewId, token);
      
      console.log("Resposta da exclusão:", response);

      setReviews(prev => prev.filter(review => review._id !== reviewId));
      
      alert("Avaliação excluída com sucesso! ✅");
      
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      const errorMessage = error.message || "Erro ao excluir avaliação. Tente novamente.";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReloadData = async () => {
    if (!token || !userProfile?.id) return;

    try {
      setLoading(true);
      const [reviewsData, artistsData, tracksData] = await Promise.all([
        AvaliacaoAPI.getUserReviews(token),
        AvaliacaoAPI.getUserTopArtists(token),        
        AvaliacaoAPI.getUserTopTracks(token),
      ]);

      setReviews(reviewsData?.data || []);
      setTopArtists(artistsData?.data || []);
      setTopTracks(tracksData?.data || []);
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
      alert("Erro ao recarregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateCapa = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem (jpeg, png, etc).');
      return;
    }

    const formData = new FormData();
    formData.append('capaImage', file);

    try {
      setActionLoading(true);
      const response = await AvaliacaoAPI.uploadCapa(formData, token);

      if (response.data?.capaUrl) {
        setCapaUrl(response.data.capaUrl);
        alert("Capa do perfil atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da capa:", error);
      alert(`Não foi possível atualizar a capa: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      {/* HEADER */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            `url(${capaUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpdateCapa}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full hover:bg-purple-600 transition-colors z-20"
          disabled={actionLoading}
        >
          {actionLoading ? 'Enviando...' : 'Alterar Capa'}
        </button>

        <div className="absolute bottom-0 left-0 p-6 sm:p-8 flex items-end w-full z-10">
          <img
            src={userProfile?.images?.[0]?.url || "https://placehold.co/128x128/333/fff?text=U"}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-900 shadow-2xl z-10 -mb-16 sm:-mb-12 transition-transform hover:scale-105"
          />
          <div className="ml-6 sm:ml-8 pb-4 text-white z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
              {userProfile?.display_name || "Seu Nome de Usuário"}
            </h1>
            <div className="flex gap-6 mt-2 text-sm font-semibold">
              <p className="hover:text-purple-400 transition cursor-pointer">
                <span className="text-purple-400">{formatCount(userProfile?.followers?.total)}</span>{" "}
                Seguidores
              </p>
              <p className="hover:text-purple-400 transition cursor-pointer">
                <span className="text-purple-400">{formatCount(reviews.length)}</span>{" "}
                Avaliações
              </p>
              <p className="text-gray-400">
                @{userProfile?.display_name?.replace(/\s/g, "").toLowerCase() || "spotifyuser"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-20 sm:pt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-xl">Carregando perfil e dados Spotify...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* REVIEWS */}
            <div className="lg:col-span-2 space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-white text-3xl font-bold border-b border-gray-700 pb-3">
                  <span className="text-purple-400">Últimas</span> Avaliações
                </h2>
                <button
                  onClick={handleReloadData}
                  disabled={actionLoading}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    '↻'
                  )}
                  Atualizar
                </button>
              </div>

              {reviews?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 italic text-lg">Nenhuma avaliação encontrada.</p>
                  <p className="text-gray-400 text-sm mt-2">Comece avaliando suas músicas e artistas favoritos!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard 
                      key={review._id} 
                      review={review} 
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              )}

              <button className="w-full bg-gray-800 text-purple-400 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
                Ver todo o histórico de avaliações ({reviews?.length || 0})
              </button>
            </div>

            {/* FAVORITOS */}
            <div className="lg:col-span-1 space-y-10">
              {/* Top Artistas */}
              <div>
                <h2 className="text-white text-2xl font-bold border-b border-gray-700 pb-2 mb-4">
                  Top Artistas 👑
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center sm:justify-start">
                  {topArtists?.length > 0 ? (
                    topArtists.map((artist) => (                      
                      <ProfileCard key={artist._id || artist.id} item={artist} type="artist" />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum artista encontrado.</p>
                  )}
                </div>
              </div>

              {/* Top Músicas */}
              <div>
                <h2 className="text-white text-2xl font-bold border-b border-gray-700 pb-2 mb-4">
                  Top Músicas 🎧
                </h2>
                <div className="flex flex-col gap-3">
                  {topTracks?.length > 0 ? (
                    topTracks.map((track) => (
                      <div
                        key={track._id || track.id}
                        className="bg-gray-800 p-3 rounded-lg flex items-center gap-3 border border-gray-700 hover:bg-gray-700/80 transition-colors"
                      >
                        <img
                          src={track?.album?.images?.[0]?.url || track?.itemImageUrl || "https://placehold.co/50x50/333/fff?text=T"}
                          alt={track?.name || track?.itemName || "Música"}
                          className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{track?.name || track?.itemName}</p>
                          <p className="text-gray-400 text-xs truncate">
                            {track?.artists?.[0]?.name || "Desconhecido"}
                          </p>
                        </div>
                        {track.avgNota && (
                          <div className="flex items-center gap-1 text-yellow-400 ml-2">
                            <span className="text-sm">★</span>
                            <span className="text-gray-200 text-sm font-bold">{track.avgNota.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhuma música encontrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Edição */}
      <EditModal
        review={editingReview}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Loading overlay para ações */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">Processando...</p>
          </div>
        </div>
      )}
    </div>
  );
}