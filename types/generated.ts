import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";

export declare type FormValues = {
    email: string;
  };
 export  interface SignUpButtonProps {
    isSubmitting: boolean;
  }
 export  interface SignInButtonProps {
    isSubmitting: boolean;
  }
  export interface GoogleAuthButtonProps {
    mode: 'signin' | 'signup';
    onClick: () => void;
  }

  export interface ResetPasswordFormProps {
      onSubmit: SubmitHandler<FormValues>;
    }
 
    export declare type FormData = {
      email: string;
      password: string;
      confirmPassword: string;
    };
    
    export interface SignUpFormProps {
      onSubmit: (e: React.FormEvent) => void;
      register: UseFormRegister<FormData>;
      errors: FieldErrors<FormData>;
      isSubmitting: boolean;
      password: string;
    }

    export interface SignInFormProps {
      isSubmitting: boolean;
      onSubmit: (e: React.FormEvent) => void;
      register: any;
      errors:FieldErrors<FormData>;
    }
  