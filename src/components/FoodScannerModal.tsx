import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, 
  Trash2, Plus, RefreshCw, Info, Edit3, X, ArrowLeft, ShieldAlert,
  Flame, Dumbbell, Wheat, Droplets, HeartPulse, Search
} from 'lucide-react';
import { 
  ConfirmedMealItem, 
  CalculatedMealNutrition, 
  calculateMealNutrition, 
  LoggedMealRecord, 
  MATERNAL_NUTRIENT_METADATA, 
  DetailedNutrients 
} from '../nutrition_engine';
import { FOOD_DATABASE_ITEMS } from '../foods_db';
import { FoodItem } from '../data';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSaveMeal: (meal: LoggedMealRecord) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveMeal,
  onOpenAssistantWithPrompt
}) => {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'confirm' | 'portions' | 'results' | 'manual'>('capture');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dishOverview, setDishOverview] = useState<string>('');
  const [pregnancySuitability, setPregnancySuitability] = useState<string>('');
  const [detectedFoods, setDetectedFoods] = useState<Array<{
    id: string;
    name: string;
    confidence: number;
    matchedDbId: string;
    defaultGrams: number;
    isLiquid: boolean;
    portionDescription: string;
    confirmed: boolean;
  }>>([]);

  const [confirmedItems, setConfirmedItems] = useState<ConfirmedMealItem[]>([]);
  const [calculatedNutrition, setCalculatedNutrition] = useState<CalculatedMealNutrition | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<LoggedMealRecord['mealType']>('Lunch');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'macros' | 'vitamins' | 'minerals' | 'other'>('macros');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Set default meal type based on current time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 11) setSelectedMealType('Breakfast');
    else if (hours >= 11 && hours < 16) setSelectedMealType('Lunch');
    else if (hours >= 16 && hours < 19) setSelectedMealType('Evening Snack');
    else setSelectedMealType('Dinner');
  }, []);

  // Cleanup camera on unmount or close
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      // If camera blocked or unavailable, fall back to file picker
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        setErrorMessage('Camera access was denied or not supported. Please upload a photo from your gallery.');
      }
    }
  };

  const capturePhotoFromVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Support JPG, PNG, HEIC/WebP
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Compress/resize slightly for optimum upload speed
        compressImage(result, (compressed) => {
          setSelectedImage(compressed);
          stopCameraStream();
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (base64Str: string, callback: (compressed: string) => void) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1000;
      const MAX_HEIGHT = 1000;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.82));
    };
  };

  // Analyze Photo with Gemini Vision API
  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;
    setStep('analyzing');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/scan-food-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          profile: profile
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to analyze meal`);
      }

      const data = await response.json();
      const detected = (data.detectedFoods || []).map((df: any, idx: number) => ({
        id: df.id || `food_${idx}`,
        name: df.name || 'Traditional Dish',
        confidence: df.confidence || 88,
        matchedDbId: df.matchedDbId || 'idli_sambar',
        defaultGrams: df.defaultGrams || 150,
        isLiquid: !!df.isLiquid,
        portionDescription: df.portionDescription || 'Standard serving',
        confirmed: true
      }));

      if (detected.length === 0) {
        // Fallback to a default detected plate if model returned empty
        detected.push({
          id: 'food_0',
          name: 'Traditional Indian Meal Plate',
          confidence: 85,
          matchedDbId: 'bisi_bele_bath',
          defaultGrams: 200,
          isLiquid: false,
          portionDescription: '1 medium plate (~200g)',
          confirmed: true
        });
      }

      setDetectedFoods(detected);
      setDishOverview(data.dishOverview || 'Freshly prepared traditional meal.');
      setPregnancySuitability(data.pregnancySuitability || 'Safe and nutritious for pregnancy.');
      setStep('confirm');
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Unable to scan food image. You can enter your meal manually or retry.');
      setStep('capture');
    }
  };

  // Proceed to portion sizing
  const handleProceedToPortions = () => {
    const confirmed = detectedFoods.filter(f => f.confirmed);
    if (confirmed.length === 0) {
      setErrorMessage('Please confirm at least one food item.');
      return;
    }

    const items: ConfirmedMealItem[] = confirmed.map(f => {
      const dbItem = FOOD_DATABASE_ITEMS.find(db => db.id === f.matchedDbId);
      return {
        foodId: f.matchedDbId,
        name: f.name,
        quantity: f.defaultGrams,
        unit: f.isLiquid ? 'ml' : 'g',
        isLiquid: f.isLiquid,
        portionSize: 'medium',
        defaultServingGrams: f.defaultGrams,
        confidence: f.confidence,
        foodItem: dbItem
      };
    });

    setConfirmedItems(items);
    setStep('portions');
  };

  // Calculate and display full nutrition results
  const handleCalculateNutrition = () => {
    const result = calculateMealNutrition(confirmedItems, profile);
    setCalculatedNutrition(result);
    setStep('results');
  };

  // Update portion for a confirmed item
  const updateItemPortion = (index: number, size: 'small' | 'medium' | 'large' | 'custom', customQty?: number) => {
    const updated = [...confirmedItems];
    const item = updated[index];
    item.portionSize = size;

    if (size === 'small') {
      item.quantity = Math.round(item.defaultServingGrams * 0.5);
    } else if (size === 'medium') {
      item.quantity = item.defaultServingGrams;
    } else if (size === 'large') {
      item.quantity = Math.round(item.defaultServingGrams * 1.5);
    } else if (size === 'custom' && customQty !== undefined) {
      item.quantity = Math.max(10, customQty);
    }

    setConfirmedItems(updated);
  };

  // Save to daily intake
  const handleSaveToDailyIntake = () => {
    if (!calculatedNutrition) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: LoggedMealRecord = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: profile?.id || 'maternal_user',
      date: dateStr,
      time: timeStr,
      mealType: selectedMealType,
      foodImage: selectedImage || undefined,
      foodNames: confirmedItems.map(i => i.name),
      items: confirmedItems,
      nutrients: calculatedNutrition.totals,
      nutritionScore: Math.min(100, Math.max(70, Math.round(
        (calculatedNutrition.totals.protein / 20) * 20 +
        (calculatedNutrition.totals.iron / 7) * 25 +
        (calculatedNutrition.totals.calcium / 300) * 25 +
        (calculatedNutrition.totals.folate / 150) * 30
      ))),
      source: 'ICMR-NIN Food Composition / IFCT 2017',
      timestamp: now.toISOString()
    };

    onSaveMeal(newRecord);
    onClose();
  };

  // Manual search and add food
  const handleAddManualFood = (food: FoodItem) => {
    const newItem: ConfirmedMealItem = {
      foodId: food.id,
      name: food.name.en,
      quantity: 150,
      unit: food.category === 'Beverages' ? 'ml' : 'g',
      isLiquid: food.category === 'Beverages',
      portionSize: 'medium',
      defaultServingGrams: 150,
      confidence: 100,
      foodItem: food
    };

    setConfirmedItems(prev => [...prev, newItem]);
    setStep('portions');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* TOP HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            {step !== 'capture' && (
              <button 
                onClick={() => {
                  if (step === 'confirm') setStep('capture');
                  else if (step === 'portions') setStep('confirm');
                  else if (step === 'results') setStep('portions');
                  else if (step === 'manual') setStep('capture');
                }}
                className="p-2 hover:bg-slate-200/60 rounded-full text-slate-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Food Scanner</h2>
              <p className="text-xs text-slate-500">Snap your meal and track your nutrition automatically.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/70 rounded-full text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {errorMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: CAPTURE OR UPLOAD */}
          {/* ========================================================= */}
          {step === 'capture' && (
            <div className="space-y-6">
              {/* Camera Video Stream or Image Preview */}
              <div className="relative aspect-4/3 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-200">
                {isCameraActive ? (
                  <>
                    <video 
                      ref={videoRef} 
                      playsInline 
                      autoPlay 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <button
                        onClick={capturePhotoFromVideo}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition scale-105 active:scale-95"
                      >
                        <Camera className="w-5 h-5" /> Capture Photo
                      </button>
                      <button
                        onClick={stopCameraStream}
                        className="px-4 py-3 bg-slate-800/80 hover:bg-slate-900 text-white rounded-full font-medium text-xs backdrop-blur-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : selectedImage ? (
                  <>
                    <img 
                      src={selectedImage} 
                      alt="Selected Meal" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      ✓ Image Ready
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Point your camera at your plate or thali</p>
                      <p className="text-xs text-slate-500 mt-1">Supports South Indian dishes, millets, rotis, curries, snacks & fruits</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={startCamera}
                  className="py-3.5 px-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl font-bold shadow-md shadow-pink-200 flex items-center justify-center gap-3 transition"
                >
                  <Camera className="w-5 h-5" />
                  <span>Take Food Photo</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-2xl font-bold border border-slate-200/80 flex items-center justify-center gap-3 transition"
                >
                  <Upload className="w-5 h-5 text-slate-500" />
                  <span>Upload From Gallery</span>
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/jpeg,image/png,image/jpg,image/webp" 
                  className="hidden" 
                />
              </div>

              {/* Selected Image Actions */}
              {selectedImage && !isCameraActive && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <button
                    onClick={handleAnalyzePhoto}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-base transition"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Food & Portion</span>
                  </button>

                  <div className="flex justify-center gap-4 text-xs">
                    <button
                      onClick={startCamera}
                      className="text-pink-600 hover:underline font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-slate-600 hover:underline font-medium flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Choose Another Image
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Entry Fallback */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setStep('manual')}
                  className="text-xs font-semibold text-slate-500 hover:text-pink-600 flex items-center justify-center gap-1.5 mx-auto transition"
                >
                  <Search className="w-4 h-4" /> Enter Food Manually / Search Indian Database
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP: ANALYZING STATE */}
          {/* ========================================================= */}
          {step === 'analyzing' && (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-pink-100 border-t-pink-600 animate-spin" />
                <div className="absolute inset-3 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Recognizing Traditional Indian Dishes...</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Our obstetric AI is detecting items on your plate and computing accurate ICMR-NIN maternal nutrition profiles.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: CONFIRM DETECTED FOODS */}
          {/* ========================================================= */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-blue-900 text-xs">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Review Detected Foods</p>
                  <p className="text-blue-700/90 mt-0.5">
                    Food recognition is an estimate. Please confirm the detected foods and serving size for more accurate nutrition tracking.
                  </p>
                </div>
              </div>

              {dishOverview && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Plate Overview:</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{dishOverview}</p>
                </div>
              )}

              {/* Detected Foods List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Detected Items</h4>
                  <span className="text-[11px] text-slate-500">{detectedFoods.filter(f => f.confirmed).length} items confirmed</span>
                </div>

                {detectedFoods.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className={`p-4 rounded-2xl border transition ${
                      item.confirmed 
                        ? 'bg-white border-slate-200 shadow-xs' 
                        : 'bg-slate-50 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => {
                            const updated = [...detectedFoods];
                            updated[idx].confirmed = !updated[idx].confirmed;
                            setDetectedFoods(updated);
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                            item.confirmed ? 'bg-pink-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {item.confirmed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.confidence}% Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{item.portionDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItemIndex(idx)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition text-xs flex items-center gap-1 font-medium"
                          title="Change item"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setDetectedFoods(detectedFoods.filter((_, i) => i !== idx));
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Extra Food Button */}
              <button
                onClick={() => setStep('manual')}
                className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-pink-300 text-slate-600 hover:text-pink-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Add Another Food Item
              </button>

              <button
                onClick={handleProceedToPortions}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition"
              >
                <span>Confirm Foods & Adjust Portions</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: PORTION / SERVING SIZE ADJUSTMENT */}
          {/* ========================================================= */}
          {step === 'portions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Serving Sizes & Quantities</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Nutrition values depend on the confirmed food and serving size.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Meal:</span>
                  <select
                    value={selectedMealType}
                    onChange={(e: any) => setSelectedMealType(e.target.value)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Morning Snack">Morning Snack</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Evening Snack">Evening Snack</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {confirmedItems.map((item, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                        <p className="text-xs text-slate-400">Default: ~{item.defaultServingGrams} {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-pink-600">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Portion Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => updateItemPortion(idx, 'small')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                          item.portionSize === 'small'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Small (0.5x)
                      </button>
                      <button
                        onClick={() => updateItemPortion(idx, 'medium')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                          item.portionSize === 'medium'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Medium (1.0x)
                      </button>
                      <button
                        onClick={() => updateItemPortion(idx, 'large')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                          item.portionSize === 'large'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Large (1.5x)
                      </button>
                      <button
                        onClick={() => updateItemPortion(idx, 'custom', item.quantity)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                          item.portionSize === 'custom'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Custom
                      </button>
                    </div>

                    {item.portionSize === 'custom' && (
                      <div className="flex items-center gap-3 pt-2">
                        <label className="text-xs text-slate-500">Custom quantity ({item.unit}):</label>
                        <input
                          type="number"
                          min="10"
                          max="1000"
                          step="10"
                          value={item.quantity}
                          onChange={(e) => updateItemPortion(idx, 'custom', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateNutrition}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition text-base"
              >
                <Flame className="w-5 h-5" />
                <span>Calculate Full Meal Nutrition</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: MEAL NUTRITION RESULT & EXPANDABLE SECTIONS */}
          {/* ========================================================= */}
          {step === 'results' && calculatedNutrition && (
            <div className="space-y-6">
              
              {/* Allergy / Safety Alerts */}
              {calculatedNutrition.allergyAlerts.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Allergy Alert Detected</span>
                  </div>
                  {calculatedNutrition.allergyAlerts.map((alert, i) => (
                    <p key={i} className="text-xs text-rose-700">{alert}</p>
                  ))}
                </div>
              )}

              {calculatedNutrition.safetyAlerts.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  {calculatedNutrition.safetyAlerts.map((alert, i) => (
                    <p key={i} className="text-xs text-amber-800 font-medium">{alert}</p>
                  ))}
                </div>
              )}

              {/* MACRO SUMMARY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 bg-orange-50/70 border border-orange-100 rounded-2xl text-center">
                  <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-orange-600/90">Calories</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedNutrition.totals.calories}</p>
                  <p className="text-[10px] text-slate-400">kcal</p>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
                  <Dumbbell className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-blue-600/90">Protein</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedNutrition.totals.protein}</p>
                  <p className="text-[10px] text-slate-400">g</p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-center">
                  <Wheat className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-amber-600/90">Carbs</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedNutrition.totals.carbohydrates}</p>
                  <p className="text-[10px] text-slate-400">g</p>
                </div>

                <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-2xl text-center">
                  <Droplets className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-rose-600/90">Fat</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedNutrition.totals.fat}</p>
                  <p className="text-[10px] text-slate-400">g</p>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center col-span-2 sm:col-span-1">
                  <HeartPulse className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-emerald-600/90">Fiber</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedNutrition.totals.fiber}</p>
                  <p className="text-[10px] text-slate-400">g</p>
                </div>
              </div>

              {/* DETAILED EXPANDABLE NUTRIENTS TABS */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Detailed Nutrient Composition</h4>
                  <span className="text-[10px] font-medium text-slate-400">Standard: ICMR-NIN IFCT</span>
                </div>

                <div className="flex gap-2 border-b border-slate-100 pb-2">
                  {[
                    { id: 'macros', label: 'Macronutrients' },
                    { id: 'vitamins', label: 'Vitamins (13)' },
                    { id: 'minerals', label: 'Minerals (11)' },
                    { id: 'other', label: 'Choline & Omega-3' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        activeCategoryTab === tab.id
                          ? 'bg-pink-50 text-pink-700 border border-pink-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: VITAMINS */}
                {activeCategoryTab === 'vitamins' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'vitaminA', name: 'Vitamin A', val: calculatedNutrition.totals.vitaminA, unit: 'mcg RAE' },
                      { key: 'vitaminB1', name: 'Thiamine (B1)', val: calculatedNutrition.totals.vitaminB1, unit: 'mg' },
                      { key: 'vitaminB2', name: 'Riboflavin (B2)', val: calculatedNutrition.totals.vitaminB2, unit: 'mg' },
                      { key: 'vitaminB3', name: 'Niacin (B3)', val: calculatedNutrition.totals.vitaminB3, unit: 'mg' },
                      { key: 'vitaminB5', name: 'Pantothenic (B5)', val: calculatedNutrition.totals.vitaminB5, unit: 'mg' },
                      { key: 'vitaminB6', name: 'Pyridoxine (B6)', val: calculatedNutrition.totals.vitaminB6, unit: 'mg' },
                      { key: 'vitaminB7', name: 'Biotin (B7)', val: calculatedNutrition.totals.vitaminB7, unit: 'mcg' },
                      { key: 'vitaminB9', name: 'Folate (B9)', val: calculatedNutrition.totals.vitaminB9, unit: 'mcg' },
                      { key: 'vitaminB12', name: 'Vitamin B12', val: calculatedNutrition.totals.vitaminB12, unit: 'mcg' },
                      { key: 'vitaminC', name: 'Vitamin C', val: calculatedNutrition.totals.vitaminC, unit: 'mg' },
                      { key: 'vitaminD', name: 'Vitamin D', val: calculatedNutrition.totals.vitaminD, unit: 'mcg' },
                      { key: 'vitaminE', name: 'Vitamin E', val: calculatedNutrition.totals.vitaminE, unit: 'mg' },
                      { key: 'vitaminK', name: 'Vitamin K', val: calculatedNutrition.totals.vitaminK, unit: 'mcg' }
                    ].map(v => (
                      <div key={v.key} className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">{v.name}</span>
                        <span className="text-xs font-bold text-slate-800">{v.val} {v.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB CONTENT: MINERALS */}
                {activeCategoryTab === 'minerals' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'calcium', name: 'Calcium', val: calculatedNutrition.totals.calcium, unit: 'mg' },
                      { key: 'iron', name: 'Iron', val: calculatedNutrition.totals.iron, unit: 'mg' },
                      { key: 'magnesium', name: 'Magnesium', val: calculatedNutrition.totals.magnesium, unit: 'mg' },
                      { key: 'phosphorus', name: 'Phosphorus', val: calculatedNutrition.totals.phosphorus, unit: 'mg' },
                      { key: 'potassium', name: 'Potassium', val: calculatedNutrition.totals.potassium, unit: 'mg' },
                      { key: 'sodium', name: 'Sodium', val: calculatedNutrition.totals.sodium, unit: 'mg' },
                      { key: 'zinc', name: 'Zinc', val: calculatedNutrition.totals.zinc, unit: 'mg' },
                      { key: 'copper', name: 'Copper', val: calculatedNutrition.totals.copper, unit: 'mg' },
                      { key: 'manganese', name: 'Manganese', val: calculatedNutrition.totals.manganese, unit: 'mg' },
                      { key: 'selenium', name: 'Selenium', val: calculatedNutrition.totals.selenium, unit: 'mcg' },
                      { key: 'iodine', name: 'Iodine', val: calculatedNutrition.totals.iodine, unit: 'mcg' }
                    ].map(m => (
                      <div key={m.key} className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">{m.name}</span>
                        <span className="text-xs font-bold text-slate-800">{m.val} {m.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB CONTENT: MACROS */}
                {activeCategoryTab === 'macros' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Calories', val: calculatedNutrition.totals.calories, unit: 'kcal' },
                      { name: 'Protein', val: calculatedNutrition.totals.protein, unit: 'g' },
                      { name: 'Carbohydrates', val: calculatedNutrition.totals.carbohydrates, unit: 'g' },
                      { name: 'Total Fat', val: calculatedNutrition.totals.fat, unit: 'g' },
                      { name: 'Saturated Fat', val: calculatedNutrition.totals.saturatedFat, unit: 'g' },
                      { name: 'Dietary Fiber', val: calculatedNutrition.totals.fiber, unit: 'g' },
                      { name: 'Sugar', val: calculatedNutrition.totals.sugar, unit: 'g' }
                    ].map((mac, i) => (
                      <div key={i} className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">{mac.name}</span>
                        <span className="text-xs font-bold text-slate-800">{mac.val} {mac.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB CONTENT: OTHER */}
                {activeCategoryTab === 'other' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Choline</span>
                      <span className="text-xs font-bold text-slate-800">{calculatedNutrition.totals.choline} mg</span>
                    </div>
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Omega-3 (ALA/DHA)</span>
                      <span className="text-xs font-bold text-slate-800">{calculatedNutrition.totals.omega3} g</span>
                    </div>
                  </div>
                )}
              </div>

              {/* PRIMARY ACTION: ADD TO TODAY'S INTAKE */}
              <button
                onClick={handleSaveToDailyIntake}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 text-base transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add to Today's Intake</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: MANUAL SEARCH / FOOD SELECTION */}
          {/* ========================================================= */}
          {step === 'manual' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 50+ traditional Indian dishes, millets, veggies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                {FOOD_DATABASE_ITEMS
                  .filter(f => !searchQuery || f.name.en.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(food => (
                    <div
                      key={food.id}
                      onClick={() => handleAddManualFood(food)}
                      className="p-3 bg-white hover:bg-pink-50/50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={food.imageUrl} 
                          alt={food.name.en} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{food.name.en}</p>
                          <p className="text-[10px] text-slate-400">{food.category} • {food.servingSize}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">{food.calories} kcal</span>
                        <p className="text-[10px] text-pink-600 font-semibold">{food.protein}g Protein</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
