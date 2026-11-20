import { Sparkles, Mail, MapPin, Instagram, Heart, ArrowUpRight } from "lucide-react";

export default function Footer({ onNavigate, variant = "full" }) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className="w-full border-t border-[#E8E0D7] bg-[#F7F3EE] py-6 px-6 text-center text-xs text-[#686163]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#452C3A] text-[10px] font-bold text-[#F7F3EE]">
              OM
            </span>
            <span className="font-serif-editorial text-base font-semibold tracking-wide text-[#452C3A]">
              OUTFITMUSE
            </span>
          </div>
          <p>© {currentYear} OutfitMuse Inc. Modern Luxury Fashion Technology. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#686163]">
            <span className="hover:text-[#452C3A] cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-[#452C3A] cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-[#452C3A] cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full border-t border-[#E8E0D7] bg-[#F5EFEB]/70 pt-16 pb-10 text-[#292526] transition-all">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#452C3A] text-sm font-bold text-[#F7F3EE] shadow-sm">
                OM
              </span>
              <span className="font-serif-editorial text-2xl font-bold tracking-wider text-[#452C3A]">
                OUTFITMUSE
              </span>
            </div>
            
            <p className="max-w-sm text-sm leading-relaxed text-[#686163]">
              Your AI-powered digital wardrobe and haute-couture styling sanctuary. 
              Elevating daily dressing with intelligent harmony between personal aesthetics, 
              weather conditions, and curated silhouette curation.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#84917C] font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-[#84917C] animate-pulse"></span>
              <span>Intelligent Style Engine Active</span>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center gap-3">
              {[
                { name: "Instagram", icon: "IG", href: "#" },
                { name: "Pinterest", icon: "PIN", href: "#" },
                { name: "Vogue Runway", icon: "VG", href: "#" },
                { name: "Threads", icon: "TH", href: "#" }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  title={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCCDBD] bg-white text-[11px] font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F4E8E9] hover:text-[#452C3A]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif-editorial text-lg font-bold text-[#452C3A] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#686163]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate("userDashboard")}
                  className="hover:text-[#452C3A] hover:translate-x-1 transition flex items-center gap-1 text-left"
                >
                  <span>Dashboard</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate("wardrobe")}
                  className="hover:text-[#452C3A] hover:translate-x-1 transition flex items-center gap-1 text-left"
                >
                  <span>Digital Wardrobe</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate("recommendations")}
                  className="hover:text-[#452C3A] hover:translate-x-1 transition flex items-center gap-1 text-left"
                >
                  <span>AI Recommendations</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate("styleProfile")}
                  className="hover:text-[#452C3A] hover:translate-x-1 transition flex items-center gap-1 text-left"
                >
                  <span>Style Questionnaire</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="font-serif-editorial text-lg font-bold text-[#452C3A] mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm text-[#686163]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C58D91]"></span>
                <span>Virtual Closet Organiser</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#84917C]"></span>
                <span>Weather-Adaptive Styling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DCCDBD]"></span>
                <span>Silhouette & Fit Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#452C3A]"></span>
                <span>Color Psychology Palette</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C58D91]"></span>
                <span>Curated Capsule Outfits</span>
              </li>
            </ul>
          </div>

          {/* About Us & Contact */}
          <div>
            <h4 className="font-serif-editorial text-lg font-bold text-[#452C3A] mb-4">
              Atelier & Contact
            </h4>
            <div className="space-y-3 text-sm text-[#686163]">
              <p className="text-xs leading-relaxed text-[#686163]">
                Born from the desire to make intentional, sustainable, and confidence-inspiring dressing effortless every single morning.
              </p>
              
              <div className="flex items-start gap-2 pt-2 text-xs text-[#292526]">
                <Mail className="h-4 w-4 shrink-0 text-[#C58D91] mt-0.5" />
                <span>concierge@outfitmuse.style</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#292526]">
                <MapPin className="h-4 w-4 shrink-0 text-[#84917C] mt-0.5" />
                <span>New York • Paris • Milan • Global</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-14 pt-8 border-t border-[#E8E0D7] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#686163]">
          <div className="flex items-center gap-2">
            <span>Designed with</span>
            <Heart className="h-3.5 w-3.5 fill-[#C58D91] text-[#C58D91]" />
            <span>for personal style clarity</span>
          </div>

          <p>© {currentYear} OutfitMuse Inc. Modern Luxury Fashion Technology. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#452C3A] transition">Privacy Manifesto</a>
            <a href="#terms" className="hover:text-[#452C3A] transition">Terms of Service</a>
            <a href="#cookies" className="hover:text-[#452C3A] transition">Ethics & Inclusivity</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
