import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../component/Input';
import { User, Mail, Lock, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../component/PasswordStrengthMeter';
import { useAuthStore } from '../store/authStore';


const SignUpPage = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signup, error, isLoading } = useAuthStore();
  const navigate  = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault()
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
  }
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-amber-50 bg-opacity-50 backdrop-filter backdrop-blur-x1 p-5 rounded-2x1 shadow-x1 overflow-hidden'
    >

      <div className='p-5 '>

        <form onSubmit={handleSignUp}>

          <Input
            icon={User}
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Mail}
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            icon={Lock}
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {passwordError && <p className='text-red-500 font-semibold mt-2'>{passwordError}</p>}
          {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

          <PasswordStrengthMeter password={password} />

          <motion.button
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r bg-[#9FBA77] text-white font-bold rounded-lg
            shadow-lg hover:bg-[#DEA534] 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
            transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
          >
           {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Sign Up'}
          </motion.button>

        </form>
      </div>

      <div className='px-8 py-4  bg-opacity-50 flex justify-center'>
        <p className='text-sm text-black'>
          Already have an account?{" "}
          <Link to={"/login"} className='text-yellow-500 hover:underline'>
            Log in
          </Link>
        </p>
      </div>

    </motion.div>
  )
}

export default SignUpPage
