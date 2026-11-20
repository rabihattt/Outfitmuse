import { useState } from "react";
import HERO_IMAGE from "./assets/hero.png";
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { GoogleIcon, AppleIcon } from "./Icons";
import Footer from "./components/Footer";

export default function Login({ onSwitch, onLogin, onAdminLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials provided");
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Unable to sign in. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between  text-[#292526]">
      
      {/* Main Split Layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Left Editorial Visual Section */}
        <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="OutfitMuse Haute Styling"
            className="absolute inset-0 h-full w-full object-cover opacity-85 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#452C3A] via-[#452C3A]/40 to-transparent" />
          
          {/* Editorial Overlay Caption */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 lg:p-16 text-[#F7F3EE]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3EE] text-sm font-bold text-[#452C3A] shadow-md">
                OM
              </span>
              <span className="font-serif-editorial text-2xl font-bold tracking-widest text-[#F7F3EE]">
                OUTFITMUSE
              </span>
            </div>

            <div className="space-y-4 max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#DCCDBD]/40 bg-[#452C3A]/60 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#DCCDBD]">
                <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
                Personalized Haute Intelligence
              </span>
              <h2 className="font-serif-editorial text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#F7F3EE]">
                Dress with effortless intent, every morning.
              </h2>
              <p className="text-sm leading-relaxed text-[#DCCDBD]/90">
                Experience a tailored wardrobe companion that harmonizes your silhouette, colors, and daily occasions into timeless looks.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
            
            {/* Header / Brand on Mobile */}
            <div className="text-center lg:text-left space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#452C3A] text-xs font-bold text-[#F7F3EE]">
                  OM
                </span>
                <span className="font-serif-editorial text-xl font-bold tracking-wider text-[#452C3A]">
                  OUTFITMUSE
                </span>
              </div>
              <h1 className="font-serif-editorial text-3xl font-bold tracking-tight text-[#452C3A] sm:text-4xl">
                Welcome Back
              </h1>
              <p className="text-sm text-[#686163]">
                Enter your credentials to access your digital styling salon.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-12 w-full rounded-xl border border-[#DCCDBD] bg-white px-4 text-sm text-[#292526] placeholder:text-[#686163]/50 outline-none transition-all duration-200 focus:border-[#452C3A] focus:ring-3 focus:ring-[#C58D91]/25"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#452C3A]"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset concierge: Please reach out to concierge@outfitmuse.style");
                    }}
                    className="text-xs font-semibold text-[#84917C] hover:text-[#452C3A] transition"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#DCCDBD] bg-white px-4 pr-12 text-sm text-[#292526] placeholder:text-[#686163]/50 outline-none transition-all duration-200 focus:border-[#452C3A] focus:ring-3 focus:ring-[#C58D91]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#686163] transition hover:text-[#452C3A]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#84917C]" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="rounded-xl border border-[#C58D91] bg-[#F4E8E9] p-3 text-xs font-medium text-[#452C3A] animate-fade-in">
                  {error}
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#452C3A] text-sm font-semibold tracking-wide text-[#F7F3EE] shadow-md transition-all duration-300 hover:bg-[#57384A] hover:shadow-lg disabled:opacity-60"
              >
                <span>{loading ? "Signing in..." : "Enter Your Dressing Room"}</span>
                <ArrowRight className="h-4 w-4 text-[#C58D91] transition-transform duration-300 group-hover:translate-x-1" />
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <span className="h-px flex-1 bg-[#DCCDBD]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#686163]">
                or continue with
              </span>
              <span className="h-px flex-1 bg-[#DCCDBD]" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Google Single Sign-On enabled for enterprise & personal accounts.")}
                className="flex h-11 items-center justify-center gap-2.5 rounded-full border border-[#DCCDBD] bg-white text-xs font-semibold text-[#292526] transition-all hover:border-[#C58D91] hover:bg-[#FAF6F2]"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Apple ID Sign-In enabled for iOS & Web clients.")}
                className="flex h-11 items-center justify-center gap-2.5 rounded-full border border-[#DCCDBD] bg-white text-xs font-semibold text-[#292526] transition-all hover:border-[#C58D91] hover:bg-[#FAF6F2]"
              >
                <AppleIcon />
                <span>Apple</span>
              </button>
            </div>

            {/* Switch to Register */}
            <p className="text-center text-xs text-[#686163]">
              New to OutfitMuse?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="font-semibold text-[#452C3A] underline decoration-[#C58D91] underline-offset-4 hover:text-[#57384A]"
              >
                Create your curated account
              </button>
            </p>

            {/* Admin Portal Gateway Link */}
            <div className="pt-4 border-t border-[#E8E0D7] text-center">
              <button
                type="button"
                onClick={onAdminLogin}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#84917C] hover:text-[#452C3A] transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>OutfitMuse Administrative Portal</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <Footer variant="minimal" />

    </div>
  );
}
