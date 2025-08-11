import React, { useState } from "react";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "Comment fonctionne FitWise ?",
      a: "FitWise combine des algorithmes intelligents avec une interface conviviale pour vous aider à suivre et améliorer votre santé au quotidien."
    },
    {
      q: "Puis-je utiliser FitWise gratuitement ?",
      a: "Oui, FitWise propose une version gratuite complète avec toutes les fonctionnalités de base."
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "La sécurité de vos données est notre priorité absolue. Nous utilisons un chiffrement de bout en bout."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#E8FFD7] to-white faq-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 faq-header">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F855A] mb-4">
            Questions Fréquentes
          </h2>
          <div className="w-20 h-1 bg-[#2F855A] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez les réponses aux questions les plus courantes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`mb-4 overflow-hidden faq-item ${
                activeIndex === index ? 'active' : ''
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className={`faq-question ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <h3 className="text-lg font-semibold">{faq.q}</h3>
                <div className="faq-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M19 9L12 16L5 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              <div className="faq-answer">
                <div className="py-4 text-gray-700">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .faq-header {
          opacity: 0;
          animation: fadeInUp 0.8s forwards 0.2s;
        }
        
        .faq-item {
          border-radius: 0.75rem;
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards 0.3s;
        }
        
        .faq-item:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .faq-question {
          width: 100%;
          text-align: left;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 0.75rem;
        }
        
        .faq-question.active {
          background: #2F855A;
          color: white;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        
        .faq-icon {
          transition: transform 0.3s ease;
        }
        
        .faq-question.active .faq-icon {
          transform: rotate(180deg);
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
        
        .faq-item.active .faq-answer {
          max-height: 300px;
          padding: 0 1.5rem;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}