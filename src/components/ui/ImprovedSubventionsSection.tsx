import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';


interface FormData {
  projectType: string;
  buildingType: string;
  canton: string;
  postal: string;
  postalCity?: string; // Optional, as it’s set conditionally
  currentSystem: string;
  power: string;
  pacType: string;
  ownerStatus: string;
  installationType: string;
  serviceYear: string;
  hasCECB: boolean;
  autoconsommation: string;
  fullname: string;
  email: string;
  phone: string;
}


interface PACResult {
  type: string;
  base: number;
  per_kw: number;
  kw: number;
  estimated_subvention: number;
  fossil_replacement_bonus: number;
  total_estimated: number;
}

const ImprovedSubventionsSection = () => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState<FormData>({
  projectType: 'pv',
  buildingType: 'house',
  canton: 'VD',
  postal: '',
  postalCity: '', // Add this to match the interface
  currentSystem: 'fuel',
  power: '',
  pacType: 'air-eau',
  ownerStatus: 'owner',
  installationType: '',
  serviceYear: '2025',
  hasCECB: false,
  autoconsommation: '',
  fullname: '',
  email: '',
  phone: ''
});

  const [showResult, setShowResult] = useState(false);
  const [simulatorResult, setSimulatorResult] = useState({
    pvAid: 0,
    hpAid: 0,
    communal: 0,
    total: 0,
    notes: ''
  });

  // Updated DATA for 2025 based on current subsidies
  const DATA = {
    cantons: {
      GE: {
        pv_chf_per_kwc_min: 200,
        pv_chf_per_kwc_max: 400,
        pv_prime_max: 6000,
        pac_air_eau_base: 3000,
        pac_air_eau_per_kw: 400,
        pac_sol_eau_base: 3000,
        pac_sol_eau_per_kw: 800,
        isolation_chf_per_m2: 60,
        cecb_bonus_min: 500,
        cecb_bonus_max: 1000,
        fossil_replacement_bonus: 1500,
        communal_bonus_percent: [25, 40],
        conditions: "Demande avant travaux; CECB recommandé; Prime SIG reconduite"
      },
      VD: {
        pv_chf_per_kwc_min: 200,
        pv_chf_per_kwc_max: 350,
        pv_prime_max: 6000,
        pac_air_eau_base: 8000,
        pac_air_eau_per_kw: 0,
        pac_sol_eau_base: 10000,
        pac_sol_eau_per_kw: 0,
        isolation_chf_per_m2: 60,
        cecb_bonus: 750,
        fossil_replacement_bonus: 1500,
        communal_bonus_percent: [20, 30],
        conditions: "Programme Bâtiments VD; CECB requis; jusqu'à CHF 8'000 pour PAC air-eau"
      },
      VS: {
        pv_chf_per_kwc_min: 250,
        pv_chf_per_kwc_max: 400,
        pv_prime_max: 8000,
        pac_air_eau_base: 9000,
        pac_air_eau_per_kw: 0,
        pac_sol_eau_base: 13000,
        pac_sol_eau_per_kw: 0,
        isolation_chf_per_m2: 50,
        cecb_bonus: 500,
        fossil_replacement_bonus: 2000,
        communal_bonus_percent: [30, 40],
        conditions: "Remplacement d’énergie fossile priorisé; CHF 9'000 pour PAC air-eau"
      },
      FR: {
        pv_chf_per_kwc_min: 200,
        pv_chf_per_kwc_max: 350,
        pv_prime_max: 5000,
        pac_air_eau_base: 3500,
        pac_air_eau_per_kw: 150,
        pac_sol_eau_base: 8000,
        pac_sol_eau_per_kw: 0,
        isolation_chf_per_m2: 60,
        cecb_bonus: 700,
        fossil_replacement_bonus: 1000,
        communal_bonus_percent: [25, 25],
        conditions: "CECB obligatoire pour rénovation; CHF 3'500 + CHF 150/kW pour PAC air-eau"
      },
      NE: {
        pv_chf_per_kwc_min: 180,
        pv_chf_per_kwc_max: 300,
        pv_prime_max: 4500,
        pac_air_eau_base: 3500,
        pac_air_eau_per_kw: 150,
        pac_sol_eau_base: 5000,
        pac_sol_eau_per_kw: 0,
        isolation_chf_per_m2: 50,
        cecb_bonus: 500,
        fossil_replacement_bonus: 1000,
        communal_bonus_percent: [20, 25],
        conditions: "CECB Plus recommandé; CHF 3'500 + CHF 150/kW pour PAC air-eau"
      },
      JU: {
        pv_chf_per_kwc_min: 200,
        pv_chf_per_kwc_max: 300,
        pv_prime_max: 4000,
        pac_air_eau_base: 2500,
        pac_air_eau_per_kw: 100,
        pac_sol_eau_base: 6500,
        pac_sol_eau_per_kw: 0,
        isolation_chf_per_m2: 45,
        cecb_bonus: 500,
        fossil_replacement_bonus: 1000,
        communal_bonus_percent: [20, 25],
        conditions: "Soumission avant travaux; CHF 2'500 + CHF 100/kW pour PAC air-eau"
      }
    },
    federal: {
      pronovo_pru_per_kwc_estimate_min: 200,
      pronovo_pru_per_kwc_estimate_max: 600,
      programme_batiments_support_estimated: "variable selon dossier; up to 30% investment"
    }
  };

  // Postal codes data per canton (major cities/communes)
  const postalData = {
    VD: [
      { code: '1000', city: 'Lausanne' },
      { code: '1012', city: 'Lausanne' },
      { code: '1009', city: 'Pully' },
      { code: '1066', city: 'Epalinges' },
      { code: '1110', city: 'Morges' },
      { code: '1196', city: 'Gland' },
      { code: '1260', city: 'Nyon' },
      { code: '1400', city: 'Yverdon-les-Bains' },
      { code: '1800', city: 'Vevey' },
      { code: '1820', city: 'Montreux' },
      { code: '1860', city: 'Aigle' },
      { code: '1008', city: 'Prilly' },
      { code: '1020', city: 'Renens' },
      { code: '1040', city: 'Echallens' },
      { code: '1052', city: 'Le Mont-sur-Lausanne' }
    ],
    GE: [
      { code: '1200', city: 'Genève' },
      { code: '1201', city: 'Genève' },
      { code: '1213', city: 'Petit-Lancy' },
      { code: '1214', city: 'Vernier' },
      { code: '1215', city: 'Meyrin' },
      { code: '1216', city: 'Cointrin' },
      { code: '1217', city: 'Meyrin' },
      { code: '1218', city: 'Le Grand-Saconnex' },
      { code: '1219', city: 'Châtelaine' },
      { code: '1227', city: 'Carouge' },
      { code: '1228', city: 'Plan-les-Ouates' },
      { code: '1232', city: 'Confignon' },
      { code: '1233', city: 'Bernex' },
      { code: '1234', city: 'Versoix' },
      { code: '1241', city: 'Puplinge' }
    ],
    VS: [
      { code: '1870', city: 'Monthey' },
      { code: '1902', city: 'Evionnaz' },
      { code: '1920', city: 'Martigny' },
      { code: '1950', city: 'Sion' },
      { code: '1963', city: 'Vétroz' },
      { code: '1974', city: 'Arbaz' },
      { code: '3960', city: 'Sierre' },
      { code: '3970', city: 'Salgesch' },
      { code: '3900', city: 'Brig-Glis' },
      { code: '3930', city: 'Visp' },
      { code: '3930', city: 'Viège' },
      { code: '3940', city: 'Saxon' },
      { code: '3952', city: 'Savièse' },
      { code: '3953', city: 'Evolène' },
      { code: '3983', city: 'Eisten' }
    ],
    FR: [
      { code: '1630', city: 'Bulle' },
      { code: '1700', city: 'Fribourg' },
      { code: '1470', city: 'Estavayer-le-Lac' },
      { code: '1564', city: 'Domdidier' },
      { code: '1618', city: 'Châtel-Saint-Denis' },
      { code: '1712', city: 'Tafers' },
      { code: '1723', city: 'Marly' },
      { code: '1752', city: 'Villars-sur-Glâne' },
      { code: '1762', city: 'Givisiez' },
      { code: '1784', city: 'Courtepin' },
      { code: '1786', city: 'Sugiez' },
      { code: '3175', city: 'Flamatt' },
      { code: '3184', city: 'Wünnewil-Flamatt' },
      { code: '3210', city: 'Kerzers' },
      { code: '3280', city: 'Murten' }
    ],
    NE: [
      { code: '2000', city: 'Neuchâtel' },
      { code: '2001', city: 'Neuchâtel' },
      { code: '2002', city: 'Neuchâtel' },
      { code: '2010', city: 'Neuchâtel OFS' },
      { code: '2067', city: 'Chaumont' },
      { code: '2100', city: 'Travers' },
      { code: '2300', city: 'La Chaux-de-Fonds' },
      { code: '2400', city: 'Le Locle' },
      { code: '2500', city: 'Biel/Bienne' },
      { code: '2540', city: 'Grenchen' },
      { code: '2520', city: 'Nidau' },
      { code: '2560', city: 'Niederwil' },
      { code: '2610', city: 'Rheinfelden' },
      { code: '2710', city: 'Tavannes' },
      { code: '2740', city: 'Montfaucon' }
    ],
    JU: [
      { code: '2800', city: 'Delémont' },
      { code: '2900', city: 'Porrentruy' },
      { code: '2350', city: 'Saignelégier' },
      { code: '2830', city: 'Courrendlin' },
      { code: '2854', city: 'Bassecourt' },
      { code: '2336', city: 'Les Bois' },
      { code: '2340', city: 'Le Noirmont' },
      { code: '2345', city: 'Les Breuleux' },
      { code: '2802', city: 'Develier' },
      { code: '2822', city: 'Courroux' },
      { code: '2824', city: 'Vicques' },
      { code: '2852', city: 'Courtételle' },
      { code: '2853', city: 'Courfaivre' },
      { code: '2855', city: 'Glovelier' },
      { code: '2856', city: 'Boécourt' }
    ]
  };

  // Utilitaires
  const avgRange = (range) => {
    if (!Array.isArray(range)) return range;
    return (range[0] + range[1]) / 2;
  };

  const chooseWithin = (min, max) => {
    if (typeof min === 'number' && typeof max === 'number') return Math.round((min + max) / 2);
    return min || max;
  };

  // Enhanced Calcul PV with new inputs
  const calculatePV = (cantonCode, kwc, installationType = '', hasCECB = false, autoconsommation = 0, serviceYear = 2025) => {
    let reduction = 1;
    if (serviceYear > 2025) {
      reduction = 1 - (serviceYear - 2025) * 0.05; // Assume 5% reduction per year
    }
    const c = DATA.cantons[cantonCode] || DATA.cantons.VD;
    let pv_rate_min = c.pv_chf_per_kwc_min;
    let pv_rate_max = c.pv_chf_per_kwc_max;
    if (installationType === 'integre') {
      pv_rate_max += 100; // Bonus for integrated
    } else if (installationType === 'toit-plat') {
      pv_rate_min -= 50; // Adjustment for flat roof
    }
    const pv_rate = chooseWithin(pv_rate_min * reduction, pv_rate_max * reduction);
    const estimated_cost_offset = Math.round(pv_rate * kwc);
    const prime = Math.min(c.pv_prime_max || 0, estimated_cost_offset);
    const federal_min = DATA.federal.pronovo_pru_per_kwc_estimate_min * kwc * reduction;
    const federal_max = DATA.federal.pronovo_pru_per_kwc_estimate_max * kwc * reduction;
    const federal_estimate = Math.round((federal_min + federal_max) / 2);

    let total_pv_subvention_estimated = prime + federal_estimate;
    if (hasCECB) {
      const cecb_bonus = c.cecb_bonus ? c.cecb_bonus : avgRange([c.cecb_bonus_min, c.cecb_bonus_max]);
      total_pv_subvention_estimated += cecb_bonus;
    }
    if (autoconsommation > 30) {
      total_pv_subvention_estimated += Math.round(prime * 0.1); // 10% bonus for high self-consumption
    }

    return {
      kwc,
      pv_rate_chf_per_kwc: pv_rate,
      estimated_offset_chf: estimated_cost_offset,
      prime_cantonale_chf: prime,
      federal_pronovo_estimate_chf: federal_estimate,
      total_pv_subvention_estimated
    };
  };

  // Calcul PAC (unchanged)
