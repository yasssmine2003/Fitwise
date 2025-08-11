import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "components/Footers/Footer.js";

export default function Navbar({ scrolled, customBg }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden menu-backdrop"
          onClick={closeMenu}
        ></div>
      )}

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 navbar ${scrolled ? 'scrolled' : ''} ${customBg ? customBg : ''}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-3xl font-extrabold tracking-tight text-[#2F855A] flex items-center logo"
          >
            <div className="logo-icon mr-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F855A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="16" r="6" fill="#2F855A" stroke="#2F855A"/>
                <path d="M8 10a4 4 0 0 1 8 0" stroke="#2F855A" fill="none"/>
              </svg>
            </div>
            <span className="logo-text">FitWise</span>
          </Link>

          <div className="hidden lg:flex gap-4 items-center">
            <NavLinks closeMenu={closeMenu} scrolled={scrolled} />
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden text-3xl text-[#2F855A] focus:outline-none z-50 relative menu-button"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 px-6 pt-4 pb-8 bg-white shadow-xl mobile-menu">
            <NavLinks closeMenu={closeMenu} mobile />
          </div>
        )}
      </nav>

      {!customBg && (
        <style jsx>{`
          .navbar {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .navbar.scrolled {
            padding: 0.5rem 0;
          }
          .logo {
            transition: all 0.3s ease;
          }
          .logo:hover .logo-icon {
            animation: bounce 0.6s ease;
          }
          .logo-text {
            font-family: 'Bebas Neue', cursive;
          }
          .menu-button {
            transition: transform 0.3s ease;
          }
          .menu-button:hover {
            transform: scale(1.1);
          }
          .mobile-menu {
            animation: slideDown 0.3s ease-out forwards;
          }
          .menu-backdrop {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      )}
    </>
  );
}

function NavLinks({ closeMenu, mobile }) {
  const location = useLocation();

  const links = [
    { to: "/", text: "Accueil" },
    { to: "/#services", text: "Nos Services" },
    { to: "/#hero", text: "À propos" },
    { to: "/#contact", text: "Contact" },
    { to: "/auth/register", text: "Inscription", highlight: true },
    { to: "/auth/login", text: "Connexion" },
  ];

  const handleAnchorClick = (e, to) => {
    e.preventDefault();
    const id = to.split("#")[1];

    if (location.pathname !== "/") {
      window.location.href = to;
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (closeMenu) closeMenu();
  };

  return (
    <>
      {links.map((link, index) => {
        const isAnchor = link.to.startsWith("/#");
        const linkClasses = `nav-link ${link.highlight ? 'highlight' : ''} ${mobile ? 'mobile-link' : ''}`;

        return (
          <div key={index} className="nav-link-container">
            {isAnchor ? (
              <a
                href={link.to}
                onClick={(e) => handleAnchorClick(e, link.to)}
                className={linkClasses}
              >
                {link.text}
                <span className="link-underline"></span>
              </a>
            ) : (
              <Link
                to={link.to}
                onClick={closeMenu}
                className={linkClasses}
              >
                {link.text}
                <span className="link-underline"></span>
              </Link>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .nav-link-container {
          position: relative;
          overflow: hidden;
        }

        .nav-link {
          position: relative;
          color: #2F855A;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          display: inline-block;
        }

        .nav-link.highlight {
          background: #2F855A;
          color: white;
          border-radius: 9999px;
          padding: 0.5rem 1.5rem;
        }

        .nav-link:hover {
          color: #276749;
        }

        .nav-link.highlight:hover {
          background: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .link-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #2F855A;
          transition: width 0.3s ease;
        }

        .nav-link:not(.highlight):hover .link-underline {
          width: 100%;
        }

        .mobile-link {
          display: block;
          padding: 0.75rem 0;
          font-size: 1.1rem;
          border-bottom: 1px solid #eee;
        }

        .mobile-link.highlight {
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}
