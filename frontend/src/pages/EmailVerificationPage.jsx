import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const EmailVerificationPage = () => {

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyEmail } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];

        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || '';
            }
            setCode(newCode);

            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();

        } else {
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');

        try {
            await verifyEmail(verificationCode);
            navigate('/');
            toast.success('Email verified successfully');

        } catch (error) {
            console.log(error);
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key == "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    useEffect(() => {
        if (code.every((digit) => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    }, [code])

    return (
        <div className='max-w-md w-full bg-amber-50 bg-opacity-50 backdrop-filter backdrop-blur-x1 p-8 rounded-2xl shadow-xl
        overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className=' bg-opacity-50 backdrop-filter backdrop-blur-xl p-8 rounded-2xl  w-full
                max-w-md'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-[#DEA534]
                    text-transparent bg-clip-text'>
                    Verify Your Email
                </h2>
                <p className='text-center text-black mb-6'>Enter the 6-digit code sent to your email address.</p>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                maxLength='6'
                                className='w-12 h-12 text-center text-2xl font-bold bg-white text-black border-black
                                border-2 border-gray-rounded-1g focus:outline-none focus:border-green-500'
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>
                    {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
                    <motion.button
                        className='w-full bg-gradient-to-r bg-[#9FBA77] text-white font-bold rounded-lg py-3 px-4
                                shadow-lg 
                                hover:bg-[#DEA534] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 diabled:opacity-50'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='submit'
                        disabled={isLoading || code.some((digit) => !digit)}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}

                    </motion.button>
                </form>
            </motion.div>
        </div>
    )

}

export default EmailVerificationPage