const calculatePAC = (cantonCode: string, type: string, kw: number, isFossil: boolean): PACResult => {
  const c = DATA.cantons[cantonCode] || DATA.cantons.VD;
  const result: PACResult = { type, base: 0, per_kw: 0, kw: 0, estimated_subvention: 0, fossil_replacement_bonus: 0, total_estimated: 0 };

  let base: number, per_kw: number;
  if (type === 'air-eau') {
    base = c.pac_air_eau_base || 0;
    per_kw = c.pac_air_eau_per_kw || 0;
  } else if (type === 'sol-eau') {
    base = c.pac_sol_eau_base || 0;
    per_kw = c.pac_sol_eau_per_kw || 0;
  } else {
    throw new Error('Type PAC inconnu (air-eau | sol-eau)');
  }

  const perKWPart = kw ? Math.round(per_kw * kw) : 0;
  const estimated_subvention = base + perKWPart;
  result.base = base;
  result.per_kw = per_kw;
  result.kw = kw;
  result.estimated_subvention = estimated_subvention;
  const fossilBonus = isFossil ? (c.fossil_replacement_bonus || 0) : 0;
  result.fossil_replacement_bonus = fossilBonus;
  result.total_estimated = estimated_subvention + fossilBonus;

  return result;
};

  // Application bonus communal (moyenne)
  const applyCommunalBonus = (cantonCode, amount) => {
    const c = DATA.cantons[cantonCode] || DATA.cantons.VD;
    const cp = c.communal_bonus_percent;
    let percent = 0;
    if (Array.isArray(cp)) {
      percent = Math.round((cp[0] + cp[1]) / 2);
    } else if (typeof cp === 'number') {
      percent = cp;
    }
    const communal_bonus = Math.round(amount * (percent / 100));
    return {
      communal_bonus,
      communal_percent_used: percent,
      total_with_commune: amount + communal_bonus
    };
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePostalChange = (e) => {
    const code = e.target.value;
    const opt = postalData[formData.canton]?.find(o => o.code === code);
    setFormData(prev => ({ 
      ...prev, 
      postal: code,
      postalCity: opt ? opt.city : '' 
    }));
  };

  const handleNext = (step) => {
    setCurrentStep(step);
  };

  const handlePrev = (step) => {
    setCurrentStep(step);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Step 1: Validate and sanitize formData to control empty/undefined values
    const data : FormData = { ...formData }; // Clone to avoid mutating original
    
    // Sanitize: Ensure all keys exist, trim strings, set safe defaults
    const sanitizedData = {
      projectType: (data.projectType || '').trim() || 'pv', // Default to 'pv' if empty
      canton: (data.canton || '').trim() || 'VD', // Default canton
      postal: (data.postal || '').trim(),
      postalCity: (data.postalCity || '').trim(),
      buildingType: (data.buildingType || '').trim() || 'house', // Default building type
      currentSystem: (data.currentSystem || '').trim() || 'none', // Default system
      power: parseFloat((data.power || '0').trim()) || (data.projectType === 'pv' ? 10 : 12), // Already has fallback, but ensure non-negative
      pacType: (data.pacType || '').trim() || 'air-eau', // Default PAC type if empty
      ownerStatus: (data.ownerStatus || '').trim() || 'owner', // Default status
      installationType: (data.installationType || '').trim() || '',
      serviceYear: (data.serviceYear || '').trim() || '2025',
      hasCECB: !!data.hasCECB, // Boolean
      autoconsommation: parseFloat((data.autoconsommation || '0').trim()) || 0,
      fullname: (data.fullname || '').trim(),
      email: (data.email || '').trim().toLowerCase(), // Normalize email
      phone: (data.phone || '').trim().replace(/\D/g, ''), // Strip non-digits for phone
    };

    // Early validation: Check required fields (prevent submit with empties)
    const requiredFields = ['fullname', 'email', 'phone', 'canton'];
    const missingFields = requiredFields.filter(field => !sanitizedData[field]);
    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields); // Or set errors state
      alert(`Veuillez remplir: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email/phone basics (expand as needed)
    if (!/\S+@\S+\.\S+/.test(sanitizedData.email)) {
      alert('Email invalide');
      return;
    }
    if (sanitizedData.phone.length < 10) {
      alert('Numéro de téléphone trop court');
      return;
    }

    // Step 2: Calculations with sanitized data (safer now)
    const effectiveCanton = sanitizedData.canton;
    const c = DATA.cantons[effectiveCanton] || DATA.cantons.VD;
    const project = sanitizedData.projectType;
    const isFossil = sanitizedData.currentSystem === 'fuel' || sanitizedData.currentSystem === 'gas';

    let pv = null;
    let hp = null;
    let subtotal = 0;

    if (project === 'pv' || project === 'both') {
      pv = calculatePV(
        effectiveCanton, 
        sanitizedData.power, 
        sanitizedData.installationType, 
        sanitizedData.hasCECB, 
        sanitizedData.autoconsommation, 
        parseInt(sanitizedData.serviceYear)
      );
      subtotal += pv.total_pv_subvention_estimated || 0; // Fallback to 0 if calc returns null
    }

    if (project === 'hp' || project === 'both') {
      hp = calculatePAC(effectiveCanton, sanitizedData.pacType, sanitizedData.power, isFossil);
      subtotal += hp.total_estimated || 0;
    }

    const communal = applyCommunalBonus(effectiveCanton, subtotal);
    const total = communal.total_with_commune || 0;
    const notes = c.conditions || 'Aucune note disponible';

    const pvAid = pv ? pv.total_pv_subvention_estimated : 0;
    const hpAid = hp ? hp.total_estimated : 0;

    setSimulatorResult({ 
      pvAid, 
      hpAid, 
      communal: communal.communal_bonus || 0, 
      total, 
      notes 
    });
    setShowResult(true);

    // Step 3: Prepare payload with no empties (all values are now defined)
    const payload = {
      mode: 'simulator',
      submittedAt: new Date().toISOString(),
      project: project,
      canton: effectiveCanton,
      postal: sanitizedData.postal || 'Non spécifié',
      postalCity: sanitizedData.postalCity || 'Non spécifié',
      buildingType: sanitizedData.buildingType,
      currentSystem: sanitizedData.currentSystem,
      power: sanitizedData.power,
      pacType: sanitizedData.pacType,
      ownerStatus: sanitizedData.ownerStatus,
      installationType: sanitizedData.installationType,
      serviceYear: sanitizedData.serviceYear,
      hasCECB: sanitizedData.hasCECB,
      autoconsommation: sanitizedData.autoconsommation,
      fullname: sanitizedData.fullname,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      pvAid,
      hpAid,
      communal: communal.communal_bonus || 0,
      total,
      notes
    };

    // Step 4: Send to n8n webhook (with error handling)
    const webhookURL = import.meta.env.VITE_API_URL;
    if (webhookURL) {
      fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        console.log('n8n webhook sent successfully');
      })
      .catch(error => {
        console.error("Erreur d’envoi vers n8n :", error);
      });
    }

    // Step 5: Send email via EmailJS (with fallbacks for empty results)
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SIMULATOR;
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      const formattedDate = new Date().toLocaleString('fr-CH', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(/\//g, '.');

      const formattedPvAid = pvAid.toLocaleString('fr-CH');
      const formattedHpAid = hpAid.toLocaleString('fr-CH');
      const formattedCommunal = (communal.communal_bonus || 0).toLocaleString('fr-CH');
      const formattedTotal = total.toLocaleString('fr-CH');

      const emailParams = {
        fullname: sanitizedData.fullname || 'Anonyme',
        email: sanitizedData.email,
        phone: sanitizedData.phone || 'Non fourni',
        project: project,
        canton: effectiveCanton,
        postal: sanitizedData.postal || 'Non spécifié',
        postalCity: sanitizedData.postalCity || 'Non spécifiée',
        buildingType: sanitizedData.buildingType,
        currentSystem: sanitizedData.currentSystem,
        power: sanitizedData.power,
        pacType: sanitizedData.pacType,
        ownerStatus: sanitizedData.ownerStatus,
        installationType: sanitizedData.installationType || 'Non spécifié',
        serviceYear: sanitizedData.serviceYear,
        hasCECB: sanitizedData.hasCECB ? 'Oui' : 'Non',
        autoconsommation: sanitizedData.autoconsommation || 'Non spécifié',
        submittedAt: formattedDate,
        pvAid: formattedPvAid,
        hpAid: formattedHpAid,
        communal: formattedCommunal,
        total: formattedTotal,
        notes: notes || 'Aucune note'
      };

      emailjs.send(emailjsServiceId, emailjsTemplateId, emailParams, emailjsPublicKey)
        .then((response) => {
          console.log('Email sent successfully:', response.status, response.text);
        })
        .catch((error) => {
          console.error('Email send error:', error);
        });
    } else {
      console.warn('EmailJS env vars missing—email not sent');
    }
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
            <p>D'après vos informations (canton <strong>${formData.canton}</strong>, code postal <strong>${formData.postal || 'Non spécifié'}</strong>), l'estimation indicative est :</p>
            <ul>
              ${simulatorResult.pvAid > 0 ? `<li>🔆 Panneaux solaires : <strong>CHF ${simulatorResult.pvAid.toLocaleString()}</strong></li>` : ''}
              ${simulatorResult.hpAid > 0 ? `<li>🔥 Pompe à chaleur : <strong>CHF ${simulatorResult.hpAid.toLocaleString()}</strong></li>` : ''}
              ${simulatorResult.communal > 0 ? `<li>🏘️ Prime communale estimée : <strong>CHF ${simulatorResult.communal.toLocaleString()}</strong></li>` : ''}
            </ul>
            <p class="total"><strong>Total estimé : CHF ${simulatorResult.total.toLocaleString()}</strong></p>
            <p>Ce résultat est indicatif. Un conseiller vérifiera les primes exactes (communes, conditions techniques, certificats).</p>
            <p><strong>Conditions :</strong> ${simulatorResult.notes}</p>
          </div>
          <footer>
            <p>comparatifdevis.ch - Rapport généré le ${new Date().toLocaleDateString('fr-CH')}</p>
            <p>Projet: ${formData.projectType}, Puissance: ${formData.power || 'Estimation'}, Système actuel: ${formData.currentSystem}</p>
            <p>Contact: ${formData.fullname} - ${formData.email} - Code postal: ${formData.postal || 'Non spécifié'}</p>
            <p>Type d'installation: ${formData.installationType || 'Non spécifié'}, Année: ${formData.serviceYear}, CECB: ${formData.hasCECB ? 'Oui' : 'Non'}, Autoconsommation: ${formData.autoconsommation || 'Non spécifié'}%</p>
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
                Obtenez jusqu’à 40 % d’aides pour vos panneaux solaires et pompes à chaleur partout en Suisse !
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
                      href="mailto:contact@comparatifdevis.com " 
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #d1fae5', 
                        color: '#065f46', 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        fontWeight: '600', 
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

                      <div className="flex flex-wrap gap-2 my-4">
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
                            <div className="flex flex-wrap gap-3 mt-1.5">
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
                              <option value="VS">Valais</option>
                              <option value="FR">Fribourg</option>
                              <option value="NE">Neuchâtel</option>
                              <option value="JU">Jura</option>
                            </select>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Code postal / Commune</label>
                            <select
                              value={formData.postal}
                              onChange={handlePostalChange}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="">Choisir une commune (optionnel)</option>
                              {postalData[formData.canton]?.map((opt) => (
                                <option key={opt.code} value={opt.code}>
                                  {opt.code} - {opt.city}
                                </option>
                              ))}
                            </select>

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

                            {(formData.projectType === 'hp' || formData.projectType === 'both') && (
                              <>
                                <label className="block mt-3 font-semibold text-green-800 text-sm">Type de pompe à chaleur</label>
                                <select
                                  name="pacType"
                                  value={formData.pacType}
                                  onChange={(e) => handleChange('pacType', e.target.value)}
                                  className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                                >
                                  <option value="air-eau">Air-eau</option>
                                  <option value="sol-eau">Sol-eau</option>
                                </select>
                              </>
                            )}

                            <label className="block mt-3 font-semibold text-green-800 text-sm">
                              {formData.projectType === 'pv' ? 'Puissance installée (kWc)' : 'Puissance de la PAC (kW)'}
                            </label>
                            <input
                              type="number"
                              name="power"
                              placeholder={formData.projectType === 'pv' ? "ex: 10" : "ex: 12"}
                              min="0"
                              step="0.1"
                              value={formData.power}
                              onChange={(e) => handleChange('power', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />
                            <p className="text-xs text-green-600 mt-1.5 block">
                              {formData.projectType === 'pv' ? 'Puissance en kWc (ex: petite installation 5 kWc, moyenne 10 kWc, grande 20 kWc+)' : 'Puissance en kW (ex: petite 8 kW, moyenne 12 kW, grande 20 kW+)'}
                            </p>

                            {(formData.projectType === 'pv' || formData.projectType === 'both') && (
                              <>
                                <label className="block mt-3 font-semibold text-green-800 text-sm">Type d’installation</label>
                                <select
                                  name="installationType"
                                  value={formData.installationType}
                                  onChange={(e) => handleChange('installationType', e.target.value)}
                                  className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                                >
                                  <option value="">Sélectionner...</option>
                                  <option value="toit-incline">Toit incliné</option>
                                  <option value="toit-plat">Toit plat</option>
                                  <option value="integre">Intégré au bâtiment</option>
                                  <option value="autre">Autre</option>
                                </select>

                                <label className="block mt-3 font-semibold text-green-800 text-sm">Autoconsommation prévue (%)</label>
                                <input
                                  type="number"
                                  name="autoconsommation"
                                  placeholder="ex: 30"
                                  min="0"
                                  max="100"
                                  value={formData.autoconsommation}
                                  onChange={(e) => handleChange('autoconsommation', e.target.value)}
                                  className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                                />
                              </>
                            )}

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Année de mise en service</label>
                            <select
                              name="serviceYear"
                              value={formData.serviceYear}
                              onChange={(e) => handleChange('serviceYear', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            >
                              <option value="2025">2025</option>
                              <option value="2026">2026</option>
                              <option value="2027">2027</option>
                            </select>

                            <label className="block mt-3 font-semibold text-green-800 text-sm">CECB / Certificat énergétique</label>
                            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer mt-1.5">
                              <input
                                type="checkbox"
                                name="hasCECB"
                                className="mr-2"
                                checked={formData.hasCECB}
                                onChange={(e) => handleChange('hasCECB', e.target.checked)}
                              />
                              Oui, certificat disponible
                            </label>

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
                              placeholder="Ex: Jean Dupont"
                              required
                              value={formData.fullname}
                              onChange={(e) => handleChange('fullname', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Email</label>
                            <input
                              type="email"
                              name="email"
                              placeholder="Ex: jean.dupont@example.com"
                              required
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <label className="block mt-3 font-semibold text-green-800 text-sm">Téléphone</label>
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Ex: +41 79 123 45 67"
                              required
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-gray-300 mt-1.5"
                            />

                            <div className="mt-3 flex flex-col lg:flex-row gap-1 justify-between">
                              <button
                                type="button"
                                className="block flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold"
                                onClick={() => handlePrev(3)}
                              >
                                ← Précédent
                              </button>
                              <button
                                type="submit"
                                className="block flex-1  px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold"
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
                          D'après vos informations (canton <strong>{formData.canton}</strong>, code postal <strong>{formData.postal || 'Non spécifié'}</strong>), l'estimation indicative est :
                        </p>
                        <ul className="space-y-1">
                          {simulatorResult.pvAid > 0 && (
                            <li>🔆 Panneaux solaires : <strong>CHF {simulatorResult.pvAid.toLocaleString('fr-CH')}</strong></li>
                          )}
                          {simulatorResult.hpAid > 0 && (
                            <li>🔥 Pompe à chaleur : <strong>CHF {simulatorResult.hpAid.toLocaleString('fr-CH')}</strong></li>
                          )}
                          {simulatorResult.communal > 0 && (
                            <li>🏘️ Prime communale estimée : <strong>CHF {simulatorResult.communal.toLocaleString('fr-CH')}</strong></li>
                          )}
                        </ul>
                        <p className="font-bold text-lg mt-2">
                          Total estimé : CHF {simulatorResult.total.toLocaleString('fr-CH')}
                        </p>
                        <p className="my-1.5 text-sm">
                          Ce résultat est indicatif. Un conseiller vérifiera les primes exactes (communes, conditions techniques, certificats).
                        </p>
                        {simulatorResult.notes && (
                          <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                            <strong>Conditions :</strong> {simulatorResult.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex flex-col lg:flex-row gap-2">
                        <a href="tel:+41211234567" className="block flex-1 px-4 py-2.5 rounded-lg bg-green-500 text-gray-900 font-bold flex-1 text-center">
                          Réserver un appel
                        </a>
                        <button
                          onClick={handleDownloadPDF}
                          className="block flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-bold flex-1 text-center"
                        >
                          Télécharger le rapport (PDF)
                        </button>
                      </div>

                      <button
                        onClick={() => setShowResult(false)}
                        className="mt-4 w-full flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-900 font-bold"
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