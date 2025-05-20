"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import SignInForm from '../molecules/SigninForm';
import GoogleAuthButton from '@/components/atoms/Buttons/GoogleAuthButton';
import { FormData } from '@/types/generated';




const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      // Handle authentication logic here
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // Implement Google OAuth logic here
  };

  return (
    <>
      <Head>
        <title>Sign In | Apartey</title>
        <meta name="description" content="Sign in to your Apartey account" />
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 px-4 shadow-xl bg-white rounded-xl border border-gray-100  ">
            {/* ===== Logo ===== */}
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
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email to sign in to your account
            </p>
          </div>
          {/* ===== SignInForm ======== */}
          <SignInForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
          />
            {/* === Google Auth ====== */}
          <div className="mt-6 bg-white">
            <GoogleAuthButton mode="signin" onClick={handleGoogleSignIn} />

          </div>
            {/* === Redirecting to sign up ==== */}
          <p className="mb-3 text-center text-sm text-gray-600 bg-white">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-orange-500 hover:text-orange-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default SignIn;