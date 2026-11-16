
export default function AdminDashboard({ admin, onLogout }) {
    return (
        <div className="min-h-screen bg-neutral-100">

            <header className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
                <h1 className="text-2xl font-bold">
                    OutfitMuse Admin
                </h1>

                <button
                    onClick={onLogout}
                    className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
                >
                    Logout
                </button>
            </header>

            <main className="p-8">

                <h2 className="text-2xl font-bold">
                    Welcome, {admin.name}
                </h2>

                <p className="mt-2 text-neutral-500">
                    Manage your OutfitMuse platform from here.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold">User Management</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            Manage registered users.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold">Category Management</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            Manage clothing categories.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold">Activity Monitoring</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            Monitor platform activities.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}
