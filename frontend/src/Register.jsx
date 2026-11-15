import { useState } from "react";
import Register_Image from "./assets/register.png";
import { EyeIcon, GoogleIcon, AppleIcon } from "./Icons";

const inputClass =
  "h-11 w-full rounded-lg bg-neutral-100 px-4 text-sm placeholder:text-neutral-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-neutral-900";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");

      // Clear registration form
      setForm({
        name: "",
        email: "",
        password: "",
        confirm: "",
      });

      // Go to Login Page
      onSwitch();

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-neutral-900">

      <div className="relative hidden w-1/2 md:block">
        <img
          src={Register_Image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
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
            Create Account
          </h1>

          <p className="mt-3 text-center text-sm text-neutral-500">
            Fill in your details to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">

            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-medium text-neutral-700">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-neutral-700">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium text-neutral-700">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`${inputClass} pr-11`}
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

            <div>
              <label htmlFor="confirm" className="mb-2 block text-xs font-medium text-neutral-700">
                Confirm password
              </label>

              <input
                id="confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.confirm}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
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
              Sign up with Google
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-neutral-300 bg-white text-sm font-medium transition hover:bg-neutral-50"
            >
              <AppleIcon />
              Sign up with Apple
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-neutral-900 hover:underline"
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}