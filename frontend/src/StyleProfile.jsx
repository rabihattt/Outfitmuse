
import { useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const questions = [
    {
        field: "height",
        title: "What is your height?",
        subtitle: "Select your height or enter it manually.",
        type: "height",
        options: [
            "Below 5'0\"",
            "5'0\" – 5'2\"",
            "5'3\" – 5'5\"",
            "5'6\" – 5'8\"",
            "5'9\" – 5'11\"",
            "6'0\" or above"
        ]
    },
    {
        field: "bodyShape",
        title: "Which body shape best describes you?",
        subtitle: "Choose the option that describes your body shape.",
        type: "single",
        options: [
            "Hourglass",
            "Pear / Triangle",
            "Apple / Oval",
            "Rectangle",
            "Inverted Triangle",
            "Not sure"
        ]
    },
    {
        field: "preferredStyles",
        title: "Which fashion styles do you prefer?",
        subtitle: "Select all styles you enjoy wearing.",
        type: "multiple",
        options: [
            "Casual",
            "Minimalist",
            "Elegant / Chic",
            "Streetwear",
            "Vintage",
            "Old Money",
            "Bohemian",
            "Traditional"
        ]
    },
    {
        field: "favoriteColors",
        title: "Which colors do you love wearing?",
        subtitle: "Choose your favorite clothing colors.",
        type: "multiple",
        options: [
            "Pastel colors",
            "Neutral colors",
            "Earthy tones",
            "Bright / Vibrant colors",
            "Dark colors",
            "Monochrome"
        ]
    },
    {
        field: "dislikedColorsPatterns",
        title: "Which colors or patterns do you dislike?",
        subtitle: "Select the colors or patterns you usually avoid.",
        type: "multiple",
        options: [
            "Neon colors",
            "Bright colors",
            "Dark colors",
            "Floral prints",
            "Stripes / Checks",
            "Bold patterns",
            "No specific dislikes"
        ]
    },
    {
        field: "preferredClothingItems",
        title: "Which clothing items do you prefer wearing?",
        subtitle: "Select all clothing items you like.",
        type: "multiple",
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
            "Salwar Kameez"
        ]
    },
    {
        field: "preferredFits",
        title: "What type of clothing fit do you prefer?",
        subtitle: "Select your preferred clothing fits.",
        type: "multiple",
        options: [
            "Oversized",
            "Relaxed fit",
            "Regular fit",
            "Slim fit",
            "Body fit"
        ]
    },
    {
        field: "comfortableOutfitType",
        title: "What type of outfits do you feel most comfortable wearing?",
        subtitle: "Choose the outfit style you feel most comfortable in.",
        type: "single",
        options: [
            "Simple and comfortable",
            "Trendy and fashionable",
            "Elegant and sophisticated",
            "Bold and experimental",
            "Modest and traditional"
        ]
    },
    {
        field: "preferredOccasions",
        title: "For which occasions do you want outfit recommendations?",
        subtitle: "Select all occasions relevant to you.",
        type: "multiple",
        options: [
            "University",
            "Office",
            "Casual outing",
            "Party",
            "Wedding",
            "Formal events",
            "Travel"
        ]
    },
    {
        field: "fashionInspirations",
        title: "What inspires your fashion choices?",
        subtitle: "Select the sources that inspire your fashion sense.",
        type: "multiple",
        options: [
            "Pinterest / Fashion moodboards",
            "Instagram fashion trends",
            "Celebrities / Influencers",
            "Movies / TV show characters",
            "Korean fashion / K-fashion",
            "Traditional cultural fashion",
            "Personal creativity",
            "Seasonal fashion trends"
        ]
    }
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
    fashionInspirations: []
};

