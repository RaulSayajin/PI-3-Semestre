import React from "react";
import { FaSpotify } from "react-icons/fa";
import logoReverb from "../assets/logoReverb.png"; // Logo do seu app
import Boy from "../assets/boy.png"; // A imagem que você selecionou

export default function Login() {
  const handleSpotifyLogin = () => {
    // Redireciona para o endpoint de login do Spotify no seu backend
    window.location.href = "http://localhost:3000/auth/login";
  };

  return (
    // 1. Container principal: Centraliza tudo na tela
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden p-4">
      
      {/* 2. Fundo de "bolhas animadas" */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* 3. O Card centralizado (backdrop-blur) */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
        
        {/* Lado Esquerdo (Desktop) / Topo (Mobile): SUA IMAGEM */}
        <div className="flex-1 p-8 md:p-10 flex flex-col items-center justify-center text-center">
          <img
            src={Boy}
            alt="Descubra músicas no Reverb"
            className="w-full max-w-sm object-contain drop-shadow-lg"
          />
           <h2 className="text-3xl font-extrabold leading-tight mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Sua Voz na Música
          </h2>
          <p className="text-gray-300 max-w-md text-md mt-2 hidden md:block">
            Avalie, compartilhe e descubra álbuns com base nas suas músicas favoritas do Spotify.
          </p>
        </div>

        {/* Lado Direito (Desktop) / Fundo (Mobile): LOGIN */}
        <div className="w-full md:w-auto md:flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-black/20">
          <img
            src={logoReverb}
            alt="Logo Reverb"
            className="w-24 h-24 object-contain mb-6 drop-shadow-lg"
          />
          <h3 className="text-white text-3xl font-bold mb-8 text-center">
            Bem-Vindo ao Reverb!
          </h3>

          <button
            onClick={handleSpotifyLogin}
            className="w-full max-w-xs flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white text-lg py-3 px-6 rounded-full font-bold transition-all duration-300 shadow-xl hover:scale-105"
          >
            <FaSpotify className="text-2xl" />
            Entrar com Spotify
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center max-w-xs">
            Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </div>

      </div>

      {/* Definição das animações de fundo no CSS */}
      <style>
        {`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        `}
      </style>
    </div>
  );
}