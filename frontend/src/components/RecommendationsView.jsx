import { useState, useEffect } from "react";
import { Sparkles, Shirt, RefreshCw, Bookmark, Check, ArrowRight, Heart, SlidersHorizontal, Layers } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function RecommendationsView({ onOpenWardrobe, onOpenStyleProfile }) {
  const [wardrobe, setWardrobe] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [curating, setCurating] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [savedLooks, setSavedLooks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);

        // Fetch Wardrobe
        const wardrobeRes = await fetch(`${API_URL}/wardrobe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wardrobeData = await wardrobeRes.json();
        if (wardrobeRes.ok) {
          setWardrobe(wardrobeData.items || []);
        }

        // Fetch Style Profile
        const profileRes = await fetch(`${API_URL}/style-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData.profile || null);
        }

      } catch (err) {
        console.error("Error loading recommendations data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefreshLooks = () => {
    setCurating(true);
    setTimeout(() => {
      setCurating(false);
    }, 600);
  };

  const toggleSaveLook = (id) => {
    setSavedLooks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group wardrobe items
  const tops = wardrobe.filter(i => i.category === "Tops");
  const bottoms = wardrobe.filter(i => i.category === "Bottoms");
  const dresses = wardrobe.filter(i => i.category === "Dresses");
  const outerwear = wardrobe.filter(i => i.category === "Outerwear");
  const shoes = wardrobe.filter(i => i.category === "Shoes");
  const accessories = wardrobe.filter(i => i.category === "Accessories" || i.category === "Bags");

  // Synthesize recommendation capsules
  const generateCapsules = () => {
    const capsules = [];

    // Capsule 1: Top + Bottom combo
    if (tops.length > 0 && bottoms.length > 0) {
      capsules.push({
        id: "cap-1",
        title: "The Editorial Minimalist Look",
        occasion: "Casual",
        matchScore: 98,
        description: "Balanced proportions celebrating effortless elegance. Clean color synchronization and breathable movement.",
        stylingNotes: "French tuck the top to accentuate waistline structure. Complement with neutral leather footwear.",
        items: [
          tops[0],
          bottoms[0],
          ...(outerwear.length > 0 ? [outerwear[0]] : []),
          ...(shoes.length > 0 ? [shoes[0]] : [])
        ]
      });
    }

    // Capsule 2: Alternate styling or Dress
    if (dresses.length > 0) {
      capsules.push({
        id: "cap-2",
        title: "Monochrome Haute Elegance",
        occasion: "Office",
        matchScore: 95,
        description: "Sophisticated single-silhouette flow. Structured styling suited for professional presentations or gallery strolls.",
        stylingNotes: "Layer a tailored blazer or lightweight cardigan over the shoulders for quiet-luxury presence.",
        items: [
          dresses[0],
          ...(outerwear.length > 1 ? [outerwear[1]] : outerwear.length > 0 ? [outerwear[0]] : []),
          ...(accessories.length > 0 ? [accessories[0]] : [])
        ]
      });
    } else if (tops.length > 1 && bottoms.length > 0) {
      capsules.push({
        id: "cap-2",
        title: "Urban Contemporary Silhouette",
        occasion: "Office",
        matchScore: 93,
        description: "Modern, confident styling optimized for day-to-evening versatility with tailored visual poise.",
        stylingNotes: "Roll up cuffs slightly to display delicate wrist accessories. Keep footwear understated.",
        items: [
          tops[1],
          bottoms[bottoms.length > 1 ? 1 : 0],
          ...(outerwear.length > 0 ? [outerwear[0]] : [])
        ]
      });
    }

    // Capsule 3: Weekend / Casual
    if (tops.length > 0 && bottoms.length > 1) {
      capsules.push({
        id: "cap-3",
        title: "Off-Duty Luxe Weekend",
        occasion: "Weekend",
        matchScore: 91,
        description: "Relaxed comfort without sacrificing refined aesthetic polish. Grounded in your preferred silhouette.",
        stylingNotes: "Pair with unstructured tote and slip-on loafers for effortless Parisian chic aura.",
        items: [
          tops[tops.length - 1],
          bottoms[1],
          ...(accessories.length > 0 ? [accessories[accessories.length - 1]] : [])
        ]
      });
    }

    // Default sample capsules if wardrobe has few items
    if (capsules.length === 0) {
      capsules.push(
        {
          id: "preview-1",
          title: "Quiet Luxury Linen & Tailored Trousers",
          occasion: "Casual",
          matchScore: 96,
          isPreview: true,
          description: "A signature pairing of relaxed proportions in neutral ivory and warm champagne.",
          stylingNotes: "Designed for effortless daytime sophistication and fluid movement.",
          palette: ["#F7F3EE", "#DCCDBD", "#452C3A"],
          itemsPlaceholder: [
            { name: "Cream Cashmere Top", category: "Tops", color: "Cream" },
            { name: "Wide-Leg Pleated Trousers", category: "Bottoms", color: "Champagne" }
          ]
        },
        {
          id: "preview-2",
          title: "Architectural Trench & Clean Foundation",
          occasion: "Office",
          matchScore: 94,
          isPreview: true,
          description: "Elevated layering structured for professional presence and weather versatility.",
          stylingNotes: "Button middle only to create an elegant vertical silhouette line.",
          palette: ["#452C3A", "#84917C", "#292526"],
          itemsPlaceholder: [
            { name: "Double-Breasted Trench", category: "Outerwear", color: "Plum" },
            { name: "High-Rise Tailored Pant", category: "Bottoms", color: "Charcoal" }
          ]
        }
      );
    }

    return capsules;
  };

  const capsules = generateCapsules();
  const filteredCapsules = selectedOccasion === "All"
    ? capsules
    : capsules.filter(c => c.occasion.toLowerCase() === selectedOccasion.toLowerCase());

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DCCDBD] border-t-[#452C3A]" />
        <p className="mt-4 font-serif-editorial text-lg text-[#452C3A]">
          Synthesizing your personal styling recommendations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="rounded-3xl border border-[#DCCDBD] bg-white p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F4E8E9] px-3.5 py-1 text-xs font-bold text-[#452C3A]">
              <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
              <span>AI Curation Engine</span>
            </div>
            <h2 className="font-serif-editorial text-3xl font-bold tracking-tight text-[#452C3A] sm:text-4xl">
              Curated Outfit Combinations
            </h2>
            <p className="max-w-2xl text-sm text-[#686163]">
              Intelligent pairings tailored to your body geometry, preferred aesthetics (
              <span className="font-semibold text-[#452C3A]">
                {profile?.preferredStyles?.join(", ") || "Minimalist, Chic"}
              </span>
              ), and current wardrobe inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefreshLooks}
              disabled={curating}
              className="flex items-center gap-2 rounded-full border border-[#DCCDBD] bg-white px-5 py-2.5 text-xs font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F5EFEB] disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#C58D91] ${curating ? "animate-spin" : ""}`} />
              <span>{curating ? "Harmonizing..." : "Recalibrate Combinations"}</span>
            </button>

            {onOpenWardrobe && (
              <button
                type="button"
                onClick={onOpenWardrobe}
                className="flex items-center gap-2 rounded-full bg-[#452C3A] px-5 py-2.5 text-xs font-semibold text-[#F7F3EE] transition hover:bg-[#57384A]"
              >
                <Shirt className="h-3.5 w-3.5 text-[#C58D91]" />
                <span>My Wardrobe ({wardrobe.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Occasion Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8E0D7] pt-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#84917C]" />
            <span className="text-xs font-semibold text-[#452C3A]">Filter by Occasion:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["All", "Casual", "Office", "Weekend"].map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedOccasion === occ
                    ? "bg-[#452C3A] text-white shadow-xs"
                    : "border border-[#E8E0D7] bg-white text-[#686163] hover:border-[#DCCDBD] hover:text-[#452C3A]"
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCapsules.map((capsule) => {
          const isSaved = !!savedLooks[capsule.id];

          return (
            <div
              key={capsule.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#DCCDBD] bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#C58D91] hover:shadow-md"
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#F4E8E9] px-2.5 py-0.5 text-[11px] font-bold text-[#452C3A]">
                        {capsule.occasion}
                      </span>
                      <span className="rounded-full bg-[#EDF1EC] px-2.5 py-0.5 text-[11px] font-bold text-[#84917C]">
                        {capsule.matchScore}% Match
                      </span>
                      {capsule.isPreview && (
                        <span className="rounded-full bg-[#DCCDBD]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#686163]">
                          Inspiration Look
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A] mt-2">
                      {capsule.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveLook(capsule.id)}
                    title="Save this look to favorites"
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      isSaved
                        ? "border-[#C58D91] bg-[#F4E8E9] text-[#452C3A]"
                        : "border-[#E8E0D7] text-[#686163] hover:border-[#C58D91] hover:text-[#C58D91]"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-[#C58D91] text-[#C58D91]" : ""}`} />
                  </button>
                </div>

                <p className="text-sm leading-relaxed text-[#686163] mb-6">
                  {capsule.description}
                </p>

                {/* Clothing Pieces Row */}
                <div className="mb-6 rounded-2xl bg-[#F7F3EE] p-4 border border-[#E8E0D7]">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-[#452C3A]">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#C58D91]" />
                      <span>Capsule Pieces ({capsule.items?.length || capsule.itemsPlaceholder?.length})</span>
                    </span>
                    <span className="text-[11px] text-[#84917C] font-medium">Harmonized</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {capsule.items ? (
                      capsule.items.map((item, idx) => (
                        <div
                          key={item._id || idx}
                          className="flex flex-col rounded-xl border border-[#DCCDBD]/60 bg-white p-2.5 text-center shadow-2xs transition group-hover:border-[#DCCDBD]"
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-24 w-full rounded-lg object-cover mb-2"
                            />
                          ) : (
                            <div className="flex h-24 w-full items-center justify-center rounded-lg bg-[#FAF6F2] text-xs text-[#686163] mb-2">
                              {item.category}
                            </div>
                          )}
                          <p className="text-xs font-bold text-[#292526] line-clamp-1">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-[#84917C] font-medium mt-0.5">
                            {item.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      capsule.itemsPlaceholder.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DCCDBD] bg-white/70 p-4 text-center"
                        >
                          <span className="text-xs font-bold text-[#452C3A]">{p.name}</span>
                          <span className="text-[10px] text-[#686163] mt-1">{p.category} • {p.color}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Editorial Styling Notes */}
                <div className="rounded-xl border border-[#84917C]/20 bg-[#EDF1EC]/40 p-3.5 text-xs text-[#292526]">
                  <span className="font-bold text-[#84917C] uppercase tracking-wider block mb-1">
                    Editorial Stylist Note:
                  </span>
                  <span>{capsule.stylingNotes}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-[#E8E0D7] flex items-center justify-between text-xs font-semibold">
                <span className="text-[#686163]">
                  {isSaved ? "Saved to your Personal Lookbook" : "Ready to wear"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSaveLook(capsule.id)}
                  className="flex items-center gap-1.5 text-[#452C3A] hover:text-[#C58D91] transition"
                >
                  <span>{isSaved ? "Look Saved ✓" : "Save this Look"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Upload Invitation if Wardrobe is Small */}
      {wardrobe.length < 4 && (
        <div className="rounded-3xl border border-dashed border-[#C58D91]/60 bg-[#F4E8E9]/30 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#452C3A] text-[#F7F3EE] mb-4">
            <Shirt className="h-6 w-6 text-[#C58D91]" />
          </div>
          <h4 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
            Unlock Infinite Outfit Permutations
          </h4>
          <p className="mx-auto max-w-lg text-sm text-[#686163] mt-2 mb-6">
            You currently have <span className="font-bold text-[#452C3A]">{wardrobe.length}</span> items in your closet. Adding just 2 tops and 1 pair of shoes allows OutfitMuse to synthesize 12+ new personalized daily silhouettes.
          </p>
          <button
            type="button"
            onClick={onOpenWardrobe}
            className="rounded-full bg-[#452C3A] px-8 py-3 text-xs font-semibold text-[#F7F3EE] shadow-sm transition hover:bg-[#57384A]"
          >
            Add More Pieces to Closet →
          </button>
        </div>
      )}

    </div>
  );
}
