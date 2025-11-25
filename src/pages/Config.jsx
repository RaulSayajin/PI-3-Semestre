import React, { useState } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import useSpotifyProfile from "../hooks/useSpotifyProfile";
import "../index.css";

// --- Componente de Esqueleto (Loading) ---
const ConfigSkeleton = () => (
  <div className="p-8 animate-pulse max-w-2xl mx-auto">
    <div className="h-10 bg-gray-700 rounded w-1/3 mb-8"></div>
    <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-700">
        <div className="w-24 h-24 rounded-full bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-7 bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
    </div>
  </div>
);

// --- Componente de Linha de Informação (Helper) ---
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-white sm:mt-0">{value}</dd>
  </div>
);

// --- Modal de Confirmação ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
        </div>
        
        <div className="flex gap-4 bg-gray-900/50 p-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Componente Principal da Página ---
export default function Config() {
  const token = useSpotifyAuth();
  const userProfile = useSpotifyProfile(token);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função de Logout movida para ser chamada pelo modal
  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_expiry");
    localStorage.removeItem("app_jwt_token"); 
    window.location.href = "/login";
  };

  // Usa o Skeleton enquanto o perfil não é carregado
  if (!userProfile) {
    return <ConfigSkeleton />;
  }

  return (
    <>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Configurações</h1>

        <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-700 shadow-xl">
          
          {/* --- Cabeçalho do Perfil --- */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-700">
            <img
              src={userProfile.images?.[1]?.url || userProfile.images?.[0]?.url || "/imagens/user-default.png"}
              alt={userProfile.display_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-white mb-1">
                {userProfile.display_name}
              </h2>
              <a 
                href={userProfile.external_urls?.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                Ver perfil no Spotify
              </a>
            </div>
          </div>

          {/* --- Detalhes do Perfil --- */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Seu Perfil Spotify</h3>
            <dl className="divide-y divide-gray-700">
              <InfoRow label="Email" value={userProfile.email} />
              <InfoRow label="País" value={userProfile.country} />
              <InfoRow label="Tipo de Conta" value={userProfile.product} />
            </dl>
          </div>

          {/* --- Ações da Conta --- */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Ações da Conta</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-red-600/90 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              Desvincular Spotify
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Isso irá desconectar sua conta do Reverb.
            </p>
          </div>
        </div>
      </div>

      {/* --- Renderiza o Modal --- */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Desvincular Conta"
        message="Tem certeza que deseja desvincular sua conta do Spotify? Você será desconectado."
      />
    </>
  );
}