"use client";
import Image from 'next/image';
import { useState } from 'react';
import { useContactUsMutation } from '@/Hooks/use-contactUs.mutation';
import toast from 'react-hot-toast';

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

  const { mutate: sendMessage, isLoading } = useContactUsMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData for API
    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('message', formData.message);

    sendMessage(submitData, {
      onSuccess: () => {
        toast.success('Message sent successfully!');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          message: ''
        });
        // Call custom onSubmit if provided
        if (onSubmit) {
          onSubmit(formData);
        }
      },
      onError: (error) => {
        toast.error('Failed to send message. Please try again.');
        console.error('Contact form error:', error);
      }
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C85212] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Submit form'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;