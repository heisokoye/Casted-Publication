import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../Firebase'
import { useNavigate } from 'react-router-dom'
import { BsEnvelope, BsLock, BsEye, BsEyeSlash } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from '../../components/loader/Loader'

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('authToken', await user.getIdToken());
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMsg("That email address doesn't look right.");
          break;
        case "auth/user-not-found":
          setErrorMsg("No account found with that email.");
          break;
        case "auth/wrong-password":
          setErrorMsg("Wrong password. Try again.");
          break;
        default:
          setErrorMsg("Couldn't sign you in. Check your credentials and try again.");
          break;
      }
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex bg-[#FAFAF7]">

      {/* RIGHT — FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#18181B]">
              Sign in to the desk
            </h2>
            <p className="text-[#6B6B6B] text-sm mt-1.5">
              Enter your staff credentials to reach the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#18181B] mb-1.5 block">
                Email address
              </label>
              <div className="relative">
                <BsEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] text-[15px]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-[#D6D3CB] rounded-md
                             placeholder:text-[#A1A1AA] text-[#18181B]
                             outline-none transition-shadow
                             focus:border-[#18181B] focus:ring-2 focus:ring-[#18181B]/10"
                  placeholder="writer@casted.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#18181B]">
                  Password
                </label>
              </div>
              <div className="relative">
                <BsLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] text-[15px]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D6D3CB] rounded-md
                             placeholder:text-[#A1A1AA] text-[#18181B]
                             outline-none transition-shadow
                             focus:border-[#18181B] focus:ring-2 focus:ring-[#18181B]/10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#18181B] transition-colors"
                >
                  {showPassword ? <BsEyeSlash size={15} /> : <BsEye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 bg-[#FBEAEA] border border-[#F0C4C4] text-[#C1272D] text-sm px-3 py-2.5 rounded-md">
                    <span className="mt-0.75 w-1.5 h-1.5 rounded-full bg-[#C1272D] shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-amber-500 text-white text-sm font-medium
                         flex justify-center items-center gap-2
                         transition-colors hover:bg-amber-600
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]/30 focus-visible:ring-offset-2"
            >
              {loading ? <Loader /> : 'Sign in'}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-[#A1A1AA]">
            Restricted to publishers &amp; writers in Casted.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Admin