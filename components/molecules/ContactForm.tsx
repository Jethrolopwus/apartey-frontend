"use client";
import Image from 'next/image';
import { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (formData: FormData) => void;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit, 
  className = "" 
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Form submitted:', formData);
    }
    // Reset form after submission
    setFormData({
      fullName: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${className}`}>
      {/* Image Section */}
      <div className="order-2 lg:order-1">
      <Image
          src="/contact.png"
            alt="Contact Us"
            width={500}
            height={400}
            className="object-cover rounded-lg shadow-lg"
            priority
           />
      </div>

      {/* Contact Form */}
      <div className="order-1 lg:order-2">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Get in touch!
          </h2>
          <p className="text-gray-600 mb-6">
            Fill out the form and we will contact you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Submit form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;