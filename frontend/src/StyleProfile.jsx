import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  Ruler, 
  User, 
  Palette, 
  Scissors, 
  HeartHandshake, 
  Compass, 
  Lightbulb,
  CheckCircle2
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const questions = [
  {
    field: "height",
    title: "What is your vertical height profile?",
    subtitle: "Select your height bracket or provide precise measurement.",
    type: "height",
    icon: Ruler,
    options: [
      "Below 5'0\"",
      "5'0\" – 5'2\"",
      "5'3\" – 5'5\"",
      "5'6\" – 5'8\"",
      "5'9\" – 5'11\"",
      "6'0\" or above",
    ],
  },
  {
    field: "bodyShape",
    title: "Which body silhouette best describes you?",
    subtitle: "Helps us calculate flattering hem lengths and drape geometries.",
    type: "single",
    icon: User,
    options: [
      "Hourglass",
      "Pear / Triangle",
      "Apple / Oval",
      "Rectangle",
      "Inverted Triangle",
      "Not sure",
    ],
  },
  {
    field: "preferredStyles",
    title: "Which fashion aesthetics resonate with you?",
    subtitle: "Select all personal style genres you naturally gravitate towards.",
    type: "multiple",
    icon: Sparkles,
    options: [
      "Casual",
      "Minimalist",
      "Elegant / Chic",
      "Streetwear",
      "Vintage",
      "Old Money",
      "Bohemian",
      "Traditional",
    ],
  },
  {
    field: "favoriteColors",
    title: "Which color palettes illuminate your wardrobe?",
    subtitle: "Choose the color families you feel most confident wearing.",
    type: "multiple",
    icon: Palette,
    options: [
      "Pastel colors",
      "Neutral colors",
      "Earthy tones",
      "Bright / Vibrant colors",
      "Dark colors",
      "Monochrome",
    ],
  },
  {
    field: "dislikedColorsPatterns",
    title: "Are there colors or prints you prefer to avoid?",
    subtitle: "We will filter these out of your AI recommendation capsules.",
    type: "multiple",
    icon: Scissors,
    options: [
      "Neon colors",
      "Bright colors",
      "Dark colors",
      "Floral prints",
      "Stripes / Checks",
      "Bold patterns",
      "No specific dislikes",
    ],
  },
  {
    field: "preferredClothingItems",
    title: "Which staple garments define your day-to-day?",
    subtitle: "Select your favorite wardrobe foundation pieces.",
    type: "multiple",
    icon: Scissors,
    options: [
      "T-shirts",
      "Shirts",
      "Tops",
      "Kurtis",
      "Dresses",
      "Jeans",
      "Trousers",
      "Skirts",
      "Sarees",
      "Salwar Kameez",
    ],
  },
  {
    field: "preferredFits",
    title: "What garment silhouette fits do you prefer?",
    subtitle: "How would you like garments to sit on your frame?",
    type: "multiple",
    icon: Scissors,
    options: [
      "Oversized",
      "Relaxed fit",
      "Regular fit",
      "Slim fit",
      "Body fit",
    ],
  },
  {
    field: "comfortableOutfitType",
    title: "Which aesthetic mood feels most authentically you?",
    subtitle: "The overall sensation you look for when checking the mirror.",
    type: "single",
    icon: HeartHandshake,
    options: [
      "Simple and comfortable",
      "Trendy and fashionable",
      "Elegant and sophisticated",
      "Bold and experimental",
      "Modest and traditional",
    ],
  },
  {
    field: "preferredOccasions",
    title: "Which occasions do you need curated looks for?",
    subtitle: "We prioritize styling rules for your daily routines.",
    type: "multiple",
    icon: Compass,
    options: [
      "University",
      "Office",
      "Casual outing",
      "Party",
      "Wedding",
      "Formal events",
      "Travel",
    ],
  },
  {
    field: "fashionInspirations",
    title: "Where do you draw creative style inspiration?",
    subtitle: "Helps the AI adapt moodboard references to your closet.",
    type: "multiple",
    icon: Lightbulb,
    options: [
      "Pinterest / Fashion moodboards",
      "Instagram fashion trends",
      "Celebrities / Influencers",
      "Movies / TV show characters",
      "Korean fashion / K-fashion",
      "Traditional cultural fashion",
      "Personal creativity",
      "Seasonal fashion trends",
    ],
  },
];

