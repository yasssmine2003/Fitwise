import { useState, useEffect, useMemo } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import sport from "assets/img/6.png";

// Initialisation sécurisée de Chart.js
if (typeof Chart !== 'undefined') {
  Chart.register(...registerables);
}
// Fonction pour calculer l'IMC (déplacée avant le composant principal)
const calculateBMI = (weight, height) => {
  if (!weight || !height || height === 0) return 0;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Fonction pour obtenir la catégorie d'IMC
const getBMICategory = (bmi) => {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) return 'Poids insuffisant';
  if (bmi < 25) return 'Poids normal';
  if (bmi < 30) return 'Surpoids';
  return 'Obésité';
};

// Fonction pour récupérer les données nutritionnelles (a modifier dans le backend )
const getNutritionData = () => {
  const nutritionData = localStorage.getItem('nutritionData');
  const nutritionProfile = localStorage.getItem('nutritionProfile');
  
  if (!nutritionData || !nutritionProfile) return null;
  
  return {
    data: JSON.parse(nutritionData),
    profile: JSON.parse(nutritionProfile),
    todayData: JSON.parse(nutritionData)[new Date().toISOString().slice(0, 10)] || { meals: {} },
    today: new Date().toISOString().slice(0, 10)
  };
};

const ActivitePhysique = () => {
  // États initiaux
  const [isInitialized, setIsInitialized] = useState(false);
  const [activite, setActivite] = useState({
    type: 'Marche',
    duree: 30,
    distance: '',
    pas: '',
    calories: '',
    intensite: 'moyen',
    date: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  const [objectifs, setObjectifs] = useState({
    pas: 10000,
    duree: 30,
    calories: 500,
    jours: 5
  });

  const [activites, setActivites] = useState([]);
  const [statistiques, setStatistiques] = useState({
    dureeTotale: 0,
    caloriesTotales: 0,
    pasTotaux: 0,
    typesActivites: {},
    distanceTotale: 0
  });

  const [progression, setProgression] = useState({
    pas: 0,
    duree: 0,
    calories: 0
  });

  const [darkMode, setDarkMode] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  
  const [userProfile, setUserProfile] = useState({
    age: 30,
    poids: 70,
    taille: 175,
    niveau: 'intermédiaire'
  });

  const [seancesPlanifiees, setSeancesPlanifiees] = useState([]);
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);
  const [seancePlanifiee, setSeancePlanifiee] = useState({
    type: 'Marche',
    duree: 30,
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    intensite: 'moyen'
  });
  // Génération des données pour le graphique hebdomadaire
  const donneesGraphique = useMemo(() => {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const aujourdHui = new Date();
    const dateDebut = new Date();
    dateDebut.setDate(aujourdHui.getDate() - 6);

    const donnees = {};
    jours.forEach(jour => {
      donnees[jour] = 0;
    });

    activites.forEach(act => {
      try {
        const dateAct = new Date(act.date);
        if (dateAct >= dateDebut && dateAct <= aujourdHui) {
          const jourSemaine = jours[dateAct.getDay() === 0 ? 6 : dateAct.getDay() - 1];
          donnees[jourSemaine] += parseInt(act.duree) || 0;
        }
      } catch {
        // Ignorer les dates invalides
      }
    });

    return donnees;
  }, [activites]);

  // Chargement des données
  useEffect(() => {
    const safelyParse = (item, defaultValue) => {
      try {
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const loadData = () => {
      try {
        const savedActivites = safelyParse(localStorage.getItem('fitwiseActivites'), []);
        const savedObjectifs = safelyParse(localStorage.getItem('fitwiseObjectifs'),[]);
        const savedProfile = safelyParse(localStorage.getItem('fitwiseProfile'),{});
        const savedTheme = safelyParse(localStorage.getItem('fitwiseDarkMode'), false);
        const savedSeances = safelyParse(localStorage.getItem('fitwiseSeancesPlanifiees'), []);

        setActivites(savedActivites);
        setObjectifs(savedObjectifs);
        setUserProfile(savedProfile);
        setDarkMode(savedTheme);
        setSeancesPlanifiees(savedSeances);

        calculerStatistiques(savedActivites);
        calculerProgression(savedActivites);
        calculerStreak(savedActivites);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
      }, []);


  // Fonctions de calcul
  const calculerStatistiques = (data = []) => {
    const stats = {
      dureeTotale: data.reduce((sum, act) => sum + (parseInt(act.duree) || 0), 0),
      caloriesTotales: data.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0),
      pasTotaux: data.reduce((sum, act) => sum + (parseInt(act.pas) || 0), 0),
      typesActivites: {},
      distanceTotale: data.reduce((sum, act) => sum + (parseFloat(act.distance) || 0), 0)
    };

    data.forEach(act => {
      if (act?.type) {
        stats.typesActivites[act.type] = (stats.typesActivites[act.type] || 0) + 1;
      }
    });

    setStatistiques(stats);
  };

  const calculerProgression = (data = []) => {
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 6);

    const activitesRecent = data.filter(act => {
      try {
        const actDate = new Date(act.date);
        return actDate >= dateLimite && actDate <= new Date();
      } catch {
        return false;
      }
    });

    const prog = {
      pas: activitesRecent.reduce((sum, act) => sum + (parseInt(act.pas) || 0), 0) / 7,
      duree: activitesRecent.reduce((sum, act) => sum + (parseInt(act.duree) || 0), 0) / 7,
      calories: activitesRecent.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0) / 7
    };

    setProgression(prog);
  };

  const calculerStreak = (data = []) => {
    const sortedActivities = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    let current = 0;
    let longest = 0;
    let previousDate = null;

    sortedActivities.forEach(act => {
      const currentDate = new Date(act.date).toDateString();
      if (previousDate === null) {
        current = 1;
      } else {
        const diffDays = Math.floor((new Date(currentDate) - new Date(previousDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          current++;
          longest = Math.max(longest, current);
        } else if (diffDays > 1) {
          current = 1;
        }
      }
      previousDate = currentDate;
    });

    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  // Gestion des formulaires
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivite(prev => ({
      ...prev,
      [name]: value
    }));

    if (['type', 'duree'].includes(name)) {
      const estimatedCalories = estimerCalories(
        name === 'type' ? value : activite.type,
        name === 'duree' ? value : activite.duree
      );
      setActivite(prev => ({
        ...prev,
        calories: estimatedCalories
      }));
    }
  };

  const estimerCalories = (type, duree) => {
    const metValues = {
      'Marche': 3.5,
      'Course': 8,
      'Vélo': 6,
      'Natation': 6,
      'Yoga': 2.5,
      'Musculation': 5,
      'HIIT': 10
    };

    const met = metValues[type] || 3;
    return Math.round(met * userProfile.poids * (parseInt(duree) / 60));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouvellesActivites = [...activites, activite];
    setActivites(nouvellesActivites);
    localStorage.setItem('fitwiseActivites', JSON.stringify(nouvellesActivites));
    
    calculerStatistiques(nouvellesActivites);
    calculerProgression(nouvellesActivites);
    calculerStreak(nouvellesActivites);

    setActivite({
      type: 'Marche',
      duree: 30,
      distance: '',
      pas: '',
      calories: '',
      intensite: 'moyen',
      date: new Date().toISOString().slice(0, 16),
      notes: ''
    });
  };

  const handleSaveGoals = () => {
    localStorage.setItem('fitwiseObjectifs', JSON.stringify(objectifs));
    alert('Objectifs enregistrés avec succès !');
  };

  const handleSaveProfile = () => {
    localStorage.setItem('fitwiseProfile', JSON.stringify(userProfile));
    alert('Profil enregistré avec succès !');
  };

  // Gestion des séances planifiées
  const handlePlanifierSeance = () => {
    const nouvellesSeances = [...seancesPlanifiees, seancePlanifiee];
    setSeancesPlanifiees(nouvellesSeances);
    localStorage.setItem('fitwiseSeancesPlanifiees', JSON.stringify(nouvellesSeances));
    
    setSeancePlanifiee({
      type: 'Marche',
      duree: 30,
      date: new Date().toISOString().slice(0, 16),
      notes: '',
      intensite: 'moyen'
    });
    
    setShowPlanifierModal(false);
    alert('Séance planifiée avec succès !');
  };

  const handleSupprimerSeance = (index) => {
    const nouvellesSeances = seancesPlanifiees.filter((_, i) => i !== index);
    setSeancesPlanifiees(nouvellesSeances);
    localStorage.setItem('fitwiseSeancesPlanifiees', JSON.stringify(nouvellesSeances));
  };

  const handleConvertirEnActivite = (seance) => {
    const nouvelleActivite = {
      ...seance,
      distance: '',
      pas: '',
      calories: estimerCalories(seance.type, seance.duree),
      date: new Date().toISOString().slice(0, 16)
    };
    
    const nouvellesActivites = [...activites, nouvelleActivite];
    setActivites(nouvellesActivites);
    localStorage.setItem('fitwiseActivites', JSON.stringify(nouvellesActivites));
    
    const nouvellesSeances = seancesPlanifiees.filter(s => s !== seance);
    setSeancesPlanifiees(nouvellesSeances);
    localStorage.setItem('fitwiseSeancesPlanifiees', JSON.stringify(nouvellesSeances));
    
    calculerStatistiques(nouvellesActivites);
    calculerProgression(nouvellesActivites);
    calculerStreak(nouvellesActivites);
    
    alert('Séance convertie en activité !');
  };
  const pieData = useMemo(() => {
    return Object.entries(statistiques.typesActivites || {}).map(([type, count]) => [type, count]);
  }, [statistiques.typesActivites]);

  // Génération des conseils
  const genererConseilPersonnalise = () => {
    const maintenant = new Date();
    const heure = maintenant.getHours();
    const jourSemaine = maintenant.getDay();
    const derniereActivite = activites.length > 0 ? activites[activites.length - 1] : null;

    const progressionPas = (progression.pas / objectifs.pas) * 100;
    const progressionDuree = (progression.duree / objectifs.duree) * 100;
    const progressionCalories = (progression.calories / objectifs.calories) * 100;

    const estMatin = heure >= 6 && heure < 12;
    const estApresMidi = heure >= 12 && heure < 18;
    const estSoir = heure >= 18 || heure < 6;
    const estWeekend = jourSemaine === 0 || jourSemaine === 6;

    if (estMatin) {
      if (activites.length === 0) {
        return {
          titre: "Bonne matinée ! ☀️",
          conseil: "Commencez votre journée par une marche de 15 minutes pour réveiller votre corps en douceur.",
          tags: ["🌅 Matin", "🚶 Marche", "⏰ Routine"],
          niveau: "motivation"
        };
      }
      
      if (derniereActivite && new Date(derniereActivite.date).toDateString() === maintenant.toDateString()) {
        return {
          titre: "Déjà actif ce matin ! 💪",
          conseil: `Excellent ! Vous avez déjà fait ${derniereActivite.type} ce matin. Gardez cette énergie !`,
          tags: ["💪 Déjà actif", "💧 Hydratation", "🌟 Énergie"],
          niveau: "encouragement"
        };
      }
    }
    
    if (estApresMidi && progressionDuree < 50) {
      return {
        titre: "Il est temps de bouger ! 🏃‍♀️",
        conseil: `Vous n'avez fait que ${Math.round(progression.duree)} minutes aujourd'hui. Objectif : ${objectifs.duree} minutes !`,
        tags: ["⏰ Après-midi", "🎯 Objectif", "💪 Motivation"],
        niveau: "motivation"
      };
    }
    
    if (estSoir && derniereActivite && new Date(derniereActivite.date).toDateString() === maintenant.toDateString()) {
      return {
        titre: "Belle journée active ! 🌙",
        conseil: `Félicitations pour votre séance de ${derniereActivite.type} ! Pensez à vous étirer.`,
        tags: ["🌙 Soir", "🧘 Étirements", "💤 Récupération"],
        niveau: "repos"
      };
    }
    
    if (progressionPas < 30) {
      return {
        titre: "Objectif pas en vue ! 👣",
        conseil: `Vous n'avez fait que ${Math.round(progression.pas)} pas aujourd'hui sur ${objectifs.pas} objectif.`,
        tags: ["👣 Pas", "🎯 Objectif", "🚶 Marche"],
        niveau: "motivation"
      };
    }
    
    if (progressionCalories < 40) {
      return {
        titre: "Calories à brûler ! 🔥",
        conseil: `Vous avez brûlé ${Math.round(progression.calories)} calories sur ${objectifs.calories} objectif.`,
        tags: ["🔥 Calories", "⚡ HIIT", "🎯 Objectif"],
        niveau: "intensite"
      };
    }
    
    if (currentStreak >= 3) {
      return {
        titre: "Streak impressionnant ! 🔥",
        conseil: `${currentStreak} jours consécutifs d'activité ! Continuez !`,
        tags: ["🔥 Streak", "💪 Motivation", "🌟 Excellence"],
        niveau: "encouragement"
      };
    }
    
    if (currentStreak === 0 && activites.length > 0) {
      return {
        titre: "Reprenez le rythme ! 💪",
        conseil: "Commencez doucement avec une activité de 15 minutes pour reprendre le rythme.",
        tags: ["💪 Reprise", "⏰ 15 min", "🚶 Douceur"],
        niveau: "motivation"
      };
    }
    
    if (derniereActivite) {
      const conseilsParType = {
        'Marche': {
          titre: "Marche excellente ! 🚶",
          conseil: "La marche est parfaite pour la santé cardiovasculaire. Pour varier, essayez des montées !",
          tags: ["🚶 Marche", "❤️ Cardio", "📈 Progression"],
          niveau: "variation"
        },
        'Course': {
          titre: "Course dynamique ! 🏃‍♀️",
          conseil: "Excellent travail ! Pensez à bien vous étirer après votre course.",
          tags: ["🏃‍♀️ Course", "🧘 Étirements", "🔄 Alternance"],
          niveau: "repos"
        },
        'Vélo': {
          titre: "Vélo énergique ! 🚴",
          conseil: "Le vélo est excellent pour les jambes ! Ajoutez des exercices pour le haut du corps.",
          tags: ["🚴 Vélo", "💪 Renforcement", "⚖️ Équilibre"],
          niveau: "complement"
        },
        'Natation': {
          titre: "Natation parfaite ! 🏊",
          conseil: "La natation est l'activité la plus complète ! Essayez différents styles.",
          tags: ["🏊 Natation", "🔄 Styles", "📈 Distance"],
          niveau: "variation"
        },
        'Yoga': {
          titre: "Yoga zen ! 🧘",
          conseil: "Le yoga est excellent pour la flexibilité. Ajoutez du cardio.",
          tags: ["🧘 Yoga", "❤️ Cardio", "⚖️ Complément"],
          niveau: "complement"
        },
        'Musculation': {
          titre: "Musculation puissante ! 💪",
          conseil: "Excellent travail de renforcement ! Hydratez-vous bien.",
          tags: ["💪 Musculation", "💧 Hydratation", "🧘 Étirements"],
          niveau: "repos"
        },
        'HIIT': {
          titre: "HIIT intense ! ⚡",
          conseil: "Le HIIT est excellent pour brûler des calories ! Reposez-vous bien.",
          tags: ["⚡ HIIT", "🔥 Calories", "🔄 Alternance"],
          niveau: "repos"
        }
      };
      
      return conseilsParType[derniereActivite.type] || {
        titre: "Activité réussie ! 🎉",
        conseil: "Félicitations pour votre activité ! Variez les exercices.",
        tags: ["🎉 Félicitations", "🔄 Variation", "⚖️ Équilibre"],
        niveau: "encouragement"
      };
    }
    
    if (estWeekend) {
      return {
        titre: "Weekend actif ! 🎉",
        conseil: "Le weekend est parfait pour essayer une nouvelle activité !",
        tags: ["🎉 Weekend", "🆕 Nouvelle activité", "⏰ Temps libre"],
        niveau: "motivation"
      };
    }
    
    return {
      titre: "Prêt à bouger ! 💪",
      conseil: "Chaque jour est une nouvelle opportunité de prendre soin de votre santé.",
      tags: ["💪 Motivation", "⏰ 20 min", "🚶 Marche"],
      niveau: "motivation"
    };
  };

  const conseilDuJour = genererConseilPersonnalise();

  // Calcul des besoins nutritionnels
  const calculerBesoinsNutritionnels = () => {
    const nutritionData = localStorage.getItem('nutritionData');
    const nutritionProfile = localStorage.getItem('nutritionProfile');
    
    if (!nutritionData || !nutritionProfile) return null;
    const profile = JSON.parse(nutritionProfile);
    const today = new Date().toISOString().slice(0, 10);
    const activitesAujourdhui = activites.filter(act => {
      const actDate = new Date(act.date).toISOString().slice(0, 10);
      return actDate === today;
    });

    const caloriesBrulées = activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0);
    const dureeTotale = activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.duree) || 0), 0);

    // Calcul simplifié des besoins
    const besoinsBase = profile.weight * 30; // Estimation basique
    const besoinsSupplementaires = Math.round(caloriesBrulées * 0.3);
    const besoinsTotaux = besoinsBase + besoinsSupplementaires;

    return {
      besoinsBase,
      besoinsSupplementaires,
      besoinsTotaux,
      caloriesBrulées,
      dureeTotale,
      activitesAujourdhui
    };
  };

  const genererRecommandationsNutritionnelles = () => {
    const nutritionInfo = getNutritionData();
    const besoins = calculerBesoinsNutritionnels();
    
    if (!nutritionInfo || !besoins) {
      return {
        titre: "Connectez votre profil nutritionnel",
        conseil: "Pour des recommandations nutritionnelles personnalisées, créez votre profil dans la section Nutrition.",
        niveau: "info",
        tags: ["🍎 Nutrition", "🔗 Connexion", "📊 Profil"]
      };
    }
    
    const { todayData } = nutritionInfo;
    const { besoinsTotaux } = besoins;
    
    const caloriesConsommees = todayData ? 
      Object.values(todayData.meals || {}).flat().reduce((sum, food) => sum + (Number(food.calories) || 0), 0) : 0;
    
    const deficit = besoinsTotaux - caloriesConsommees;
    
    if (deficit > 500) {
      return {
        titre: "Besoin de calories supplémentaires !",
        conseil: `Ajoutez ${Math.round(deficit)} calories à votre alimentation pour récupérer efficacement.`,
        niveau: "intensite",
        tags: ["🔥 Calories", "🍽️ Alimentation", "💪 Récupération"]
      };
    }
    
    if (deficit < -300) {
      return {
        titre: "Attention aux excès !",
        conseil: `Vous avez consommé ${Math.abs(deficit)} calories de plus que vos besoins.`,
        niveau: "repos",
        tags: ["⚖️ Équilibre", "🏃‍♀️ Activité", "📊 Contrôle"]
      };
    }
    
    return {
      titre: "Équilibre parfait !",
      conseil: "Votre alimentation et votre activité sont bien équilibrées.",
      niveau: "encouragement",
      tags: ["⚖️ Équilibre", "🌟 Bien-être", "💪 Santé"]
    };
  };

  const recommandationsNutrition = genererRecommandationsNutritionnelles();

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Chargement en cours...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-teal-50 text-gray-800'} p-4 md:p-10 lg:p-12`}>
      {/* Barre de navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-300">FitWise</h1>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="nav-link">Accueil</a>
            <a href="#stats" className="nav-link">Statistiques</a>
            <a href="#objectifs" className="nav-link">Objectifs</a>
            <a href="#suivi" className="nav-link">Suivi</a>
            <a href="#calendrier" className="nav-link">Calendrier</a>
            <a href="nutrition" className="nav-link">Nutrition</a>
            <a href="#conseils" className="nav-link">Conseils</a>
          </div>
        </div>
      </nav>

      <header className="mb-16 pt-16 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 dark:text-indigo-300 tracking-tight">
          FitWise
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-2 font-medium">
          Suivez vos activités physiques avec style et précision
        </p>
      </header>

      {/* Section Statistiques */}
      <section id="stats" className="mb-16">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">📊</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-700 tracking-tight">Statistiques</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            {/* Graphique hebdomadaire */}
            <div className="flex-1 bg-blue-50 rounded-2xl shadow p-5 flex flex-col justify-between h-[240px] min-w-[220px]">
              <h3 className="text-base font-semibold text-blue-900 mb-3">Activité cette semaine</h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-[240px] max-h-[160px] w-full h-full mx-auto flex items-center justify-center">
                  <Line
                    data={{
                      labels: Object.keys(donneesGraphique),
                      datasets: [{
                        label: "Minutes d'activité",
                        data: Object.values(donneesGraphique),
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        borderColor: '#3B82F6',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Répartition des activités */}
            <div className="flex-1 bg-emerald-50 rounded-2xl shadow p-5 flex flex-col justify-between h-[240px] min-w-[220px]">
              <h3 className="text-base font-semibold text-emerald-900 mb-3">Répartition des activités</h3>
              <div className="flex-1 flex items-center justify-center">
                {pieData.length > 0 ? (
                  <Pie
                    data={{
                      labels: pieData.map(([type]) => type),
                      datasets: [{
                        data: pieData.map(([_, count]) => count),
                        backgroundColor: [
                          '#3B82F6', '#14B8A6', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'
                        ]
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                ) : (
                  <div className="text-gray-400">Aucune donnée disponible</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-6 flex items-center">
              <span className="text-3xl mr-4">⏱️</span>
              <div>
                <div className="text-sm text-gray-600">Durée totale</div>
                <div className="text-xl font-bold">{statistiques.dureeTotale} min</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 flex items-center">
              <span className="text-3xl mr-4">🔥</span>
              <div>
                <div className="text-sm text-gray-600">Calories brûlées</div>
                <div className="text-xl font-bold">{statistiques.caloriesTotales} kcal</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 flex items-center">
              <span className="text-3xl mr-4">👣</span>
              <div>
                <div className="text-sm text-gray-600">Pas totaux</div>
                <div className="text-xl font-bold">{statistiques.pasTotaux}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 flex items-center">
              <span className="text-3xl mr-4">📍</span>
              <div>
                <div className="text-sm text-gray-600">Distance totale</div>
                <div className="text-xl font-bold">{statistiques.distanceTotale.toFixed(1)} km</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Objectifs */}
      <section id="objectifs" className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🎯</span> Objectifs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Définir vos objectifs</h3>
            
            <div className="space-y-4">
              <GoalInput 
                label="Pas par jour" 
                value={objectifs.pas} 
                onChange={(val) => setObjectifs({...objectifs, pas: parseInt(val) || 0})} 
                unit="pas"
              />
              
              <GoalInput 
                label="Minutes d'activité" 
                value={objectifs.duree} 
                onChange={(val) => setObjectifs({...objectifs, duree: parseInt(val) || 0})} 
                unit="min"
              />
              
              <GoalInput 
                label="Calories à brûler" 
                value={objectifs.calories} 
                onChange={(val) => setObjectifs({...objectifs, calories: parseInt(val) || 0})} 
                unit="kcal"
              />
              
              <GoalInput 
                label="Jours d'activité/semaine" 
                value={objectifs.jours} 
                onChange={(val) => setObjectifs({...objectifs, jours: parseInt(val) || 0})} 
                unit="jours"
              />
            </div>
            
            <button 
              onClick={handleSaveGoals}
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              Enregistrer les objectifs
            </button>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Progression</h3>
            
            <div className="space-y-6">
              <ProgressBar 
                title="Pas quotidiens" 
                current={Math.round(progression.pas)} 
                target={objectifs.pas} 
                color="indigo" 
              />
              
              <ProgressBar 
                title="Minutes d'activité" 
                current={Math.round(progression.duree)} 
                target={objectifs.duree} 
                color="teal" 
              />
              
              <ProgressBar 
                title="Calories brûlées" 
                current={Math.round(progression.calories)} 
                target={objectifs.calories} 
                color="purple" 
              />
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Badges à gagner</h4>
              <div className="flex flex-wrap gap-4">
                <Badge icon="🏅" name="Débutant" locked={statistiques.dureeTotale < 100} />
                <Badge icon="🏆" name="Actif" locked={statistiques.dureeTotale < 300} />
                <Badge icon="🌟" name="Expert" locked={statistiques.dureeTotale < 600} />
                <Badge icon="🚀" name="Marathonien" locked={statistiques.distanceTotale < 42} />
                <Badge icon="💎" name="Légende" locked={statistiques.dureeTotale < 1000} />
              </div>
            </div>

            <div className="mt-8">
              <ActivityStreak currentStreak={currentStreak} longestStreak={longestStreak} />
            </div>
          </div>
        </div>
      </section>

      {/* Section Suivi des activités */}
      <section id="suivi" className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-6 flex items-center">
          <span className="mr-3"><img src={sport} alt="sport" className="w-10 h-10" /></span> Enregistrer une activité
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Type d'activité</label>
              <select
                name="type"
                value={activite.type}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
              >
                <option value="Marche">Marche</option>
                <option value="Course">Course</option>
                <option value="Vélo">Vélo</option>
                <option value="Natation">Natation</option>
                <option value="Yoga">Yoga</option>
                <option value="Musculation">Musculation</option>
                <option value="HIIT">HIIT</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Durée (min)</label>
                <input
                  type="number"
                  name="duree"
                  value={activite.duree}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  min="1"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  value={activite.distance}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Nombre de pas</label>
                <input
                  type="number"
                  name="pas"
                  value={activite.pas}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Calories brûlées</label>
                <input
                  type="number"
                  name="calories"
                  value={activite.calories}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Intensité</label>
              <select
                name="intensite"
                value={activite.intensite}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
              >
                <option value="faible">Faible</option>
                <option value="moyen">Moyen</option>
                <option value="élevé">Élevé</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Date et heure</label>
              <input
                type="datetime-local"
                name="date"
                value={activite.date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Notes</label>
              <textarea
                name="notes"
                value={activite.notes}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition"
            >
              Enregistrer l'activité
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <img src={sport} alt="Illustration sport" className="max-w-full h-auto rounded-xl" />
          </div>
        </form>
      </section>

      {/* Section Calendrier */}
      <section id="calendrier" className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-6 flex items-center">
          <span className="mr-3 text-3xl">📅</span> Calendrier d'entraînement
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
                  <div key={jour} className="text-center font-semibold">{jour}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({length: 28}, (_, i) => i + 1).map(day => {
                  const hasActivity = activites.some(act => {
                    const actDate = new Date(act.date);
                    return actDate.getDate() === day;
                  });
                  
                  const hasPlannedSession = seancesPlanifiees.some(seance => {
                    const seanceDate = new Date(seance.date);
                    return seanceDate.getDate() === day;
                  });
                  
                  return (
                    <div 
                      key={day} 
                      className={`h-16 p-2 border rounded-xl flex flex-col items-center justify-center 
                        ${day % 7 === 0 ? 'bg-teal-50 dark:bg-gray-600' : ''} 
                        ${day === new Date().getDate() ? 'border-2 border-teal-500' : 'border-gray-200 dark:border-gray-600'}`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {hasActivity && (
                        <span className="text-xs bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100 px-2 py-1 rounded-full mt-1">
                          {activites.find(act => new Date(act.date).getDate() === day)?.type}
                        </span>
                      )}
                      {hasPlannedSession && !hasActivity && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full mt-1">
                          {seancesPlanifiees.find(seance => new Date(seance.date).getDate() === day)?.type}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Journal d'entraînement</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {activites.length > 0 ? (
                activites.slice().reverse().map((act, index) => (
                  <div key={index} className="border-l-4 border-teal-400 pl-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="font-semibold">{act.type} - {act.duree}min</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(act.date).toLocaleDateString()}
                    </div>
                    {act.notes && (
                      <div className="text-sm mt-1 italic">"{act.notes}"</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">Aucune activité enregistrée</div>
              )}
            </div>
            
            <button 
              onClick={() => setShowPlanifierModal(true)}
              className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              Ajouter une séance future
            </button>
            
            {seancesPlanifiees.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Séances planifiées</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {seancesPlanifiees.map((seance, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">
                            {seance.type} - {seance.duree}min
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(seance.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {seance.notes && (
                            <div className="text-sm mt-1 italic">
                              "{seance.notes}"
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-3">
                          <button
                            onClick={() => handleConvertirEnActivite(seance)}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                            title="Marquer comme terminée"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleSupprimerSeance(index)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Nutrition & Activité */}
      <section id="nutrition-activite" className="mb-12 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mb-4">
            <span className="text-3xl">🍎</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Nutrition & Activité
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                recommandationsNutrition.niveau === 'motivation' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                recommandationsNutrition.niveau === 'encouragement' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                'bg-gradient-to-br from-teal-400 to-blue-500'
              }`}>
                <span className="text-xl">{
                  recommandationsNutrition.niveau === 'motivation' ? '💪' :
                  recommandationsNutrition.niveau === 'encouragement' ? '🌟' : '💡'
                }</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {recommandationsNutrition.titre}
                </h3>
                <p className="text-lg leading-relaxed">
                  {recommandationsNutrition.conseil}
                </p>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  {recommandationsNutrition.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Équilibre du jour</h3>
            
            {(() => {
              const besoins = calculerBesoinsNutritionnels();
              if (!besoins) {
                return (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🍎</div>
                    <p className="mb-4">
                      Connectez votre profil nutritionnel pour voir vos statistiques
                    </p>
                    <a 
                      href="/nutrition"
                      className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition inline-block"
                    >
                      Aller à Nutrition
                    </a>
                  </div>
                );
              }
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {besoins.caloriesBrulées}
                      </div>
                      <div className="text-sm">Calories brûlées</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {besoins.besoinsTotaux}
                      </div>
                      <div className="text-sm">Besoins totaux</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Équilibre calorique</span>
                      <span>{Math.round((besoins.caloriesBrulées / besoins.besoinsTotaux) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${Math.min(100, (besoins.caloriesBrulées / besoins.besoinsTotaux) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Section Conseils du jour */}
      <section id="conseils" className="mb-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mb-4">
            <span className="text-3xl">💡</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Conseils du jour
          </h2>
          <p className="mt-2 text-lg">
            Votre motivation quotidienne pour rester actif
          </p>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              conseilDuJour.niveau === 'motivation' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
              conseilDuJour.niveau === 'encouragement' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
              'bg-gradient-to-br from-teal-400 to-blue-500'
            }`}>
              <span className="text-xl">{
                conseilDuJour.niveau === 'motivation' ? '💪' :
                conseilDuJour.niveau === 'encouragement' ? '🌟' : '💡'
              }</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">
                {conseilDuJour.titre}
              </h3>
              <p className="text-lg leading-relaxed">
                {conseilDuJour.conseil}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                {conseilDuJour.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <blockquote className="italic text-lg">
            "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte."
          </blockquote>
          <cite className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
            - Winston Churchill
          </cite>
        </div>
      </section>

      {/* Section Profil utilisateur */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-6 flex items-center">
          <span className="mr-3 text-3xl">👤</span> Profil utilisateur
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Âge</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Poids (kg)</label>
                <input
                  type="number"
                  value={userProfile.poids}
                  onChange={(e) => setUserProfile({...userProfile, poids: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Taille (cm)</label>
                <input
                  type="number"
                  value={userProfile.taille}
                  onChange={(e) => setUserProfile({...userProfile, taille: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">Niveau d'activité</label>
                <select
                  value={userProfile.niveau}
                  onChange={(e) => setUserProfile({...userProfile, niveau: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleSaveProfile}
              className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              Enregistrer le profil
            </button>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Votre IMC</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl">
              <div className="text-5xl font-bold text-center mb-4">
                {calculateBMI(userProfile.poids, userProfile.taille)}
              </div>
              <div className="text-center">
                {getBMICategory(calculateBMI(userProfile.poids, userProfile.taille))}
              </div>
              <div className="mt-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                  style={{ width: `${Math.min(100, (calculateBMI(userProfile.poids, userProfile.taille) / 40) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>16</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Activités favorites</h4>
              <div className="flex flex-wrap gap-2">
                {['Marche', 'Course', 'Vélo', 'Natation', 'Yoga', 'Musculation', 'HIIT'].map(activity => (
                  <button
                    key={activity}
                    onClick={() => setActivite({...activite, type: activity})}
                    className={`px-4 py-2 rounded-full text-sm ${activite.type === activity ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour planifier une séance */}
      {showPlanifierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                Planifier une séance
              </h3>
              <button
                onClick={() => setShowPlanifierModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Type d'activité</label>
                <select
                  value={seancePlanifiee.type}
                  onChange={(e) => setSeancePlanifiee({...seancePlanifiee, type: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                >
                  <option value="Marche">Marche</option>
                  <option value="Course">Course</option>
                  <option value="Vélo">Vélo</option>
                  <option value="Natation">Natation</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Musculation">Musculation</option>
                  <option value="HIIT">HIIT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Durée (min)</label>
                  <input
                    type="number"
                    value={seancePlanifiee.duree}
                    onChange={(e) => setSeancePlanifiee({...seancePlanifiee, duree: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Intensité</label>
                  <select
                    value={seancePlanifiee.intensite}
                    onChange={(e) => setSeancePlanifiee({...seancePlanifiee, intensite: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="élevé">Élevé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Date et heure</label>
                <input
                  type="datetime-local"
                  value={seancePlanifiee.date}
                  onChange={(e) => setSeancePlanifiee({...seancePlanifiee, date: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Notes</label>
                <textarea
                  value={seancePlanifiee.notes}
                  onChange={(e) => setSeancePlanifiee({...seancePlanifiee, notes: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handlePlanifierSeance}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                >
                  Planifier
                </button>
                <button
                  onClick={() => setShowPlanifierModal(false)}
                  className="flex-1 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composants auxiliaires
const GoalInput = ({ label, value, onChange, unit }) => {
  return (
    <div>
      <label className="block font-semibold mb-2">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-xl"
        />
        <span className="bg-gray-200 dark:bg-gray-600 px-4 flex items-center justify-center rounded-r-xl">
          {unit}
        </span>
      </div>
    </div>
  );
};

const ProgressBar = ({ title, current, target, color }) => {
  const percentage = Math.min(100, (current / target) * 100);
  const colorClasses = {
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {current}/{target} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Badge = ({ icon, name, locked }) => {
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl ${locked ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-sm mt-1">{name}</span>
    </div>
  );
};

const ActivityStreak = ({ currentStreak, longestStreak }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
      <h4 className="font-semibold mb-3">Série d'activités</h4>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currentStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Actuelle</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{longestStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Record</div>
        </div>
      </div>
    </div>
  );
};

export default ActivitePhysique;