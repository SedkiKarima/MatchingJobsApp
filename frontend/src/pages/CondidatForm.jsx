import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  whatsapp: true,
  linkedin: '',
  portfolio: '',
  message: '',
};

export default function CondidatForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/offers/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setJob(null));
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleCvChange(e) {
    setCvFile(e.target.files[0] || null);
  }

  function validate() {
    if (!form.nom.trim()) return 'Le nom est obligatoire';
    if (!form.prenom.trim()) return 'Le prénom est obligatoire';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Adresse email invalide";
    if (!form.telephone.trim()) return 'Le numéro de téléphone est obligatoire';
    if (!cvFile) return 'Merci de joindre votre CV';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('nom', form.nom.trim());
      formData.append('prenom', form.prenom.trim());
      formData.append('email', form.email.trim());
      formData.append('telephone', form.telephone.trim());
      formData.append('whatsapp', form.whatsapp);
      formData.append('linkedin', form.linkedin.trim());
      formData.append('portfolio', form.portfolio.trim());
      formData.append('message', form.message.trim());
      formData.append('cv', cvFile);

      await apiClient.post('/applications', formData);

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi de la candidature");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h1 className="text-xl font-bold text-gray-900">Candidature envoyée !</h1>
          <p className="text-sm text-gray-500">
            Votre candidature {job ? <>pour <strong>{job.title}</strong></> : ''} a bien été transmise au recruteur.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto mb-4">
        <Link to={`/job-details/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'offre
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Postuler à cette offre</h1>
          {job ? (
            <p className="text-sm text-gray-500 mt-1">
              {job.title} • <span className="text-gray-400">{job.company}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Chargement de l'offre...</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Nom / Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Nom *</span>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Votre nom de famille"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Prénom *</span>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </label>
        </div>

        {/* Email */}
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Adresse email *</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="vous@exemple.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        {/* Téléphone */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 px-3 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-600 shrink-0">
              🇲🇦 +212
            </span>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
          <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="whatsapp"
              checked={form.whatsapp}
              onChange={handleChange}
              className="h-4 w-4 rounded accent-green-600"
            />
            J'utilise ce numéro sur WhatsApp
          </label>
        </div>

        {/* CV */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">CV *</span>
          {cvFile ? (
            <div className="flex items-center justify-between gap-3 border border-gray-300 rounded-xl px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{cvFile.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setCvFile(null)}
                className="text-xs font-semibold text-red-600 hover:underline shrink-0"
              >
                Retirer
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3" />
              </svg>
              <span className="text-sm text-gray-500">Ajouter votre CV (PDF, DOC)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* LinkedIn */}
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Profil LinkedIn</span>
          <input
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/votre-profil"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        {/* Portfolio */}
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Portfolio (optionnel)</span>
          <input
            type="url"
            name="portfolio"
            value={form.portfolio}
            onChange={handleChange}
            placeholder="https://votre-portfolio.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        {/* Message */}
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Pourquoi êtes-vous le bon profil pour ce poste ?</span>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Quelques lignes pour vous présenter..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:bg-gray-400"
        >
          {submitting ? 'Envoi en cours...' : 'Continuer'}
        </button>
      </form>
    </div>
  );
}
