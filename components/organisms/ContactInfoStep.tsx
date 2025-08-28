"use client";

import React from 'react';
import { StepProps } from '@/types/generated';
import ContactInfoForm from "@/components/organisms/ContactInfoForm";
import type { ContactInfoFormData } from "@/components/organisms/ContactInfoForm";

interface ContactInfoStepProps extends StepProps {
  formData: ContactInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactInfoFormData>>;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ onNext, onBack, formData, setFormData }) => (
  <div className="max-w-2xl w-full">
    <ContactInfoForm formData={formData} setFormData={setFormData} onNext={onNext} onBack={onBack} />
  </div>
);

export default ContactInfoStep; 