import React, { useEffect, useState } from 'react';
import { AvaliacaoAPI } from '../api/feedApi';
import ReviewCard from '../components/feed/ReviewCard';

export default function FeedPage({ token }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('for_you');
  const [loading, setLoading] = useState(true);

  // Função para buscar os reviews de acordo com a aba
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === 'for_you') {
          data = await AvaliacaoAPI.getGlobalFeed();
        } else if (activeTab === 'following') {
          const spotifyToken = localStorage.getItem("spotify_access_token");
          data = await AvaliacaoAPI.getFollowingFeed(spotifyToken);
        } else if (activeTab === 'trending') {
          data = await AvaliacaoAPI.getTrendingFeed();
        }
        setReviews(data.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar feed:", err);
        setError("Não foi possível carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeTab, token]);

  const updateReviewInList = (updatedReview) => {
    setReviews(prevReviews => 
      prevReviews.map(r => r._id === updatedReview._id ? updatedReview : r)
    );
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const spotifyToken = localStorage.getItem("spotify_access_token");
      if (!spotifyToken) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        return;
      }

      await AvaliacaoAPI.deleteRating(reviewId, spotifyToken);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error("Erro ao deletar avaliação:", err);
      alert(`Não foi possível deletar a avaliação: ${err.message}`);
    }
  };

  // Componente para as abas
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-3 px-6 text-lg font-bold border-b-2 transition-all duration-200
        ${activeTab === id
          ? "border-purple-500 text-white shadow-md bg-gray-800/50"
          : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">

        {/* Cabeçalho */}
        <header className="mb-6 pt-4 pb-2 border-b-4 border-purple-600">
          <h1 className="text-white text-4xl font-extrabold tracking-tight">
            Feed de Avaliações 💬
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Veja o que a comunidade está ouvindo e avaliando.
          </p>
        </header>

        {/* Navegação por abas */}
        <div className="border-b border-gray-700 mb-8 flex space-x-0 overflow-x-auto sticky top-0 bg-gray-900 z-10">
          <TabButton id="for_you" label="Para Você" />
          <TabButton id="following" label="Seguindo" />
          <TabButton id="trending" label="Em Alta" />
        </div>

        {/* Lista de reviews */}
        <div className="space-y-8">
          {loading ? (
            <p className="text-white text-center mt-12">
              Carregando avaliações de {activeTab}...
            </p>
          ) : error ? (
            <p className="text-red-400 text-center mt-12">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-center text-xl mt-12">
              Nenhuma avaliação encontrada neste filtro.
            </p>
          ) : (
            reviews.map((review) => (
              <ReviewCard 
                key={review._id} 
                review={review} 
                onDelete={handleDeleteReview}
                onUpdateReview={updateReviewInList}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
