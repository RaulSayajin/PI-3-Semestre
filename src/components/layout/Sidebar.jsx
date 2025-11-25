import React from "react";

import { Link, NavLink } from "react-router-dom"; 
import logoReverb from "../../../public/reverbIcon.png";
import {
  Bars3Icon,
  HeartIcon,
  HomeIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";


function SidebarItem({ icon, label, expanded, to, onClick, danger = false }) {
  const baseClasses = "flex items-center p-3 rounded-lg transition-all w-full";
  const layoutClasses = expanded ? "gap-4" : "justify-center";
  const getDynamicClasses = (isActive) => {
    if (isActive) {
      return "bg-purple-600 text-white shadow-lg"; 
    }
    if (danger) {
      return "text-gray-400 hover:bg-red-800 hover:text-white"; 
    }
    return "text-gray-400 hover:bg-gray-800 hover:text-white";
  };

  if (to) {
    return (
      <li>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `${baseClasses} ${layoutClasses} ${getDynamicClasses(isActive)}`
          }
        >
          {icon}
          {expanded && <span className="truncate">{label}</span>}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onClick}
        className={`${baseClasses} ${layoutClasses} ${getDynamicClasses(false)}`}
      >
        {icon}
        {expanded && <span className="truncate">{label}</span>}
      </button>
    </li>
  );
}



export default function Sidebar({ expanded, setExpanded, user, className }) {
  
  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_expiry");
    localStorage.removeItem("app_jwt_token");
    window.location.href = "/login";
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-50 border-r border-gray-800 ${
        expanded ? "w-64" : "w-20"
      } ${className}`}
    >
      {/* Header do Sidebar */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-800"
        style={{ minHeight: '65px' }}
      >
        {/* Logo e Nome */}
        {expanded && (
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <img
              src={logoReverb}
              alt="Logo Reverb"
              className="w-8 h-8 flex-shrink-0" 
            />
            <span className="text-xl font-bold whitespace-nowrap text-white">
              Reverb
            </span>
          </Link>
        )}

        {/* Botão de Toggle */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className={`p-2 rounded-md hover:bg-gray-800 transition ${
            expanded ? "" : "mx-auto"
          }`}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Perfil do usuário */}
      <div className="flex flex-col items-center py-6 px-3">
        <img
          src={user?.images?.[0]?.url || "imagens/usuario.png"}
          alt="Foto de perfil"
          className={`rounded-full border-2 border-purple-500 object-cover ${
            expanded ? "w-20 h-20" : "w-12 h-12"
          } transition-all duration-300`}
        />
        {expanded && (
          <span className="mt-4 text-md font-semibold text-center px-2 truncate">
            {user?.display_name || "Usuário Spotify"}
          </span>
        )}
      </div>

      {/* Menu Principal (flex-1) */}
      <ul className="flex-1 flex flex-col mt-2 space-y-1 px-3">
        {/* Itens de Navegação */}
        <SidebarItem
          icon={<HomeIcon className="w-6 h-6" />}
          label="Home"
          to="/"
          expanded={expanded}
        />
        <SidebarItem
          icon={<GlobeAltIcon className="w-6 h-6" />}
          label="Feed"
          to="/feed"
          expanded={expanded}
        />
        <SidebarItem
          icon={<HeartIcon className="w-6 h-6" />}
          label="Favoritos"
          to="/curtidas"
          expanded={expanded}
        />
        
        {/* Divisor para separar Navegação de Configurações */}
        <div className={`pt-2 mt-2 ${expanded ? 'border-t border-gray-800' : 'border-t border-gray-800 mx-2'}`}></div>

        <SidebarItem
          icon={<UserIcon className="w-6 h-6" />}
          label="Perfil"
          to="/Perfil" // Lembre-se que rotas são case-sensitive
          expanded={expanded}
        />
        <SidebarItem
          icon={<Cog6ToothIcon className="w-6 h-6" />}
          label="Configurações"
          to="/config"
          expanded={expanded}
        />
      </ul>

      {/* Sair (Rodapé) */}
      <div className="p-3 border-t border-gray-800">
        <SidebarItem
          icon={<ArrowRightOnRectangleIcon className="w-6 h-6" />}
          label="Sair"
          expanded={expanded}
          onClick={handleLogout} 
          danger={true}         
        />
      </div>
    </nav>
  );
}