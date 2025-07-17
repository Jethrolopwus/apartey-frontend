import React, { useState } from 'react';

interface ContactOwnerModalProps {
  open: boolean;
  onClose: () => void;
  propertyName?: string;
  onSend?: (data: { name: string; email: string; message: string; propertyName?: string }) => void;
}

const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({ open, onClose, propertyName, onSend }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleSend = () => {
    if (onSend) {
      onSend({ name, email, message, propertyName });
    }
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-8 z-10 flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Contact Home Owner</h2>
        <p className="text-xs text-gray-600 mb-4">
          Send a message about <span className="font-medium">{propertyName || 'this property'}</span>. The owner will receive your contact details to respond directly.
        </p>
        <label className="text-xs font-medium text-gray-700 mb-1">Your Name</label>
        <input
          className="mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label className="text-xs font-medium text-gray-700 mb-1">Your Email</label>
        <input
          className="mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="text-xs font-medium text-gray-700 mb-1">Message</label>
        <textarea
          className="mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent resize-none"
          rows={3}
          placeholder="Tell the owner about your interest in their home..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#C85212] text-white rounded-md hover:bg-[#A64310] text-sm"
            type="button"
            onClick={handleSend}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerModal; 