/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

import back6 from 'assets/img/bb1.png';
import profile from 'assets/img/Gym.jpg';
import angular from 'assets/img/nutri.jpg';
import illHeader from 'assets/img/well.jpg';
import FAQSection from "../components/FAQSection";
import bgSite from 'assets/img/back.jpg';
import "assets/styles/tailwind.css";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: "Activité",
      desc: "Suivi quotidien de vos séances sportives et pas réalisés.",
      img: profile,
      icon: "🏃",
      to: "/activite-physique"
    },
    {
      title: "Nutrition",
      desc: "Calculez et suivez vos calories et apports nutritionnels.",
      img: angular,
      icon: "🍎",
      to: "/nutrition"
    },
    {
      title: "Bien-être",
      desc: "Analyse du sommeil, et conseils santé personnalisés.",
      img: illHeader,
      icon: "🌙",
      to: "/bien-etre"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fff4] to-[#e6fffa]">
      <IndexNavbar scrolled={scrolled} />

      {/* Hero Section */}
 {/* Hero Section */}
<section  id="hero"className="relative overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
  <div className="absolute inset-0 z-0 hero-background-animation">
    <img 
      src={bgSite} 
      className="w-full h-full object-cover"
      alt="Background"
      style={{ objectPosition: "center top" }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#2F855A]/70 to-transparent"></div>
  </div>

  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-7xl mx-auto w-full px-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Texte avec animations */}
        <div className="flex-1 text-center md:text-left animate-fade-in" style={{ paddingTop: "5vh" }}>
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-2 hero-title bg-gradient-to-r from-[#C6F6D5] via-white to-[#2F855A] bg-clip-text text-transparent drop-shadow-2xl animate-title-pop"
          >
            Reprends le contrôle de ta santé, simplement.
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 hero-subtitle">
            Une application intuitive pour bouger, mieux manger et retrouver ton équilibre – à ton rythme.
          </h2>

          <button
            className="cta-button-primary mb-4 animate-bounce"
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
          >
            Commencer maintenant
          </button>

          <p className="text-lg text-[#C6F6D5] animate-fade-in-up">
            Déjà adoptée par une communauté engagée dans le bien-être.
          </p>
        </div>

        {/* Image avec animation */}
        <div className="flex-1 flex justify-center hero-image">
          <img
            src={back6}
            alt="Fitness illustration"
            className="w-full max-w-3xl object-contain floating"
            style={{ maxHeight: "260vh" }}
          />
        </div>
      </div>
    </div>
  </div>
</section>

{/* Styles CSS - */}
<style jsx>{`
  .hero-background-animation {
    animation: backgroundZoom 20s infinite alternate;
  }
  
  @keyframes backgroundZoom {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); }
  }
  
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    opacity: 0;
    animation: fadeInUp 1s forwards 0.3s;
  }
  
  .hero-subtitle {
    opacity: 0;
    animation: fadeInUp 1s forwards 0.5s;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
  
  .hero-stats {
    opacity: 0;
    animation: fadeIn 1s forwards 0.7s;
  }
  
  .hero-image {
    opacity: 0;
    animation: fadeInRight 1s forwards 0.9s;
  }
  
  .floating {
    animation: float 6s ease-in-out infinite;
    filter: drop-shadow(0 10px 30px rgba(47, 133, 90, 0.4));
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .cta-button-primary {
    background: #2F855A;
    color: white;
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: bold;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: none;
    cursor: pointer;
  }
  
  .animate-bounce {
    animation: bounce 1.2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0);}
    50% { transform: translateY(-8px);}
  }

  @keyframes title-pop {
    0% { opacity: 0; transform: scale(0.8);}
    80% { opacity: 1; transform: scale(1.05);}
    100% { opacity: 1; transform: scale(1);}
  }
  .animate-title-pop {
    animation: title-pop 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }

  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 1s forwards 1s;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`}</style>
      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F855A] mb-4">Nos Services</h2>
            <div className="w-20 h-1 bg-[#2F855A] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment FitWise peut transformer votre approche de la santé
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {services.map((card, index) => (
              <ServiceCard key={index} card={card} index={index} />
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Footer Wave */}
      <div className="relative h-20 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full wave-animation">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#2F855A" 
          ></path>
        </svg>
      </div>

      <Footer />

      {/* Styles CSS */}
      <style jsx>{`
        .hero-background-animation {
          animation: backgroundZoom 20s infinite alternate;
        }
        
        @keyframes backgroundZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          opacity: 0;
          animation: fadeInUp 1s forwards 0.3s;
        }
        
        .hero-subtitle {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          opacity: 0;
          animation: fadeInUp 1s forwards 0.5s;
        }
        
        .hero-stats {
          opacity: 0;
          animation: fadeIn 1s forwards 0.7s;
        }
        
        .hero-image {
          opacity: 0;
          animation: fadeInRight 1s forwards 0.9s;
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(47, 133, 90, 0.4));
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .cta-button-primary {
          background: #2F855A;
          color: white;
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: bold;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
        }
        
        .cta-button-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .cta-button-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.2) 50%);
          background-size: 400% 400%;
          transition: background-position 0.6s ease;
        }
        
        .cta-button-primary:hover::after {
          background-position: 100% 100%;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s forwards;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .wave-animation path {
          animation: wave 8s linear infinite;
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }

        @keyframes title-pop {
          0% { opacity: 0; transform: scale(0.8);}
          80% { opacity: 1; transform: scale(1.05);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-title-pop {
          animation: title-pop 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .hero-title {
          text-shadow: 4px 4px 16px rgba(47,133,90,0.25), 0 2px 8px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}

// Composant ServiceCard
function ServiceCard({ card, index }) {
  const CardContent = (
    <div className={`service-card`}>
      <div className="card-inner">
        <div className="absolute inset-0 bg-[#2F855A] rounded-2xl card-shadow"></div>
        <div className="card-content">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={card.img} 
              alt={card.title}
              className="w-full h-full object-cover card-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F855A]/70 to-transparent"></div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-3 opacity-90">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-[#2F855A]">{card.title}</h3>
            <p className="text-gray-700 text-base">{card.desc}</p>
            <div className="mt-4 w-8 h-1 bg-[#2F855A] rounded-full"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .service-card {
          flex: 1;
          min-width: 280px;
          max-width: 380px;
          perspective: 1000px;
          opacity: 0;
          animation: fadeInUp 0.6s forwards 0.3s;
        }
        
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .service-card:hover .card-inner {
          transform: rotateY(10deg) rotateX(5deg);
        }
        
        .card-shadow {
          transform: translateY(8px);
          opacity: 0.2;
          transition: all 0.3s ease;
        }
        
        .service-card:hover .card-shadow {
          transform: translateY(12px);
          opacity: 0.3;
        }
        
        .card-content {
          position: relative;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          height: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .service-card:hover .card-content {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .card-image {
          transition: transform 0.8s ease;
        }
        
        .service-card:hover .card-image {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
  return card.to ? (
    <Link to={card.to} style={{ textDecoration: 'none' }}>
      {CardContent}
    </Link>
  ) : CardContent;
}



function StatItem({ value, label, delay }) {
  return (
    <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm stat-item" style={{ animationDelay: `${delay}s` }}>
      <div className="text-3xl font-bold text-white counter">{value.toLocaleString()}+</div>
      <div className="text-[#C6F6D5] text-sm">{label}</div>
    </div>
  );
}