import React, { useState, useEffect, useMemo } from 'react';
import { ImageOff, Loader2, ExternalLink, ShieldCheck, Utensils } from 'lucide-react';
import { getVerifiedDishPhoto, FoodImageMetadata } from '../data/food_image_registry';

interface VerifiedFoodImageProps {
  src?: string | null;
  alt: string;
  dishName?: string;
  fallbackUrls?: string[];
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  showAttribution?: boolean;
  sourceLabel?: string;
  licenseLabel?: string;
  sourceUrl?: string;
  onLoadSuccess?: () => void;
}

export const VerifiedFoodImage: React.FC<VerifiedFoodImageProps> = ({
  src,
  alt,
  dishName,
  fallbackUrls = [],
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio = 'video',
  showAttribution = false,
  sourceLabel,
  licenseLabel,
  sourceUrl,
  onLoadSuccess
}) => {
  // Query verified registry for exact matching dish metadata
  const verifiedMetadata: FoodImageMetadata | null = useMemo(() => {
    return getVerifiedDishPhoto(dishName || alt);
  }, [dishName, alt]);

  // Build ordered list of candidate URLs
  const candidateUrls = useMemo(() => {
    const list: string[] = [];

    const addUrl = (url?: string | null) => {
      if (url && typeof url === 'string' && url.trim().length > 0 && !list.includes(url.trim())) {
        list.push(url.trim());
      }
    };

    // 1. If verified metadata exists, prioritize its primary URL
    if (verifiedMetadata?.primaryUrl) {
      addUrl(verifiedMetadata.primaryUrl);
    }

    // 2. Direct src provided if non-empty
    addUrl(src);

    // 3. Verified fallbacks
    if (verifiedMetadata?.fallbacks && verifiedMetadata.fallbacks.length > 0) {
      verifiedMetadata.fallbacks.forEach(fb => addUrl(fb));
    }

    // 4. Props fallbacks
    if (fallbackUrls && fallbackUrls.length > 0) {
      fallbackUrls.forEach(u => addUrl(u));
    }

    // 5. Generate weserv/wsrv proxy links for any wikimedia URLs to prevent CORS or rate limits
    const currentList = [...list];
    currentList.forEach(u => {
      if (u.includes('upload.wikimedia.org')) {
        const pathPart = u.replace(/^https?:\/\/upload\.wikimedia\.org\//, '');
        addUrl(`https://wsrv.nl/?url=upload.wikimedia.org/${pathPart}&w=800&fit=cover&q=85`);
        addUrl(`https://images.weserv.nl/?url=upload.wikimedia.org/${pathPart}&w=800`);
      }
    });

    return list;
  }, [src, fallbackUrls, verifiedMetadata]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reset state on URL list change
  useEffect(() => {
    setCurrentIndex(0);
    if (candidateUrls.length === 0) {
      setIsLoading(false);
      setHasError(true);
    } else {
      setIsLoading(true);
      setHasError(false);
    }
  }, [candidateUrls]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoadSuccess) onLoadSuccess();
  };

  const handleImageError = () => {
    // Try the next candidate in the fallback list
    if (currentIndex + 1 < candidateUrls.length) {
      setCurrentIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      // All candidates exhausted
      setIsLoading(false);
      setHasError(true);
    }
  };

  const currentUrl = candidateUrls[currentIndex];
  const aspectClass = aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'wide' ? 'aspect-21/9' : '';

  // Final attribution details
  const displaySource = verifiedMetadata?.imageSource || sourceLabel;
  const displayLicense = verifiedMetadata?.imageLicense || licenseLabel;
  const displayArchive = verifiedMetadata?.archiveUrl || sourceUrl;

  return (
    <div className={`relative w-full overflow-hidden bg-slate-900 select-none ${aspectClass} ${containerClassName}`}>
      
      {/* 1. LOADING INDICATOR */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 text-slate-300 p-4 text-center space-y-2">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wide">
            Loading verified dish photograph...
          </span>
        </div>
      )}

      {/* 2. PLACEHOLDER STATE (Exact matching image unavailable) */}
      {(hasError || !currentUrl) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
            <Utensils className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
              Verified dish image unavailable
            </span>
            <p className="text-[11px] font-bold text-slate-200">
              {dishName || alt || 'Traditional Dish'}
            </p>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed mx-auto">
              Generic regional thalis and AI-generated food images are strictly prohibited to ensure medical and culinary authenticity.
            </p>
          </div>
        </div>
      )}

      {/* 3. VERIFIED DISH PHOTOGRAPH */}
      {currentUrl && !hasError && (
        <img
          src={currentUrl}
          alt={alt || dishName || 'Traditional Indian Recipe'}
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}

      {/* 4. VERIFIED ATTRIBUTION BAR */}
      {showAttribution && !hasError && !isLoading && (displaySource || displayLicense) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-6 flex items-center justify-between text-[10px] text-white/95 z-10">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-semibold">{displaySource || 'Verified Open Culinary Dataset'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {displayLicense && (
              <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-xs rounded text-[9px] font-mono font-bold text-amber-300">
                {displayLicense}
              </span>
            )}
            {displayArchive && displayArchive.startsWith('http') && (
              <a
                href={displayArchive}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white hover:text-amber-300 inline-flex items-center gap-0.5 font-bold underline cursor-pointer"
              >
                <span>Archive</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
