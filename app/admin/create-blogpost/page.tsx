"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { useCreateAdminBlogPostMutation } from '@/Hooks/use-createAdminBlogPost.mutation';
import { CreateAdminPostData } from '@/types/admin';
import RichTextEditor from '@/components/molecules/RichTextEditor';

const categories = [
  "Renting",
  "Selling",
  "Buying",
  "Investment",
  "Maintenance",
  "Tips",
  "News"
];

export default function CreateBlogPost() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const { mutate: createPost, isLoading, error } = useCreateAdminBlogPostMutation();

  const [formData, setFormData] = useState<CreateAdminPostData>({
    title: "",
    content: "",
    category: "Renting",
    tags: [],
    status: "draft"
  });

  const handleInputChange = (field: keyof CreateAdminPostData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }

      setSelectedFile(file);
      setImageUrl(""); // Clear URL when file is selected
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter blog content");
      return;
    }

    if (!selectedFile && !imageUrl.trim()) {
      alert("Please upload an image or enter an image URL");
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('category', formData.category);
    submitData.append('tags', JSON.stringify(formData.tags));
    submitData.append('status', status);
    
    if (selectedFile) {
      submitData.append('blog-image', selectedFile);
    } else if (imageUrl.trim()) {
      submitData.append('imageUrl', imageUrl);
    }

    createPost(submitData, {
      onSuccess: () => {
        router.push('/admin/blog');
      },
      onError: (error) => {
        console.error('Error creating blog post:', error);
      }
    });
  };

  const handleDraft = (e: React.FormEvent) => {
    handleSubmit(e, 'draft');
  };

  const handlePublish = (e: React.FormEvent) => {
    handleSubmit(e, 'published');
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8">
        <h1 className="text-2xl font-bold text-[#2D3A4A] mb-8">Create New Blog Post</h1>
        
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter Blog Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Create your blog content here..."
              className="min-h-[300px]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Separate with a comma)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Property, First-Time Homebuyer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-red-500 text-sm hover:text-red-600 transition-colors"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#C85212] text-white px-6 py-2 rounded-lg hover:bg-[#a63e0a] transition-colors mb-4"
                >
                  Upload Image
                </button>
                <p className="text-gray-600 mb-2">Upload a featured image for your blog post</p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>

          {/* Or Enter Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-[#C85212] text-[#C85212] bg-white rounded-lg hover:bg-[#C85212] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDraft}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Draft'}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#C85212] text-white rounded-lg hover:bg-[#a63e0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 