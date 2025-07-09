import Image, { StaticImageData } from 'next/image';

interface AvatarProps {
  src: string | StaticImageData;
  alt: string;
  isPlaceholder?: boolean;
}

interface TestimonialStripProps {
  avatars: AvatarProps[];
  text: string;
  className?: string;
}

const TestimonialStrip = ({ 
  avatars, 
  text, 
  className = ''
}: TestimonialStripProps) => {
  // Limit to displaying max 5 avatars to avoid overcrowding
  const displayAvatars = avatars.slice(0, 5);
  const remainingCount = Math.max(0, avatars.length - 5);
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex -space-x-2">
        {displayAvatars.map((avatar, index) => (
          <div 
            key={index} 
            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
          >
            {avatar.isPlaceholder ? (
              <Image 
                src="/api/placeholder/32/32" 
                alt={avatar.alt} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Image 
                src={avatar.src} 
                alt={avatar.alt} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white overflow-hidden flex items-center justify-center text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="ml-3 text-gray-600">
        {text}
      </span>
    </div>
  );
};

export default TestimonialStrip;