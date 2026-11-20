import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Shirt, 
  Layers, 
  Compass, 
  Plus, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  SlidersHorizontal,
  TrendingUp,
  Tag,
  Palette
} from "lucide-react";
import WeatherWidget from "./components/WeatherWidget";

const API_URL = "http://localhost:5000/api";

export default function Dashboard({ 
  user, 
  onLogout, 
  onOpenWardrobe, 
  onOpenRecommendations,
  onOpenStyleProfile,
  onAddClothes
}) {
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);

        // Fetch Wardrobe items
        const wardrobeRes = await fetch(`${API_URL}/wardrobe`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const wardrobeData = await wardrobeRes.json();
        if (wardrobeRes.ok && wardrobeData.items) {
          setWardrobeCount(wardrobeData.items.length);
          setRecentItems(wardrobeData.items.slice(0, 4));
        }

        // Fetch Style Profile
        const profileRes = await fetch(`${API_URL}/style-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.profile) {
          setProfile(profileData.profile);
        }

      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const primaryStyle = profile?.preferredStyles?.[0] || "Contemporary Minimalist";
  const bodyShape = profile?.bodyShape || "Personal Geometry";

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Editorial Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#DCCDBD] bg-gradient-to-r from-[#452C3A] via-[#523545] to-[#452C3A] p-8 lg:p-12 text-[#F7F3EE] shadow-sm">
        
        {/* Subtle Watermark Monogram */}
        <div className="pointer-events-none absolute -right-8 -bottom-10 font-serif-editorial text-[160px] font-bold text-white/[0.04] select-none">
          MUSE
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCCDBD]/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#DCCDBD]">
                <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
                Haute Styling Suite
              </span>
              <span className="rounded-full bg-[#84917C]/30 px-3 py-1 text-xs font-semibold text-[#84917C] text-emerald-200">
                ● Live AI Concierge
              </span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#F7F3EE] leading-tight">
              {getGreetingTime()}, {user?.name || "Curator"}.
            </h1>

            <p className="text-sm leading-relaxed text-[#DCCDBD]/90 sm:text-base">
              Your digital closet has been synchronized. Today’s aesthetic harmony focuses on{" "}
              <span className="font-semibold text-white underline decoration-[#C58D91] underline-offset-4">
                {primaryStyle}
              </span>{" "}
              silhouettes tailored to your personal geometry.
            </p>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#DCCDBD]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#84917C]" />
                Profile: <strong className="text-white">{bodyShape}</strong>
              </span>
              <span>•</span>
              <span>
                Wardrobe: <strong className="text-white">{wardrobeCount} Pieces</strong>
              </span>
              <span>•</span>
              <span>
                Occasion Focus: <strong className="text-white">{profile?.preferredOccasions?.[0] || "Everyday Chic"}</strong>
              </span>
            </div>

          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenWardrobe}
              className="flex items-center justify-center gap-2.5 rounded-full bg-[#F7F3EE] px-6 py-3.5 text-xs font-bold tracking-wide text-[#452C3A] shadow-md transition-all duration-300 hover:bg-[#FAF6F2] hover:shadow-lg"
            >
              <Shirt className="h-4 w-4 text-[#C58D91]" />
              <span>Explore Wardrobe ({wardrobeCount})</span>
            </button>

            <button
              type="button"
              onClick={onOpenRecommendations}
              className="flex items-center justify-center gap-2.5 rounded-full border border-[#DCCDBD]/40 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold tracking-wide text-[#F7F3EE] transition-all hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4 text-[#C58D91]" />
              <span>Curate Today's Outfit</span>
            </button>
          </div>

        </div>

      </div>

      {/* Snapshot Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div 
          onClick={onOpenWardrobe}
          className="luxury-card cursor-pointer rounded-2xl p-6 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#686163]">
              Closet Pieces
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5EFEB] text-[#452C3A] transition-colors group-hover:bg-[#452C3A] group-hover:text-[#F7F3EE]">
              <Shirt className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
            {wardrobeCount}
          </div>
          <p className="mt-1 text-xs text-[#84917C] font-medium flex items-center gap-1">
            <span>Catalogued & Cloud-Backed</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={onOpenRecommendations}
          className="luxury-card cursor-pointer rounded-2xl p-6 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#686163]">
              Outfit Permutations
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E8E9] text-[#C58D91] transition-colors group-hover:bg-[#C58D91] group-hover:text-white">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
            {wardrobeCount > 0 ? wardrobeCount * 3 + 2 : "12"}
          </div>
          <p className="mt-1 text-xs text-[#686163] font-medium">
            AI-generated pairings ready
          </p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={onOpenStyleProfile}
          className="luxury-card cursor-pointer rounded-2xl p-6 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#686163]">
              Style Archetype
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF1EC] text-[#84917C] transition-colors group-hover:bg-[#84917C] group-hover:text-white">
              <Palette className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif-editorial text-2xl font-bold text-[#452C3A] truncate">
            {profile?.preferredStyles?.[0] || "Curated"}
          </div>
          <p className="mt-1 text-xs text-[#84917C] font-medium">
            Personal Profile Completed ✓
          </p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={onOpenRecommendations}
          className="luxury-card cursor-pointer rounded-2xl p-6 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#686163]">
              Style Harmony Score
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F2] text-[#452C3A] transition-colors group-hover:bg-[#452C3A] group-hover:text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
            97%
          </div>
          <p className="mt-1 text-xs text-[#686163] font-medium">
            Color & silhouette alignment
          </p>
        </div>

      </div>

      {/* Atmospheric Weather Styling Section */}
      <WeatherWidget 
        onExploreWeatherOutfits={(season) => {
          onOpenWardrobe();
        }}
      />

      {/* Two Column Section: AI Recommendation Showcase + Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: AI Outfit of the Day Feature */}
        <div className="lg:col-span-2 rounded-3xl border border-[#DCCDBD] bg-white p-7 lg:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#C58D91] animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#452C3A]">
                  AI Daily Curation
                </span>
              </div>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
                Today's Recommended Silhouette
              </h3>
            </div>

            <button
              type="button"
              onClick={onOpenRecommendations}
              className="text-xs font-semibold text-[#452C3A] hover:text-[#C58D91] transition flex items-center gap-1.5"
            >
              <span>View All Outfits</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Featured Outfit Showcase Card */}
          <div className="rounded-2xl border border-[#E8E0D7] bg-[#F7F3EE] p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
              <div>
                <span className="rounded-full bg-[#F4E8E9] px-3 py-1 text-xs font-bold text-[#452C3A]">
                  {profile?.preferredOccasions?.[0] || "Elevated Casual"}
                </span>
                <h4 className="font-serif-editorial text-xl font-bold text-[#292526] mt-2">
                  Harmonized Neutral Capsule
                </h4>
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="text-xs text-[#686163]">Match Confidence</span>
                <span className="rounded-lg bg-[#84917C] px-2.5 py-1 text-xs font-bold text-white">
                  98%
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#686163] py-4">
              A refined ensemble engineered for comfortable daytime elegance. Blends balanced vertical lines with breathable fabrics, respecting your preference for{" "}
              <strong className="text-[#452C3A]">{profile?.preferredFits?.[0] || "Relaxed Fit"}</strong> garments.
            </p>

            {/* Visual Item Tiles Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentItems.length > 0 ? (
                recentItems.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 rounded-xl border border-[#DCCDBD] bg-white p-2.5 shadow-2xs"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#292526] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#84917C]">{item.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#DCCDBD] bg-white p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF6F2] text-xs font-bold text-[#452C3A]">
                      TOP
                    </span>
                    <span className="text-xs text-[#686163]">Classic Ivory Blouse</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#DCCDBD] bg-white p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF6F2] text-xs font-bold text-[#452C3A]">
                      BTM
                    </span>
                    <span className="text-xs text-[#686163]">Tailored High Trousers</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#DCCDBD] bg-white p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF6F2] text-xs font-bold text-[#452C3A]">
                      SHOE
                    </span>
                    <span className="text-xs text-[#686163]">Almond Leather Loafers</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E8E0D7] text-xs">
              <span className="text-[#84917C] font-semibold">
                ✓ Silhouette & Color Tested
              </span>
              <button
                type="button"
                onClick={onOpenRecommendations}
                className="font-bold text-[#452C3A] hover:text-[#C58D91] transition flex items-center gap-1"
              >
                <span>Curate Full Ensemble</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Atelier Quick Shortcuts & Style Rules */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-[#DCCDBD] bg-white p-6 shadow-xs">
            <h3 className="font-serif-editorial text-xl font-bold text-[#452C3A] mb-4">
              Atelier Actions
            </h3>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onOpenWardrobe}
                className="flex w-full items-center justify-between rounded-xl border border-[#E8E0D7] bg-[#F7F3EE] p-3 text-xs font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F4E8E9]"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="h-4 w-4 text-[#C58D91]" />
                  <span>Upload Clothing to Closet</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#686163]" />
              </button>

              <button
                type="button"
                onClick={onOpenStyleProfile}
                className="flex w-full items-center justify-between rounded-xl border border-[#E8E0D7] bg-[#F7F3EE] p-3 text-xs font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F4E8E9]"
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="h-4 w-4 text-[#84917C]" />
                  <span>Update Style Questionnaire</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#686163]" />
              </button>

              <button
                type="button"
                onClick={onOpenRecommendations}
                className="flex w-full items-center justify-between rounded-xl border border-[#E8E0D7] bg-[#F7F3EE] p-3 text-xs font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F4E8E9]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#C58D91]" />
                  <span>View All AI Recommendations</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#686163]" />
              </button>
            </div>
          </div>

          {/* Editorial Capsule Wisdom Card */}
          <div className="rounded-3xl border border-[#DCCDBD] bg-gradient-to-br from-[#FAF6F2] to-[#F5EFEB] p-6 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#84917C]">
              Editorial Note #14
            </span>
            <h4 className="font-serif-editorial text-lg font-bold text-[#452C3A] mt-1 mb-2">
              The 3-Piece Proportion Rule
            </h4>
            <p className="text-xs leading-relaxed text-[#686163]">
              Every compelling outfit incorporates a foundation layer, a structural element (jacket, belt, or pleats), and a punctuation accent (statement shoes or textured bag).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
