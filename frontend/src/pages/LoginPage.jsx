import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Input from '../component/Input';
import { Mail, Lock, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();


  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-amber-50 bg-opacity-50 backdrop-filter backdrop-blur-x1 p-5 rounded-2x1 shadow-x1 overflow-hidden'
    >

      <div className='p-5'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-500 to-yellow-500
      text-transparent bg-clip-text'>
          Welcome Back
        </h2>


        <form
          onSubmit={handleLogin}>
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

          <div className='flex items-center mb-6'>
            <Link to='/forgot-password' className='text-sm text-black hover:underline'>
              Forgot Password?
            </Link>
          </div>

          {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

          <motion.button
            className='mt-5 w-full py-3 px-4  text-white font-bold rounded-lg bg-[#9FBA77]
                      shadow-lg hover:bg-[#DEA534] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                      transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
            >
            {isLoading ? (
              <Loader className='w-6 h-6 animate-spin mx-auto' />
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-black'>
          Don't have an account ? {" "}
          <Link to='/signup' className='text-yellow-500 hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>

    </motion.div>
  )
}

export default LoginPage
