import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Retour</span>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
            </div>
            <div className="w-10" /> {/* Spacer for symmetry */}
          </div>
          <p className="text-center mt-2 opacity-90">Comparatifdevis.ch</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Last Update */}
        <div className="mb-8 p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
          <p className="text-sm font-semibold text-green-800">
            <strong>Dernière mise à jour :</strong> 25 octobre 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Comparatifdevis.ch (“nous”, “notre” ou “le site”) s'engage à protéger votre vie privée et vos données personnelles. 
            Cette politique explique quelles informations nous collectons, comment elles sont utilisées et vos droits concernant ces données.
          </p>
        </section>

        {/* Sections */}
        <section className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">1. Informations que nous collectons</h2>
            <p className="text-gray-600 mb-4">
              Lorsque vous utilisez notre site pour recevoir des devis pour panneaux solaires ou pompes à chaleur, 
              nous pouvons collecter les informations suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Informations de contact</strong> : nom, prénom, adresse email, numéro de téléphone.</li>
              <li><strong>Informations sur le projet</strong> : type de projet (panneaux solaires, pompe à chaleur ou les deux), 
                code postal, type de bâtiment, puissance estimée, système actuel, détails spécifiques.</li>
              <li><strong>Données techniques</strong> : votre adresse IP, type de navigateur, pages visitées, interactions avec le site.</li>
              <li><strong>Autres informations</strong> : réponses fournies dans le simulateur d’aides, préférences et consentements.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">2. Utilisation des informations</h2>
            <p className="text-gray-600 mb-4">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Fournir le service de mise en relation avec des prestataires certifiés.</li>
              <li>Générer des estimations et des rapports personnalisés d’aides et subventions.</li>
              <li>Communiquer avec vous concernant vos demandes et vos devis.</li>
              <li>Améliorer et personnaliser notre site et nos services.</li>
              <li>Respecter nos obligations légales.</li>
            </ul>
            <p className="text-gray-600 mt-4 font-semibold">
              Nous ne vendons, n’échangeons ni ne louons vos données personnelles à des tiers.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">3. Partage des données</h2>
            <p className="text-gray-600 mb-4">
              Vos informations peuvent être partagées avec :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Prestataires partenaires</strong> : pour vous envoyer les devis correspondant à votre projet.</li>
              <li><strong>Outils tiers</strong> : comme EmailJS pour l’envoi de vos rapports par email et n8n pour la transmission sécurisée des données aux prestataires.</li>
              <li><strong>Autorités légales</strong> : si la loi l’exige ou pour protéger nos droits.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Tous nos partenaires sont tenus de respecter la confidentialité et de sécuriser vos données.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">4. Conservation des données</h2>
            <p className="text-gray-600 mb-4">
              Nous conservons vos informations uniquement le temps nécessaire pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Traiter votre demande de devis.</li>
              <li>Maintenir les obligations légales ou comptables.</li>
              <li>Améliorer nos services et analyses internes (données anonymisées).</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vous pouvez demander la suppression de vos données à tout moment (voir section 7).
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">5. Sécurité des données</h2>
            <p className="text-gray-600">
              Nous prenons des mesures techniques et organisationnelles pour protéger vos informations contre tout accès non autorisé, 
              perte, modification ou divulgation.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">6. Cookies et technologies similaires</h2>
            <p className="text-gray-600 mb-4">
              Notre site peut utiliser des cookies et des technologies similaires pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Mesurer et analyser l’utilisation du site.</li>
              <li>Préférences utilisateur et personnalisation.</li>
              <li>Optimiser l’expérience et la performance du site.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vous pouvez gérer vos préférences de cookies via votre navigateur.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">7. Vos droits</h2>
            <p className="text-gray-600 mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Accéder à vos données personnelles.</li>
              <li>Demander la correction ou la suppression de vos données.</li>
              <li>Retirer votre consentement à tout moment.</li>
              <li>Vous opposer au traitement de vos données ou demander leur limitation.</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Pour exercer vos droits, contactez-nous à :{' '}
              <a href="mailto:contact@comparatifdevis.com " className="text-green-600 hover:underline font-semibold">
                contact@comparatifdevis.com 
              </a>
            </p>
          </div>

          {/* Section 8 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">8. Consentement</h2>
            <p className="text-gray-600">
              En utilisant notre site et en soumettant vos informations, vous acceptez cette politique de confidentialité 
              et consentez au traitement de vos données tel que décrit ci-dessus.
            </p>
          </div>

          {/* Section 9 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">9. Modifications de la politique</h2>
            <p className="text-gray-600">
              Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. 
              La date de dernière mise à jour sera indiquée en haut de cette page.
            </p>
          </div>

          {/* Section 10 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-4">10. Contact</h2>
            <p className="text-gray-600 mb-4">
              Pour toute question concernant cette politique ou le traitement de vos données :
            </p>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="font-semibold text-green-800">Comparatifdevis.ch</p>
              <p className="text-gray-700">Avenue de Tivoli 19bis – 1007 Lausanne</p>
              <p className="mt-2">
                📧{' '}
                <a href="contact@comparatifdevis.com " className="text-green-600 hover:underline font-semibold">
                  contact@comparatifdevis.com 
                </a>
              </p>
            </div>
          </div>
        </section>

        
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Comparatifdevis.ch. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;