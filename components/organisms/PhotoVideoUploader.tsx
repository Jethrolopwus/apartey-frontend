"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, X, Link2, PlayCircle } from "lucide-react";
import Image from "next/image";
import { PropertyListingFormState } from "@/types/propertyListing";

interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface PhotoVideoUploaderProps {
  formData: PropertyListingFormState;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingFormState>>;
}

const PhotoVideoUploader: React.FC<PhotoVideoUploaderProps> = ({
  formData,
  setFormData,
}) => {
  // Separate state for cover photo and media uploads
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [mediaUploads, setMediaUploads] = useState<UploadedFile[]>([]);
  const [videoTourLink, setVideoTourLink] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Handle cover photo change
  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverPhoto(file);
      setCoverPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        coverPhoto: file,
        videoTourLink,
        uploads: prev.uploads || [],
      }));
    }
  };

  // Handle media uploads change
  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));
    const allFiles = [...mediaUploads, ...newFiles];
    setMediaUploads(allFiles);
    setFormData((prev) => ({
      ...prev,
      uploads: allFiles.map((f) => f.file),
      coverPhoto: coverPhoto || prev.coverPhoto,
      videoTourLink,
    }));
  };

  const triggerCoverSelect = () => {
    coverInputRef.current?.click();
  };
  const triggerMediaSelect = () => {
    mediaInputRef.current?.click();
  };

  // Remove cover photo
  const removeCoverPhoto = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPhoto(null);
    setCoverPreview("");
    setFormData((prev) => ({
      ...prev,
      coverPhoto: undefined,
      uploads: prev.uploads || [],
      videoTourLink,
    }));
  };

  // Remove media upload
  const removeMediaFile = (indexToRemove: number) => {
    const fileToRemove = mediaUploads[indexToRemove];
    URL.revokeObjectURL(fileToRemove.preview);
    const updatedFiles = mediaUploads.filter((_, i) => i !== indexToRemove);
    setMediaUploads(updatedFiles);
    setFormData((prev) => ({
      ...prev,
      uploads: updatedFiles.map((f) => f.file),
      coverPhoto: coverPhoto || prev.coverPhoto,
      videoTourLink,
    }));
  };

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      mediaUploads.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [coverPreview, mediaUploads]);

  // Initialize from formData
  useEffect(() => {
    if (formData) {
      // Cover photo
      if (formData.coverPhoto instanceof File) {
        setCoverPhoto(formData.coverPhoto);
        setCoverPreview(URL.createObjectURL(formData.coverPhoto));
      } else if (typeof formData.coverPhoto === "string") {
        setCoverPreview(formData.coverPhoto);
      }
      // Media uploads
      if (Array.isArray(formData.uploads)) {
        const newFiles = formData.uploads.filter((file): file is File => file instanceof File);
        const files = newFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" as const : "video" as const,
        }));
        setMediaUploads(files);
      }
    }
    // Clean up on unmount
    return () => {
      mediaUploads.forEach((file) => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.uploads, formData?.coverPhoto]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-900">
        Photos and videos
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        The maximum photo size is 8 MB. Formats: jpeg, jpg, png. Put the main
        picture first.
        <br />
        The maximum video size is 10 MB. Formats: mp4, mov.
      </p>

      {/* Cover Photo Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo <span className="text-red-500">*</span></label>
        {coverPreview ? (
          <div className="relative w-40 h-40 mb-2">
            <Image
              src={coverPreview}
              alt="cover preview"
              fill
              className="object-cover w-full h-full rounded-lg border"
              style={{ objectFit: 'cover' }}
            />
            <button
              onClick={removeCoverPhoto}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
              title="Remove cover photo"
            >
              <X size={16} className="text-gray-800" />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerCoverSelect}
            className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <PlusCircle className="text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 text-center">Upload cover photo</p>
          </div>
        )}
        <input
          type="file"
          ref={coverInputRef}
          onChange={handleCoverChange}
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
        />
      </div>

      {/* Media Uploads Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Photos / Videos</label>
        <div className="grid grid-cols-3 gap-4">
          {mediaUploads.map((file, idx) => (
            <div
              key={file.preview}
              className="relative group rounded-lg overflow-hidden border aspect-w-1 aspect-h-1"
            >
              <Image
                src={file.preview}
                alt="upload preview"
                fill
                className="object-cover w-full h-full"
                style={{ objectFit: "cover" }}
              />
              {file.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <PlayCircle size={40} className="text-white" />
                </div>
              )}
              <button
                onClick={() => removeMediaFile(idx)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-80 hover:opacity-100 transition-opacity z-10"
                title="Remove file"
              >
                <X size={16} className="text-gray-800" />
              </button>
            </div>
          ))}
          <div
            onClick={triggerMediaSelect}
            className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors aspect-w-1 aspect-h-1"
          >
            <PlusCircle className="text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 text-center">Upload photos / videos</p>
          </div>
        </div>
        <input
          type="file"
          ref={mediaInputRef}
          onChange={handleMediaChange}
          multiple
          accept="image/jpeg,image/png,image/jpg,video/mp4,video/mov"
          className="hidden"
        />
      </div>

      {/* Video Tour Link */}
      <div className="mt-8">
        <label
          htmlFor="video-tour-link"
          className="block text-sm font-medium text-gray-700"
        >
          Link to the video tour
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            name="video-tour-link"
            id="video-tour-link"
            className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
            placeholder="www.youtube.com/..."
            value={videoTourLink}
            onChange={(e) => setVideoTourLink(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoVideoUploader;
