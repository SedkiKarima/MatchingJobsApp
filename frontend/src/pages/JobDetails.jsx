import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';

function JobDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-48" />
        <div className="grid lg:grid-cols-3">
          <div className="lg:col-span-2 p-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="bg-gray-50 border-l p-8">
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/offers/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setError('Offre introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-600 font-medium">{error || 'Offre introuvable.'}</p>
        <Link to="/" className="text-sm text-indigo-600 font-medium hover:underline">
          ← Retour aux offres
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mb-4 px-1">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux offres
        </Link>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-10">
          <h1 className="text-4xl font-bold">{job.title}</h1>
          <h2 className="text-xl mt-2 opacity-90">{job.company}</h2>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-white/20 px-4 py-2 rounded-full">📍 {job.location}</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">💼 {job.contract}</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              {job.status === 'published' ? '✅ Publiée' : '📝 Brouillon'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2 p-8 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Description du poste</h2>
              <p className="text-gray-600 leading-8">
                {job.description || "Aucune description fournie pour cette offre."}
              </p>
            </section>

            {job.tags && job.tags.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Compétences recherchées</h2>
                <div className="flex flex-wrap gap-3">
                  {job.tags.map((tag) => (
                    <span key={tag} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-gray-50 border-l p-8">
            <div className="bg-white rounded-xl shadow p-6 space-y-5">
              <h2 className="text-xl font-bold">Aperçu de l'offre</h2>

              <div>
                <p className="text-sm text-gray-500">Type de contrat</p>
                <p className="font-semibold">{job.contract}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Localisation</p>
                <p className="font-semibold">{job.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Publiée le</p>
                <p className="font-semibold">
                  {new Date(job.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={() => navigate(`/condidat-form/${job.id}`)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-4 rounded-xl font-bold"
              >
                Postuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
