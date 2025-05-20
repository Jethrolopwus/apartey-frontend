"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import ResetPasswordForm from '../molecules/ResetPasswordForm';
import { FormValues } from '@/types/generated';



const ResetPassword: React.FC = () => {
  const handleResetPassword: SubmitHandler<FormValues> = (data) => {
    // Handle password reset logic here
    console.log('Sending reset link to:', data.email);
  };
  
  

  return (
    <div className="flex flex-col items-center  bg-gray-50 justify-center min-h-screen  ">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg border border-gray-50 shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Apartey Logo" 
              width={100} 
              height={50} 
              priority
            />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-4">Reset your password</h1>
        <p className="text-center text-gray-400 mb-6">Enter your email and we'll send you a link to reset your password</p>
        {/* ==== Reset Password Form ======= */}
        <form onSubmit={(e) => e.preventDefault()}>
          <ResetPasswordForm onSubmit={handleResetPassword} />
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-400">Remember your password? </span>
          <Link href="/login" className="text-orange-500 hover:text-orange-400">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;