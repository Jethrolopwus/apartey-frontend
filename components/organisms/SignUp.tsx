"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import SignUpForm from '@/components/molecules/SignupForm';
import GoogleAuthButton from '@/components/atoms/Buttons/GoogleAuthButton';
import { FormData } from '@/types/generated';
import { useSignUPMutation } from '@/Hooks/use.register.mutation';
import { toast } from 'react-hot-toast';

const SignUp: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  const password = watch('password', '');
  const { mutate, isLoading, error, data } = useSignUPMutation();

  // Handle NextAuth session (Google OAuth)
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Handle traditional signup success
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data?.token);
      localStorage.setItem("email", data?.user?.email);
      toast.success('Account created successfully!');
      reset(); 
      router.push('/verifyEmail'); 
    }
  }, [data, router, reset]);

  // Handle signup error
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData: FormData) => {
    mutate(formData);
  });

  const handleGoogleSignUp = () => {
    console.log('Google sign up initiated');
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
          <h2 className="text-center title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create an account
          </h2>
          <p className="mb-3 text-center text-sm text-gray-600">
            Enter your details to create an account
          </p>
        </div> 

        <div className="space-y-6">
          {/* Traditional Signup Form */}
          <div>
            <SignUpForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isLoading}
              password={password}
            />
          </div>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Google Auth Button */}
          <GoogleAuthButton 
            mode="signup"
            callbackUrl="/dashboard"
            onClick={handleGoogleSignUp}
          />
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;