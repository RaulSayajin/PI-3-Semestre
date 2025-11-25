import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  HeartIcon,
  Cog6ToothIcon,
  UserIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function BottomNav() {
  const navItems = [
    { icon: HomeIcon, label: "Home", to: "/" },
    { icon: GlobeAltIcon, label: "Feed", to: "/feed" },
    { icon: HeartIcon, label: "Curtidas", to: "/curtidas" },
    { icon: UserIcon, label: "Perfil", to: "/Perfil" },
    { icon: Cog6ToothIcon, label: "Config", to: "/config" },
  ];

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 h-16 z-40
        grid grid-cols-5 
        bg-gray-900/90 backdrop-blur-md 
        border-t border-gray-800
        md:hidden 
      `}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-colors duration-200 ${
                isActive
                  ? "text-purple-400"
                  : "text-neutral-400 hover:text-white"
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}