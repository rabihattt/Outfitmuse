
import { useState } from "react";
import HERO_IMAGE from "./assets/hero.png";
import { EyeIcon } from "./Icons";

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
            const response = await fetch(
                "http://localhost:5000/api/admin/login",
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
                throw new Error(data.message || "Admin login failed");
            }

            sessionStorage.setItem("adminToken", data.token);
            sessionStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            onLogin(data.admin);

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

                    <div className="mb-6 text-center">
                        <div className="mb-3 text-sm font-semibold text-neutral-500">
                            ADMIN PORTAL
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Admin Login
                        </h1>

                        <p className="mt-3 text-sm text-neutral-500">
                            Sign in to access the administration panel.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                        <div>
                            <label className="mb-2 block text-xs font-medium text-neutral-700">
                                Admin Email
                            </label>

                            <input
                                type="email"
                                required
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter admin email"
                                className="h-11 w-full rounded-lg bg-neutral-100 px-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-neutral-700">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="h-11 w-full rounded-lg bg-neutral-100 px-4 pr-11 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
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
                            className="h-11 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login as Admin"}
                        </button>

                    </form>

                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-8 w-full text-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:underline"
                    >
                        ← Back to User Login
                    </button>

                </div>
            </div>
        </div>
    );
}
