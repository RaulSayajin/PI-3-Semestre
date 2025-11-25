import React, { useEffect, useState } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { AvaliacaoAPI } from "../api/feedApi";
import ReviewModal from "../components/curtidas/modalAvaliação";
import "../index.css";

// --- Componentes de UI Melhorados ---

// Componente de Esqueleto de Carregamento (Loading Skeleton)
const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-xl p-4 shadow-xl animate-pulse">
    <div className="w-full aspect-square bg-gray-700 rounded-lg mb-3"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-700 rounded-full w-full"></div>
  </div>
);

// Componente auxiliar para status
const StatusDisplay = ({ isLoading, error, dataLength, emptyMessage }) => {
  if (isLoading) return null;
  if (error) return <p className="text-red-400 text-lg py-4">{error}</p>;
  if (dataLength === 0)
    return <p className="text-gray-500 italic text-lg py-4">{emptyMessage}</p>;
  return null;
};

// --- Cards atualizados para abrir o Modal ---
const AlbumCard = ({ item, onOpenModal, rating }) => (
  <div className="group bg-gray-800 rounded-xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02] flex flex-col overflow-hidden">
    
    {/* --- Área da Imagem com Badge de Nota --- */}
    <div className="relative">
      <img
        src={item.album.images?.[0]?.url || "/imagens/back.jpg"}
        alt={item.album.name}
        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {rating && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-yellow-300 flex items-center gap-1.5">
          ⭐<span>{rating}</span>
        </div>
      )}
    </div>

    {/* --- Área de Conteúdo e Ação --- */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-white text-lg font-bold truncate mb-1">
        {item.album.name}
      </h3>
      <p className="text-gray-400 text-sm truncate mb-4">
        {item.album.artists.map((a) => a.name).join(", ")}
      </p>

      <button
        onClick={() =>
          onOpenModal({
            itemSpotifyId: item.album.id,
            itemName: item.album.name,
            imageUrl: item.album.images?.[0]?.url,
            itemType: "album",
          })
        }
        className={`mt-auto w-full px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg ${
          rating
            ? "bg-gray-700 hover:bg-gray-600 text-white" 
            : "bg-purple-600 hover:bg-purple-700 text-white" 
        }`}
      >
        {rating ? "Editar Avaliação" : "Avaliar"}
      </button>
    </div>
  </div>
);

