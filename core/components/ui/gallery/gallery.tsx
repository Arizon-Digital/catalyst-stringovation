import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

import { BcImage } from '~/components/bc-image';
import { cn } from '~/lib/utils';

interface Image {
  altText: string;
  src: string;
}
interface Video {
  title: string;
  url: string;
  type?: 'youtube' | 'direct';
}
interface Props {
  className?: string;
  defaultImageIndex?: number;
  images: Image[];
  videos: Video[];
}

const isYoutubeUrl = (url?: string) => url?.includes('youtube.com') || url?.includes('youtu.be');

const getYoutubeEmbedUrl = (url: string) => {
  const videoId = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
  )?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};
 
const getYoutubeThumbnailUrl = (url: string) => {
  const videoId = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
  )?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
};


const Gallery = ({ className, images, videos, defaultImageIndex = 0 }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(defaultImageIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaItems = [
    ...images.map((image) => ({
      type: 'image' as const,
      altText: image.altText,
      src: image.src,
    })),
    ...videos.map((video) => ({
      type: 'video' as const,
      title: video.title,
      url: video.url,
    })),
  ];

  const selectedItem = mediaItems.length > 0 ? mediaItems[selectedImageIndex] : undefined;

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.target as HTMLVideoElement;
    let errorMessage = 'Unknown video error';
 
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case 1:
          errorMessage = 'Video loading aborted';
          break;
        case 2:
          errorMessage = 'Network error while loading video';
          break;
        case 3:
          errorMessage = 'Video decoding failed';
          break;
        case 4:
          errorMessage = 'Video not supported';
          break;
      }
    }
 
    setVideoError(errorMessage);
    setIsPlaying(false);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setVideoError(null);
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
            setVideoError('Failed to play video');
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleRetryVideo = () => {
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleSourceError = (e: React.SyntheticEvent<HTMLSourceElement, Event>) => {
    console.error('Source Error Details:', {
      sourceElement: e.target,
      src: (e.target as HTMLSourceElement).src,
      type: (e.target as HTMLSourceElement).type,
    });
    setVideoError('Failed to load video source');
  };

  return (
    <div aria-live="polite" className={className}>
      <figure className="relative aspect-square h-full max-h-[548px] lg:w-full">
        {selectedItem ? (
          <>
          {selectedItem.type==='image'?( 
            <BcImage
            alt={selectedItem.altText}
            className="h-full w-full object-contain"
            fill
            priority={true}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={selectedItem.src}
          />
          ):(
          <div className="relative h-full w-full p-12 lg:p-6">
            {isYoutubeUrl(selectedItem.url) ? (
              <div className="relative h-full w-full">
                <iframe
                  src={getYoutubeEmbedUrl(selectedItem.url || '') || ''}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedItem.title || 'YouTube video'}
                />
              </div>
            ) : (
              <>
                {videoError ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <p className="text-red-500">{videoError}</p>
                      <button
                        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={handleRetryVideo}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      onError={handleVideoError}
                    >
                      <source
                        src={selectedItem.url}
                        type="video/mp4"
                        onError={handleSourceError}
                      />
                      Your browser does not support the video tag.
                    </video>
                    {!isPlaying && !videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <button
                          className="rounded-full bg-white p-4 shadow-lg transition-transform hover:scale-110"
                          onClick={handleVideoClick}
                          aria-label="Play video"
                        >
                          <svg
                            className="h-8 w-8 text-gray-800"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>)}
          </>
         
        ) : (
          <div className="flex aspect-square items-center justify-center bg-gray-200">
            <div className="text-base font-semibold text-gray-500">Coming soon</div>
          </div>
        )}
        {mediaItems.length > 1 && (
          <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-5 sm:px-0">
            <button
              aria-label="Previous product image"
              className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              onClick={() =>
                setSelectedImageIndex((prev) => {
                  if (prev === 0) {
                    return mediaItems.length - 1;
                  }

                  return prev - 1;
                })
              }
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Next product image"
              className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              onClick={() =>
                setSelectedImageIndex((prev) => {
                  if (prev === mediaItems.length - 1) {
                    return 0;
                  }

                  return prev + 1;
                })
              }
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </figure>
      <nav
        aria-label="Thumbnail navigation"
        className="mt-3 flex w-full flex-wrap items-center gap-4 px-6 py-1 sm:px-1 md:mt-5 md:gap-6"
      >
        {mediaItems.map((item, index) => {
          const isActive = selectedImageIndex === index;
          const isVideo = item.type === 'video';
          const isYoutube = isVideo && isYoutubeUrl(item.url);

          return (
            <button
              aria-label={isVideo ? 'Play video' : 'Enlarge product image'}
              aria-pressed={isActive}
              className="inline-block h-12 w-12 flex-shrink-0 flex-grow-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 md:h-24 md:w-24"
              key={`${isVideo ? item.url : item.src}-${index}`}
              onClick={() => {
                setSelectedImageIndex(index);
              }}
            >
              {isVideo ? (
                <div className="relative h-full w-full">
                  {isYoutube ? (
                    <img
                      src={getYoutubeThumbnailUrl(item.url || '') || ''}
                      alt={item.title || 'Video thumbnail'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video className="h-full w-full object-cover" preload="metadata">
                      <source src={item.url} type="video/mp4" onError={handleSourceError} />
                    </video>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <BcImage
                  alt={item.altText}
                  className={cn(
                    'flex h-full w-full cursor-pointer items-center justify-center border-2 object-contain hover:border-primary',
                    isActive && 'border-primary',
                  )}
                  height={94}
                  priority={true}
                  src={item.src}
                  width={94}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export { Gallery };
