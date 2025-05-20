import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";

export declare type FormValues = {
    email: string;
  };
  export interface ReviewLocation {
    lat: number;
    lng: number;
  }
  
  export interface ReviewData {
    id: string;
    address: string;
    rating: number;
    reviewCount: number;
    comment: string;
    imageUrl: string;
    location: ReviewLocation;
  }
  
  export interface SortOption {
    label: string;
    value: string;
  }
  
  export interface ReviewsSectionProps {
    initialReviews?: ReviewData[];
    initialSortOption?: string;
  }
  export interface Category {
    id: number;
    title: string;
    image: string;
  }
  export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
  }
  export interface Listing {
    id: string;
    imageUrl: string;
    verified: boolean;
    title: string;
    location: string;
    rating: number;
    reviewCount: number;
    beds: number;
    baths: number;
    size: string;
    oldPrice: string;
    newPrice: string;
  }
  
  export interface FeaturedReview {
    id: string;
    imageUrl: string;
    verified?: boolean;
    address: string;
    rating: number;
    reviewCount: number;
    comment: string;
    user: {
      name: string;
      avatarUrl: string;
    };
    date: string;
  }
  

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
  