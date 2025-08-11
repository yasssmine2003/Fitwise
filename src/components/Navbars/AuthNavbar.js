/* eslint-disable */
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const closeNavbar = () => setNavbarOpen(false);

  const links = [
    { text: "Accueil", to: "/" },
    { text: "Services", to: "/#services" },
    { text: "À propos", to: "/#about" },
    { text: "Contact", to: "/#contact" },
  ];

  const handleAnchorClick = (e, to) => {
    if (to.startsWith("/#")) {
      e.preventDefault();
      const id = to.split("#")[1];
      if (window.location.pathname !== "/") {
        window.location.href = to;
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      closeNavbar();
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-green-300 transition-colors duration-300"
              onClick={closeNavbar}
            >
              FitWise
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-12 items-center">
              {links.map((link, index) =>
                link.to.startsWith("/#") ? (
                  <a
                    key={index}
                    href={link.to}
                    onClick={(e) => handleAnchorClick(e, link.to)}
                    className="relative group px-4 py-2"
                  >
                    <span className="text-white font-medium text-lg group-hover:text-green-300 transition-colors duration-300">
                      {link.text}
                    </span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0.5 bg-green-300 transition-all duration-500 group-hover:w-4/5"></span>
                    <span className="absolute inset-0 bg-white/10 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-300"></span>
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={link.to}
                    onClick={closeNavbar}
                    className="relative group px-4 py-2"
                  >
                    <span className="text-white font-medium text-lg group-hover:text-green-300 transition-colors duration-300">
                      {link.text}
                    </span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0.5 bg-green-300 transition-all duration-500 group-hover:w-4/5"></span>
                    <span className="absolute inset-0 bg-white/10 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-300"></span>
                  </Link>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleNavbar}
                className="text-white focus:outline-none text-2xl"
                aria-label="Toggle menu"
              >
                {navbarOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {navbarOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-8 px-8 py-10">
              {links.map((link, index) =>
                link.to.startsWith("/#") ? (
                  <a
                    key={index}
                    href={link.to}
                    onClick={(e) => handleAnchorClick(e, link.to)}
                    className="group relative text-white text-xl py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:pl-6"
                  >
                    {link.text}
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={link.to}
                    onClick={closeNavbar}
                    className="group relative text-white text-xl py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:pl-6"
                  >
                    {link.text}
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}