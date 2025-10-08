import React, { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-solar.jpg";
import solarPanels from "@/assets/solar-panels.jpg";
import heatPump from "@/assets/heat-pump.jpg";
import happyFamily from "@/assets/happy-family.jpg";
import savings from "@/assets/savings.jpg";
import installation from "@/assets/installation.jpg";

export default function Index() {
  const [form, setForm] = useState({
    projectType: "photovoltaic",
    canton: "",
    surface: "",
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.canton) e.canton = "Indiquez votre canton";
    if (!form.name) e.name = "Votre prénom est requis";
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Email invalide";
    if (!form.phone) e.phone = "Téléphone requis";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setForm({
          projectType: form.projectType,
          canton: "",
          surface: "",
          name: "",
          email: "",
          phone: "",
        });
        setSubmitted(false);
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
            AH
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground">
              AH Digital — Devis subventionnés
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Photovoltaïque & Pompes à chaleur — Suisse romande
            </p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <a className="text-muted-foreground hover:text-foreground transition-colors" href="#how">
            Comment ça marche
          </a>
          <a className="text-muted-foreground hover:text-foreground transition-colors" href="#subventions">
            Subventions
          </a>
          <a className="text-muted-foreground hover:text-foreground transition-colors" href="#testimonials">
            Témoignages
          </a>
          <a
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
            href="#form"
          >
            Obtenir mes devis
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <section className="space-y-6">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Installez des panneaux solaires ou une pompe à chaleur —{" "}
              <span className="text-primary">payez moins grâce aux subventions</span>
            </motion.h2>

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
          <aside
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
                    <option value="photovoltaic">Panneaux solaires</option>
                    <option value="heatpump">Pompe à chaleur</option>
                    <option value="both">Les deux</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Canton</label>
                  <input
                    value={form.canton}
                    onChange={(e) => setForm({ ...form, canton: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="ex: Vaud, Genève, Fribourg"
                  />
                  {errors.canton && (
                    <p className="text-destructive text-xs mt-1">{errors.canton}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Surface de toit / logement (m²)
                  </label>
                  <input
                    value={form.surface}
                    onChange={(e) => setForm({ ...form, surface: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Optionnel"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Prénom</label>
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

      {/* Subventions Section */}
      <section id="subventions" className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={heatPump} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="bg-gradient-to-br from-accent to-card p-8 sm:p-12 rounded-3xl shadow-2xl border border-border"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Subventions & aides disponibles
            </h3>
            <p className="text-base text-muted-foreground mb-8">
              Les aides varient selon le canton. Exemples :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">🏛️</div>
                <h5 className="font-bold text-foreground mb-2">Aides cantonales</h5>
                <p className="text-xs text-muted-foreground">
                  Peuvent couvrir jusqu'à 20–30% du projet selon le canton.
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">🇨🇭</div>
                <h5 className="font-bold text-foreground mb-2">Programmes fédéraux</h5>
                <p className="text-xs text-muted-foreground">
                  SuisseEnergie et autres primes pour l'efficacité énergétique.
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">♨️</div>
                <h5 className="font-bold text-foreground mb-2">Primes pour pompes à chaleur</h5>
                <p className="text-xs text-muted-foreground">
                  Aides spécifiques pour remplacement de chaudières anciennes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#form"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Vérifier mes aides
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border-2 border-border bg-card px-6 py-3 rounded-xl font-semibold hover:bg-accent transition-colors"
              >
                En savoir plus
              </a>
            </div>
          </motion.div>
        </div>
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  AH
                </div>
                <strong className="text-lg text-foreground">AH Digital</strong>
              </div>
              <p className="text-sm text-muted-foreground">
                Service de mise en relation — prestation gratuite
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">
                Mentions légales
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
            canton et de la situation du demandeur.
          </p>
        </div>
      </footer>
    </div>
  );
}
