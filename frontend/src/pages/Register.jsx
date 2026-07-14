import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  function validateForm() {

  if (!fullName.trim()) {
    return "Le nom complet est obligatoire";
  }

  if (fullName.trim().length < 3) {
    return "Le nom doit contenir au moins 3 caractères";
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Adresse email invalide";
  }


  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }


  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir une lettre majuscule";
  }


  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir un chiffre";
  }


  if (!["candidate", "recruiter"].includes(role)) {
    return "Type de compte invalide";
  }


  return null;
}
async function handleSubmit(e) {

  e.preventDefault();

  setError('');


  const validationError = validateForm();

  if (validationError) {
    setError(validationError);
    return;
  }


  setLoading(true);


  try {

    const registeredUser = await register(
      fullName.trim(),
      email.trim(),
      password,
      role
    );

    navigate(registeredUser.role === 'manager' ? '/dashboard' : '/');


  } catch (err) {

    setError(
      err.response?.data?.error 
      || "Erreur lors de l'inscription"
    );


  } finally {

    setLoading(false);

  }
}

  return (
    <div className="
      min-h-screen 
      flex 
      items-center 
      justify-center 
      bg-gradient-to-br 
      from-blue-50 
      via-white 
      to-indigo-100
      px-4
    ">

      <form
        onSubmit={handleSubmit}
        className="
          w-full 
          max-w-md 
          bg-white 
          rounded-3xl 
          shadow-xl 
          p-8
          space-y-5
        "
      >

        <h1 className="
          text-3xl 
          font-bold 
          text-center 
          text-gray-800
        ">
          Créer un compte
        </h1>


        {error && (
          <div className="
            bg-red-100 
            text-red-700 
            px-4 
            py-3 
            rounded-lg
            text-sm
          ">
            {error}
          </div>
        )}


        {/* Nom complet */}
        <div>
          <label className="
            block 
            text-sm 
            font-medium 
            text-gray-700 
            mb-2
          ">
            Nom complet
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              outline-none
              transition
            "
          />
        </div>


        {/* Email */}
        <div>
          <label className="
            block 
            text-sm 
            font-medium 
            text-gray-700 
            mb-2
          ">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-blue-500
              outline-none
              transition
            "
          />
        </div>


        {/* Password */}
        <div>
          <label className="
            block 
            text-sm 
            font-medium 
            text-gray-700 
            mb-2
          ">
            Mot de passe
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              focus:ring-2
              focus:ring-blue-500
              outline-none
              transition
            "
          />
        </div>


        {/* Role */}
        <div>
          <label className="
            block 
            text-sm 
            font-medium 
            text-gray-700 
            mb-2
          ">
            Type de compte
          </label>

        </div>


        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            disabled:bg-gray-400
            transition
            duration-300
            shadow-md
          "
        >
          {loading ? "Création..." : "S'inscrire"}
        </button>


        <p className="
          text-center 
          text-gray-600
          text-sm
        ">
          Déjà un compte ?{' '}

          <Link
            to="/login"
            className="
              text-blue-600
              font-semibold
              hover:underline
            "
          >
            Se connecter
          </Link>

        </p>

      </form>

    </div>
  );
}
