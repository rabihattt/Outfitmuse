export default function Dashboard({ user, onLogout }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-900">

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
          className="h-10 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Logout
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to OutfitMuse
        </h1>

        {user?.name && (
          <p className="mt-4 text-sm text-neutral-500">
            Signed in as {user.name}
          </p>
        )}
      </main>

    </div>
  );
}
