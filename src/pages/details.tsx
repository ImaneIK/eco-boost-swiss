import React, { useState } from 'react';
import { Sun, Battery, Building2, Zap, TrendingUp, Home, Briefcase, Building, ChevronDown, ChevronUp } from 'lucide-react';

const SubventionsSolaires = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedCanton, setSelectedCanton] = useState('VD');

  const cantons = {
    VD: {
      name: 'Vaud',
      icon: '🏔️',
      highlights: [
        'Nouvelle loi sur l\'énergie (LVLEne) en vigueur en 2026',
        'Obligation énergies renouvelables pour nouvelles constructions',
        'Obligation rénovation si >125 kWh/m²/an',
        'Bonus Pronovo augmenté pour façades solaires'
      ]
    },
    GE: {
      name: 'Genève',
      icon: '⛲',
      highlights: [
        'Photovoltaïque obligatoire pour nouvelles constructions',
        'Dès 2030: production sur site si >200 MWh/an',
        'Budget 500M CHF jusqu\'en 2030',
        'Pompes à chaleur ≤20 kW sur simple déclaration'
      ]
    },
    FR: {
      name: 'Fribourg',
      icon: '🏰',
      highlights: [
        'Loi cantonale sur le climat (LClim)',
        'Programme Bâtiments 2025 renforcé',
        'Aides augmentées pour PAC >70 kW',
        'Focus sur grands consommateurs'
      ]
    },
    NE: {
      name: 'Neuchâtel',
      icon: '🏞️',
      highlights: [
        'Subventions cantonales cumulables avec Pronovo',
        'Plan Climat cantonal actif',
        'Obligations pour bâtiments publics',
        'Contexte favorable pour PPE'
      ]
    },
    VS: {
      name: 'Valais',
      icon: '⛰️',
      highlights: [
        'Loi effective depuis janvier 2025',
        'Promotion active du solaire et PAC',
        'Intégration bilan carbone',
        'Focus zones agricoles et montagne'
      ]
    }
  };

  const federalChanges = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'RCP virtuel et CEL',
      description: 'Regroupement sans câblage. Communautés d\'énergie locales pour partager l\'électricité solaire.',
      badge: 'Nouveauté 2025'
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: 'Batteries solaires',
      description: 'Remboursement timbre réseau + valorisation flexibilité énergétique. Jusqu\'à 80% d\'autoconsommation.',
      badge: 'ROI rapide'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Bonus façades',
      description: '400 CHF/kWc (intégrées) ou 200 CHF/kWc (ajoutées). Idéal pour bâtiments industriels.',
      badge: 'Tarif revalorisé'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Raccordement réduit',
      description: 'WACC à 3,43% dès 2026. Frais réduits pour grandes installations.',
      badge: 'Économies'
    }
  ];

  const benefits = [
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Particuliers',
      points: [
        'Rénovations obligatoires mais subventionnées',
        'PV plus rentable avec nouveaux bonus',
        'Démarches administratives simplifiées'
      ]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Entreprises',
      points: [
        'Jusqu\'à 10% de rentabilité annuelle',
        'Meilleure valorisation CECB et ESG',
        'RCP virtuels et CEL inter-bâtiments'
      ]
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Collectivités',
      points: [
        'Bâtiments publics exemplaires',
        'Financements fédéraux et cantonaux',
        'Accompagnement projets pilotes'
      ]
    }
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-12 h-12" />
            <span className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
              Nouveautés 2025
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Subventions solaires en Suisse
          </h1>
          <p className="text-xl text-green-50 max-w-3xl">
            Depuis le 1ᵉʳ avril 2025, la Suisse renforce ses politiques en faveur de l'énergie solaire. 
            Découvrez toutes les aides disponibles.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Federal Changes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500"></div>
            Nouveautés fédérales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {federalChanges.map((change, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                    {change.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{change.title}</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {change.badge}
                      </span>
                    </div>
                    <p className="text-gray-600">{change.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cantonal Changes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500"></div>
            Évolutions cantonales
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-wrap border-b">
              {Object.entries(cantons).map(([code, canton]) => (
                <button
                  key={code}
                  onClick={() => setSelectedCanton(code)}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    selectedCanton === code
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-1">{canton.icon}</div>
                  <div className="text-sm">{canton.name}</div>
                </button>
              ))}
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {cantons[selectedCanton].name}
              </h3>
              <ul className="space-y-3">
                {cantons[selectedCanton].highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-green-500"></div>
            Ce que cela change pour vous
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{benefit.title}</h3>
                <ul className="space-y-2">
                  {benefit.points.map((point, pidx) => (
                    <li key={pidx} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <Sun className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Passez à l'énergie solaire avec Comparatifdevis
          </h2>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            Les nouvelles subventions rendent le passage à l'énergie renouvelable plus attractif que jamais. 
            Nos experts vous accompagnent à chaque étape.
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg">
            Contactez Comparatifdevis →
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Comparatifdevis - Accompagnement personnalisé pour votre transition énergétique
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SubventionsSolaires;