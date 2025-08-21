import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import back from 'assets/img/back.jpg';
import { Link } from "react-router-dom"
// Fonction utilitaire pour manipuler les dates
const addDays = (date, days) => {
  if (!date || !(date instanceof Date)) {
    console.error('Date invalide:', date);
    return new Date();
  }
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Icônes SVG
const PencilIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 group-hover:rotate-12 transition-transform">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
);

const TrashIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 group-hover:scale-110 transition-transform">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

const MEALS = [
  { id: "breakfast", label: "Petit déjeuner", icon: "🥐", color: "bg-gradient-to-br from-purple-200 via-violet-100 to-purple-300" },
  { id: "lunch", label: "Déjeuner", icon: "🥗", color: "bg-gradient-to-br from-purple-200 via-violet-100 to-purple-300" },
  { id: "dinner", label: "Dîner", icon: "🍲", color: "bg-gradient-to-br from-purple-200 via-violet-100 to-purple-300" },
  { id: "snack", label: "Snacks", icon: "🍎", color: "bg-gradient-to-br from-purple-200 via-violet-100 to-purple-300" },
];

function calculateCalories({ weight, height, age, sex, activity, goal }) {
  let MB;
  if (sex === "male") {
    MB = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    MB = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  // Coefficients d'activité
  const activityCoefficients = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const coeff = activityCoefficients[activity] || 1.2;
  let calories = MB * coeff;
  if (goal === "gain") calories += 400;
  if (goal === "lose") calories -= 400;
  return Math.round(calories);
}

function calculateMacros(calories) {
  return {
    carbs: Math.round(calories * 0.5 / 4),
    protein: Math.round(calories * 0.2 / 4),
    fat: Math.round(calories * 0.3 / 9),
  };
}

function FoodForm({ onAdd }) {
  const [food, setFood] = useState({ name: "", calories: "", carbs: "", protein: "", fat: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-emerald-400 to-purple-400 text-black font-bold rounded-full px-4 py-2 text-sm shadow-lg hover:shadow-emerald-300/30 hover:from-emerald-500 hover:to-purple-500 transition-all flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          <span>Ajouter un aliment</span>
        </button>
      ) : (
        <form 
          className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-xl border border-white/30 backdrop-blur-sm animate-fadeIn"
          onSubmit={e => {
            e.preventDefault();
            if (!food.name || !food.calories) return;
            onAdd({ 
              ...food, 
              calories: Number(food.calories), 
              carbs: Number(food.carbs)||0, 
              protein: Number(food.protein)||0, 
              fat: Number(food.fat)||0 
            });
            setFood({ name: "", calories: "", carbs: "", protein: "", fat: "" });
            setIsExpanded(false);
          }}
        >
          <div className="relative">
            <input
              className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition pl-10"
              placeholder="Nom de l'aliment"
              value={food.name}
              onChange={e => setFood(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <span className="absolute left-3 top-3 text-gray-400">🍎</span>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="relative">
              <input
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition pl-8"
                placeholder="Kcal"
                type="number"
                min="0"
                value={food.calories}
                onChange={e => setFood(f => ({ ...f, calories: e.target.value }))}
              />
              <span className="absolute left-2 top-2 text-xs text-gray-400">🔥</span>
            </div>
            <div className="relative">
              <input
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition pl-8"
                placeholder="Gluc."
                type="number"
                min="0"
                value={food.carbs}
                onChange={e => setFood(f => ({ ...f, carbs: e.target.value }))}
              />
              <span className="absolute left-2 top-2 text-xs text-gray-400">🍞</span>
            </div>
            <div className="relative">
              <input
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition pl-8"
                placeholder="Prot."
                type="number"
                min="0"
                value={food.protein}
                onChange={e => setFood(f => ({ ...f, protein: e.target.value }))}
              />
              <span className="absolute left-2 top-2 text-xs text-gray-400">🍗</span>
            </div>
            <div className="relative">
              <input
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition pl-8"
                placeholder="Gras"
                type="number"
                min="0"
                value={food.fat}
                onChange={e => setFood(f => ({ ...f, fat: e.target.value }))}
              />
              <span className="absolute left-2 top-2 text-xs text-gray-400">🥑</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-400 to-purple-400 text-black font-bold rounded-xl px-4 py-3 text-sm font-medium shadow-lg hover:shadow-emerald-300/30 hover:from-emerald-500 hover:to-purple-500 transition-all"
            >
              Confirmer
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function EditFoodForm({ food, onSave, onCancel }) {
  const [edit, setEdit] = useState(food);

  return (
    <form 
      className="flex gap-3 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-full animate-fadeIn"
      onSubmit={e => {
        e.preventDefault();
        onSave({ 
          ...edit, 
          calories: Number(edit.calories), 
          carbs: Number(edit.carbs)||0, 
          protein: Number(edit.protein)||0, 
          fat: Number(edit.fat)||0 
        });
      }}
    >
      <input
        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-gray-50"
        value={edit.name}
        onChange={e => setEdit(f => ({ ...f, name: e.target.value }))}
        autoFocus
      />
      
      <div className="flex gap-2">
        <input
          className="w-14 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-gray-50"
          value={edit.calories}
          type="number"
          min="0"
          onChange={e => setEdit(f => ({ ...f, calories: e.target.value }))}
        />
        <input
          className="w-12 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-gray-50"
          value={edit.carbs}
          type="number"
          min="0"
          onChange={e => setEdit(f => ({ ...f, carbs: e.target.value }))}
        />
        <input
          className="w-12 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-gray-50"
          value={edit.protein}
          type="number"
          min="0"
          onChange={e => setEdit(f => ({ ...f, protein: e.target.value }))}
        />
        <input
          className="w-12 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-gray-50"
          value={edit.fat}
          type="number"
          min="0"
          onChange={e => setEdit(f => ({ ...f, fat: e.target.value }))}
        />
      </div>
      
      <button
        type="submit"
        className="bg-emerald-500 text-white font-bold rounded-lg p-2 text-sm hover:bg-emerald-600 transition shadow hover:shadow-md"
        title="Enregistrer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-200 text-gray-700 rounded-lg p-2 text-sm hover:bg-gray-300 transition shadow hover:shadow-md"
        title="Annuler"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </form>
  );
}
/* les donnes sont stockes dans le local storage , a modifier pour que les donnes soient stockes dans la base de donnes  plus tard !!!*/

export default function Nutrition() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("nutritionProfile");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("nutritionData");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    console.log('Date sélectionnée initialisée:', today);
    return today;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Calculer today à partir de selectedDate
  const today = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    if (profile && !data[today]) {
      setData(d => ({ ...d, [today]: { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, water: 0 } }));
    }
  }, [profile, today,data]);

  useEffect(() => {
    localStorage.setItem("nutritionProfile", JSON.stringify(profile));
  }, [profile]);
  
  useEffect(() => {
    localStorage.setItem("nutritionData", JSON.stringify(data));
  }, [data]);

  // Effet pour surveiller les changements de date
  useEffect(() => {
    console.log('Date sélectionnée changée:', selectedDate);
    console.log('Date formatée (today):', today);
    
    // S'assurer que les données existent pour la nouvelle date
    if (profile && !data[today]) {
      console.log('Initialisation des données pour:', today);
      setData(d => ({ 
        ...d, 
        [today]: { 
          meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, 
          water: 0 
        } 
      }));
    }
  }, [selectedDate, today, profile, data]);

  const calorieGoal = profile ? calculateCalories(profile) : 2000;
  const macrosGoal = calculateMacros(calorieGoal);
  const dayData = data[today] || { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, water: 0 };
  const allFoods = Object.values(dayData.meals).flat();
  const totalCalories = allFoods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
  const totalCarbs = allFoods.reduce((sum, f) => sum + (Number(f.carbs) || 0), 0);
  const totalProtein = allFoods.reduce((sum, f) => sum + (Number(f.protein) || 0), 0);
  const totalFat = allFoods.reduce((sum, f) => sum + (Number(f.fat) || 0), 0);

  const handleAddWater = () => setData(d => ({ ...d, [today]: { ...dayData, water: Math.min(dayData.water + 1, 8) } }));
  const handleRemoveWater = () => setData(d => ({ ...d, [today]: { ...dayData, water: Math.max(dayData.water - 1, 0) } }));

  const handleAddFood = (meal, food) => {
    setData(d => ({
      ...d,
      [today]: {
        ...dayData,
        meals: {
          ...dayData.meals,
          [meal]: [...dayData.meals[meal], food],
        },
      },
    }));
  };

  const handleDeleteFood = (meal, idx) => {
    setData(d => ({
      ...d,
      [today]: {
        ...dayData,
        meals: {
          ...dayData.meals,
          [meal]: dayData.meals[meal].filter((_, i) => i !== idx),
        },
      },
    }));
  };

  const handleEditFood = (meal, idx, newFood) => {
    setData(d => ({
      ...d,
      [today]: {
        ...dayData,
        meals: {
          ...dayData.meals,
          [meal]: dayData.meals[meal].map((f, i) => i === idx ? newFood : f),
        },
      },
    }));
    setEditing(null);
  };

  const handleReset = () => {
    localStorage.removeItem("nutritionProfile");
    localStorage.removeItem("nutritionData");
    setProfile(null);
    setData({});
    setShowProfileModal(false);
  };

  // Fonction pour récupérer les données d'activité physique
  const getActiviteData = () => {
    const activitesData = localStorage.getItem('fitwiseActivites');
    const objectifsData = localStorage.getItem('fitwiseObjectifs');
    
    if (!activitesData) return null;
    
    const activites = JSON.parse(activitesData);
    const objectifs = objectifsData ? JSON.parse(objectifsData) : null;
    const today = new Date().toISOString().slice(0, 10);
    
    const activitesAujourdhui = activites.filter(act => {
      const actDate = new Date(act.date).toISOString().slice(0, 10);
      return actDate === today;
    });
    
    return { activites, activitesAujourdhui, objectifs, today };
  };

  // Générer des recommandations d'activité basées sur la nutrition
  const genererRecommandationsActivite = () => {
    const activiteInfo = getActiviteData();
    if (!activiteInfo) {
      return {
        titre: "Connectez votre activité physique",
        conseil: "Pour des recommandations d'activité personnalisées, utilisez la section Activité Physique.",
        niveau: "info",
        tags: ["🏃‍♀️ Activité", "🔗 Connexion", "📊 Données"]
      };
    }
    
    const { activitesAujourdhui} = activiteInfo;
    const caloriesConsommees = allFoods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
    const caloriesBrulées = activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0);    
    // Calculer le surplus/déficit calorique (en tenant compte des calories brûlées)
    const surplus = caloriesConsommees - (calorieGoal + caloriesBrulées);
    
    // Recommandations selon le contexte
    if (activitesAujourdhui.length === 0) {
      if (surplus > 200) {
        return {
          titre: "Activité recommandée !",
          conseil: `Vous avez consommé ${surplus} calories de plus que vos besoins. Une séance d'exercice vous aiderait à équilibrer !`,
          niveau: "motivation",
          tags: ["🏃‍♀️ Activité", "⚖️ Équilibre", "🔥 Calories"]
        };
      }
      
      return {
        titre: "Bonne alimentation !",
        conseil: "Votre alimentation est équilibrée. Une activité physique vous aiderait à optimiser votre santé !",
        niveau: "encouragement",
        tags: ["🍎 Nutrition", "💪 Santé", "🌟 Bien-être"]
      };
    }
    
    if (surplus > 300) {
      return {
        titre: "Intensifiez votre activité !",
        conseil: `Vous avez un surplus de ${surplus} calories. Augmentez l'intensité ou la durée de votre activité.`,
        niveau: "intensite",
        tags: ["⚡ Intensité", "⏰ Durée", "🔥 Calories"]
      };
    }
    
    if (surplus < -200) {
      return {
        titre: "Attention à la récupération !",
        conseil: `Vous avez un déficit de ${Math.abs(surplus)} calories. Privilégiez la récupération et ajustez votre alimentation.`,
        niveau: "repos",
        tags: ["🧘 Récupération", "🍽️ Alimentation", "💤 Repos"]
      };
    }
    
    // Recommandations selon les macronutriments
    const ratioProteines = (totalProtein / (totalProtein + totalCarbs + totalFat)) * 100;
    const ratioGlucides = (totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100;
    
    if (ratioProteines < 15) {
      return {
        titre: "Augmentez les protéines !",
        conseil: "Votre apport en protéines est faible. Idéal pour la musculation ou les activités de renforcement.",
        niveau: "complement",
        tags: ["🥩 Protéines", "💪 Musculation", "🏋️ Renforcement"]
      };
    }
    
    if (ratioGlucides > 60) {
      return {
        titre: "Parfait pour l'endurance !",
        conseil: "Votre alimentation riche en glucides est idéale pour les activités d'endurance comme la course ou le vélo.",
        niveau: "encouragement",
        tags: ["🍞 Glucides", "🏃‍♀️ Endurance", "🚴 Cardio"]
      };
    }
    
    return {
      titre: "Équilibre parfait !",
      conseil: "Votre alimentation et votre activité sont parfaitement équilibrées. Continuez sur cette lancée !",
      niveau: "encouragement",
      tags: ["⚖️ Équilibre", "🌟 Excellence", "💪 Santé"]
    };
  };

  // Obtenir les recommandations d'activité
  const recommandationsActivite = genererRecommandationsActivite();

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-purple-50 p-4">
        {/* Navigation entre jours */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            className="p-2 rounded-full bg-white/80 shadow hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="text-center bg-white/80 px-6 py-3 rounded-xl shadow">
            <div className="font-bold text-lg">{format(selectedDate, "EEEE d MMMM", { locale: fr })}</div>
            <div className="text-sm text-gray-600">{format(selectedDate, "yyyy")}</div>
          </div>
          
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 rounded-full bg-white/80 shadow hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="w-full min-h-[80vh] flex items-center justify-center">
          <div className="bg-gradient-to-br from-emerald-400 via-emerald-300 to-emerald-600 rounded-3xl shadow-2xl p-0 max-w-sm w-full border border-emerald-200 mx-auto">
            <div className="text-center mb-6 pt-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-purple-400 rounded-full mx-auto flex items-center justify-center text-black font-bold text-2xl mb-4 shadow-md">
                🍏
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow">FitWise</h1>
              <p className="text-white/80 mt-2 text-base">Créez votre profil nutritionnel personnalisé</p>
            </div>
         {/* formulaire   */}
         <form className="space-y-5 bg-black/90 rounded-2xl shadow-lg p-6 mx-4 mb-8" onSubmit={e => {
              e.preventDefault();
              setProfile({
                weight: Number(e.target.weight.value),
                height: Number(e.target.height.value),
                age: Number(e.target.age.value),
                sex: e.target.sex.value,
                activity: e.target.activity.value,
                goal: e.target.goal.value,
              });
              setShowProfileModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Âge</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="120"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-base focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition placeholder-gray-300"
                      placeholder="30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Sexe</label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 transition cursor-pointer">
                      <input type="radio" name="sex" value="male" required className="accent-emerald-500" />
                      <span className="text-gray-700">Homme</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 transition cursor-pointer">
                      <input type="radio" name="sex" value="female" required className="accent-emerald-500" />
                      <span className="text-gray-700">Femme</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Poids (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight"
                      min="30"
                      max="250"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-base focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition placeholder-gray-300"
                      placeholder="70"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Taille (cm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="height"
                      min="120"
                      max="230"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-3 text-base focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition placeholder-gray-300"
                      placeholder="175"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Niveau d'activité</label>
                  <select name="activity" required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition">
                    <option value="sedentary">Sédentaire (peu ou pas d'exercice)</option>
                    <option value="light">Légèrement actif (1-3x/semaine)</option>
                    <option value="moderate">Modérément actif (3-5x/semaine)</option>
                    <option value="active">Très actif (6-7x/semaine)</option>
                    <option value="very_active">Extrêmement actif (sport intense + travail physique)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Objectif</label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex flex-col items-center p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 transition cursor-pointer">
                      <input type="radio" name="goal" value="gain" required className="accent-emerald-500 mb-2" />
                      
                      <span className="text-xs text-gray-700">Gain</span>
                    </label>
                    <label className="flex-1 flex flex-col items-center p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 transition cursor-pointer">
                      <input type="radio" name="goal" value="maintain" defaultChecked className="accent-emerald-500 mb-2" />
                     
                      <span className="text-xs text-gray-700">Maintien</span>
                    </label>
                    <label className="flex-1 flex flex-col items-center p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50/50 transition cursor-pointer">
                      <input type="radio" name="goal" value="lose" className="accent-emerald-500 mb-2" />
                     
                      <span className="text-xs text-gray-700">Perte</span>
                    </label>
                  </div>
                </div>
              </div>
             <center> <button
                type="submit"
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Commencer le suivi
           <span className="text-xl">→</span>
              </button>
              </center>
            </form>
  
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen pb-32 relative"
        style={{
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Navigation entre jours */}
        <div className="flex justify-center items-center gap-2 pt-6 pb-2 relative z-50">
          <button 
            onClick={() => {
              const newDate = addDays(selectedDate, -1);
              console.log('Jour précédent:', newDate);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-full bg-white/80 shadow hover:bg-gray-100 transition cursor-pointer active:scale-95"
            title="Jour précédent"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="text-center bg-white/80 px-4 py-2 rounded-lg shadow mx-2">
            <div className="font-bold">{format(selectedDate, "EEE d MMM", { locale: fr })}</div>
            <div className="text-xs text-gray-600">{format(selectedDate, "yyyy")}</div>
            <div className="text-xs text-emerald-600 font-medium">
              {selectedDate.toDateString() === new Date().toDateString() ? "Aujourd'hui" : ""}
            </div>
          </div>
          
          <button 
            onClick={() => {
              const newDate = addDays(selectedDate, 1);
              console.log('Jour suivant:', newDate);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-full bg-white/80 shadow hover:bg-gray-100 transition cursor-pointer active:scale-95"
            title="Jour suivant"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          {/* Bouton pour revenir à aujourd'hui */}
          <button 
            onClick={() => {
              console.log('Retour à aujourd\'hui');
              setSelectedDate(new Date());
            }}
            className="p-2 rounded-full bg-emerald-500/80 text-white shadow hover:bg-emerald-600 transition cursor-pointer active:scale-95"
            title="Aujourd'hui"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>

        {/* Overlay semi-transparent */}
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        
        {/* Contenu principal */}
        <div className="relative z-10">
          {/* Header Résumé Calories */}
          <div className="relative bg-gradient-to-r from-emerald-500/90 to-purple-600/90 rounded-b-3xl p-6 shadow-2xl mx-4">
            <div className="absolute bottom-0 left-0 w-full h-16 bg-white/10 backdrop-blur-sm rounded-t-full"></div>
            
            <div className="relative z-10 flex justify-between items-center text-white font-bold">
              <div className="text-center">
                <div className="text-sm font-medium opacity-90">Consommées</div>
                <div className="text-3xl font-extrabold">{totalCalories}</div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff20" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#calorieGradient)" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 * (1 - Math.min(totalCalories / (calorieGoal + (getActiviteData() ? getActiviteData().activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0) : 0)), 1))}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20">
                    <div className="rounded-full px-4 py-3 bg-white/90 flex flex-col items-center shadow-md">
                      <div className="text-4xl font-black leading-none text-black">
                        {(() => {
                          const activiteInfo = getActiviteData();
                          const caloriesBrulées = activiteInfo ? 
                            activiteInfo.activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0) : 0;
                          return Math.max(calorieGoal + caloriesBrulées - totalCalories, 0);
                        })()}
                      </div>
                      <div className="text-xs font-bold text-black mt-1 tracking-wider">KCAL RESTANTES</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium opacity-90">Brûlées</div>
                <div className="text-3xl font-extrabold">
                  {(() => {
                    const activiteInfo = getActiviteData();
                    if (!activiteInfo) return 0;
                    
                    const { activitesAujourdhui } = activiteInfo;
                    return activitesAujourdhui.reduce((sum, act) => sum + (parseInt(act.calories) || 0), 0);
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Section Macros */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 mx-4 mt-6 transform transition-all hover:scale-[1.01]">
            <h3 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-emerald-500 text-2xl">⚡</span>
              <span>Vos macros aujourd'hui</span>
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">Glucides</span>
                  <span className="font-bold">{totalCarbs}g / {macrosGoal.carbs}g</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-md" 
                    style={{ width: `${Math.min(totalCarbs/macrosGoal.carbs*100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">Protéines</span>
                  <span className="font-bold">{totalProtein}g / {macrosGoal.protein}g</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-md" 
                    style={{ width: `${Math.min(totalProtein/macrosGoal.protein*100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">Graisses</span>
                  <span className="font-bold">{totalFat}g / {macrosGoal.fat}g</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-md" 
                    style={{ width: `${Math.min(totalFat/macrosGoal.fat*100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Hydratation */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 mx-4 mt-5 transform transition-all hover:scale-[1.01]">
            <h3 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-blue-500 text-2xl">💧</span>
              <span>Hydratation</span>
            </h3>
            
            {dayData.water * 250 >= 2000 && (
              <div className="flex items-center justify-center mb-4 animate-bounce">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-emerald-400 text-white font-bold px-4 py-2 rounded-full shadow-lg border-2 border-blue-300">
                  🏅 Hydration Hero !
                </span>
              </div>
            )}
            
            {dayData.water * 250 === 1750 && (
              <div className="flex items-center justify-center mb-4 animate-bounce">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-emerald-400 text-white font-bold px-4 py-2 rounded-full shadow-lg border-2 border-blue-300">
                  Encore 250ml pour atteindre ton objectif !
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-gray-600">Objectif quotidien</span>
              <span className="text-blue-500 font-bold">{dayData.water * 250}ml / 2000ml</span>
            </div>
            
            <div className="flex flex-row gap-3 justify-center items-center">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => i < dayData.water ? handleRemoveWater() : handleAddWater()}
                  className={`h-16 w-12 rounded-xl transition-all flex items-end justify-center relative overflow-hidden ${
                    i < dayData.water 
                      ? 'bg-gradient-to-b from-blue-200 to-blue-400 shadow-inner'
                      : 'bg-gray-100 hover:bg-blue-50'
                  }`}
                >
                  <div className={`absolute bottom-0 w-full ${i < dayData.water ? 'bg-blue-300/50' : 'bg-gray-200'} transition-all`} 
                       style={{ height: `${(i+1)*12.5}%` }}>
                  </div>
                  <span className={`text-2xl mb-2 z-10 ${
                    i < dayData.water ? 'text-blue-600 animate-bounce' : 'text-gray-400'
                  }`}>
                    {i < dayData.water ? '💧' : '+'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Repas */}
          <div className="space-y-5 mt-5 mx-4">
            {MEALS.map(meal => (
              <div
                key={meal.id}
                className={`${meal.color} backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/30 transition-all hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="text-4xl p-4 rounded-2xl shadow-md flex-shrink-0 transform hover:rotate-6 transition-transform">
                      {meal.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-extrabold text-xl text-gray-800">{meal.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {meal.id === 'breakfast' ? '220-330 kcal recommandées' : 
                             meal.id === 'lunch' || meal.id === 'dinner' ? '330-440 kcal recommandées' : 
                             '55-110 kcal recommandées'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {dayData.meals[meal.id].length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-sm bg-white/50 rounded-lg border border-dashed border-gray-300">
                            Cliquez sur "+ Ajouter un aliment" pour commencer
                          </div>
                        ) : (
                          dayData.meals[meal.id].map((food, idx) => (
                            editing && editing.meal === meal.id && editing.idx === idx ? (
                              <EditFoodForm
                                key={idx}
                                food={food}
                                onSave={f => handleEditFood(meal.id, idx, f)}
                                onCancel={() => setEditing(null)}
                              />
                            ) : (
                              <div
                                key={idx}
                                className="flex justify-between items-center bg-white/90 p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{food.calories < 100 ? '🍎' : food.calories < 300 ? '🍗' : '🍲'}</span>
                                  <div>
                                    <span className="font-bold text-gray-800">{food.name}</span>
                                    <div className="flex gap-2 mt-1">
                                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{food.calories} kcal</span>
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{food.carbs}g gluc.</span>
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{food.protein}g prot.</span>
                                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{food.fat}g gras</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => setEditing({ meal: meal.id, idx })}
                                    className="p-2 text-gray-500 hover:text-purple-600 transition group"
                                    aria-label="Modifier"
                                    title="Modifier"
                                  >
                                    <PencilIcon />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFood(meal.id, idx)}
                                    className="p-2 text-gray-500 hover:text-red-600 transition group"
                                    aria-label="Supprimer"
                                    title="Supprimer"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            )
                          ))
                        )}
                      </div>
                      
                      <div className="mt-5">
                        <FoodForm onAdd={food => handleAddFood(meal.id, food)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Activité & Nutrition */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 mx-4 mt-5 transform transition-all hover:scale-[1.01]">
            <h3 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-emerald-500 text-2xl">⚡</span>
              <span>Activité & Nutrition</span>
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Recommandations</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{recommandationsActivite.titre}</span>
                  <span className="text-gray-400">•</span>
                  <span>{recommandationsActivite.conseil}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                  {recommandationsActivite.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              
                             <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                 <h4 className="font-semibold text-gray-700 mb-2">Activité Physique</h4>
                 <p className="text-sm text-gray-600 mb-3">
                   Pour une meilleure efficacité, il est important de combiner une alimentation équilibrée avec une activité physique régulière.
                   Vous pouvez enregistrer vos activités physiques dans la section Activité Physique.
                 </p>
                 <button 
                   onClick={() => window.location.href = '/activite-physique'}
                   className="bg-gradient-to-r from-emerald-400 to-purple-400 text-black font-bold rounded-full px-4 py-2 text-sm shadow-lg hover:shadow-emerald-300/30 hover:from-emerald-500 hover:to-purple-500 transition-all flex items-center gap-2"
                 >
                   <span className="text-lg">🏃‍♀️</span>
                   <span>Aller à Activité Physique</span>
                 </button>
               </div>
            </div>
          </div>

          {/* Modal de modification du profil */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Modifier votre profil</h2>
                
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  setProfile({
                    ...profile,
                    weight: Number(e.target.weight.value),
                    height: Number(e.target.height.value),
                    goal: e.target.goal.value,
                  });
                  setShowProfileModal(false);
                }}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      defaultValue={profile?.weight}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (cm)</label>
                    <input
                      type="number"
                      name="height"
                      defaultValue={profile?.height}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Objectif</label>
                    <select 
                      name="goal"
                      defaultValue={profile?.goal}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="gain">Prise de poids</option>
                      <option value="maintain">Maintien</option>
                      <option value="lose">Perte de poids</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer Mobile */}
<div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 z-50 shadow-lg">
  <div className="flex justify-around max-w-md mx-auto">
    {[
      { icon: "📔", label: "Accueil", path: "/" },
      { icon: "📈", label: "Stats",path:"/activite-physique/#nutrition-activite" },
      { icon: "🍽", label: "Repas"},
      { icon: "👤", label: "Profil", action: () => setShowProfileModal(true) }
    ].map((item, index) =>
      item.path ? (
        <Link
          to={item.path}
          key={index}
          className={`flex flex-col items-center p-1 transition-all text-gray-500 hover:text-purple-500`}
        >
          {index === 2 ? (
            <span className="bg-gradient-to-r from-emerald-500 to-purple-500 w-14 h-14 flex items-center justify-center text-white font-bold text-2xl rounded-full shadow-xl -mt-7 transform hover:scale-110 transition-all">
              {item.icon}
            </span>
          ) : (
            <>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </>
          )}
        </Link>
      ) : (
        <button
          key={index}
          onClick={item.action}
          className={`flex flex-col items-center p-1 transition-all text-gray-500 hover:text-purple-500`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      )
    )}
  </div>
</div>

      </div>
    </>
  );
}