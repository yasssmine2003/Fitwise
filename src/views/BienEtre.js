import React, { useState } from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Footer from "../components/Footers/Footer";
import { Link } from "react-router-dom";
import well1 from "../assets/img/calm1.png";
import well2 from "../assets/img/well2.png";

// Nouvelle palette de couleurs vibrantes
const vibrantColors = {
  green: "#8DA35E",
  greenLight: "#BDCAB3",
  cream: "#EDEAD7",
  lavender: "#BFB6CD",
  purple: "#5A4153",
  white: "#FFFFFF",
  text: "#4A4A4A",
  textLight: "#6D6D6D",
  accent: "#A78A7F",
  accentLight: "#D4C4B8"
};

// Citations inspirantes pour le carrousel
const quotes = [
  {
    text: "Le bien-être n'est pas un luxe, c'est une nécessité.",
    author: "Osho",
    img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    text: "La santé est un état de complet bien-être physique, mental et social.",
    author: "OMS"
  },
  {
    text: "Le secret du bonheur? Vivre le moment présent.",
    author: "Thich Nhat Hanh"
  }
];

const sections = [
  {
    icon: "🌿",
    title: "Analyse de votre bien-être",
    desc: "Questionnaire en ligne (énergie, humeur, sommeil, stress), score de bien-être global, recommandations personnalisées.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    color: vibrantColors.green,
    id: "analyse"
  },
  {
    icon: "🧠",
    title: "Santé mentale",
    desc: "Articles sur la gestion du stress, exercices de respiration, partenariats avec des psychologues.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    color: vibrantColors.lavender,
    id: "sante-mentale"
  },
  {
    icon: "😴",
    title: "Sommeil réparateur",
    desc: "Astuces pour mieux dormir, suivi du sommeil, rituel du soir conseillé.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    color: vibrantColors.greenLight,
    id: "sommeil"
  },
  {
    icon: "📅",
    title: "Suivi personnalisé",
    desc: "Journal de bien-être, évolution graphique, notifications bienveillantes.",
    color: vibrantColors.purple,
    id: "suivi"
  },
];

// Recommandations selon le score
const getRecommandation = (score) => {
  if (score >= 16) return {
    titre: "Excellent !",
    conseil: "Votre bien-être est au top aujourd'hui. Continuez ainsi et inspirez les autres !",
    niveau: "positif"
  };
  if (score >= 12) return {
    titre: "Très bien !",
    conseil: "Votre bien-être est bon. Pensez à maintenir vos bonnes habitudes.",
    niveau: "bien"
  };
  if (score >= 8) return {
    titre: "Attention",
    conseil: "Votre bien-être est moyen. Essayez de vous accorder un moment de détente ou de parler à un proche.",
    niveau: "moyen"
  };
  return {
    titre: "Prenez soin de vous",
    conseil: "Votre bien-être semble bas. Accordez-vous du repos, respirez profondément et n'hésitez pas à demander de l'aide si besoin.",
    niveau: "faible"
  };
};

const QUESTIONNAIRE = [
  { key: 'energie', label: "Niveau d'énergie", icon: '⚡', min: 1, max: 5 },
  { key: 'humeur', label: "Humeur", icon: '😊', min: 1, max: 5 },
  { key: 'sommeil', label: "Qualité du sommeil", icon: '😴', min: 1, max: 5 },
  { key: 'stress', label: "Niveau de stress", icon: '😰', min: 1, max: 5 },
];

// Exercices de respiration
const breathingExercises = [
  {
    name: "Respiration 4-7-8",
    steps: [
      "Videz complètement vos poumons en expirant par la bouche",
      "Inspirez tranquillement par le nez en comptant jusqu'à 4",
      "Retenez votre souffle en comptant jusqu'à 7",
      "Expirez complètement par la bouche en comptant jusqu'à 8",
      "Répétez ce cycle 4 fois"
    ],
    benefits: "Réduit l'anxiété, favorise l'endormissement",
    duration: 5
  },
  {
    name: "Respiration carrée",
    steps: [
      "Inspirez par le nez en comptant jusqu'à 4",
      "Retenez votre souffle en comptant jusqu'à 4",
      "Expirez par la bouche en comptant jusqu'à 4",
      "Retenez vos poumons vides en comptant jusqu'à 4",
      "Répétez pendant 5 minutes"
    ],
    benefits: "Équilibre le système nerveux, améliore la concentration",
    duration: 5
  }
];

