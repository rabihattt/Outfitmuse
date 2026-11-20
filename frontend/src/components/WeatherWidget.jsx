import { useState } from "react";
import { CloudSun, Sun, CloudRain, Wind, Sparkles, Thermometer, Compass } from "lucide-react";

export default function WeatherWidget({ onExploreWeatherOutfits }) {
  const [selectedSeason, setSelectedSeason] = useState("Spring");
  const [currentCity, setCurrentCity] = useState("Milan & New York");

  const weatherPresets = {
    Spring: {
      temp: "19°C",
      condition: "Mild & Luminous",
      icon: CloudSun,
      advice: "Optimal for transitional layering. Pair a crisp relaxed shirt with light knit outerwear.",
      palette: ["#DCCDBD", "#84917C", "#F7F3EE"],
      paletteNames: "Champagne, Sage & Warm Ivory",
      layerTip: "Light blazer, silk scarf, tailored trousers",
    },
    Summer: {
      temp: "27°C",
      condition: "Radiant Sunshine",
      icon: Sun,
      advice: "Breathable fabrics are paramount. Embrace breezy silhouettes and natural linen tones.",
      palette: ["#F7F3EE", "#C58D91", "#DCCDBD"],
      paletteNames: "Ivory, Dusty Rose & Champagne",
      layerTip: "Linen dress, cotton tops, strappy sandals",
    },
    Autumn: {
      temp: "14°C",
      condition: "Crisp Golden Breeze",
      icon: Wind,
      advice: "Rich textures take center stage. Trench coats, knit cardigans, and structured leather.",
      palette: ["#452C3A", "#DCCDBD", "#84917C"],
      paletteNames: "Deep Plum, Champagne & Sage",
      layerTip: "Oversized trench, ankle boots, cashmere knit",
    },
    Winter: {
      temp: "7°C",
      condition: "Cool Editorial Chills",
      icon: CloudRain,
      advice: "Insulated luxury. Layer high-density wool outerwear with monochromatic inner pieces.",
      palette: ["#292526", "#452C3A", "#DCCDBD"],
      paletteNames: "Charcoal, Deep Plum & Warm Champagne",
      layerTip: "Wool overcoat, turtleneck, knee-high boots",
    },
  };

  const current = weatherPresets[selectedSeason];
  const Icon = current.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#DCCDBD] bg-gradient-to-br from-[#FFFFFF] via-[#FAF6F2] to-[#F5EFEB] p-6 lg:p-8 shadow-xs">
      
      {/* Decorative background watermark */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 font-serif-editorial text-9xl font-bold text-[#452C3A]/[0.03] select-none">
        WEATHER
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#84917C]/15 text-[#84917C]">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#452C3A]">
              Atmospheric & Weather Styling
            </h3>
            <p className="text-xs text-[#686163]">
              Real-time climatic styling recommendations
            </p>
          </div>
        </div>

        {/* Season / Climate Selector Pills */}
        <div className="flex items-center gap-1 rounded-full border border-[#DCCDBD] bg-[#F7F3EE] p-1 text-xs">
          {["Spring", "Summer", "Autumn", "Winter"].map((season) => (
            <button
              key={season}
              type="button"
              onClick={() => setSelectedSeason(season)}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                selectedSeason === season
                  ? "bg-[#452C3A] text-[#F7F3EE] shadow-xs"
                  : "text-[#686163] hover:text-[#452C3A]"
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Temp & Status Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#E8E0D7] bg-white/80 p-4 shadow-2xs">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F4E8E9] text-[#C58D91]">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-editorial text-3xl font-bold text-[#292526]">
                {current.temp}
              </span>
              <span className="text-xs font-semibold text-[#84917C] uppercase tracking-wider">
                {current.condition}
              </span>
            </div>
            <p className="text-xs text-[#686163] mt-0.5">
              Styling Season: <span className="font-semibold text-[#452C3A]">{selectedSeason}</span>
            </p>
          </div>
        </div>

        {/* Editorial Styling Advice */}
        <div className="md:col-span-2 space-y-3">
          <div className="rounded-2xl border border-[#DCCDBD]/60 bg-white/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#452C3A] uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
              <span>Recommended Silhouette & Fabric</span>
            </div>
            <p className="text-sm leading-relaxed text-[#292526]">
              {current.advice}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E0D7]">
              <span className="text-[11px] font-semibold text-[#686163]">Key Pieces:</span>
              <span className="rounded-md bg-[#F5EFEB] px-2.5 py-0.5 text-xs font-medium text-[#452C3A]">
                {current.layerTip}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Harmony Color Palette Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F7F3EE] px-4 py-3 border border-[#E8E0D7]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#452C3A]">Today's Natural Light Harmony:</span>
          <div className="flex items-center gap-1.5">
            {current.palette.map((color, idx) => (
              <span
                key={idx}
                className="h-4 w-4 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <span className="text-xs text-[#686163] font-medium hidden sm:inline">
            ({current.paletteNames})
          </span>
        </div>

        {onExploreWeatherOutfits && (
          <button
            type="button"
            onClick={() => onExploreWeatherOutfits(selectedSeason)}
            className="text-xs font-semibold text-[#452C3A] hover:text-[#C58D91] transition flex items-center gap-1"
          >
            <span>Filter Wardrobe for {selectedSeason}</span>
            <span>→</span>
          </button>
        )}
      </div>

    </div>
  );
}
