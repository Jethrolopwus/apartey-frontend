"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteAdminBlogPostMutation } from '@/Hooks/use-deleteAdminBlogPostById.query';
import toast from 'react-hot-toast';

interface DeleteBlogPostModalProps {
  postId: string;
  postTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteBlogPostModal({ 
  postId, 
  postTitle, 
  isOpen, 
  onClose 
}: DeleteBlogPostModalProps) {
  const router = useRouter();
  const { mutate: deletePost, isLoading } = useDeleteAdminBlogPostMutation();

  const handleDelete = () => {
    deletePost(postId, {
      onSuccess: () => {
        toast.success('Blog post deleted successfully');
        onClose();
        router.push('/admin/blog');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete blog post');
      }
    });
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2D3A4A]">Delete Blog Post</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete &ldquo;{postTitle}&rdquo;? This action cannot be undone and all associated data will be permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-[#C85212] text-[#C85212] bg-white rounded-lg hover:bg-[#C85212] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </div>
    </div>
  );
} 