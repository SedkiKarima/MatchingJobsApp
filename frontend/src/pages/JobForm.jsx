import { useState } from 'react';
import apiClient from '../api/client';

const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Freelance'];

function toFormState(initialData) {
  return {
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    contract: initialData?.contract || 'CDI',
    description: initialData?.description || '',
    status: initialData?.status || 'draft',
    tags: (initialData?.tags || []).join(', '),
  };
}

export default function JobForm({ initialData, onCancel, onSubmitSuccess }) {
  const [job, setJob] = useState(() => toFormState(initialData));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData?.id);

  function handleChange(e) {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (job.title.trim().length < 5) return 'Le titre doit contenir au moins 5 caractères.';
    if (job.company.trim().length < 2) return "Nom de l'entreprise invalide.";
    if (!job.location.trim()) return 'Veuillez saisir la localisation.';
    if (job.description.trim().length < 20) return 'La description est trop courte (min. 20 caractères).';
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

    const payload = {
      title: job.title.trim(),
      company: job.company.trim(),
      location: job.location.trim(),
      contract: job.contract,
      description: job.description.trim(),
      status: job.status,
      tags: job.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      const { data } = isEditing
        ? await apiClient.put(`/offers/${initialData.id}`, payload)
        : await apiClient.post('/offers', payload);
      onSubmitSuccess(data.offer);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer l'offre.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        {isEditing ? "Modifier l'offre" : 'Créer une offre'}
      </h1>

      {error && <p className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Titre du poste *</span>
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Entreprise *</span>
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        <div className="grid grid-cols-2 gap-5">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Localisation *</span>
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Type de contrat *</span>
            <select
              name="contract"
              value={job.contract}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              {CONTRACT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Description *</span>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Compétences (séparées par des virgules)</span>
          <input
            type="text"
            name="tags"
            value={job.tags}
            onChange={handleChange}
            placeholder="React, Node.js, MySQL"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Visibilité *</span>
          <select
            name="status"
            value={job.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publiée</option>
          </select>
        </label>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:bg-gray-400"
          >
            {submitting ? 'Enregistrement...' : isEditing ? "Enregistrer les modifications" : "Créer l'offre"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
