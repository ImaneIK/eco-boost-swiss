import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImprovedSubventionsSection = () => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: 'pv',
    buildingType: 'house',
    canton: 'VD',
    postal: '',
    currentSystem: 'fuel',
    power: '',
    ownerStatus: 'owner',
    fullname: '',
    email: '',
    phone: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [simulatorResult, setSimulatorResult] = useState({
    pvAid: 0,
    hpAid: 0,
    communal: 0,
    total: 0
  });

  // Données d'exemple par canton (taux indicatifs et plafonds en CHF)
  const cantonData = {
    VD: { pvRate: 0.5, pvUnit: 'kW', pvMax: 7500, hpRate: 600, hpUnit: 'installation', hpMax: 7500, communalBonus: 0 },
    GE: { pvRate: 0.45, pvUnit: 'kW', pvMax: 7000, hpRate: 650, hpUnit: 'installation', hpMax: 7000, communalBonus: 500 },
    BE: { pvRate: 0.4, pvUnit: 'kW', pvMax: 6000, hpRate: 500, hpUnit: 'installation', hpMax: 6000, communalBonus: 0 },
    VS: { pvRate: 0.35, pvUnit: 'kW', pvMax: 5000, hpRate: 550, hpUnit: 'installation', hpMax: 5000, communalBonus: 300 },
    FR: { pvRate: 0.45, pvUnit: 'kW', pvMax: 6000, hpRate: 500, hpUnit: 'installation', hpMax: 6000, communalBonus: 0 },
    NE: { pvRate: 0.5, pvUnit: 'kW', pvMax: 7000, hpRate: 600, hpUnit: 'installation', hpMax: 7000, communalBonus: 200 },
    JU: { pvRate: 0.3, pvUnit: 'kW', pvMax: 4000, hpRate: 400, hpUnit: 'installation', hpMax: 4000, communalBonus: 0 },
    ZH: { pvRate: 0.4, pvUnit: 'kW', pvMax: 6500, hpRate: 500, hpUnit: 'installation', hpMax: 6500, communalBonus: 0 }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (step) => {
    setCurrentStep(step);
  };

  const handlePrev = (step) => {
    setCurrentStep(step);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData;
    let power = parseFloat(data.power) || (data.projectType === 'pv' ? 10 : 12);
    const effectiveCanton = data.canton === 'ZH-CUSTOM' ? 'ZH' : data.canton;
    const info = cantonData[effectiveCanton] || cantonData['VD'];
    const project = data.projectType || 'pv';

    let pvAid = 0;
    if (project === 'pv' || project === 'both') {
      pvAid = Math.round(Math.min(info.pvMax, info.pvRate * power * 1000));
    }

    let hpAid = 0;
    if (project === 'hp' || project === 'both') {
      const base = info.hpRate;
      let multiplier = 1;
      if (data.currentSystem === 'fuel' || data.currentSystem === 'gas') multiplier = 1.2;
      hpAid = Math.round(Math.min(info.hpMax, base * multiplier));
    }

    const communal = info.communalBonus || 0;
    const total = pvAid + hpAid + communal;

    setSimulatorResult({ pvAid, hpAid, communal, total });
    setShowResult(true);

    // Envoi automatique vers n8n (si configuré)
    const webhookURL = "https://n8n.yourdomain.ch/webhook/simulateur"; // à remplacer par ton URL webhook n8n

    const payload = {
      submittedAt: new Date().toISOString(),
      project: project,
      canton: effectiveCanton,
      postal: data.postal || '',
      buildingType: data.buildingType || '',
      currentSystem: data.currentSystem || '',
      power: power,
      ownerStatus: data.ownerStatus || '',
      fullname: data.fullname || '',
      email: data.email || '',
      phone: data.phone || '',
      pvAid, hpAid, communal, total
    };

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.error("Erreur d’envoi vers n8n :", error);
    });
  };

  const handleDownloadPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Rapport d'estimation - Simulateur d'aides</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; margin: 40px; color: #222; line-height: 1.6; }
            h1 { color: #065f46; font-size: 24px; margin-bottom: 10px; }
            .result { background: linear-gradient(180deg, #f0fdf4, #dcfce7); padding: 20px; border-radius: 10px; margin: 20px 0; }
            ul { margin: 10px 0; padding-left: 20px; }
            li { margin: 5px 0; }
            strong { color: #065f46; }
            .total { font-size: 18px; margin-top: 10px; }
            footer { margin-top: 30px; font-size: 12px; color: #6b6b6b; }
          </style>
        </head>
        <body>
          <h1>Rapport d'estimation - Subventions énergétiques</h1>
          <div class="result">
            <strong>Estimation rapide</strong>
            <p>D'après vos informations (canton <strong>${formData.canton}</strong>), l'estimation indicative est :</p>
            <ul>
              ${simulatorResult.pvAid > 0 ? `<li>🔆 Panneaux solaires : <strong>CHF ${simulatorResult.pvAid.toLocaleString()}</strong></li>` : ''}
              ${simulatorResult.hpAid > 0 ? `<li>🔥 Pompe à chaleur : <strong>CHF ${simulatorResult.hpAid.toLocaleString()}</strong></li>` : ''}
              ${simulatorResult.communal > 0 ? `<li>🏘️ Prime communale estimée : <strong>CHF ${simulatorResult.communal.toLocaleString()}</strong></li>` : ''}
            </ul>
            <p class="total"><strong>Total estimé : CHF ${simulatorResult.total.toLocaleString()}</strong></p>
            <p>Ce résultat est indicatif. Un conseiller vérifiera les primes exactes (communes, conditions techniques, certificats).</p>
          </div>
          <footer>
            <p>comparatifdevis.ch - Rapport généré le ${new Date().toLocaleDateString('fr-CH')}</p>
            <p>Projet: ${formData.projectType}, Puissance: ${formData.power || 'Estimation'}, Système actuel: ${formData.currentSystem}</p>
            <p>Contact: ${formData.fullname} - ${formData.email}</p>
          </footer>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShowSimulator = () => {
    setShowSimulator(true);
    setCurrentStep(1);
    setShowResult(false);
    const element = document.getElementById('simulateur');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stepLabels = ['Projet', 'Localisation', 'Détails', 'Contact'];

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img src="/assets/heat-pump.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative">
        <motion.div
          className="bg-gradient-to-br from-green-50 to-green-100 py-4 px-3 sm:p-12 rounded-3xl shadow-2xl border border-green-200"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
            Subventions & aides disponibles
          </h3>
          <p className="text-base text-green-700 mb-8">
            Les aides varient selon le codepostale. Exemples :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🇨🇭</div>
              <h5 className="font-bold text-green-800 mb-2">Programmes fédéraux</h5>
              <p className="text-xs text-green-600">
                SuisseEnergie et autres primes pour l'efficacité énergétique.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">♨️</div>
              <h5 className="font-bold text-green-800 mb-2">Aides cantonales</h5>
              <p className="text-xs text-green-600">
                Aides spécifiques pour remplacement de chaudières anciennes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🏛️</div>
              <h5 className="font-bold text-green-800 mb-2">Subventions communales</h5>
              <p className="text-xs text-green-600">
                Obtenez jusqu’à 40 % d’aides pour vos panneaux solaires et pompes à chaleur partout en Suisse romande !
              </p>
            </div>
          </div>

          {!showSimulator && (
            <section 
              id="intro-aides" 
              style={{ 
                background: 'linear-gradient(180deg, #f0fdf4, #dcfce7)', 
                padding: '36px 20px', 
                borderRadius: '12px', 
                maxWidth: '1100px', 
                margin: '24px auto', 
                fontFamily: 'Inter, system-ui, Arial', 
                color: '#102020' 
              }}
            >
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div 
                  aria-hidden="true" 
                  style={{ 
                    flex: '0 0 68px', 
                    height: '68px', 
                    borderRadius: '12px', 
                    background: '#ecfdf5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: '0 6px 18px rgba(16,32,32,0.06)' 
                  }}
                >
                  <svg 
                    width="36" 
                    height="36" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{ display: 'block' }}
                  >
                    <path 
                      d="M3 12h6M12 3v6M21 12h-6M12 21v-6" 
                      stroke="#10b981" 
                      strokeWidth="1.6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div style={{ flex: '1', minWidth: '240px' }}>
                  <h2 style={{ margin: '0 0 8px', fontSize: '22px', lineHeight: '1.05', color: '#065f46' }}>
                    Profitez des aides suisses pour votre transition énergétique !
                  </h2>

                  <p style={{ margin: '0 0 14px', color: '#047857', fontSize: '15px' }}>
                    comparatifdevis.ch vous accompagne pour <strong>obtenir les subventions disponibles</strong> en Suisse pour l’installation de <strong>panneaux photovoltaïques</strong> ou de <strong>pompes à chaleur</strong>, que vous soyez <strong>particulier ou entreprise</strong>.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={handleShowSimulator} 
                      className="btn-primary" 
                      style={{ 
                        background: '#10b981', 
                        color: '#ffffff', 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        fontWeight: 700, 
                        textDecoration: 'none', 
                        boxShadow: '0 6px 18px rgba(16,185,129,0.18)', 
                        border: 'none', 
                        cursor: 'pointer' 
                      }}
                    >
                      Lancer la simulation
                    </button>
                    <a 
                      href="/contact" 
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #d1fae5', 
                        color: '#065f46', 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        fontWeight: 600, 
                        textDecoration: 'none' 
                      }}
                    >
                      Contactez un conseiller
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          <AnimatePresence>
            {showSimulator && (
              <motion.div
                id="simulateur"
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-green-200 mt-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-4xl mx-auto">
                  {!showResult ? (
                    <>
                      <h1 className="text-2xl font-bold mb-1">Simulateur d'aides - Panneaux solaires & Pompes à chaleur</h1>
                      <p className="text-green-600 mb-4">Estimez en 2 minutes les subventions fédérales, cantonales et communales potentielles. Les résultats sont indicatifs — un conseiller vérifiera l'éligibilité exacte.</p>
                      
                      <div className="flex gap-2 my-4">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`flex-1 p-1.5 rounded-lg text-xs text-center font-medium ${
                              currentStep === s
                                ? 'bg-gradient-to-r from-green-500 to-green-300 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {s}. {stepLabels[s - 1]}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {currentStep === 1 && (
                          <div>
                            <label className="block mt-3 font-semibold text-green-800 text-sm">Quel type de projet ?</label>
                            <div className="flex gap-3 mt-1.5">
                              <div className="flex-1">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                                  <input
                                    type="radio"
                                    name="projectType"
                                    value="pv"
                                    className="mr-2"
                                    checked={formData.projectType === 'pv'}
                                    onChange={(e) => handleChange('projectType', e.target.value)}
                                  />
                                  Panneaux solaires
                                </label>
                              </div>
                              <div className="flex-1">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                                  <input
                                    type="radio"
                                    name="projectType"
                                    value="hp"
                                    className="mr-2"
                                    checked={formData.projectType === 'hp'}
                                    onChange={(e) => handleChange('projectType', e.target.value)}
                                  />
                                  Pompe à chaleur
                                </label>
                              </div>
                              <div className="flex-1">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                                  <input
                                    type="radio"
                                    name="projectType"
                                    value="both"
                                    className="mr-2"
                                    checked={formData.projectType === 'both'}
                                    onChange={(e) => handleChange('projectType', e.target.value)}
                                  />
                                  Les deux
                                </label>
                              </div>
                            </div>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Type de bâtiment</label>
                            <select
                              name="buildingType"
                              value={formData.buildingType}
                              onChange={(e) => handleChange('buildingType', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="house">Maison individuelle</option>
                              <option value="apartment">Immeuble locatif</option>
                              <option value="commercial">Bâtiment commercial / industriel</option>
                              <option value="other">Autre</option>
                            </select>

                            <div className="mt-3">
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold"
                                onClick={() => handleNext(2)}
                              >
                                Suivant →
                              </button>
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div>
                            <label className="block mt-3 font-semibold text-green-800 text-sm">Dans quel canton se situe le projet ?</label>
                            <select
                              name="canton"
                              id="cantonSelect"
                              value={formData.canton}
                              onChange={(e) => handleChange('canton', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="VD">Vaud</option>
                              <option value="GE">Genève</option>
                              <option value="BE">Berne</option>
                              <option value="VS">Valais</option>
                              <option value="FR">Fribourg</option>
                              <option value="NE">Neuchâtel</option>
                              <option value="JU">Jura</option>
                              <option value="ZH">Zurich</option>
                              <option value="ZH-CUSTOM">Autre (choisir dans la liste)</option>
                            </select>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Code postal / Commune (optionnel pour affiner)</label>
                            <input
                              type="text"
                              name="postal"
                              placeholder="Ex: 1000 Lausanne"
                              value={formData.postal}
                              onChange={(e) => handleChange('postal', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <div className="mt-3 flex justify-between">
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold"
                                onClick={() => handlePrev(1)}
                              >
                                ← Précédent
                              </button>
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold"
                                onClick={() => handleNext(3)}
                              >
                                Suivant →
                              </button>
                            </div>
                          </div>
                        )}

                        {currentStep === 3 && (
                          <div>
                            <label className="block mt-3 font-semibold text-green-800 text-sm">Quel est votre système actuel ?</label>
                            <select
                              name="currentSystem"
                              value={formData.currentSystem}
                              onChange={(e) => handleChange('currentSystem', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="fuel">Mazout</option>
                              <option value="gas">Gaz</option>
                              <option value="electric">Électrique</option>
                              <option value="hp_old">PAC existante (remplacement)</option>
                              <option value="none">Aucun / nouvelle construction</option>
                            </select>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Surface de toiture / puissance souhaitée</label>
                            <input
                              type="number"
                              name="power"
                              placeholder="kWc pour PV ou kW thermique pour PAC"
                              min="0"
                              step="0.1"
                              value={formData.power}
                              onChange={(e) => handleChange('power', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />
                            <p className="text-xs text-green-600 mt-1.5 block">
                              Si vous ne connaissez pas la puissance, choisissez une estimation: petite 5 kW, moyenne 10 kW, grande 20 kW+
                            </p>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Vous êtes :</label>
                            <select
                              name="ownerStatus"
                              value={formData.ownerStatus}
                              onChange={(e) => handleChange('ownerStatus', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="owner">Propriétaire occupant</option>
                              <option value="landlord">Propriétaire bailleur</option>
                              <option value="tenant">Locataire</option>
                              <option value="company">Entreprise / collectivité</option>
                            </select>

                            <div className="mt-3 flex justify-between">
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold"
                                onClick={() => handlePrev(2)}
                              >
                                ← Précédent
                              </button>
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold"
                                onClick={() => handleNext(4)}
                              >
                                Suivant →
                              </button>
                            </div>
                          </div>
                        )}

                        {currentStep === 4 && (
                          <div>
                            <label className="block mt-3 font-semibold text-green-800 text-sm">Nom complet</label>
                            <input
                              type="text"
                              name="fullname"
                              required
                              value={formData.fullname}
                              onChange={(e) => handleChange('fullname', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Email</label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Téléphone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <div className="mt-3 flex justify-between">
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold"
                                onClick={() => handlePrev(3)}
                              >
                                ← Précédent
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold"
                              >
                                Obtenir mon estimation ✅
                              </button>
                            </div>
                          </div>
                        )}
                      </form>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold mb-1">Simulateur d'aides - Panneaux solaires & Pompes à chaleur</h1>
                      <p className="text-green-600 mb-4">Estimez en 2 minutes les subventions fédérales, cantonales et communales potentielles. Les résultats sont indicatifs — un conseiller vérifiera l'éligibilité exacte.</p>
                      
                      <div className="flex gap-2 my-4">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`flex-1 p-1.5 rounded-lg text-xs text-center font-medium ${
                              s === 4
                                ? 'bg-gradient-to-r from-green-500 to-green-300 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {s}. {stepLabels[s - 1]}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-b from-green-50 to-emerald-50">
                        <strong>Estimation rapide</strong>
                        <p className="my-1.5">
                          D'après vos informations (canton <strong>{formData.canton}</strong>), l'estimation indicative est :
                        </p>
                        <ul className="space-y-1">
                          {simulatorResult.pvAid > 0 && (
                            <li>🔆 Panneaux solaires : <strong>CHF {simulatorResult.pvAid.toLocaleString()}</strong></li>
                          )}
                          {simulatorResult.hpAid > 0 && (
                            <li>🔥 Pompe à chaleur : <strong>CHF {simulatorResult.hpAid.toLocaleString()}</strong></li>
                          )}
                          {simulatorResult.communal > 0 && (
                            <li>🏘️ Prime communale estimée : <strong>CHF {simulatorResult.communal.toLocaleString()}</strong></li>
                          )}
                        </ul>
                        <p className="font-bold text-lg mt-2">
                          Total estimé : CHF {simulatorResult.total.toLocaleString()}
                        </p>
                        <p className="my-1.5 text-sm">
                          Ce résultat est indicatif. Un conseiller vérifiera les primes exactes (communes, conditions techniques, certificats).
                        </p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <a href="tel:+41211234567" className="px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold flex-1 text-center">
                          Réserver un appel
                        </a>
                        <button
                          onClick={handleDownloadPDF}
                          className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold flex-1 text-center"
                        >
                          Télécharger le rapport (PDF)
                        </button>
                      </div>

                      <button
                        onClick={() => setShowResult(false)}
                        className="mt-4 w-full px-4 py-2.5 rounded-lg bg-gray-200 text-gray-900 font-bold"
                      >
                        Modifier mes informations
                      </button>
                    </>
                  )}

                  <footer className="mt-4 text-xs text-green-600 text-center">
                    Note : Les montants sont indicatifs. Pour un chiffrage précis, un expert vérifiera votre dossier et les primes communales spécifiques.
                  </footer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ImprovedSubventionsSection;