export default function StyleProfile({ onComplete, onLogout }) {
    const [answers, setAnswers] = useState(initialAnswers);
    const [currentStep, setCurrentStep] = useState(0);
    const [manualHeight, setManualHeight] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    // Update single selection
    const handleSingleSelect = (field, value) => {
        setAnswers(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
    };

    // Update multiple selection
    const handleMultipleSelect = (field, value) => {
        setAnswers(prev => {
            let updated;

            if (prev[field].includes(value)) {
                updated = prev[field].filter(item => item !== value);
            } else if (
                field === "dislikedColorsPatterns" &&
                value === "No specific dislikes"
            ) {
                updated = ["No specific dislikes"];
            } else if (
                field === "dislikedColorsPatterns"
            ) {
                updated = [
                    ...prev[field].filter(
                        item => item !== "No specific dislikes"
                    ),
                    value
                ];
            } else {
                updated = [...prev[field], value];
            }

            return {
                ...prev,
                [field]: updated
            };
        });

        setError("");
    };

    // Validate current question
    const validateQuestion = () => {
        const value = answers[currentQuestion.field];

        if (Array.isArray(value) && value.length === 0) {
            setError("Please select at least one option.");
            return false;
        }

        if (!Array.isArray(value) && !value.trim()) {
            setError("Please select or enter your answer.");
            return false;
        }

        return true;
    };

    // Next question
    const handleNext = () => {
        if (!validateQuestion()) return;

        setError("");

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // Previous question
    const handlePrevious = () => {
        setError("");

        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Submit profile to backend
    const handleSubmit = async () => {
        if (!validateQuestion()) return;

        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Your session has expired. Please login again.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/style-profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(answers)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save your style profile."
                );
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

        return Array.isArray(value)
            ? value.includes(option)
            : value === option;
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-8">

            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-10 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold tracking-wide text-neutral-900">
                            OUTFITMUSE
                        </h1>

                        <p className="mt-1 text-sm text-neutral-500">
                            Discover your personal style
                        </p>
                    </div>

                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="text-sm text-neutral-500 hover:text-neutral-900"
                        >
                            Logout
                        </button>
                    )}

                </div>

                {/* Intro */}
                <div className="mb-8 text-center">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        Your Personal Style Profile
                    </p>

                    <h2 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
                        Let's discover your style!
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                        Tell us about your fashion preferences so we can
                        create personalized outfit recommendations for you.
                    </p>

                </div>

                {/* Progress */}
                <div className="mb-8">

                    <div className="mb-3 flex justify-between text-sm">

                        <span className="font-medium text-neutral-700">
                            Question {currentStep + 1} of {questions.length}
                        </span>

                        <span className="text-neutral-500">
                            {Math.round(progress)}% completed
                        </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200">

                        <div
                            className="h-full rounded-full bg-neutral-900 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />

                    </div>

                </div>

                {/* Question Card */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">

                    <div className="mb-8">

                        <span className="text-sm font-semibold text-neutral-400">
                            QUESTION {currentStep + 1}
                        </span>

                        <h3 className="mt-3 text-2xl font-semibold leading-snug text-neutral-900">
                            {currentQuestion.title}
                        </h3>

                        <p className="mt-2 text-sm text-neutral-500">
                            {currentQuestion.subtitle}
                        </p>

                        {currentQuestion.type === "multiple" && (
                            <p className="mt-3 text-xs font-medium text-neutral-500">
                                You can select multiple options.
                            </p>
                        )}

                    </div>

                    {/* Height Question */}
                    {currentQuestion.type === "height" && (

                        <div className="space-y-3">

                            {currentQuestion.options.map(option => (

                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setManualHeight("");
                                        handleSingleSelect("height", option);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition ${
                                        answers.height === option
                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                            : "border-neutral-200 text-neutral-700 hover:border-neutral-500"
                                    }`}
                                >

                                    {option}

                                    {answers.height === option && (
                                        <span>✓</span>
                                    )}

                                </button>

                            ))}

                            <div className="border-t border-neutral-200 pt-5">

                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Or enter your height manually
                                </label>

                                <input
                                    type="text"
                                    value={manualHeight}
                                    onChange={e => {
                                        setManualHeight(e.target.value);

                                        handleSingleSelect(
                                            "height",
                                            e.target.value
                                        );
                                    }}
                                    placeholder="Example: 160 cm"
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                                />

                            </div>

                        </div>

                    )}

                    {/* Single and Multiple Selection */}
                    {(currentQuestion.type === "single" ||
                      currentQuestion.type === "multiple") && (

                        <div className="grid gap-3 sm:grid-cols-2">

                            {currentQuestion.options.map(option => {

                                const selected = isSelected(
                                    currentQuestion.field,
                                    option
                                );

                                return (

                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            if (currentQuestion.type === "single") {
                                                handleSingleSelect(
                                                    currentQuestion.field,
                                                    option
                                                );
                                            } else {
                                                handleMultipleSelect(
                                                    currentQuestion.field,
                                                    option
                                                );
                                            }
                                        }}
                                        className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                                            selected
                                                ? "border-neutral-900 bg-neutral-900 text-white"
                                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-500"
                                        }`}
                                    >

                                        <span>{option}</span>

                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center border text-xs ${
                                            currentQuestion.type === "multiple"
                                                ? "rounded"
                                                : "rounded-full"
                                        } ${
                                            selected
                                                ? "border-white bg-white text-neutral-900"
                                                : "border-neutral-300"
                                        }`}>
                                            {selected && "✓"}
                                        </span>

                                    </button>

                                );
                            })}

                        </div>

                    )}

                    {/* Error Message */}
                    {error && (

                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}

                    {/* Navigation */}
                    <div className="mt-10 flex items-center justify-between gap-4">

                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 0 || loading}
                            className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {currentStep < questions.length - 1 ? (

                            <button
                                type="button"
                                onClick={handleNext}
                                className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
                            >
                                Next
                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Saving Profile..."
                                    : "Complete Profile"}
                            </button>

                        )}

                    </div>

                </div>

                <p className="mt-6 text-center text-xs text-neutral-400">
                    Your preferences help OutfitMuse personalize your fashion experience.
                </p>

            </div>

        </div>
    );
}
