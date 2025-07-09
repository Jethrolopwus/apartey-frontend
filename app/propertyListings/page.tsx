"use client";
import { useState } from "react";
import PropertyDetailsForm from "@/components/organisms/PropertyDetailsForm";

export default function ListPropertyFormPage() {
  const [formData, setFormData] = useState({});

  return <PropertyDetailsForm formData={formData} setFormData={setFormData} />;
}
