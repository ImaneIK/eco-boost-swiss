import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/solarpumps.jpg";
import solarPanels from "@/assets/heat-pump.jpg";
import heatPump from "@/assets/heat-pump.jpg";
import happyFamily from "@/assets/happy-family.jpg";
import savings from "@/assets/savings3.jpeg";
import installation from "@/assets/installation.jpg";
import { Navigate, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ImprovedSubventionsSection from "@/components/ui/ImprovedSubventionsSection";
import emailjs from '@emailjs/browser';



export default function Index() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    projectType: "panneaux solaires",
    codepostal: "",
    surface: "",
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Simulator states
  const [simulatorForm, setSimulatorForm] = useState({
    type: "",
    codepostal: "",
    surface: "",
    cout: "",
  });
  const [simulatorResult, setSimulatorResult] = useState({
    federale: 0,
    cantonale: 0,
    total: 0,
    net: 0,
  });
  const [showSimulatorResult, setShowSimulatorResult] = useState(false);


  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Comparatifdevis - Devis subventionnés",
        "url": "https://devis-front.vercel.app/",
        "logo": "https://devis-front.vercel.app/favicon.ico"
      },
      {
        "@type": "WebPage",
        "name": "Devis subventionnés - Automatisation des devis B2B",
        "description": "Transformez vos devis en contrats signés. Plateforme automatisée pour créer, gérer et suivre vos devis B2B en Suisse Romande, UE et Afrique du Nord.",
        "url": "https://devis-front.vercel.app/"
      }
    ]
  };

  // 🧠 Restore form from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("quoteForm");
    if (saved) setForm(JSON.parse(saved));
  }, []);

