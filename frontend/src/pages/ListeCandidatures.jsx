import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import JobForm from './JobForm'; // Import de votre composant JobForm

const funnelData = [
  { name: 'Sourcing', candidats: 145, pourcentage: 100 },
  { name: 'Tri CV', candidats: 92, pourcentage: 63 },
  { name: 'Entretiens', candidats: 48, pourcentage: 33 },
  { name: 'Offres', candidats: 12, pourcentage: 8 },
  { name: 'Embauches', candidats: 6, pourcentage: 4 },
];

function getStatutStyle(statut) {
  switch (statut) {
    case 'Accepté': return 'bg-green-100 text-green-800';
    case 'Refusé': return 'bg-red-100 text-red-800';
    case 'Pas encore traité': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function initialsOf(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function DashboardRH() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // États pour la recherche et le filtre global de l'onglet candidats
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('Tous');

  // Utilisation d'un State pour les candidatures pour garantir la réactivité dans React
  const [candidatures, setCandidatures] = useState([
    {
      id: 1,
      nom: "Amine Benjelloun",
      poste: "Développeur Fullstack React/Node",
      entreprise: "Airbus Atlantic Maroc",
      date: "09 Juillet 2026",
      statut: "Pas encore traité",
      email: "amine.b@example.com",
      initiaux: "AB"
    },
    {
      id: 2,
      nom: "Youssef El Alami",
      poste: "Développeur Web / React Native",
      entreprise: "Ingenexa",
      date: "02 Juillet 2026",
      statut: "Pas encore traité",
      email: "youssef.alami@example.com",
      initiaux: "YE"
    },
    {
      id: 3,
      nom: "Sarah Martin",
      poste: "Développeur Mobile (Expo / React Native)",
      entreprise: "IT ROAD",
      date: "15 Juin 2026",
      statut: "Pas encore traité",
      email: "sarah.m@example.com",
      initiaux: "SM"
    },
    {
      id: 4,
      nom: "Thomas Dubois",
      poste: "Stagiaire Développeur (PFE)",
      entreprise: "NEMO",
      date: "05 Juin 2026",
      statut: "Refusé",
      email: "thomas.d@example.com",
      initiaux: "TD"
    },
    {
      id: 5,
      nom: "Yasmine Alami",
      poste: "Stagiaire Business Analyst / IT",
      entreprise: "YT Consulting",
      date: "28 Mai 2026",
      statut: "Refusé",
      email: "yasmine.a@example.com",
      initiaux: "YA"
    },
    {
      id: 6,
      nom: "Karim Tazi",
      poste: "Développeur Front-end (React/Tailwind)",
      entreprise: "Viveris",
      date: "12 Juillet 2026",
      statut: "Accepté",
      email: "karim.tazi@example.com",
      initiaux: "KT"
    }
  ]);

  // États pour la gestion des offres d'emploi
  const [jobView, setJobView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([
    { id: 1, title: "Développeur Fullstack React/Node", company: "TechCorp", location: "Paris (Remote)", salary: "45000", contractType: "Full Time" },
    { id: 2, title: "Product Designer (UI/UX)", company: "Design Agency", location: "Lyon", salary: "38000", contractType: "Full Time" },
    { id: 3, title: "DevOps Engineer", company: "Cloud Solutions", location: "Casablanca", salary: "55000", contractType: "Full Time" },
  ]);

  const firstName = user.full_name.split(' ')[0];

  // Déclencher l'édition d'un job
  const handleEditClick = (job) => {
    setSelectedJob(job);
    setJobView('edit');
  };

  // Filtrage dynamique basé sur le State réactif
  const filteredCandidatures = candidatures.filter((candidat) => {
    const matchesSearch = 
      candidat.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      candidat.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = filtreStatut === 'Tous' || candidat.statut === filtreStatut;

    return matchesSearch && matchesStatut;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">

      {/* 1. BARRE LATÉRALE (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">HirePulse</span>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Tableau de bord
            </button>
            <button
              onClick={() => {
                setActiveMenu('offres');
                setJobView('list');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'offres' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Offres d'emploi
            </button>
            <button
              onClick={() => setActiveMenu('candidats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'candidats' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Candidats
            </button>
            <button
              onClick={() => setActiveMenu('entretiens')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'entretiens' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Entretiens
            </button>
          </nav>
        </div>

        {/* Profil connecté */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold shrink-0">
            {initialsOf(user.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.role === 'manager' ? 'Recruteur' : 'Candidat'}</p>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </aside>

      {/* ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* 2. EN-TÊTE (HEADER) */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-80">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher un candidat, un poste..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative bg-gray-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* 3. CORPS DU DASHBOARD */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">

          {/* VUE 1 : DASHBOARD PRINCIPAL */}
          {activeMenu === 'dashboard' && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-950">Bonjour {firstName} 👋</h1>
                <p className="text-gray-500 text-sm mt-1">Voici le suivi de vos recrutements pour aujourd'hui.</p>
              </div>

              {/* Cartes de statistiques (KPI Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-sm text-gray-500 font-medium">Offres actives</span>
                    <p className="text-2xl font-bold">{jobs.length}</p>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">↑ +2 cette semaine</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-sm text-gray-500 font-medium">Candidatures reçues</span>
                    <p className="text-2xl font-bold">297</p>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">↑ +12% vs mois dernier</span>
                  </div>
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-sm text-gray-500 font-medium">Entretiens prévus</span>
                    <p className="text-2xl font-bold">8</p>
                    <span className="text-xs text-gray-400 font-medium">Aujourd'hui & demain</span>
                  </div>
                  <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-sm text-gray-500 font-medium">Taux de conversion</span>
                    <p className="text-2xl font-bold">4%</p>
                    <span className="text-xs text-gray-400 font-medium">Sourcing → Embauche</span>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Pipeline de recrutement */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-5">Pipeline de recrutement</h2>
                  <div className="space-y-4">
                    {funnelData.map((step) => (
                      <div key={step.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{step.name}</span>
                          <span className="font-medium text-gray-900">{step.candidats}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${step.pourcentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidats récents réels et dynamiques */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Candidats récents</h2>
                    <button 
                      onClick={() => setActiveMenu('candidats')}
                      className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                      Voir tout
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100 mt-4">
                    {candidatures.slice(0, 4).map((candidat) => (
                      <li key={candidat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/40 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold shrink-0">
                          {candidat.initiaux}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{candidat.nom}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {candidat.poste} • <span className="font-semibold text-gray-400">{candidat.entreprise}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatutStyle(candidat.statut)}`}>
                          {candidat.statut}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                          {candidat.date.split(' ')[0]} {candidat.date.split(' ')[1] || ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* VUE 2 : ONGLETS DES OFFRES D'EMPLOI */}
          {activeMenu === 'offres' && (
            <div className="space-y-6">
              
              {/* --- SOUS-VUE : LISTE DES OFFRES --- */}
              {jobView === 'list' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-950">Offres d'emploi</h1>
                      <p className="text-gray-500 text-sm mt-1">Gérez vos publications de postes.</p>
                    </div>
                    <button
                      onClick={() => setJobView('create')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      Créer une offre
                    </button>
                  </div>

                  {/* Tableau des offres */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full border-collapse text-left text-sm text-gray-500">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 font-medium">Poste</th>
                          <th className="px-6 py-4 font-medium">Entreprise</th>
                          <th className="px-6 py-4 font-medium">Localisation</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-900 block">{job.title}</span>
                              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                {job.contractType || 'Full Time'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{job.company}</td>
                            <td className="px-6 py-4 text-gray-500">{job.location}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setActiveMenu('candidats');
                                    setSearchTerm(job.title);
                                  }}
                                  className="text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
                                >
                                  Voir candidature
                                </button>
                                <button
                                  onClick={() => handleEditClick(job)}
                                  className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- SOUS-VUE : CRÉER UNE OFFRE --- */}
              {jobView === 'create' && (
                <div>
                  <button
                    onClick={() => setJobView('list')}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Retour aux offres
                  </button>
                  <JobForm 
                    onCancel={() => setJobView('list')} 
                    onSubmitSuccess={(newJob) => {
                      setJobs(prev => [...prev, { ...newJob, id: Date.now() }]);
                      setJobView('list');
                    }}
                  />
                </div>
              )}

              {/* --- SOUS-VUE : ÉDITER UNE OFFRE --- */}
              {jobView === 'edit' && (
                <div>
                  <button
                    onClick={() => {
                      setJobView('list');
                      setSelectedJob(null);
                    }}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Retour aux offres
                  </button>
                  <JobForm 
                    initialData={selectedJob} 
                    onCancel={() => {
                      setJobView('list');
                      setSelectedJob(null);
                    }} 
                    onSubmitSuccess={(updatedJob) => {
                      setJobs(prev => prev.map(item => item.id === selectedJob.id ? { ...item, ...updatedJob } : item));
                      setSelectedJob(null);
                      setJobView('list');
                    }}
                  />
                </div>
              )}

            </div>
          )}

          {/* VUE 3 : INTERFACE DE GESTION DES CANDIDATS */}
          {activeMenu === 'candidats' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">Suivi des Candidatures</h1>
                <p className="text-gray-500 text-sm mt-1">Consultez l'état d'avancement des profils postulants.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Rechercher un candidat, poste..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Filtres mis à jour de manière dynamique */}
                  <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['Tous', 'Pas encore traité', 'Accepté', 'Refusé'].map((statut) => (
                      <button
                        key={statut}
                        onClick={() => setFiltreStatut(statut)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          filtreStatut === statut
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {statut}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tableau principal */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Candidat</th>
                        <th className="px-6 py-4 font-medium">Poste visé</th>
                        <th className="px-6 py-4 font-medium">Entreprise</th>
                        <th className="px-6 py-4 font-medium">Date d'application</th>
                        <th className="px-6 py-4 font-medium text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCandidatures.length > 0 ? (
                        filteredCandidatures.map((candidat) => (
                          <tr key={candidat.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold shrink-0 text-sm">
                                {candidat.initiaux}
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-gray-900 block truncate">{candidat.nom}</span>
                                <span className="text-xs text-gray-400 block truncate">{candidat.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{candidat.poste}</td>
                            <td className="px-6 py-4 text-gray-500">{candidat.entreprise}</td>
                            <td className="px-6 py-4 text-gray-400">{candidat.date}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getStatutStyle(candidat.statut)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  candidat.statut === 'Accepté' ? 'bg-green-500' :
                                  candidat.statut === 'Refusé' ? 'bg-red-500' :
                                  'bg-yellow-500'
                                }`} />
                                {candidat.statut}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                            Aucun candidat trouvé pour ces critères de recherche.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VUES TEMPORAIRES POUR AUTRES ONGLETS */}
          {activeMenu === 'entretiens' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h1 className="text-2xl font-bold">Planification des Entretiens</h1>
              <p className="text-gray-500 mt-2">Section entretiens en cours de développement...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}