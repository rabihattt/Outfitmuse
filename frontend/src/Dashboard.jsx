
export default function Dashboard({ user, onLogout, onOpenWardrobe }) {
    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-900">

            {/* Header */}
            <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">

                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                        OM
                    </span>

                    <span className="text-xl font-semibold tracking-tight">
                        OutfitMuse
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onLogout}
                    className="h-10 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                    Logout
                </button>

            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Thanks for trusting OutfitMuse..
                </h1>

                {user?.name && (
                    <p className="mt-4 text-sm text-neutral-500">
                        Signed in as {user.name}
                    </p>
                )}

                {/* Wardrobe Button */}
                <button
                    type="button"
                    onClick={onOpenWardrobe}
                    className="mt-8 rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                    My Wardrobe →
                </button>

            </main>

        </div>
    );
}
