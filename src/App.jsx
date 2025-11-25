import React from "react";
import MainBanner from "./components/home/MainBanner";
import ArtistsCarousel from "./components/home/ArtistsCarousel";
import MusicCarousel from "./components/home/MusicCarousel";
import RecentlyPlayedCarousel from './components/home/RecentlyPlayedCarousel';

import "./index.css"

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      <style>{`
        /* Animação para o fade-in do banner */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        /* Estilo para a barra de scroll */
        .overflow-x-auto::-webkit-scrollbar {
            height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
            background: #1f2937; /* gray-800 */
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #6D28D9; /* purple-700 */
            border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: #5B21B6; /* purple-800 */
        }
      `}</style>
      
      <div className="max-w-[1400px] mx-auto space-y-12 p-4 md:p-8">
        <MainBanner />
        <ArtistsCarousel />
        <MusicCarousel />
        <RecentlyPlayedCarousel />
      </div>
    </div>
  );
}