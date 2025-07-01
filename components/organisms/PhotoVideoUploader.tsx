"use client";

import { useState, useRef, useEffect } from 'react';
import { PlusCircle, X, Link2, PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface PhotoVideoUploaderProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PhotoVideoUploader: React.FC<PhotoVideoUploaderProps> = ({ formData, setFormData }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [videoTourLink, setVideoTourLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = [];

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (isImage && file.size > 8 * 1024 * 1024) {
        alert('Max photo size is 8MB'); // Replace with a better notification system
        return;
      }
      if (isVideo && file.size > 10 * 1024 * 1024) {
        alert('Max video size is 10MB'); // Replace with a better notification system
        return;
      }

      if (isImage || isVideo) {
        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
          type: isImage ? 'image' : 'video',
        });
      }
    });
    
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);

    if (coverIndex === null && updatedFiles.some(f => f.type === 'image')) {
        const firstImageIndex = updatedFiles.findIndex(f => f.type === 'image');
        setCoverIndex(firstImageIndex);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = (indexToRemove: number) => {
    const fileToRemove = uploadedFiles[indexToRemove];
    URL.revokeObjectURL(fileToRemove.preview);

    const updatedFiles = uploadedFiles.filter((_, i) => i !== indexToRemove);
    setUploadedFiles(updatedFiles);

    if (indexToRemove === coverIndex) {
        const newCoverIndex = updatedFiles.findIndex(f => f.type === 'image');
        setCoverIndex(newCoverIndex !== -1 ? newCoverIndex : null);
    } else if (coverIndex !== null && indexToRemove < coverIndex) {
        setCoverIndex(coverIndex - 1);
    }
  };

  const setAsCover = (index: number) => {
    if (uploadedFiles[index].type === 'image') {
      setCoverIndex(index);
    }
  };

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [uploadedFiles]);
  
  const orderedFiles = [...uploadedFiles];
  if (coverIndex !== null && coverIndex < uploadedFiles.length) {
    const [coverFile] = orderedFiles.splice(coverIndex, 1);
    orderedFiles.unshift(coverFile);
  }

  useEffect(() => {
    if (!setFormData) return;
    if (uploadedFiles.length === 0) {
      setFormData((prev: any) => ({
        ...prev,
        media: undefined,
      }));
      return;
    }
    const coverPhotoFile = coverIndex !== null && uploadedFiles[coverIndex]?.type === 'image'
      ? uploadedFiles[coverIndex].file
      : undefined;
    setFormData((prev: any) => ({
      ...prev,
      media: {
        ...prev.media,
        coverPhoto: coverPhotoFile,
        uploads: uploadedFiles.map(f => f.file),
        videoTourLink,
      },
    }));
  }, [uploadedFiles, coverIndex, videoTourLink, setFormData]);

  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold text-gray-900">Photos and videos</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
            The maximum photo size is 8 MB. Formats: jpeg, jpg, png. Put the main picture first.<br/>
            The maximum video size is 10 MB. Formats: mp4, mov.
        </p>

        <div className="grid grid-cols-3 gap-4">
            {orderedFiles.map((file) => {
                const originalIndex = uploadedFiles.indexOf(file);
                const isCover = originalIndex === coverIndex;
                
                return (
                    <div key={file.preview} className="relative group rounded-lg overflow-hidden border aspect-w-1 aspect-h-1">
                        <Image src={file.preview} alt={`upload preview`} layout="fill" objectFit="cover" />
                        
                        {file.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <PlayCircle size={40} className="text-white" />
                            </div>
                        )}

                        {isCover && file.type === 'image' && (
                             <div className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-md">
                                Cover
                             </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col items-center justify-center space-y-2">
                            <button onClick={() => removeFile(originalIndex)} className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <X size={16} className="text-gray-800" />
                            </button>
                            {!isCover && file.type === 'image' && (
                                <button onClick={() => setAsCover(originalIndex)} className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded-md">
                                    Set as cover
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
            <div 
                onClick={triggerFileSelect}
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors aspect-w-1 aspect-h-1">
                <PlusCircle className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 text-center">Upload photos / videos</p>
            </div>
        </div>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/jpg,video/mp4,video/mov"
            className="hidden"
        />

        <div className="mt-8">
            <label htmlFor="video-tour-link" className="block text-sm font-medium text-gray-700">
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
                    onChange={e => setVideoTourLink(e.target.value)}
                />
            </div>
        </div>
    </div>
  );
};

export default PhotoVideoUploader; 