// Conseils pour le sommeil
const sleepTips = [
  {
    title: "Rituel du soir",
    tips: [
      "Évitez les écrans 1h avant le coucher",
      "Prenez une tisane apaisante (camomille, tilleul)",
      "Lisez un livre relaxant",
      "Faites quelques étirements doux",
      "Méditez 10 minutes"
    ]
  },
  {
    title: "Environnement optimal",
    tips: [
      "Température entre 18-20°C",
      "Chambre dans l'obscurité totale",
      "Bruit blanc ou silence complet",
      "Literie confortable et propre",
      "Aérez la chambre 10 minutes"
    ]
  },
  {
    title: "Alimentation",
    tips: [
      "Dînez léger 2h avant le coucher",
      "Évitez café, thé, alcool",
      "Privilégiez les protéines et glucides complexes",
      "Buvez suffisamment d'eau",
      "Évitez les repas trop copieux"
    ]
  }
];

// Routines de relaxation
const relaxationRoutines = [
  {
    name: "Routine matinale zen",
    duration: 15,
    steps: [
      "Étirements doux au réveil",
      "Respiration consciente 5 minutes",
      "Méditation guidée 10 minutes",
      "Petit-déjeuner équilibré"
    ]
  },
  {
    name: "Pause déjeuner relaxante",
    duration: 20,
    steps: [
      "Marche en pleine conscience",
      "Exercices de respiration",
      "Méditation courte",
      "Repas en pleine conscience"
    ]
  },
  {
    name: "Routine soirée apaisante",
    duration: 30,
    steps: [
      "Yoga doux ou étirements",
      "Bain chaud avec huiles essentielles",
      "Lecture relaxante",
      "Méditation du soir",
      "Préparation du lendemain"
    ]
  }
];

// Playlists de sons apaisants
const soothingPlaylists = [
  {
    name: "Nature apaisante",
    tracks: ["Pluie douce", "Océan calme", "Forêt zen", "Ruisseau", "Oiseaux matinaux"],
    duration: 60
  },
  {
    name: "Méditation guidée",
    tracks: ["Respiration consciente", "Body scan", "Loving-kindness", "Mindfulness", "Gratitude"],
    duration: 45
  },
  {
    name: "Sons binauraux",
    tracks: ["Alpha waves", "Theta waves", "Delta waves", "Gamma waves", "Beta waves"],
    duration: 30
  }
];

// Composant Bouton Zen
const ZenButton = ({ children, onClick, type = 'primary', className = '' }) => {
  const baseClasses = "rounded-full px-8 py-3 text-lg font-light tracking-wide transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2";
  
  const typeClasses = {
    primary: `bg-gradient-to-r from-${vibrantColors.green} to-${vibrantColors.purple} text-${vibrantColors.white} shadow-lg hover:shadow-xl hover:from-${vibrantColors.purple} hover:to-${vibrantColors.green}`,
    secondary: `bg-${vibrantColors.white} border-2 border-${vibrantColors.green} text-${vibrantColors.green} hover:bg-${vibrantColors.greenLight} hover:border-${vibrantColors.purple}`,
    accent: `bg-gradient-to-r from-${vibrantColors.accent} to-${vibrantColors.accentLight} text-${vibrantColors.purple} shadow-lg hover:from-${vibrantColors.accentLight} hover:to-${vibrantColors.accent}`
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
    >
      {children}
    </button>
  );
};