useEffect(() => {
  emailjs.init("UgrE56x2fPhCSxUgK"); // Your EmailJS public key
}, []);



  // 🚀 Submission helper
  const submitForm = async (data: typeof form, clientId: string) => {
    try {
      setSubmitted(true);
    } catch (err: any) {
      alert("Une erreur est survenue, réessayez plus tard.");
    }
  };

  const validateForm = () => {
  const newErrors:any = {};

  if (!form.projectType) newErrors.projectType = 'Veuillez sélectionner un type de projet';
  if (!form.codepostal) newErrors.codepostal = 'Veuillez indiquer votre code postal / région';
  if (!form.details || form.details.trim().length < 10) newErrors.details = 'La description doit faire au moins 10 caractères';
  if (!form.name || form.name.trim().length < 2) newErrors.name = 'Le nom doit faire au moins 2 caractères';
  if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Veuillez entrer un email valide';
  if (!form.phone || form.phone.length < 10) newErrors.phone = 'Veuillez entrer un numéro de téléphone valide';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // 📬 Form submit click
const handleSubmit = async (e: React.FormEvent) => { // Added type for TS
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start loading

    const templateParams = {
      submittedAt: new Date().toISOString(),
      projectType: form.projectType,
      codepostal: form.codepostal,
      details: form.details,
      name: form.name,
      email: form.email,
      phone: form.phone
    };

    try {
      // FIXED: Second param is Template ID (not Public Key!)
      const response = await emailjs.send(
        'service_m2f6pta',        // Your Service ID
        'template_8so6cuj',       // <-- REPLACE: e.g., 'template_abc123' from dashboard
        templateParams
      );
      console.log('Email sent successfully!', response, response.status, response.text);
      
      setSubmitted(true); // Hide form, show success
      setForm({ projectType: '', codepostal: '', details: '', surface: '', name: '', email: '', phone: '' });
      setErrors({});
      
      alert('Devis envoyés avec succès ! Vous recevrez une réponse sous 24h.');
      
    } catch (error) {
      console.error('Failed to send email:', error); // Check this in console!
      alert('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
    } finally {
      setLoading(false); // Stop loading
    }
  };



  

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth" });


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {submitted && <div>Devis soumis ! Redirection vers votre tableau de bord...</div>}
 
 {/* header */}
 <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 p-1 bg-gray-100 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  <img src="/logo.png" alt="Logo Comparatifdevis" className="w-6 h-6" />
          </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-green-600">
            Comparatifdevis.ch
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Photovoltaïque & Pompes à chaleur — Suisse romande
          </p>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 items-center text-sm">
        <a
          className="text-muted-foreground hover:text-foreground transition-colors"
          href="#how"
        >
          Comment ça marche
        </a>
        <a
          className="text-muted-foreground hover:text-foreground transition-colors"
          href="#subventions"
        >
          Subventions
        </a>
        <a
          className="text-muted-foreground hover:text-foreground transition-colors"
          href="#testimonials"
        >
          Témoignages
        </a>

       
          <button
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
            onClick={scrollToForm}
          >
           Profitez-en
          </button>
        
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-muted/20 transition"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-card/95 backdrop-blur-sm md:hidden shadow-lg border-t border-border/50 flex flex-col items-center gap-4 py-4 z-40">
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#how"
            onClick={() => setMobileOpen(false)}
          >
            Comment ça marche
          </a>
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#subventions"
            onClick={() => setMobileOpen(false)}
          >
            Subventions
          </a>
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#testimonials"
            onClick={() => setMobileOpen(false)}
          >
            Témoignages
          </a>

         
            <a
              href="#form"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
              onClick={() => {
                navigate("#form");
                setMobileOpen(false);
              }}
            >
              Profitez-en
            </a>
        </div>
      )}
    </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ backgroundImage: 'var(--texture-dots)', backgroundSize: 'var(--texture-size)' }}></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
          <section className="space-y-6">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🌱 Passez à l'énergie durable
            </motion.h2>
              <motion.p
              className="text-base sm:text-lg text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Que vous soyez <strong className="text-foreground">particulier</strong> ou <strong className="text-foreground">entreprise</strong>, bénéficiez des{" "}
              <strong className="text-foreground">aides et subventions suisses</strong> pour vos{" "}
              <strong className="text-foreground">panneaux solaires</strong> ou votre{" "}
              <strong className="text-foreground">pompe à chaleur</strong>. 
              Faites un geste pour la planète tout en réduisant vos coûts énergétiques.
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Recevez jusqu'à <strong className="text-foreground">4 devis gratuits</strong> de
              prestataires qualifiés en Suisse romande. Comparez, choisissez et économisez —
              facilement et sans engagement.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <a
                href="#form"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                📩 Obtenir mes devis gratuits
              </a>
              <a
                href="#subventions"
                className="inline-flex items-center justify-center gap-2 border-2 border-border bg-card px-6 py-4 rounded-xl font-semibold hover:bg-accent transition-colors"
              >
                🔎 Vérifier mes aides disponibles
              </a>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="p-5 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-foreground">⚡ Réponse en 48h</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Devis détaillés et personnalisés.
                </p>
              </div>
              <div className="p-5 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-foreground">✅ Prestataires certifiés</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vérifiés et notés par nos équipes.
                </p>
              </div>
              <div className="p-5 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-foreground">💰 Économies garanties</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Aides cantonales et fédérales identifiées pour vous.
                </p>
              </div>
              <div className="p-5 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-foreground">🔓 Sans engagement</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous gardez le contrôle, on vous accompagne.
                </p>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <img
                alt="Maison suisse avec panneaux solaires"
                src={heroImage}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </motion.div>
          </section>

          {/* Form Section */}
          <aside ref={formRef}
            id="form"
            className="bg-card p-6 sm:p-8 rounded-2xl shadow-xl border border-border sticky top-24"
          >
            <h3 className="text-2xl font-bold text-foreground">Recevez vos devis subventionnés</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Remplissez ce formulaire rapide — on s'occupe du reste.
            </p>

            {submitted ? (
              <motion.div
                className="mt-6 p-5 bg-accent rounded-xl border-2 border-primary"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <strong className="text-primary text-lg">✨ Merci !</strong>
                <p className="text-sm text-muted-foreground mt-2">
                  Votre demande a bien été enregistrée. Nous revenons vers vous sous 48h avec des
                  devis.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Type de projet
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="panneaux solaires">Panneaux solaires</option>
                    <option value="pompe à chaleur">Pompe à chaleur</option>
                    {/* <option value="les deux">Les deux</option> */}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Code Postal</label>
                  <input
                    value={form.codepostal}
                    onChange={(e) => setForm({ ...form, codepostal: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="ex: Vaud, Genève, Fribourg"
                  />
                  {errors.codepostal && (
                    <p className="text-destructive text-xs mt-1">{errors.codepostal}</p>
                  )}
                </div>

                {/* <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Surface de toit / logement (m²)
                  </label>
                  <input
                    value={form.surface}
                    onChange={(e) => setForm({ ...form, surface: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Optionnel"
                  />
                </div> */}

                {/* description du projet (details) */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Description du projet</label>
                  <textarea
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Décrivez votre projet en détail"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Nom</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-4 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  🚀 Recevoir mes devis gratuits
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  En soumettant, vous acceptez notre politique de confidentialité. Service gratuit
                  et sans engagement.
                </p>
              </form>
            )}
          </aside>
        </div>
      </main>

      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(ldJson)}
      </script>

      {/* How it Works Section */}
      <section id="how" className="bg-accent/30 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Comment ça marche ?
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={solarPanels} alt="Panneaux solaires" className="w-full h-48 object-cover" />
              </div>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Décrivez votre projet</h4>
              <p className="text-sm text-muted-foreground">
                Dites-nous quel projet : panneaux solaires ou pompe à chaleur. Plus de détails =
                devis plus précis.
              </p>
            </motion.div>

            <motion.div
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={installation} alt="Installation professionnelle" className="w-full h-48 object-cover" />
              </div>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Nous sélectionnons</h4>
              <p className="text-sm text-muted-foreground">
                3 à 4 prestataires certifiés et qualifiés près de chez vous.
              </p>
            </motion.div>

            <motion.div
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={savings} alt="Économies" className="w-full h-48 object-cover" />
              </div>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Comparez & économisez</h4>
              <p className="text-sm text-muted-foreground">
                Recevez les devis sous 48h et découvrez quelles aides s'appliquent pour réduire le
                coût final.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subventions Section with Integrated Simulator */}
      <section id="subventions" className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={heatPump} alt="" className="w-full h-full object-cover" />
        </div>
       

       
      
        {/* Integrated Simulator */}
        <ImprovedSubventionsSection />
        
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Ils ont économisé — témoignages
          </motion.h3>
          <motion.p
            className="text-center text-muted-foreground mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Des milliers de Suisses romands ont déjà fait confiance à notre service
          </motion.p>

          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img src={happyFamily} alt="Famille heureuse" className="w-full h-80 object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.blockquote
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-primary text-4xl mb-4">"</div>
              <p className="text-muted-foreground mb-6">
                "Grâce à ce service, j'ai reçu 4 devis pour mon installation solaire à Lausanne.
                J'ai économisé <strong className="text-foreground">12 000 CHF</strong> grâce aux
                subventions !"
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  M
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Marc</div>
                  <div className="text-xs text-muted-foreground">Lausanne</div>
                </div>
              </footer>
            </motion.blockquote>

            <motion.blockquote
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-primary text-4xl mb-4">"</div>
              <p className="text-muted-foreground mb-6">
                "J'ai remplacé ma vieille chaudière par une pompe à chaleur. Entre les aides
                cantonales et la prime, j'ai couvert plus de{" "}
                <strong className="text-foreground">40%</strong> des frais."
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  C
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Claire</div>
                  <div className="text-xs text-muted-foreground">Genève</div>
                </div>
              </footer>
            </motion.blockquote>

            <motion.blockquote
              className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-primary text-4xl mb-4">"</div>
              <p className="text-muted-foreground mb-6">
                "Tout a été simple : j'ai rempli le formulaire, j'ai reçu mes devis, et choisi le
                meilleur en 3 jours."
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  T
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Thomas</div>
                  <div className="text-xs text-muted-foreground">Fribourg</div>
                </div>
              </footer>
            </motion.blockquote>
          </div>
        </div>

        </section>

     

      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className=" bg-gray-100 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  <img src="/logo_footer.png" alt="Logo Comparatifdevis" className="w-auto h-24 rounded-lg" />
                </div>
                
              </div>
              <strong className="text-lg text-green-600">Comparatifdevis.ch</strong>
              <p className="text-sm text-muted-foreground">
                Service de mise en relation — prestation gratuite
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">
                Avenue de Tivoli 19bis – 1007 Lausanne
              </a>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">
                Politique de confidentialité
              </a>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">
                Contact
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground border-t border-border pt-6">
            Les montants et aides indiqués sont à titre indicatif. Les aides réelles dépendent du
            codepostal et de la situation du demandeur.
          </p>
        </div>
      </footer>
    </div>
  );
}