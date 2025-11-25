import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import useSpotifyAuth from "../../hooks/useSpotifyAuth.jsx";
import useSpotifyProfile from "../../hooks/useSpotifyProfile.js";
import Login from "../../pages/login.jsx";

export default function Layout() {
  const token = useSpotifyAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const profile = useSpotifyProfile(token);

  if (!token) {
    return <Login />;
  }

  return (
    <div className="bg-[#181818] min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <Sidebar
        className={`hidden md:flex`}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        user={profile}
      />

      <main
        className={`transition-all duration-500 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent pb-24 md:pb-0 ${
          sidebarExpanded ? "md:ml-[256px]" : "md:ml-[80px]"
        }`}
      >
        <Outlet /> {/* As páginas serão renderizadas aqui */}
      </main>

      <div className="md:hidden">{<BottomNav />}</div>
    </div>
  );
}