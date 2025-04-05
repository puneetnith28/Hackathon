import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import FirstLogo from "../First_logo.png";
import { AiOutlineUser } from "react-icons/ai";

// Utility function to determine if a path is active
const isActive = (path, currentPath) => path === currentPath;

const NavbarButton = ({ path, label, icon, onClick, isActive }) => (
  <div className={`nav-item ${isActive ? "active" : ""}`}>
    <button
      onClick={onClick}
      className="nav-button"
      aria-label={label}
      style={{ border: "none", background: "none" }}
    >
      {icon && <span className="nav-icon">{icon}</span>}
      <p>{label}</p>
    </button>
  </div>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(Boolean(token));
  }, [location]);

  return (
    <nav
      className={`navbar ${isMobile ? "mobile" : ""}`}
      aria-label="Main Navigation"
    >
      <div className="nav-item-container">
        <div
          className="logo-container-nav"
          onClick={() => handleNavigation("/")}
        >
          <img src={FirstLogo} alt="SkillPilot" className="nav-logo" />
          <p>SkillPilot</p>
        </div>

        <NavbarButton
          path="/search"
          label="SEARCH"
          onClick={() => handleNavigation("/search")}
          isActive={isActive("/search", location.pathname)}
        />

        <NavbarButton
          path="/messages"
          label="MESSAGES"
          onClick={() => handleNavigation("/messages")}
          isActive={isActive("/messages", location.pathname)}
        />

        <NavbarButton
          path="/notes"
          label="Explore"
          onClick={() => handleNavigation("/notes")}
          isActive={isActive("/notes", location.pathname)}
        />

        {/* <NavbarButton
          path="/newpost"
          label="NEW POST"
          onClick={() => handleNavigation("/newpost")}
          isActive={isActive("/newpost", location.pathname)}
        /> */}
      </div>

      {isAuthenticated ? (
        <NavbarButton
          path="/profile"
          label="PROFILE"
          icon={<AiOutlineUser />}
          onClick={() => handleNavigation("/profile")}
          isActive={isActive("/profile", location.pathname)}
        />
      ) : (
        <div className="auth-buttons">
          <NavbarButton
            path="/login"
            label="LOGIN"
            onClick={() => handleNavigation("/login")}
            isActive={isActive("/login", location.pathname)}
          />
          <NavbarButton
            path="/register"
            label="REGISTER"
            onClick={() => handleNavigation("/register")}
            isActive={isActive("/register", location.pathname)}
          />
        </div>
      )}

      {isMobile && (
        <button
          className="mobile-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isExpanded ? "active" : ""}`}></div>
        </button>
      )}
    </nav>
  );
};

export default Navbar;