// Composant Carte Zen
const ZenCard = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`
      bg-${vibrantColors.white} rounded-3xl p-8 
      border border-${vibrantColors.cream} shadow-lg
      ${hoverEffect ? 'hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-500' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Composant En-tête de Section
const SectionHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="text-center mb-16">
      <div className={`inline-flex items-center justify-center bg-${vibrantColors.white} rounded-full px-8 py-4 mb-6 border border-${vibrantColors.lavender} shadow-sm`}>
        <span className="text-4xl mr-4">{icon}</span>
        <h2 className={`text-4xl md:text-5xl font-display text-${vibrantColors.purple} tracking-wide`}>
          {title}
        </h2>
      </div>
      <p className={`text-xl text-${vibrantColors.text} max-w-3xl mx-auto leading-relaxed font-body`}>
        {subtitle}
      </p>
    </div>
  );
};

export default function BienEtre() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [activeExercise, setActiveExercise] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Changement automatique des citations
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // --- Questionnaire bien-être ---
  const today = new Date().toISOString().slice(0, 10);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('bienetreAnswers');
    return saved ? JSON.parse(saved) : {};
  });
  const [submitted, setSubmitted] = useState(!!answers[today]);

  const [form, setForm] = useState(() => {
    const defaultForm = {};
    QUESTIONNAIRE.forEach(q => {
      defaultForm[q.key] = 3;
    });
    return defaultForm;
  });

  const handleQuestionnaire = (e) => {
    e.preventDefault();
    
    const allAnswered = QUESTIONNAIRE.every(q => form[q.key] !== undefined && form[q.key] !== null);
    if (!allAnswered) {
      alert('Veuillez répondre à toutes les questions avant de valider.');
      return;
    }
    
    let score = 0;
    QUESTIONNAIRE.forEach(q => {
      if (q.reverse) {
        score += (q.max - form[q.key] + 1);
      } else {
        score += form[q.key];
      }
    });
    
    const newAnswers = { ...answers, [today]: { ...form, score } };
    setAnswers(newAnswers);
    localStorage.setItem('bienetreAnswers', JSON.stringify(newAnswers));
    setSubmitted(true);
  };

  const score = answers[today]?.score;
  const recommandation = score ? getRecommandation(score) : null;

  // --- Journal de bien-être ---
  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem('bienetreJournal');
    return saved ? JSON.parse(saved) : {};
  });
  const [note, setNote] = useState(journal[today] || "");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveNote = (e) => {
    e.preventDefault();
    const newJournal = { ...journal, [today]: note };
    setJournal(newJournal);
    localStorage.setItem('bienetreJournal', JSON.stringify(newJournal));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  // États pour les nouvelles fonctionnalités
  const [activeBreathing, setActiveBreathing] = useState(null);
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [sleepData, setSleepData] = useState(() => {
    const saved = localStorage.getItem('bienetreSleep');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [sleepNotes, setSleepNotes] = useState("");
  const [sleepQuality, setSleepQuality] = useState(8);

  // Timer pour les exercices de respiration
  React.useEffect(() => {
    let interval;
    if (isBreathing && breathingTimer > 0) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev <= 1) {
            setIsBreathing(false);
            setActiveBreathing(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathingTimer]);

  const startBreathing = (exercise) => {
    setActiveBreathing(exercise);
    setBreathingTimer(exercise.duration * 60);
    setIsBreathing(true);
  };

  const saveSleepData = (data) => {
    const newSleepData = { ...sleepData, [today]: data };
    setSleepData(newSleepData);
    localStorage.setItem('bienetreSleep', JSON.stringify(newSleepData));
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${vibrantColors.cream} 0%, ${vibrantColors.greenLight} 25%, ${vibrantColors.green} 50%, ${vibrantColors.lavender} 75%, ${vibrantColors.purple} 100%)`,
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Styles globaux */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap');
        
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: ${vibrantColors.purple};
        }
        
        body, p, button {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          color: ${vibrantColors.text};
        }
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }
        
        .font-body {
          font-family: 'Montserrat', sans-serif;
        }
        
        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .wave {
          animation: wave 8s linear infinite;
        }
        
        @keyframes wave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        /* Classes de couleur */
        .bg-green { background-color: ${vibrantColors.green}; }
        .bg-greenLight { background-color: ${vibrantColors.greenLight}; }
        .bg-cream { background-color: ${vibrantColors.cream}; }
        .bg-lavender { background-color: ${vibrantColors.lavender}; }
        .bg-purple { background-color: ${vibrantColors.purple}; }
        .bg-accent { background-color: ${vibrantColors.accent}; }
        .bg-accentLight { background-color: ${vibrantColors.accentLight}; }
        
        .text-green { color: ${vibrantColors.green}; }
        .text-greenLight { color: ${vibrantColors.greenLight}; }
        .text-cream { color: ${vibrantColors.cream}; }
        .text-lavender { color: ${vibrantColors.lavender}; }
        .text-purple { color: ${vibrantColors.purple}; }
        .text-accent { color: ${vibrantColors.accent}; }
        .text-accentLight { color: ${vibrantColors.accentLight}; }
        
        .border-green { border-color: ${vibrantColors.green}; }
        .border-greenLight { border-color: ${vibrantColors.greenLight}; }
        .border-cream { border-color: ${vibrantColors.cream}; }
        .border-lavender { border-color: ${vibrantColors.lavender}; }
        .border-purple { border-color: ${vibrantColors.purple}; }
        
        .from-green { --tw-gradient-from: ${vibrantColors.green}; }
        .to-purple { --tw-gradient-to: ${vibrantColors.purple}; }
        .from-purple { --tw-gradient-from: ${vibrantColors.purple}; }
        .to-green { --tw-gradient-to: ${vibrantColors.green}; }
        .from-accent { --tw-gradient-from: ${vibrantColors.accent}; }
        .to-accentLight { --tw-gradient-to: ${vibrantColors.accentLight}; }
      `}</style>

      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Vagues subtiles en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple/5 to-transparent animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green/3 to-transparent animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      {/* Navigation interne */}
      <nav className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 border border-lavender shadow-lg">
        <div className="flex space-x-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-500 hover:bg-greenLight/30 ${
                activeSection === section.id ? 'bg-greenLight/40 text-purple' : 'text-gray-600 hover:text-purple'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm font-light hidden md:block">{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu principal */}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <main className="flex-1 pt-32 pb-32 relative z-10">
        {/* Hero Section avec citation inspirante */}
        <section id="hero" className="py-32 text-center mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cream/30 to-greenLight/20 wave" 
               style={{ backgroundSize: '200% 200%' }} />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <ZenCard hoverEffect={false} className="p-16 bg-white/90">
              <div className="fade-in">
                <h2 className="font-display text-4xl md:text-5xl text-purple mb-8 leading-relaxed tracking-wide">
                  "{quotes[currentQuote].text}"
                </h2>
                <p className="text-xl text-gray-600 italic mb-8 font-body">— {quotes[currentQuote].author}</p>
                <div className="flex justify-center gap-3">
                  {quotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuote(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-1000 ${
                        index === currentQuote ? 'bg-purple scale-125' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </ZenCard>
          </div>
          
          {/* Éléments décoratifs flottants */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-green/20 rounded-full float" 
               style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accentLight/20 rounded-full float" 
               style={{ animationDelay: '1s' }} />
        </section>

        {/* Introduction avec typographie apaisante */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-24 fade-in">
          <h1 className="font-display text-6xl md:text-7xl text-purple mb-12 leading-relaxed tracking-wide">
            Votre bien-être, notre priorité
          </h1>
          <p className="font-body text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto" style={{ lineHeight: '1.8' }}>
            Découvrez nos solutions personnalisées pour vous aider à atteindre un équilibre entre corps et esprit. 
            De la gestion du stress à l'amélioration du sommeil, FitWise vous accompagne à chaque étape.
          </p>
        </section>

        {/* Section Analyse de votre bien-être */}
        <section id="analyse" className="py-20 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader 
              icon="🌿" 
              title="Analyse de votre bien-être" 
              subtitle="Évaluez votre état de bien-être quotidien et recevez des recommandations personnalisées pour améliorer votre équilibre."
            />
            
            <ZenCard className="p-12 bg-white/90">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Questionnaire */}
                <div>
                  <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Évaluation quotidienne</h3>
                  
                  {/* Affichage des résultats */}
                  {submitted && score && recommandation ? (
                    <ZenCard className="text-center p-8">
                      <div className="text-8xl font-light text-green mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {score} <span className="text-4xl">/ 20</span>
                      </div>
                      <div className="text-3xl font-display text-purple mb-4 tracking-wide">{recommandation.titre}</div>
                      <div className="text-lg text-gray-600 mb-8 leading-relaxed font-body">{recommandation.conseil}</div>
                      
                      {/* Résumé des réponses */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {QUESTIONNAIRE.map(q => (
                          <div key={q.key} className="flex flex-col items-center p-4 bg-white/40 rounded-xl border border-cream">
                            <span className="text-2xl mb-2">{q.icon}</span>
                            <span className="text-sm text-gray-600 font-body">{q.label}</span>
                            <span className="text-lg font-light text-green" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {answers[today]?.[q.key] || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <ZenButton onClick={() => {
                        setSubmitted(false);
                        setForm({
                          energie: 3,
                          humeur: 3,
                          sommeil: 3,
                          stress: 3
                        });
                      }}>
                        Répondre à nouveau
                      </ZenButton>
                    </ZenCard>
                  ) : (
                    /* Formulaire de questionnaire */
                    <ZenCard className="p-8">
                      <form onSubmit={handleQuestionnaire} className="space-y-8">
                        {QUESTIONNAIRE.map(q => (
                          <div key={q.key} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{q.icon}</span>
                              <div className="flex-1">
                                <h4 className="text-lg font-display text-gray-700 mb-1">{q.label}</h4>
                                <p className="text-sm text-gray-600 font-body">Évaluez de 1 à 5</p>
                              </div>
                              {form[q.key] !== undefined && (
                                <span className="text-green text-xl">✓</span>
                              )}
                            </div>
                            
                            <div className="flex justify-center gap-3">
                              {Array.from({ length: 5 }, (_, i) => i + 1).map(val => (
                                <button
                                  type="button"
                                  key={val}
                                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-300 ${
                                    form[q.key] === val 
                                      ? 'bg-green border-purple text-white shadow-md scale-110' 
                                      : 'bg-white/70 border-gray-300 text-gray-600 hover:bg-green/20 hover:border-green hover:scale-105'
                                  }`}
                                  onClick={() => setForm(prev => ({ ...prev, [q.key]: val }))}
                                >
                                  {q.reverse ? 6 - val : val}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-6">
                          <ZenButton type="submit" className="w-full py-4 text-xl">
                            Valider mon bien-être
                          </ZenButton>
                        </div>
                      </form>
                    </ZenCard>
                  )}
                </div>

                {/* Graphique de suivi */}
                <div>
                  <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Votre progression</h3>
                  <ZenCard className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center">
                      <div className="w-full h-64 bg-white/50 rounded-xl mb-6 flex items-end justify-center p-4">
                        {/* Barres du graphique */}
                        {Object.entries(answers)
                          .slice(-7)
                          .map(([date, data], i) => (
                            <div key={date} className="flex flex-col items-center mx-1">
                              <div 
                                className="w-8 bg-gradient-to-t from-green to-purple rounded-t-sm transition-all duration-500"
                                style={{ height: `${(data.score / 20) * 100}%` }}
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          ))}
                      </div>
                      <p className="text-gray-600 font-body mb-6">
                        Suivez votre évolution sur les 7 derniers jours
                      </p>
                      <ZenButton type="secondary">
                        Voir l'historique complet
                      </ZenButton>
                    </div>
                  </ZenCard>
                </div>
              </div>
            </ZenCard>
          </div>
        </section>

        {/* Section Santé mentale */}
        <section id="sante-mentale" className="py-20 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              icon="🧠"
              title="Santé mentale"
              subtitle="Découvrez des techniques de respiration et de méditation pour apaiser votre esprit et réduire le stress."
            />

            <ZenCard className="p-12 bg-white/90">
              {/* Exercices de respiration */}
              <div className="mb-16">
                <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Exercices de respiration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {breathingExercises.map((exercise, index) => (
                    <ZenCard key={exercise.name}>
                      {/* Titre de l'exercice */}
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-display text-purple mb-2">{exercise.name}</h4>
                        <p className="text-gray-600 text-sm font-body">{exercise.benefits}</p>
                      </div>
                      
                      {/* Image de fond avec overlay */}
                      <div className="relative mb-6 rounded-xl overflow-hidden h-48">
                        <img 
                          src={index === 0 ? well1 : well2}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      {activeBreathing === exercise && isBreathing ? (
                        <div className="text-center">
                          <div className="text-5xl font-light text-green mb-6">
                            {Math.floor(breathingTimer / 60)}:{(breathingTimer % 60).toString().padStart(2, '0')}
                          </div>
                          <ZenButton 
                            onClick={() => setIsBreathing(false)}
                            type="secondary"
                          >
                            Arrêter
                          </ZenButton>
                        </div>
                      ) : (
                        <div>
                          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-3 font-body">
                            {exercise.steps.map((step, i) => (
                              <li key={i} className="text-base">{step}</li>
                            ))}
                          </ol>
                          <ZenButton 
                            onClick={() => startBreathing(exercise)}
                          >
                            Commencer ({exercise.duration} min)
                          </ZenButton>
                        </div>
                      )}
                    </ZenCard>
                  ))}
                </div>
              </div>

              {/* Techniques de relaxation */}
              <div>
                <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Techniques de relaxation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relaxationRoutines.map((routine, index) => (
                    <ZenCard key={routine.name}>
                      <div className="flex items-start mb-4">
                        <span className="text-3xl mr-4">{index === 0 ? "🌅" : index === 1 ? "🌞" : "🌙"}</span>
                        <div>
                          <h4 className="text-xl font-display text-purple">{routine.name}</h4>
                          <p className="text-gray-600 text-sm font-body">{routine.duration} minutes</p>
                        </div>
                      </div>
                      <ul className="space-y-3 mt-4">
                        {routine.steps.map((step, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green mr-2">•</span>
                            <span className="text-gray-600 font-body">{step}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <ZenButton type="secondary" className="w-full">
                          Essayer cette routine
                        </ZenButton>
                      </div>
                    </ZenCard>
                  ))}
                </div>
              </div>
            </ZenCard>
          </div>
        </section>

        {/* Section Sommeil réparateur */}
        <section id="sommeil" className="py-20 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              icon="😴"
              title="Sommeil réparateur"
              subtitle="Créez votre rituel du soir parfait et suivez votre voyage vers un sommeil profond."
            />

            <div className="bg-gradient-to-br from-white/90 to-greenLight/20 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-cream">
              {/* Header avec statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                  { icon: "😴", value: "8.5/10", label: "Qualité" },
                  { icon: "⏰", value: "7h 30", label: "Durée" },
                  { icon: "🔄", value: "5", label: "Cycles" },
                  { icon: "📊", value: "85%", label: "Progression" }
                ].map((stat, i) => (
                  <ZenCard key={i} className="text-center p-6">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-display text-green">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-body">{stat.label}</div>
                  </ZenCard>
                ))}
              </div>

              {/* Rituel du soir */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-display text-purple tracking-wide">Votre rituel du soir</h3>
                  <ZenButton 
                    onClick={() => setShowCustomizeModal(true)}
                    type="accent"
                  >
                    <span>⚙️</span> Personnaliser
                  </ZenButton>
                </div>
                
                {/* Étapes en grille moderne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      time: "20h00", 
                      title: "Bain relaxant", 
                      desc: "Eau tiède + huiles essentielles", 
                      benefit: "Détend les muscles et prépare le corps au repos",
                      icon: "🛁",
                      color: "from-blue-400 to-blue-600",
                      duration: "15 min"
                    },
                    { 
                      time: "20h30", 
                      title: "Lecture douce", 
                      desc: "15 minutes de lecture apaisante", 
                      benefit: "Calme l'esprit et réduit l'activité cérébrale",
                      icon: "📖",
                      color: "from-purple-400 to-purple-600",
                      duration: "15 min"
                    },
                    { 
                      time: "21h00", 
                      title: "Méditation", 
                      desc: "10 minutes de pleine conscience", 
                      benefit: "Réduit le stress et prépare à l'endormissement",
                      icon: "🧘",
                      color: "from-green-400 to-green-600",
                      duration: "10 min"
                    },
                    { 
                      time: "21h15", 
                      title: "Préparation", 
                      desc: "Chambre fraîche et sombre", 
                      benefit: "Optimise les conditions pour un sommeil profond",
                      icon: "💤",
                      color: "from-indigo-400 to-indigo-600",
                      duration: "5 min"
                    },
                    { 
                      time: "21h30", 
                      title: "Dodo", 
                      desc: "Sommeil réparateur garanti", 
                      benefit: "Récupération complète et régénération cellulaire",
                      icon: "🌙",
                      color: "from-green to-purple",
                      duration: "7-8h"
                    }
                  ].map((step, index) => (
                    <ZenCard key={index}>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{step.icon}</span>
                            <div>
                              <div className="text-xl font-display text-purple">{step.title}</div>
                              <div className="text-sm text-gray-600 font-body">{step.time} • {step.duration}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setCompletedSteps(prev => ({
                              ...prev,
                              [index]: !prev[index]
                            }))}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              completedSteps[index] 
                                ? 'bg-green border-purple text-cream' 
                                : 'border-gray-300 hover:border-green'
                            }`}
                          >
                            {completedSteps[index] && '✓'}
                          </button>
                        </div>
                        
                        <div className="text-gray-600 text-sm mb-4 font-body">{step.desc}</div>
                        
                        {/* Bénéfice avec design moderne */}
                        <div className="bg-gradient-to-r from-green/10 to-greenLight/10 rounded-xl p-4 border border-green/20">
                          <div className="text-sm text-green font-medium mb-2 flex items-center gap-2 font-body">
                            <span>💡</span>
                            Bénéfice
                          </div>
                          <div className="text-gray-700 font-body text-sm">{step.benefit}</div>
                        </div>
                      </div>
                    </ZenCard>
                  ))}
                </div>
                
                {/* Progression moderne */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 border border-cream">
                    <span className="text-gray-700 font-body">Progression :</span>
                    <span className="text-2xl font-display text-green">
                      {Object.keys(completedSteps).length}/5 étapes
                    </span>
                    <div className="w-40 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green to-purple h-3 rounded-full transition-all duration-500"
                        style={{width: `${(Object.keys(completedSteps).length / 5) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambiances sonores */}
              <div>
                <h3 className="text-3xl font-display text-purple mb-8 text-center tracking-wide">Ambiances sonores</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { name: "Pluie douce", icon: "🌧️", color: "from-blue-400 to-blue-600", url: "https://www.soundjay.com/misc/sounds/rain-01.mp3" },
                    { name: "Océan calme", icon: "🌊", color: "from-cyan-400 to-cyan-600", url: "https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3" },
                    { name: "Forêt zen", icon: "🌲", color: "from-green-400 to-green-600", url: "https://www.soundjay.com/misc/sounds/forest-ambience.mp3" },
                    { name: "Bruit blanc", icon: "⚪", color: "from-gray-400 to-gray-600", url: "https://www.soundjay.com/misc/sounds/white-noise.mp3" }
                  ].map((sound, index) => (
                    <ZenCard key={index} className="text-center p-6">
                      <span className="text-4xl mb-4 block group-hover:scale-110 transition-all duration-300">{sound.icon}</span>
                      <h4 className="text-lg font-display text-purple mb-3">{sound.name}</h4>
                      <ZenButton
                        onClick={() => {
                          if (currentSound === sound.name && isPlaying) {
                            setIsPlaying(false);
                            setCurrentSound(null);
                          } else {
                            setCurrentSound(sound.name);
                            setIsPlaying(true);
                          }
                        }}
                        className={`${sound.color} ${
                          currentSound === sound.name && isPlaying ? 'ring-4 ring-white/50 animate-pulse' : ''
                        }`}
                      >
                        {currentSound === sound.name && isPlaying ? 'Arrêter' : 'Écouter'}
                      </ZenButton>
                      
                      {/* Audio element (caché) */}
                      {currentSound === sound.name && (
                        <audio 
                          src={sound.url} 
                          autoPlay={isPlaying}
                          loop
                          onEnded={() => setIsPlaying(false)}
                          style={{ display: 'none' }}
                        />
                      )}
                    </ZenCard>
                  ))}
                </div>
                
                {/* Indicateur de lecture moderne */}
                {isPlaying && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 border border-cream">
                      <span className="text-2xl">🎵</span>
                      <span className="text-gray-700 font-body">Écoute en cours : {currentSound}</span>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Notes sur la qualité du sommeil */}
        <div className="mt-12 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-display text-purple mb-6 text-center tracking-wide">Votre expérience du sommeil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Évaluation de la qualité */}
              <ZenCard>
                <h4 className="text-xl font-display text-purple mb-4">Qualité de votre sommeil</h4>
                <div className="text-center mb-4">
                  <div className="text-4xl font-display text-green mb-2">{sleepQuality}/10</div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-body">
                    <span>Très mauvais</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </ZenCard>
              
              {/* Notes personnelles */}
              <ZenCard>
                <h4 className="text-xl font-display text-purple mb-4">Notes personnelles</h4>
                <textarea
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  placeholder="Comment vous sentez-vous ce matin ? Avez-vous bien dormi ?..."
                  className="w-full h-32 p-4 rounded-xl border border-cream bg-white text-lg focus:ring-2 focus:ring-green focus:border-green transition-all duration-500 placeholder-gray-400 font-body resize-none"
                  style={{ lineHeight: '1.6' }}
                />
                <div className="mt-4 text-right">
                  <ZenButton>
                    Sauvegarder
                  </ZenButton>
                </div>
              </ZenCard>
            </div>
          </div>
        </div>

        {/* Modal de personnalisation */}
        {showCustomizeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <ZenCard className="p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display text-purple tracking-wide">Personnaliser ma routine</h3>
                <button 
                  onClick={() => setShowCustomizeModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-display text-purple mb-3">Choisir vos activités</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Bain relaxant", "Lecture", "Méditation", "Yoga doux", 
                      "Étirements", "Musique calme", "Tisane", "Journaling"
                    ].map((activity, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer font-body">
                        <input type="checkbox" className="w-5 h-5 text-green rounded border-gray-300 focus:ring-green" />
                        <span className="text-gray-700">{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-display text-purple mb-3">Heure de début</h4>
                  <input 
                    type="time" 
                    defaultValue="20:00"
                    className="w-full p-4 rounded-xl border border-cream bg-white text-lg font-body"
                  />
                </div>
                
                <div>
                  <h4 className="text-lg font-display text-purple mb-3">Durée de la routine</h4>
                  <select className="w-full p-4 rounded-xl border border-cream bg-white text-lg font-body">
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <ZenButton 
                  onClick={() => setShowCustomizeModal(false)}
                  type="secondary"
                  className="flex-1"
                >
                  Annuler
                </ZenButton>
                <ZenButton className="flex-1">
                  Sauvegarder
                </ZenButton>
              </div>
            </ZenCard>
          </div>
        )}

        {/* Section Suivi personnalisé */}
        <section id="suivi" className="py-20 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              icon="📅"
              title="Suivi personnalisé"
              subtitle="Suivez votre progression et recevez des notifications bienveillantes pour maintenir votre bien-être."
            />

            <ZenCard className="p-12 bg-white/90">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Journal de bien-être */}
                <div>
                  <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Journal de bien-être</h3>
                  <ZenCard>
                    <form onSubmit={handleSaveNote}>
                      <textarea
                        className="w-full min-h-[150px] rounded-2xl border border-cream bg-white px-6 py-4 text-lg focus:ring-2 focus:ring-green focus:border-green transition-all duration-800 placeholder-gray-400 font-body"
                        placeholder="Exprimez votre ressenti, vos gratitudes, ou un moment marquant de la journée..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        maxLength={400}
                        style={{ lineHeight: '1.7' }}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-400 font-body">{note.length}/400 caractères</span>
                        <ZenButton type="submit" className="text-lg">
                          {journal[today] ? 'Mettre à jour' : 'Enregistrer'}
                        </ZenButton>
                      </div>
                      {savedMsg && <div className="text-green text-sm mt-4 animate-pulse font-body">Note enregistrée !</div>}
                    </form>
                    {journal[today] && (
                      <div className="mt-6 bg-white rounded-2xl p-6 border border-cream">
                        <span className="font-display text-gray-700 text-lg">Votre note du jour :</span>
                        <div className="mt-3 text-gray-600 leading-relaxed font-body" style={{ lineHeight: '1.8' }}>{journal[today]}</div>
                      </div>
                    )}
                  </ZenCard>
                </div>

                {/* Statistiques */}
                <div>
                  <h3 className="text-2xl font-display text-purple mb-8 tracking-wide">Vos statistiques</h3>
                  <ZenCard className="p-8 h-full flex flex-col justify-center">
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg font-body">Score moyen cette semaine</span>
                        <span className="text-3xl font-display text-green">15.2/20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg font-body">Jours consécutifs</span>
                        <span className="text-3xl font-display text-green">7</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg font-body">Tendance</span>
                        <span className="text-3xl font-display text-green-500">↗️ +2.1</span>
                      </div>
                    </div>
                  </ZenCard>
                </div>
              </div>
            </ZenCard>
          </div>
        </section>
      </main>

      {/* Footer Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cream/90 to-greenLight/90 backdrop-blur-md border-t border-cream/50 py-4 z-50 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { icon: "📔", label: "Accueil", path: "/" },
            { icon: "🍏", label: "Nutrition", path: "/nutrition" },
            { icon: "🏃‍♀️", label: "Activité", path: "/activite-physique" },
            { icon: "🧘", label: "Bien-être", path: "/bien-etre" }
          ].map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex flex-col items-center p-2 transition-all duration-800 text-gray-600 hover:text-purple ${item.label === 'Bien-être' ? 'font-medium text-purple' : ''}`}
            >
              <span className={`text-2xl ${item.label === 'Bien-être' ? `bg-gradient-to-r from-green to-purple w-14 h-14 flex items-center justify-center text-white rounded-full shadow-xl -mt-7 animate-pulse` : ''}`}>{item.icon}</span>
              <span className="text-xs mt-1 font-body">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}