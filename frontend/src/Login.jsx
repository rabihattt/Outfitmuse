
import { useState } from "react";
import HERO_IMAGE from "./assets/hero.png";
import { EyeIcon, GoogleIcon, AppleIcon } from "./Icons";

export default function Login({ onSwitch, onLogin }) {
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
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token for the current browser session
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to the dashboard
      onLogin(data.user);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-neutral-900">

      <div className="relative hidden w-1/2 lg:block">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[340px]">

          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
              OM
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              OutfitMuse
            </span>
          </div>

          <h1 className="text-center text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-3 text-center text-sm text-neutral-500">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-neutral-700">
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 w-full rounded-lg bg-neutral-100 px-4 text-sm placeholder:text-neutral-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-neutral-700">
                  Password
                </label>

                <a href="#" className="text-xs font-semibold text-neutral-900 hover:underline">
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
                  className="h-11 w-full rounded-lg bg-neutral-100 px-4 pr-11 text-sm placeholder:text-neutral-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-neutral-900"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">OR</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-neutral-300 bg-white text-sm font-medium transition hover:bg-neutral-50"
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-neutral-300 bg-white text-sm font-medium transition hover:bg-neutral-50"
            >
              <AppleIcon />
              Sign in with Apple
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-neutral-900 hover:underline"
            >
              Sign up now
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}