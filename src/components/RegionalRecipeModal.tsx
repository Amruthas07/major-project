import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, Upload, RefreshCw, Check, AlertTriangle, 
  Sparkles, ChefHat, Plus, Trash2, Edit3, ArrowLeft, ArrowRight,
  ShieldCheck, Info, Heart, ShoppingBag, Calendar, ListPlus, Flame, Award
} from 'lucide-react';
import { 
  IndianRegion, REGIONS_LIST, REGION_TO_STATES, 
  RecipeIngredient, RecipeServingSize, RegionalRecipe, FoodSafetyLevel,
  NutritionDataSourceType
} from '../types/recipe';
import { 
  calculateRecipeNutrition, generatePregnancyNutritionNotes, 
  checkRecipeAllergies, evaluateRecipeFoodSafety 
} from '../utils/recipe_nutrition';
import { MATERNAL_NUTRIENT_METADATA, DetailedNutrients } from '../nutrition_engine';

interface RegionalRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: RegionalRecipe) => void;
  onAddToMealPlan?: (recipe: RegionalRecipe, day?: string, slot?: string) => void;
  onAddToFoodLog?: (recipe: RegionalRecipe, grams?: number) => void;
  onAddToShoppingList?: (ingredients: RecipeIngredient[]) => void;
  userProfile?: any;
  initialRecipe?: RegionalRecipe | null;
  language?: string;
}

