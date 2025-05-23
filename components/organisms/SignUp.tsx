
"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SignUpForm from '@/components/molecules/SignupForm';
import { FormData } from '@/types/generated';
import { useSignUPMutation } from '@/Hooks/use.register.mutation';
import { toast } from 'react-hot-toast';

const SignUp: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  const password = watch('password', '');
  const { mutate, isLoading, error, data } = useSignUPMutation();

 
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
//    // Call the mutation with the form data
    mutate(formData);
   });

  return (
   <div className="flex min-h-screen bg-gray-50 items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
<div className="w-full max-w-md space-y-8 px-4 shadow-xl bg-white rounded-xl border border-gray-100 "> 
      
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
             <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">               Create an account
            </h2>
             <p className="mb-3 text-center text-sm text-gray-600">
              Enter your details to create an account
            </p>
          </div> 

       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
         <SignUpForm
          onSubmit={onSubmit}
          register={register}
           errors={errors}           isSubmitting={isLoading}
           password={password}
         />
        
         <p className="mt-4 mb-3 text-center text-sm text-gray-500">
           Already have an account?{' '}
           <Link href="/signin" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">             Sign in
           </Link>
         </p>
       </div>
     </div>
    </div>
  );
}
 export default SignUp;