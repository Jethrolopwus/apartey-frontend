
"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import SignInForm from '@/components/molecules/SigninForm'; 
import GoogleAuthButton from '@/components/atoms/Buttons/GoogleAuthButton';
import { FormData } from '@/types/generated'; 
import { useSignInMutation } from '@/Hooks/use.login.mutation';
import { toast } from 'react-hot-toast';

const SignIn: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const { mutate, isLoading, error, data } = useSignInMutation();

  // Handle NextAuth session (Google OAuth)
  useEffect(() => {
    if (session) {
      // User is already authenticated via Google, redirect to dashboard
      router.push('/dashboard');
    }
  }, [session, router]);

  // Handle traditional signin success
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data?.token);
      localStorage.setItem("email", data?.user?.email);
      toast.success('Signed in successfully!');
      reset(); 
      router.push('/dashboard'); 
    }
  }, [data, router, reset]);

  // Handle signin error
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
      toast.error(errorMessage);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData: FormData) => {
  
    mutate(formData);
  });

  const handleGoogleSignIn = () => {
    console.log('Google sign in initiated');
  };
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }
  if (session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 px-6 py-8 shadow-xl bg-white rounded-xl border border-gray-100"> 
        
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
            Sign in to your account
          </h2>
          <p className="mb-3 text-center text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div> 

        <div className="space-y-6">
            {/* Traditional Signin Form */}
            <div>
            <SignInForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isLoading}
            />
          </div>
            {/* Divider */}
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>
          {/* Google Auth Button */}
          <GoogleAuthButton 
            mode="signin"
            callbackUrl="/dashboard"
            onClick={handleGoogleSignIn}
          />
        
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
