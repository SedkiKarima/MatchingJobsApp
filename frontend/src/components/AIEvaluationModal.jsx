export default function AIEvaluationModal({ result, onClose }) {
  if (!result) return null;

  const { candidateName, jobTitle, score, accepted, reasons, summary } = result;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Résultat de l'analyse IA</h2>
            <p className="text-sm text-gray-500">
              {candidateName} • {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${accepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {score}
          </div>
          <div>
            <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${accepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {accepted ? '✅ Profil retenu' : '❌ Profil non retenu'}
            </span>
            <p className="text-xs text-gray-400 mt-1">Score de compatibilité sur 100</p>
          </div>
        </div>

        {summary && (
          <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Pourquoi ce résultat</h3>
          <ul className="space-y-2">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
