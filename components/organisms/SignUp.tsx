"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import SignUpForm from '@/components/molecules/SignupForm';
import GoogleAuthButton from '@/components/atoms/Buttons/GoogleAuthButton';
import { FormData } from '@/types/generated';




const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      // Handle registration logic here
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
    // Implement Google OAuth logic here
  };

  return (
    <>
      <Head>
        <title>Sign Up | Apartey</title>
        <meta name="description" content="Create an Apartey account" />
      </Head>

      <div className="flex min-h-screen bg-gray-50 items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 px-4 shadow-xl bg-white rounded-xl border border-gray-100 ">
            {/* ==== Logo ===== */}
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Apartey Logo"
                width={100}
                height={50}
                priority
              />
            </div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your details to create an account
            </p>
          </div>
          {/* ===== SignInForm ======== */}
          <SignUpForm 
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            password={password}
          />
         {/* === Google Auth ====== */}
          <div className="mt-6">
            <GoogleAuthButton mode="signup" onClick={handleGoogleSignUp} />
          </div>
            {/* === Redirecting to sign up ==== */}
          <p className="mb-3 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-orange-500 hover:text-orange-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;