export const RegionalRecipeModal: React.FC<RegionalRecipeModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
  onAddToMealPlan,
  onAddToFoodLog,
  onAddToShoppingList,
  userProfile,
  initialRecipe,
  language = 'en'
}) => {
  // Step state
  // 1: Region & State & City & Traditional Name & Photo
  // 2: Analysis & Ingredients Review & Serving Size
  // 3: Detailed Nutrition & Pregnancy Analysis & Final Actions
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [region, setRegion] = useState<IndianRegion>(initialRecipe?.region || 'South');
  const [state, setState] = useState<string>(initialRecipe?.state || 'Karnataka');
  const [city, setCity] = useState<string>(initialRecipe?.city || '');
  const [traditionalName, setTraditionalName] = useState<string>(initialRecipe?.traditionalName || '');
  const [photoUrl, setPhotoUrl] = useState<string>(initialRecipe?.referenceImageUrl || initialRecipe?.photoUrl || '');
  const [isImageUnavailable, setIsImageUnavailable] = useState<boolean>(!initialRecipe?.referenceImageUrl && !initialRecipe?.photoUrl);
  const [referenceImageSource, setReferenceImageSource] = useState<string>(initialRecipe?.referenceImageSource || 'User-provided personal meal photograph');
  const [referenceImageLicense, setReferenceImageLicense] = useState<string>(initialRecipe?.referenceImageLicense || 'Personal user photo');
  const [nutritionDataSourceType, setNutritionDataSourceType] = useState<NutritionDataSourceType>(initialRecipe?.nutritionDataSourceType || 'USER_PROVIDED');
  const [category, setCategory] = useState<string>(initialRecipe?.category || 'Main Dish');
  const [isVegetarian, setIsVegetarian] = useState<boolean>(initialRecipe?.isVegetarian ?? true);
  const [cookingMethod, setCookingMethod] = useState<string>(initialRecipe?.cookingMethod || 'Traditional Cooking');
  const [description, setDescription] = useState<string>(initialRecipe?.englishDescription || '');

  // Ingredients & Serving
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialRecipe?.ingredients || [
      { name: 'Ragi flour', quantity: 100, unit: 'g' },
      { name: 'Water', quantity: 250, unit: 'ml' },
      { name: 'Ghee', quantity: 5, unit: 'g' }
    ]
  );
  const [servingSize, setServingSize] = useState<RecipeServingSize>(
    initialRecipe?.servingSize || {
      totalGrams: 350,
      servings: 1,
      servingGrams: 350,
      servingUnit: '1 Serving'
    }
  );

  // Camera & Image handling
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis & Loading states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [foodSafety, setFoodSafety] = useState<{ level: FoodSafetyLevel; explanation: string }>({
    level: initialRecipe?.foodSafety?.level || 'Generally suitable',
    explanation: initialRecipe?.foodSafety?.explanation || 'Wholesome traditional preparation.'
  });
  const [allergens, setAllergens] = useState<string[]>(initialRecipe?.allergens || []);
  const [pregnancyNotes, setPregnancyNotes] = useState<string[]>(initialRecipe?.pregnancyNutritionNotes || []);

  // New ingredient form input
  const [newIngName, setNewIngName] = useState<string>('');
  const [newIngQty, setNewIngQty] = useState<number>(50);
  const [newIngUnit, setNewIngUnit] = useState<RecipeIngredient['unit']>('g');

  // Active nutrient category view
  const [activeNutrientTab, setActiveNutrientTab] = useState<'macros' | 'vitamins' | 'minerals' | 'all'>('macros');

  // Success message / action banner
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Update states when region changes
  useEffect(() => {
    const availableStates = REGION_TO_STATES[region] || [];
    if (!availableStates.includes(state)) {
      setState(availableStates[0] || '');
    }
  }, [region]);

  // Recalculate nutrition automatically when ingredients or serving size changes
  const computedNutrition = calculateRecipeNutrition(ingredients, servingSize);

  // Stop camera on unmount or close
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Camera stream starter
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. You can upload a photo from your files instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoUrl(dataUri);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger AI-Assisted Recipe Analysis
  const handleAnalyzeRecipe = async () => {
    if (!region || !state || !traditionalName.trim()) {
      setAnalysisError('Please enter the Region, State, and Traditional Recipe Name first.');
      return;
    }
    if (!photoUrl) {
      setAnalysisError('Please take or upload a Dish Photo for complete visual & regional analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/analyze-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          state,
          city,
          traditionalName: traditionalName.trim(),
          image: photoUrl,
          profile: userProfile
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.suggestedIngredients && data.suggestedIngredients.length > 0) {
        setIngredients(data.suggestedIngredients);
      }
      if (data.servingSize) {
        setServingSize(data.servingSize);
      }
      if (data.category) setCategory(data.category);
      if (data.cookingMethod) setCookingMethod(data.cookingMethod);
      if (data.description) setDescription(data.description);
      if (data.foodSafety) setFoodSafety(data.foodSafety);
      if (data.allergens) setAllergens(data.allergens);
      if (data.pregnancyNutritionNotes) setPregnancyNotes(data.pregnancyNutritionNotes);

      setStep(2); // Proceed to Review & Adjustments
    } catch (err: any) {
      console.warn('AI analysis API error, generating local clinical fallback:', err);
      // Fallback local clinical assessment
      const fallbackSafety = evaluateRecipeFoodSafety(traditionalName, ingredients, cookingMethod);
      const fallbackNotes = generatePregnancyNutritionNotes(computedNutrition.perServingNutrients, traditionalName, userProfile);
      setFoodSafety(fallbackSafety);
      setPregnancyNotes(fallbackNotes);
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ingredient Management
  const handleAddIngredient = () => {
    if (!newIngName.trim()) return;
    setIngredients(prev => [
      ...prev,
      {
        name: newIngName.trim(),
        quantity: Math.max(1, newIngQty),
        unit: newIngUnit
      }
    ]);
    setNewIngName('');
    setNewIngQty(50);
  };

  const handleUpdateIngredient = (index: number, updated: Partial<RecipeIngredient>) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, ...updated } : ing));
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  // Serving size handlers
  const handleServingsChange = (newServings: number) => {
    const s = Math.max(1, newServings);
    setServingSize(prev => ({
      ...prev,
      servings: s,
      servingGrams: Math.round(prev.totalGrams / s)
    }));
  };

  const handleTotalGramsChange = (newTotal: number) => {
    const total = Math.max(10, newTotal);
    setServingSize(prev => ({
      ...prev,
      totalGrams: total,
      servingGrams: Math.round(total / (prev.servings || 1))
    }));
  };

  // Build the complete final recipe record
  const constructFinalRecipe = (): RegionalRecipe => {
    const currentNutrients = computedNutrition.perServingNutrients;
    const currentNotes = pregnancyNotes.length > 0 
      ? pregnancyNotes 
      : generatePregnancyNutritionNotes(currentNutrients, traditionalName, userProfile);

    const hasPhoto = !isImageUnavailable && Boolean(photoUrl && photoUrl.trim().length > 0);

    return {
      recipeId: initialRecipe?.recipeId || `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      region,
      state,
      city: city.trim() || undefined,
      traditionalName: traditionalName.trim(),
      englishDescription: description || `Traditional authentic recipe from ${state}, ${region} India.`,
      photoUrl: hasPhoto ? photoUrl : '',
      referenceImageUrl: hasPhoto ? photoUrl : null,
      referenceImageSource: hasPhoto ? (referenceImageSource || 'User-provided recipe photo') : undefined,
      referenceImageLicense: hasPhoto ? (referenceImageLicense || 'User-owned photograph') : undefined,
      sourceReference: hasPhoto ? 'User meal contribution' : 'Verified ICMR-NIN Repository Entry',
      nutritionSource: nutritionDataSourceType === 'VERIFIED' ? 'ICMR-NIN IFCT 2017 & USDA FoodData Central' : 'User-provided & Aggregate Calculation',
      nutritionDataSourceType: nutritionDataSourceType || 'USER_PROVIDED',
      category: (category as any) || 'Main Dish',
      ingredients,
      servingSize,
      nutrition: currentNutrients,
      nutritionStatus: computedNutrition.status,
      foodSafety,
      allergens,
      pregnancyNutritionNotes: currentNotes,
      cookingMethod,
      isVegetarian,
      createdBy: 'user',
      createdAt: initialRecipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSave = () => {
    const finalRecipe = constructFinalRecipe();
    onSaveRecipe(finalRecipe);
    setActionSuccessMessage('✨ Recipe successfully saved to your Regional Recipe Collection!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleAddMealPlanClick = () => {
    const finalRecipe = constructFinalRecipe();
    onSaveRecipe(finalRecipe);
    if (onAddToMealPlan) {
      onAddToMealPlan(finalRecipe, 'Monday', 'Lunch');
    }
    setActionSuccessMessage('📅 Added recipe to your Weekly Meal Planner!');
  };

  const handleAddFoodLogClick = () => {
    const finalRecipe = constructFinalRecipe();
    onSaveRecipe(finalRecipe);
    if (onAddToFoodLog) {
      onAddToFoodLog(finalRecipe, servingSize.servingGrams);
    }
    setActionSuccessMessage('🥗 Logged recipe into today\'s Active Nutrition Intake!');
  };

  const handleAddShoppingListClick = () => {
    if (onAddToShoppingList) {
      onAddToShoppingList(ingredients);
    }
    setActionSuccessMessage('🛒 Recipe ingredients added to your Smart Shopping List!');
  };

  if (!isOpen) return null;

  const allergyAlerts = checkRecipeAllergies({ traditionalName, ingredients, allergens }, userProfile?.allergies || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-[#1E293B] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Regional Indian Recipe System</h2>
              <p className="text-[11px] text-slate-300">
                {step === 1 && 'Step 1: Region, State, Traditional Name & Photo'}
                {step === 2 && 'Step 2: Confirm & Adjust Ingredients & Serving Size'}
                {step === 3 && 'Step 3: Pregnancy Nutrition & Maternal Suitability'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step indicator pills */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-bold text-slate-300">
              <span className={`px-2 py-0.5 rounded-lg ${step === 1 ? 'bg-amber-500 text-slate-900 font-extrabold' : ''}`}>1. Details</span>
              <span className={`px-2 py-0.5 rounded-lg ${step === 2 ? 'bg-amber-500 text-slate-900 font-extrabold' : ''}`}>2. Ingredients</span>
              <span className={`px-2 py-0.5 rounded-lg ${step === 3 ? 'bg-amber-500 text-slate-900 font-extrabold' : ''}`}>3. Nutrition</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {actionSuccessMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ========================================================================= */}
          {/* STEP 1: REGION -> STATE -> CITY -> TRADITIONAL NAME -> DISH PHOTO */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Region & State & City Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Region Selector */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as IndianRegion)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  >
                    {REGIONS_LIST.map((r) => (
                      <option key={r} value={r}>{r} India</option>
                    ))}
                  </select>
                </div>

                {/* 2. State Selector */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    2. State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  >
                    {(REGION_TO_STATES[region] || []).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 3. City / Location (Optional) */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    3. City / Location <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mysuru, Amritsar, Madurai..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Traditional Recipe Name Input */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
                  4. Traditional Recipe Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ragi Mudde, Murungai Keerai Sambar, Methi Thepla, Sarson Ka Saag..."
                  value={traditionalName}
                  onChange={(e) => setTraditionalName(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-amber-500 transition shadow-inner"
                />
                <p className="text-[11px] text-amber-800">
                  💡 <strong>Authentic Name Rule:</strong> Your traditional recipe name is preserved exactly as entered and will not be altered or translated to English.
                </p>
              </div>

              {/* Dish Photo Capture / Upload Section */}
              <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      5. Photo of the Dish <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Provide an authentic photo of your prepared recipe plate.</p>
                  </div>

                  {photoUrl && (
                    <button
                      onClick={() => setPhotoUrl('')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                {/* Camera Viewfinder if active */}
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-72 flex items-center justify-center shadow-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-full shadow-lg flex items-center gap-2 transition"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Photo</span>
                      </button>
                      <button
                        onClick={() => {
                          setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
                          startCamera();
                        }}
                        className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        title="Flip Camera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-full"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : !isImageUnavailable && photoUrl ? (
                  /* Photo Preview */
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-video max-h-64 flex items-center justify-center group shadow-sm">
                      <img
                        src={photoUrl}
                        alt={traditionalName || 'Dish preview'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Retake</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Different</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                          Photo Source / Attribution
                        </label>
                        <input
                          type="text"
                          value={referenceImageSource}
                          onChange={(e) => setReferenceImageSource(e.target.value)}
                          placeholder="e.g. User Personal Meal Photo / Cooked at Home"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                          Image License
                        </label>
                        <input
                          type="text"
                          value={referenceImageLicense}
                          onChange={(e) => setReferenceImageLicense(e.target.value)}
                          placeholder="e.g. User-owned Photograph / CC-BY"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ) : isImageUnavailable ? (
                  /* Unavailable state banner */
                  <div className="p-6 bg-slate-100 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-800 rounded-full text-xs font-black uppercase">
                      Reference image unavailable
                    </span>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Recipe will be saved without a photograph. Unverified or AI-generated photos are strictly prohibited in the clinical database.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsImageUnavailable(false)}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      I have an authentic food photo to upload
                    </button>
                  </div>
                ) : (
                  /* Initial Capture / Upload Buttons */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="p-6 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition group"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-amber-700 transition">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-slate-800">Take Photo (Camera)</span>
                        <span className="text-[10px] text-slate-500">Live capture of actual dish</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 border-2 border-dashed border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition group"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-700 transition">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-slate-800">Upload Dish Photo</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG authentic photo</span>
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsImageUnavailable(true);
                          setPhotoUrl('');
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold hover:underline"
                      >
                        No verified photo available? Proceed with "Reference image unavailable"
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {cameraError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{cameraError}</span>
                  </p>
                )}
              </div>

              {/* Analysis Error Message if any */}
              {analysisError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAnalyzeRecipe}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Regional Nutrition Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Recipe & Confirm Ingredients</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: REVIEW & CONFIRM INGREDIENTS & SERVING SIZES */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Recipe Summary Preview Header */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {photoUrl && (
                    <img
                      src={photoUrl}
                      alt={traditionalName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      {region} India • {state} {city ? `(${city})` : ''}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{traditionalName}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{description || 'Traditional wholesome preparation'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Basic Info</span>
                </button>
              </div>

              {/* Ingredients List & Editor */}
              <div className="border border-slate-200 rounded-3xl p-5 bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Recipe Ingredients ({ingredients.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Edit quantities, remove ingredients, or add missing ingredients to ensure precise nutritional calculation.
                    </p>
                  </div>
                </div>

                {/* Ingredients table / items */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition"
                    >
                      <span className="text-xs font-bold text-slate-800 flex-1 min-w-0 truncate">
                        {ing.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={ing.quantity}
                          onChange={(e) => handleUpdateIngredient(idx, { quantity: Number(e.target.value) || 0 })}
                          className="w-20 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-black text-right text-slate-800 focus:ring-1 focus:ring-amber-500"
                        />
                        <select
                          value={ing.unit}
                          onChange={(e) => handleUpdateIngredient(idx, { unit: e.target.value as any })}
                          className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-700"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="cup">cup</option>
                          <option value="bowl">bowl</option>
                          <option value="piece">piece</option>
                          <option value="pinch">pinch</option>
                        </select>

                        <button
                          onClick={() => handleDeleteIngredient(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove ingredient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new ingredient sub-row */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Add ingredient (e.g. Toor dal, Spinach, Ghee)..."
                    value={newIngName}
                    onChange={(e) => setNewIngName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="number"
                    min="1"
                    value={newIngQty}
                    onChange={(e) => setNewIngQty(Number(e.target.value) || 0)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-black text-right"
                  />
                  <select
                    value={newIngUnit}
                    onChange={(e) => setNewIngUnit(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="cup">cup</option>
                    <option value="bowl">bowl</option>
                    <option value="piece">piece</option>
                    <option value="pinch">pinch</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 bg-[#54668E] hover:bg-[#363955] text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Serving Size Calculation Box */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-3xl p-5 space-y-4">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Serving Size & Yield
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Recipe Prepared (grams)</label>
                    <input
                      type="number"
                      min="10"
                      value={servingSize.totalGrams}
                      onChange={(e) => handleTotalGramsChange(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Number of Servings</label>
                    <input
                      type="number"
                      min="1"
                      value={servingSize.servings}
                      onChange={(e) => handleServingsChange(Number(e.target.value) || 1)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
                    />
                  </div>

                  <div className="bg-white border border-amber-200 rounded-xl p-2.5 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Calculated Per Serving</span>
                    <span className="text-sm font-black text-amber-900">
                      {servingSize.servingGrams} g <span className="text-[10px] text-slate-500 font-normal">({servingSize.servingUnit || '1 serving'})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Macro Bar Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Calories</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">{computedNutrition.perServingNutrients.calories} kcal</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Protein</span>
                  <p className="text-base font-black text-emerald-900 mt-0.5">{computedNutrition.perServingNutrients.protein} g</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Iron</span>
                  <p className="text-base font-black text-amber-900 mt-0.5">{computedNutrition.perServingNutrients.iron} mg</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Calcium</span>
                  <p className="text-base font-black text-blue-900 mt-0.5">{computedNutrition.perServingNutrients.calcium} mg</p>
                </div>
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Recipe Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-2xl shadow-md transition flex items-center gap-2"
                >
                  <span>View Maternal Nutrition Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: PREGNANCY NUTRITION ANALYSIS & MATERNAL ACTIONS */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6">

              {/* Allergy Warning if matched */}
              {allergyAlerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Personal Allergy Match Warning</span>
                  </div>
                  {allergyAlerts.map((msg, i) => (
                    <p key={i} className="text-xs text-rose-600">{msg}</p>
                  ))}
                </div>
              )}

              {/* Food Safety & Suitability Banner */}
              <div className={`rounded-3xl p-5 border flex items-start gap-4 ${
                foodSafety.level === 'Generally suitable' 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : foodSafety.level === 'Use caution'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  foodSafety.level === 'Generally suitable' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider">Pregnancy Suitability:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                      foodSafety.level === 'Generally suitable' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {foodSafety.level}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{foodSafety.explanation}</p>
                </div>
              </div>

              {/* Pregnancy Clinical Nutrition Highlights */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Antenatal Nutrition Highlights (Per Serving: {servingSize.servingGrams}g)</span>
                </h4>
                <div className="space-y-2">
                  {pregnancyNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Provenance & Verification Badge Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Data Attribution & Provenance
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Explicitly distinguish between lab-verified data, formula estimation, or user input.
                  </p>
                </div>
                <select
                  value={nutritionDataSourceType}
                  onChange={(e) => setNutritionDataSourceType(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-800 shadow-sm"
                >
                  <option value="VERIFIED">VERIFIED DATA (ICMR-NIN IFCT 2017 & USDA)</option>
                  <option value="ESTIMATED">ESTIMATED DATA (IFCT Ingredient Aggregation)</option>
                  <option value="USER_PROVIDED">USER-PROVIDED DATA (Custom Manual Entry)</option>
                  <option value="AI_ASSISTED">AI-ASSISTED DATA (Multimodal AI Verified)</option>
                </select>
              </div>

              {/* Complete Micronutrient Breakdown Tabs */}
              <div className="border border-slate-200 rounded-3xl p-5 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Nutritional Composition (IFCT 2017 & ICMR Standard)
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Status: {computedNutrition.status}
                    </span>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
                    <button
                      onClick={() => setActiveNutrientTab('macros')}
                      className={`px-2.5 py-1 rounded-lg transition ${activeNutrientTab === 'macros' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Macros
                    </button>
                    <button
                      onClick={() => setActiveNutrientTab('vitamins')}
                      className={`px-2.5 py-1 rounded-lg transition ${activeNutrientTab === 'vitamins' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Vitamins
                    </button>
                    <button
                      onClick={() => setActiveNutrientTab('minerals')}
                      className={`px-2.5 py-1 rounded-lg transition ${activeNutrientTab === 'minerals' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Minerals
                    </button>
                    <button
                      onClick={() => setActiveNutrientTab('all')}
                      className={`px-2.5 py-1 rounded-lg transition ${activeNutrientTab === 'all' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      All 30+ Nutrients
                    </button>
                  </div>
                </div>

                {/* Nutrient Grid Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                  {(Object.keys(MATERNAL_NUTRIENT_METADATA) as Array<keyof DetailedNutrients>).map(k => {
                    const meta = MATERNAL_NUTRIENT_METADATA[k];
                    if (!meta) return null;

                    if (activeNutrientTab === 'macros' && meta.category !== 'macronutrient') return null;
                    if (activeNutrientTab === 'vitamins' && meta.category !== 'vitamin') return null;
                    if (activeNutrientTab === 'minerals' && meta.category !== 'mineral') return null;

                    const val = computedNutrition.perServingNutrients[k] || 0;
                    return (
                      <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-500 block truncate">{meta.name}</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-sm font-black text-slate-900">{val}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{meta.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Action Tray */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Recipe Integration Actions
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Save this traditional dish or sync it with your daily logs, weekly meal planner, and shopping list.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <button
                    onClick={handleSave}
                    className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Recipe</span>
                  </button>

                  <button
                    onClick={handleAddMealPlanClick}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Add to Meal Plan</span>
                  </button>

                  <button
                    onClick={handleAddFoodLogClick}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ListPlus className="w-4 h-4 text-emerald-400" />
                    <span>Log as Today's Meal</span>
                  </button>

                  <button
                    onClick={handleAddShoppingListClick}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>Sync Shopping List</span>
                  </button>
                </div>
              </div>

              {/* Step Navigation Back Button */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Ingredients</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
