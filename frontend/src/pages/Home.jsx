import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

export default function Home() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get('/offers?status=published')
      .then(({ data }) => setOffers(data))
      .catch(() => setError('Impossible de charger les offres pour le moment.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredOffers = offers.filter((offer) =>
    `${offer.title} ${offer.location} ${(offer.tags || []).join(' ')}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tight text-gray-900">HirePulse</Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'manager' && (
                <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
                  Tableau de bord
                </Link>
              )}
              <span className="text-sm text-gray-600 hidden sm:block">{user.full_name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 tracking-tight">
            Trouvez un emploi qui a du sens
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            Découvrez des offres qui correspondent à vos compétences et à vos ambitions.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <span className="absolute left-4 top-3.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Poste, compétence, ville..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* LISTE DES OFFRES */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Toutes les offres ({filteredOffers.length})
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Chargement des offres...</p>
        ) : error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : filteredOffers.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune offre ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    {offer.company[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{offer.title}</p>
                    <p className="text-sm text-gray-500 truncate">{offer.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(offer.tags || []).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>{offer.location}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{offer.contract}</span>
                </div>

                <button
                  onClick={() => navigate(`/job-details/${offer.id}`)}
                  className="mt-2 w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Postuler
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
