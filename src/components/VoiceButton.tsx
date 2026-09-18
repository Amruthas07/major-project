import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Square, Mic, MicOff } from 'lucide-react';
import { voiceService, VOICE_LABELS } from '../services/voice_service';
import { KaggleFoodItem } from '../types';
import { useLanguage } from '../services/language_service';

interface VoiceListenButtonProps {
  food: KaggleFoodItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'banner' | 'modal';
}

/**
 * 🔊 Accessible Listen / Stop Button for Food Cards & Food Details
 * Reads food name, explanation, nutrition and pregnancy safety in the user's selected language.
 * Displays prominent [ 🔇 Stop ] button when speech is playing.
 */
export const VoiceListenButton: React.FC<VoiceListenButtonProps> = ({
  food,
  className = '',
  size = 'md',
  variant = 'card'
}) => {
  const { currentLanguageCode } = useLanguage();
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);
  const itemKey = food.id || food.name;

  useEffect(() => {
    const unsubscribe = voiceService.subscribeSpeaking((speaking, activeKey) => {
      if (!speaking || activeKey !== itemKey) {
        setIsSpeakingThis(false);
      } else if (speaking && activeKey === itemKey) {
        setIsSpeakingThis(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [itemKey]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeakingThis) {
      voiceService.stopSpeaking();
      setIsSpeakingThis(false);
    } else {
      voiceService.stopSpeaking();
      setIsSpeakingThis(true);
      voiceService.speakFoodOverview(food, currentLanguageCode, () => {
        setIsSpeakingThis(false);
      });
    }
  };

  const labels = VOICE_LABELS[currentLanguageCode] || VOICE_LABELS.en;

  if (variant === 'modal') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer ${
          isSpeakingThis
            ? 'bg-[#BA1A1A] text-white hover:bg-[#93000A] animate-pulse ring-2 ring-red-400'
            : 'bg-[#523D35] text-[#EFEFE9] hover:bg-[#3D2C26]'
        } ${className}`}
        title={isSpeakingThis ? 'Stop voice readout immediately' : 'Listen to food overview in selected language'}
      >
        {isSpeakingThis ? (
          <>
            <Square className="w-4 h-4 fill-current text-white" />
            <span>🔇 {labels.stop}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#BBA58F]" />
            <span>🔊 {labels.listen}</span>
          </>
        )}
      </button>
    );
  }

  // Card Variant
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : 'px-3 py-1.5 text-xs font-bold gap-1.5';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center rounded-xl transition cursor-pointer font-bold ${
        isSpeakingThis
          ? 'bg-[#BA1A1A] text-white hover:bg-[#93000A] animate-pulse shadow-sm ring-2 ring-red-400'
          : 'bg-[#523D35]/10 text-[#523D35] hover:bg-[#523D35]/20 border border-[#523D35]/20'
      } ${sizeClasses} ${className}`}
      title={isSpeakingThis ? 'Stop voice readout' : 'Listen to food details aloud in selected language'}
    >
      {isSpeakingThis ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-white" />
          <span>🔇 {labels.stop}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 {labels.listen}</span>
        </>
      )}
    </button>
  );
};

interface VoiceNameSpeakerButtonProps {
  foodName: string;
  className?: string;
}

/**
 * 🔊 Compact speaker button right next to the Food Name
 * Allows toggling between pronunciation and immediate cancellation
 */
export const VoiceNameSpeakerButton: React.FC<VoiceNameSpeakerButtonProps> = ({
  foodName,
  className = ''
}) => {
  const { currentLanguageCode } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const itemKey = 'name-' + foodName;

  useEffect(() => {
    const unsubscribe = voiceService.subscribeSpeaking((speaking, activeKey) => {
      if (!speaking || activeKey !== itemKey) {
        setIsPlaying(false);
      } else if (speaking && activeKey === itemKey) {
        setIsPlaying(true);
      }
    });
    return () => unsubscribe();
  }, [itemKey]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      voiceService.stopSpeaking();
      setIsPlaying(false);
    } else {
      voiceService.stopSpeaking();
      setIsPlaying(true);
      voiceService.speakFoodName(foodName, currentLanguageCode, () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-1.5 rounded-full transition cursor-pointer shrink-0 ${
        isPlaying
          ? 'bg-[#BA1A1A] text-white animate-pulse shadow-xs ring-2 ring-red-400'
          : 'text-[#523D35] hover:bg-[#523D35]/15'
      } ${className}`}
      title={isPlaying ? 'Stop pronunciation' : `Pronounce ${foodName} in selected language`}
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};

interface VoiceSearchButtonProps {
  onSearchResult: (text: string) => void;
  className?: string;
}

/**
 * 🎤 Voice Search Button for Food Database
 * Recognizes speech in the user's selected language.
 */
export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onSearchResult,
  className = ''
}) => {
  const { currentLanguageCode } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const labels = VOICE_LABELS[currentLanguageCode] || VOICE_LABELS.en;

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isListening) {
      voiceService.stopSpeaking();
      setIsListening(false);
      setFeedbackMessage(null);
      return;
    }

    setIsListening(true);
    setFeedbackMessage(labels.listening);

    voiceService.startVoiceSearch(
      currentLanguageCode,
      (transcript) => {
        setIsListening(false);
        setFeedbackMessage(null);
        onSearchResult(transcript);
      },
      (errorMsg) => {
        setIsListening(false);
        setFeedbackMessage(errorMsg);
        setTimeout(() => setFeedbackMessage(null), 4000);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleStart}
        className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
          isListening
            ? 'bg-[#BA1A1A] text-white animate-pulse shadow-md ring-2 ring-[#BA1A1A]/40'
            : 'bg-[#523D35]/10 hover:bg-[#523D35]/20 text-[#523D35]'
        } ${className}`}
        title={isListening ? `${labels.stop} (Tap to cancel)` : `Voice Search (${labels.listen})`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {feedbackMessage && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 rounded-lg bg-[#223030] text-white text-xs whitespace-nowrap shadow-lg z-50 animate-fade-in pointer-events-none">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};
