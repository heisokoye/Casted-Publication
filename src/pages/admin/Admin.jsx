import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../Firebase'
import { useNavigate } from 'react-router-dom'
import { BsArrowRight, BsEnvelope, BsLock, BsShieldLock, BsEye, BsEyeSlash } from 'react-icons/bs' 
import { motion } from 'framer-motion' // Add this import
import Loader from '../../components/loader/Loader'

const Admin = () => {
  // State for email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Firebase auth and navigation
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try{
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save auth token to local storage
      localStorage.setItem('authToken', await user.getIdToken());
      // Navigate to the dashboard
      navigate("/dashboard");
    } catch(error){
      setLoading(false);
      // Handle login errors
      switch(error.code){
        case "auth/invalid-email":
          setErrorMsg("Invalid Email");
          break;
        case "auth/user-not-found":
          setErrorMsg("User not found");
          break;
        case "auth/wrong-password":
          setErrorMsg("Wrong Password");
          break;
        default:
          setErrorMsg("Invalid login credentials");
          break;
      }
    }
  };
  // className="bg-[url('/bg.png')] bg-no-repeat bg-cover bg-fixed
 return (
  <div className="min-h-screen flex">

    {/* RIGHT SIDE (AUTH FORM) */}
    <div className="w-full flex items-center justify-center bg-white px-6">
      <div
        className="w-full max-w-md"
      >
        <div className="p-8">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Login
            </h2>
            <p className="text-gray-500 mt-2">
              Access your writing & publishing dashboard
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <BsEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="writer@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Password
              </label>
              <div className="relative">
                <BsLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-500 text-sm p-3 rounded-lg"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  Sign In
                  <BsArrowRight />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Restricted to Publishers & Writers only
          </p>
        </div>
      </div>
    </div>
  </div>
)
}

export default Admin