const TrackCard = ({ item, onOpenModal, rating }) => (
  <div className="group bg-gray-800 rounded-xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02] flex flex-col overflow-hidden">
    
    {/* --- Área da Imagem com Badge de Nota --- */}
    <div className="relative">
      <img
        src={item.track.album.images?.[0]?.url || "/imagens/back.jpg"}
        alt={item.track.name}
        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {rating && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-yellow-300 flex items-center gap-1.5">
          ⭐<span>{rating}</span>
        </div>
      )}
    </div>

    {/* --- Área de Conteúdo e Ação --- */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-white text-lg font-bold truncate mb-1">
        {item.track.name}
      </h3>
      <p className="text-gray-400 text-sm truncate mb-4">
        {item.track.artists.map((a) => a.name).join(", ")} •{" "}
        {item.track.album.name}
      </p>

      <button
        onClick={() =>
          onOpenModal({
            itemSpotifyId: item.track.id,
            itemName: item.track.name,
            imageUrl: item.track.album.images?.[0]?.url,
            itemType: "track",
          })
        }
        className={`mt-auto w-full px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg ${
          rating
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {rating ? "Editar Avaliação" : "Avaliar"}
      </button>
    </div>
  </div>
);

const ArtistCard = ({ artist, onOpenModal, rating }) => (
  <div className="group bg-gray-800 rounded-xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02] flex flex-col overflow-hidden">
    
    {/* --- Área da Imagem com Badge de Nota --- */}
    <div className="relative">
      <img
        src={artist.images?.[0]?.url || "/imagens/back.jpg"}
        alt={artist.name}
        // Artistas ficam ótimos com imagens redondas!
        className="w-full aspect-square object-cover rounded-full p-2 transition-transform duration-300 group-hover:scale-105"
      />
      {rating && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-yellow-300 flex items-center gap-1.5">
          ⭐<span>{rating}</span>
        </div>
      )}
    </div>

    {/* --- Área de Conteúdo e Ação --- */}
    <div className="p-4 flex flex-col flex-grow text-center">
      <h3 className="text-white text-lg font-bold truncate mb-4">
        {artist.name}
      </h3>

      <button
        onClick={() =>
          onOpenModal({
            itemSpotifyId: artist.id,
            itemName: artist.name,
            imageUrl: artist.images?.[0]?.url,
            itemType: "artist",
          })
        }
        className={`mt-auto w-full px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg ${
          rating
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {rating ? "Editar Avaliação" : "Avaliar"}
      </button>
    </div>
  </div>
);

// --- Componente principal ---
export default function CurtidosPage() {
  const token = useSpotifyAuth();

  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [errorAlbums, setErrorAlbums] = useState(null);

  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [errorTracks, setErrorTracks] = useState(null);

  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [errorArtists, setErrorArtists] = useState(null);

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [activeTab, setActiveTab] = useState("tracks");

  // --- Estado do Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // Mapa de avaliações para acesso rápido
  const avaliacoesMap = React.useMemo(() => {
    if (!avaliacoes) return {};
    return avaliacoes.reduce((map, item) => {
      if (item.itemSpotifyId) {
        map[item.itemSpotifyId] = item;
      }
      return map;
    }, {});
  }, [avaliacoes]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async (
      endpoint,
      setData,
      setLoading,
      setError,
      errorMessage
    ) => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro na API");
        const data = await res.json();
        setData(data);
        setError(null);
      } catch {
        setError(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData(
      "/user/saved-albums",
      setAlbums,
      setLoadingAlbums,
      setErrorAlbums,
      "Erro ao buscar álbuns."
    );
    fetchData(
      "/user/followed-artists",
      setArtists,
      setLoadingArtists,
      setErrorArtists,
      "Erro ao buscar artistas."
    );
    fetchData(
      "/user/saved-tracks",
      setTracks,
      setLoadingTracks,
      setErrorTracks,
      "Erro ao buscar músicas."
    );

    // 1. Buscar as avaliações do backend
    const fetchAvaliacoes = async () => {
      try {
        const response = await AvaliacaoAPI.getUserReviews(token);
        setAvaliacoes(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar avaliações do usuário:", error);
      }
    };

    fetchAvaliacoes();
  }, [token]);

  const openModal = (itemData) => {
    setSelectedItem(itemData);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

const handleSaveReview = async (reviewData) => {
  try {
    const spotifyToken = localStorage.getItem("spotify_access_token");
    console.log("[DEBUG] Tentando enviar avaliação com o token do Spotify:", spotifyToken);

    if (!spotifyToken) {
      throw new Error("Autenticação com Spotify não encontrada. Por favor, faça o login novamente.");
    }

    const payload = {
      itemSpotifyId: reviewData.itemSpotifyId, 
      itemName: reviewData.itemName,
      itemImageUrl: reviewData.imageUrl,
      tipoItem: reviewData.itemType,
      nota: reviewData.rating,
      comentario: reviewData.comment || "", 
    };

    console.log("Enviando payload", payload);
    await AvaliacaoAPI.createRating(payload, spotifyToken);

    console.log("Avaliação salva com sucesso!");

    return { success: true, message: "Avaliação enviada com sucesso!" };

  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro desconhecido.";
    return { success: false, message: `Falha ao enviar: ${errorMessage}` };
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case "albums":
        return loadingAlbums ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <StatusDisplay
              error={errorAlbums}
              dataLength={albums.length}
              emptyMessage="Nenhum álbum curtido encontrado."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {albums.map((item) => {
                const aval = avaliacoesMap[item.album.id];
                return <AlbumCard key={item.album.id} item={item} onOpenModal={openModal} rating={aval?.nota} />;
              })}
            </div>
          </>
        );
      case "artists":
        return loadingArtists ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <StatusDisplay
              error={errorArtists}
              dataLength={artists.length}
              emptyMessage="Nenhum artista seguido encontrado."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {artists.map((artist) => {
                const aval = avaliacoesMap[artist.id];
                return <ArtistCard key={artist.id} artist={artist} onOpenModal={openModal} rating={aval?.nota} />;
              })}
            </div>
          </>
        );
      case "tracks":
      default:
        return loadingTracks ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <StatusDisplay
              error={errorTracks}
              dataLength={tracks.length}
              emptyMessage="Nenhuma música curtida encontrada."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {tracks.map((item) => {
                const aval = avaliacoesMap[item.track.id];
                return (
                  <TrackCard
                    key={item.track.id}
                    item={item}
                    onOpenModal={openModal}
                    rating={aval?.nota || null}
                  />
                );
              })}
            </div>
          </>
        );
    }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-3 px-6 text-lg font-semibold border-b-2 transition-all duration-200 
        ${
          activeTab === id
            ? "border-purple-500 text-white shadow-md"
            : "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-black/50 backdrop-blur-sm p-8 border-b border-gray-800">
        <h1 className="text-white text-4xl font-extrabold tracking-tight">
          💜 Reverb
        </h1>
        <p className="text-gray-400 text-lg mt-2 max-w-2xl">
          Mergulhe na sua música favorita, avalie e compartilhe. Suas percepções reverberam e criam conexões.
        </p>
      </header>

      <main className="p-8 lg:p-12">
        <div className="border-b border-gray-700 mb-8 flex space-x-4 overflow-x-auto">
          <TabButton id="tracks" label="Músicas Curtidas" />
          <TabButton id="albums" label="Álbuns Curtidos" />
          <TabButton id="artists" label="Artistas Seguidos" />
        </div>

        <section>{renderContent()}</section>
      </main>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <ReviewModal
          itemData={selectedItem}
          onClose={closeModal}
          onSaveReview={handleSaveReview}
        />
      )}
    </div>
  );
}
