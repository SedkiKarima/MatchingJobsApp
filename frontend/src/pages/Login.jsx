import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();


  function validateForm() {

    if (!email.trim()) {
      return "L'email est obligatoire";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Format d'email invalide";
    }


    if (!password) {
      return "Le mot de passe est obligatoire";
    }


    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
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

      await login(
        email.trim(),
        password
      );

      navigate('/');

    } catch (err) {

      setError(
        err.response?.data?.error 
        || "Email ou mot de passe incorrect"
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
      to-indigo-100
      px-4
    ">


      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          w-full
          max-w-md
          p-8
          rounded-3xl
          shadow-xl
          space-y-5
        "
      >


        <h1 className="
          text-3xl
          font-bold
          text-center
          text-gray-800
        ">
          Connexion
        </h1>



        {error && (

          <div className="
            bg-red-100
            text-red-700
            p-3
            rounded-lg
            text-sm
          ">
            {error}
          </div>

        )}




        <div>

          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Email
          </label>


          <input

            type="email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            className="
              w-full
              px-4
              py-3
              border
              rounded-xl
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "

            placeholder="exemple@gmail.com"

          />

        </div>





        <div>


          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Mot de passe
          </label>


          <input

            type="password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            className="
              w-full
              px-4
              py-3
              border
              rounded-xl
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "

            placeholder="********"

          />


        </div>





        <button

          disabled={loading}

          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-semibold
            hover:bg-blue-700
            transition
            disabled:bg-gray-400
          "

        >

          {loading 
            ? "Connexion..." 
            : "Se connecter"
          }

        </button>





        <p className="
          text-center
          text-gray-600
        ">

          Pas encore de compte ?

          <Link

            to="/register"

            className="
              ml-1
              text-blue-600
              font-semibold
              hover:underline
            "

          >
            S'inscrire
          </Link>


        </p>


      </form>


    </div>

  );
}
