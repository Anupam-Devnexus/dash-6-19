import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPowerOff, FaHammer, FaBlog
} from "react-icons/fa6";
import {
  MdOutlineDashboardCustomize,
  MdOutlineProductionQuantityLimits,
  MdQuestionAnswer,
  MdOutlinePermMedia,
} from "react-icons/md";
import { GoCodeReview } from "react-icons/go";
import { IoIdCardOutline } from "react-icons/io5";
import { GrLocationPin } from "react-icons/gr";
import { VscFileMedia } from "react-icons/vsc";
import { toast } from "react-toastify";

const navItems = [
  { label: "Dashboard", icon: <MdOutlineDashboardCustomize />, path: "/admin/dashboard" },
  { label: "Products", icon: <MdOutlineProductionQuantityLimits />, path: "/admin/products" },
  { label: "Bids", icon: <FaHammer />, path: "/admin/bids" },
  { label: "Blogs", icon: <FaBlog />, path: "/admin/blogs" },
  { label: "Enquiry", icon: <MdQuestionAnswer />, path: "/admin/enquiry" },
  { label: "Review", icon: <GoCodeReview />, path: "/admin/review" },
  { label: "Brochures", icon: <IoIdCardOutline />, path: "/admin/brochures" },
  { label: "Media", icon: <MdOutlinePermMedia />, path: "/admin/media" },
  { label: "Portfolio", icon: <VscFileMedia />, path: "/admin/portfolio" },
  { label: "Locations", icon: <GrLocationPin />, path: "/admin/location" },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 min-h-screen w-14 lg:w-36 bg-[var(--var-red-col)] text-white shadow-md flex flex-col justify-between transition-all duration-300 overflow-y-auto">
      {/* Logo */}
      <div className="flex justify-center items-center p-4">
        <img
          src="https://res.cloudinary.com/dt4ohfuwc/image/upload/v1750072333/name_logos-7_pan13u.png"
          alt="Cervino Ceramix Logo"
          className="object-contain"
        />
      </div>

      {/* Navigation Items */}
      <ul className="flex-grow flex flex-col gap-1 p-3 text-sm">
        {navItems.map(({ label, icon, path }) => (
          <NavItem
            key={label}
            icon={icon}
            label={label}
            active={location.pathname === path}
            onClick={() => navigate(path)}
          />
        ))}
      </ul>

      {/* Logout */}
      <div className="p-4 flex flex-col items-center text-sm">
        <div
          onClick={handleLogout}
          className="w-9 h-9 bg-white/20 hover:bg-white/30 transition rounded-full flex items-center justify-center cursor-pointer"
          title="Logout"
        >
          <FaPowerOff className="text-lg" />
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <li
      onClick={onClick}
      title={label}
      className={`group flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200
        ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden lg:inline truncate">{label}</span>
    </li>
  );
}
