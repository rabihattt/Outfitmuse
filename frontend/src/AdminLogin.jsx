import { useState } from "react";
import HERO_IMAGE from "./assets/hero.png";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Footer from "./components/Footer";

export default function AdminLogin({ onBack, onLogin }) {
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
      const response = await fetch("http://localhost:5000/api/admin/login", {
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
        throw new Error(data.message || "Admin authorization denied");
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("admin", JSON.stringify(data.admin));

      onLogin(data.admin);
    } catch (err) {
      setError(err.message || "Administrative verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F7F3EE] text-[#292526]">
      
      {/* Main Split Layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Left Side: Dark Plum Executive Styling */}
        <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-[#2D1B25]">
          <img
            src={HERO_IMAGE}
            alt="OutfitMuse Administration"
            className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B25] via-[#452C3A]/70 to-[#2D1B25]/90" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 lg:p-16 text-[#F7F3EE]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCCDBD] text-sm font-bold text-[#452C3A] shadow-md">
                OM
              </span>
              <span className="font-serif-editorial text-2xl font-bold tracking-widest text-[#F7F3EE]">
                OUTFITMUSE
              </span>
            </div>

            <div className="space-y-4 max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#DCCDBD]/30 bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#DCCDBD]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#84917C]" />
                Executive Control Chamber
              </span>
              <h2 className="font-serif-editorial text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#F7F3EE]">
                Platform Architecture & Curation Command
              </h2>
              <p className="text-sm leading-relaxed text-[#DCCDBD]/90">
                Oversee platform user registries, catalog taxonomies, garment metadata pipelines, and AI recommendation tuning.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
            
            {/* Header */}
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#452C3A] px-3.5 py-1 text-xs font-bold text-[#F7F3EE] mb-2">
                <Lock className="h-3 w-3 text-[#C58D91]" />
                <span>RESTRICTED ACCESS</span>
              </div>
              
              <h1 className="font-serif-editorial text-3xl font-bold tracking-tight text-[#452C3A] sm:text-4xl">
                Administrator Sign In
              </h1>
              <p className="text-sm text-[#686163]">
                Authenticate with supervisory credentials to proceed.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Admin Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]"
                >
                  Admin Identity / Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@outfitmuse.style"
                  className="h-12 w-full rounded-xl border border-[#DCCDBD] bg-white px-4 text-sm text-[#292526] placeholder:text-[#686163]/50 outline-none transition-all duration-200 focus:border-[#452C3A] focus:ring-3 focus:ring-[#C58D91]/25"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]"
                >
                  Supervisory Keycode
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security keycode"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#452C3A] text-sm font-semibold tracking-wide text-[#F7F3EE] shadow-md transition-all duration-300 hover:bg-[#57384A] hover:shadow-lg disabled:opacity-60"
              >
                <span>{loading ? "Verifying Authorization..." : "Access Admin Console"}</span>
                <ArrowRight className="h-4 w-4 text-[#C58D91] transition-transform duration-300 group-hover:translate-x-1" />
              </button>

            </form>

            {/* Back to User Login */}
            <div className="pt-4 border-t border-[#E8E0D7] text-center">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#686163] hover:text-[#452C3A] transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Member Login</span>
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