const initialAnswers = {
  height: "",
  bodyShape: "",
  preferredStyles: [],
  favoriteColors: [],
  dislikedColorsPatterns: [],
  preferredClothingItems: [],
  preferredFits: [],
  comfortableOutfitType: "",
  preferredOccasions: [],
  fashionInspirations: [],
};

export default function StyleProfile({ onComplete, onLogout, onBackToDashboard }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [manualHeight, setManualHeight] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingProfileLoaded, setExistingProfileLoaded] = useState(false);

  // If user already has a style profile, pre-fill it for review/editing!
  useEffect(() => {
    const fetchExistingProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/style-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.profile) {
          setAnswers({
            height: data.profile.height || "",
            bodyShape: data.profile.bodyShape || "",
            preferredStyles: data.profile.preferredStyles || [],
            favoriteColors: data.profile.favoriteColors || [],
            dislikedColorsPatterns: data.profile.dislikedColorsPatterns || [],
            preferredClothingItems: data.profile.preferredClothingItems || [],
            preferredFits: data.profile.preferredFits || [],
            comfortableOutfitType: data.profile.comfortableOutfitType || "",
            preferredOccasions: data.profile.preferredOccasions || [],
            fashionInspirations: data.profile.fashionInspirations || [],
          });
          setExistingProfileLoaded(true);
        }
      } catch (err) {
        // No existing profile, that's normal for onboarding
      }
    };

    fetchExistingProfile();
  }, []);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const CurrentIcon = currentQuestion.icon || Sparkles;

  // Single Selection
  const handleSingleSelect = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  // Multiple Selection
  const handleMultipleSelect = (field, value) => {
    setAnswers((prev) => {
      let updated;

      if (prev[field].includes(value)) {
        updated = prev[field].filter((item) => item !== value);
      } else if (
        field === "dislikedColorsPatterns" &&
        value === "No specific dislikes"
      ) {
        updated = ["No specific dislikes"];
      } else if (field === "dislikedColorsPatterns") {
        updated = [
          ...prev[field].filter((item) => item !== "No specific dislikes"),
          value,
        ];
      } else {
        updated = [...prev[field], value];
      }

      return {
        ...prev,
        [field]: updated,
      };
    });

    setError("");
  };

  // Validation
  const validateQuestion = () => {
    const value = answers[currentQuestion.field];

    if (Array.isArray(value) && value.length === 0) {
      setError("Please select at least one preference option to proceed.");
      return false;
    }

    if (!Array.isArray(value) && !value.trim()) {
      setError("Please select or enter your answer.");
      return false;
    }

    return true;
  };

  // Step Forward
  const handleNext = () => {
    if (!validateQuestion()) return;
    setError("");

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Step Backward
  const handlePrevious = () => {
    setError("");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit Profile
  const handleSubmit = async () => {
    if (!validateQuestion()) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/style-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      });

      const data = await response.json();

      // If already exists (409), treat as completed
      if (response.status === 409) {
        if (onComplete) onComplete(answers);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to record your style profile.");
      }

      if (onComplete) {
        onComplete(data.profile);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (field, option) => {
    const value = answers[field];
    return Array.isArray(value) ? value.includes(option) : value === option;
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] px-4 py-10 sm:px-8 text-[#292526]">
      <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
        
        {/* Editorial Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E0D7]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#452C3A] text-xs font-bold text-[#F7F3EE]">
              OM
            </span>
            <div>
              <span className="font-serif-editorial text-xl font-bold tracking-wider text-[#452C3A]">
                OUTFITMUSE
              </span>
              <p className="text-[11px] text-[#84917C] font-semibold">
                Haute Style Questionnaire
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-xs font-semibold text-[#686163] hover:text-[#452C3A] transition"
              >
                ← Back to Atelier
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-[#DCCDBD] bg-white px-4 py-1.5 text-xs font-semibold text-[#686163] hover:text-[#452C3A]"
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        {/* Questionnaire Intro */}
        <div className="text-center space-y-2 pt-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F4E8E9] px-3.5 py-1 text-xs font-bold text-[#452C3A]">
            <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
            Personal Aesthetic Blueprint
          </span>

          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#452C3A]">
            Refine Your Style Persona
          </h2>

          <p className="mx-auto max-w-lg text-xs leading-relaxed text-[#686163]">
            These fashion preferences guide our algorithms to curate silhouettes, color harmonies, and weather-adaptive daily pairings for your wardrobe.
          </p>
        </div>

        {/* Smooth Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#452C3A]">
              Stage {currentStep + 1} of {questions.length}
            </span>
            <span className="text-[#84917C]">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCCDBD]/40">
            <div
              className="h-full rounded-full bg-[#452C3A] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card Frame */}
        <div className="rounded-3xl border border-[#DCCDBD] bg-white p-6 sm:p-10 shadow-xs">
          
          {/* Question Title Header */}
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF6F2] text-[#452C3A]">
                <CurrentIcon className="h-4 w-4 text-[#C58D91]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#84917C]">
                Question {currentStep + 1}
              </span>
            </div>

            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold leading-snug text-[#452C3A]">
              {currentQuestion.title}
            </h3>

            <p className="text-xs text-[#686163]">
              {currentQuestion.subtitle}
            </p>

            {currentQuestion.type === "multiple" && (
              <span className="inline-block rounded-md bg-[#EDF1EC] px-2.5 py-0.5 text-[10px] font-bold text-[#84917C] uppercase tracking-wider">
                Multiple selections permitted
              </span>
            )}
          </div>

          {/* Height Question Type */}
          {currentQuestion.type === "height" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const active = answers.height === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setManualHeight("");
                        handleSingleSelect("height", option);
                      }}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left text-xs font-semibold transition-all ${
                        active
                          ? "border-[#452C3A] bg-[#452C3A] text-[#F7F3EE] shadow-xs"
                          : "border-[#E8E0D7] bg-[#FAF6F2] text-[#292526] hover:border-[#C58D91] hover:bg-white"
                      }`}
                    >
                      <span>{option}</span>
                      {active && <Check className="h-4 w-4 text-[#C58D91]" />}
                    </button>
                  );
                })}
              </div>

              {/* Manual Height Input */}
              <div className="pt-4 border-t border-[#E8E0D7]">
                <label className="mb-1.5 block text-xs font-semibold text-[#452C3A]">
                  Or input exact metric height:
                </label>
                <input
                  type="text"
                  value={manualHeight}
                  onChange={(e) => {
                    setManualHeight(e.target.value);
                    handleSingleSelect("height", e.target.value);
                  }}
                  placeholder='e.g. 168 cm or 5&apos;6"'
                  className="h-11 w-full rounded-xl border border-[#DCCDBD] bg-white px-4 text-xs text-[#292526] placeholder:text-[#686163]/50 outline-none transition focus:border-[#452C3A]"
                />
              </div>
            </div>
          )}

          {/* Single or Multiple Selection Question Types */}
          {(currentQuestion.type === "single" ||
            currentQuestion.type === "multiple") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => {
                const selected = isSelected(currentQuestion.field, option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      if (currentQuestion.type === "single") {
                        handleSingleSelect(currentQuestion.field, option);
                      } else {
                        handleMultipleSelect(currentQuestion.field, option);
                      }
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left text-xs font-semibold transition-all duration-200 ${
                      selected
                        ? "border-[#452C3A] bg-[#452C3A] text-[#F7F3EE] shadow-xs"
                        : "border-[#E8E0D7] bg-[#FAF6F2] text-[#292526] hover:border-[#C58D91] hover:bg-white"
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center text-xs transition-colors ${
                        currentQuestion.type === "multiple"
                          ? "rounded-md"
                          : "rounded-full"
                      } ${
                        selected
                          ? "bg-[#C58D91] text-white"
                          : "border border-[#DCCDBD] bg-white"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-2xl border border-[#C58D91] bg-[#F4E8E9] p-3.5 text-xs font-semibold text-[#452C3A] animate-fade-in">
              {error}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-[#E8E0D7]">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
              className="flex items-center gap-2 rounded-full border border-[#DCCDBD] bg-white px-5 py-2.5 text-xs font-semibold text-[#686163] transition hover:text-[#452C3A] disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-[#452C3A] px-7 py-2.5 text-xs font-semibold text-[#F7F3EE] shadow-sm transition hover:bg-[#57384A]"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C58D91]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#452C3A] px-8 py-3 text-xs font-semibold text-[#F7F3EE] shadow-md transition hover:bg-[#57384A] disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
                <span>{loading ? "Recording Preferences..." : "Finalize Style Blueprint"}</span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom Editorial Footnote */}
        <p className="text-center text-[11px] text-[#686163]">
          Your questionnaire data is strictly encrypted and used solely for generating private outfit suggestions.
        </p>

      </div>
    </div>
  );
}
