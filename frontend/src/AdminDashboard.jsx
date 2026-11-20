import { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Shirt, 
  Layers, 
  Activity, 
  LogOut, 
  Search, 
  Filter, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FolderTree
} from "lucide-react";
import Footer from "./components/Footer";

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");

  // Sample real-world platform users preview
  const platformUsers = [
    { id: "usr-1", name: "Elena Vance", email: "elena@vance.com", profileCompleted: true, items: 14, joined: "Nov 14, 2026", status: "Active" },
    { id: "usr-2", name: "Marcus Chen", email: "marcus@chen.design", profileCompleted: true, items: 28, joined: "Nov 15, 2026", status: "Active" },
    { id: "usr-3", name: "Aria Montgomery", email: "aria@rosewood.co", profileCompleted: false, items: 4, joined: "Nov 17, 2026", status: "Pending Profile" },
    { id: "usr-4", name: "Julian Thorne", email: "j.thorne@atelier.fr", profileCompleted: true, items: 19, joined: "Nov 18, 2026", status: "Active" },
  ];

  const categoryMetrics = [
    { name: "Tops", count: 42, percentage: "32%", color: "#452C3A" },
    { name: "Bottoms", count: 31, percentage: "24%", color: "#57384A" },
    { name: "Outerwear", count: 20, percentage: "15%", color: "#C58D91" },
    { name: "Dresses", count: 18, percentage: "14%", color: "#DCCDBD" },
    { name: "Shoes & Bags", count: 19, percentage: "15%", color: "#84917C" },
  ];

  const activityFeed = [
    { id: 1, event: "New style profile finalized by Marcus Chen", time: "12 mins ago", type: "profile" },
    { id: 2, event: "Cloudinary asset upload verified: 'Cashmere Trench'", time: "42 mins ago", type: "upload" },
    { id: 3, event: "Recommendation synthesis executed for 8 member closets", time: "2 hours ago", type: "ai" },
    { id: 4, event: "New member account registered: Elena Vance", time: "4 hours ago", type: "user" },
  ];

  const filteredUsers = platformUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col justify-between text-[#292526]">
      
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#DCCDBD] bg-white/95 backdrop-blur-md px-6 lg:px-12 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#452C3A] text-sm font-bold text-[#F7F3EE]">
              OM
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-2xl font-bold tracking-wider text-[#452C3A]">
                  OUTFITMUSE
                </span>
                <span className="rounded-md bg-[#452C3A] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#292526]">
                {admin?.name || "Platform Director"}
              </span>
              <span className="text-[10px] text-[#84917C] font-semibold">
                Supervisory Access
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-full border border-[#DCCDBD] bg-white px-4 py-2 text-xs font-semibold text-[#686163] transition hover:border-[#C58D91] hover:text-[#452C3A]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 lg:px-12 py-10 space-y-10 animate-fade-in">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#84917C]">
              Operational Intelligence
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#452C3A] mt-1">
              Welcome, {admin?.name || "Administrator"}
            </h1>
            <p className="text-xs text-[#686163] mt-1">
              Real-time monitoring of members, wardrobe asset ingestion, and AI curation operations.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#DCCDBD] bg-white p-1 text-xs font-semibold shadow-2xs">
            {[
              { id: "overview", label: "Overview & Analytics" },
              { id: "users", label: "User Registry" },
              { id: "taxonomy", label: "Taxonomy & Categories" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#452C3A] text-[#F7F3EE] shadow-xs"
                    : "text-[#686163] hover:text-[#452C3A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Stats Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="luxury-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#686163]">
              <span>Active Members</span>
              <Users className="h-4 w-4 text-[#C58D91]" />
            </div>
            <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
              128
            </div>
            <span className="mt-1 text-[11px] font-semibold text-[#84917C]">
              +14% new this month
            </span>
          </div>

          <div className="luxury-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#686163]">
              <span>Wardrobe Assets</span>
              <Shirt className="h-4 w-4 text-[#84917C]" />
            </div>
            <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
              1,492
            </div>
            <span className="mt-1 text-[11px] font-semibold text-[#686163]">
              Cloudinary Media Sync 100%
            </span>
          </div>

          <div className="luxury-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#686163]">
              <span>Curated Profiles</span>
              <Layers className="h-4 w-4 text-[#DCCDBD]" />
            </div>
            <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
              94%
            </div>
            <span className="mt-1 text-[11px] font-semibold text-[#84917C]">
              Questionnaire Completion
            </span>
          </div>

          <div className="luxury-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#686163]">
              <span>API Uptime & Health</span>
              <Activity className="h-4 w-4 text-[#452C3A]" />
            </div>
            <div className="font-serif-editorial text-4xl font-bold text-[#452C3A]">
              99.98%
            </div>
            <span className="mt-1 text-[11px] font-semibold text-[#84917C]">
              Express & MongoDB Stable
            </span>
          </div>

        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Category Breakdown */}
            <div className="lg:col-span-2 rounded-3xl border border-[#DCCDBD] bg-white p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
                <div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
                    Garment Category Distribution
                  </h3>
                  <p className="text-xs text-[#686163]">
                    Proportion of cataloged apparel across all active digital closets
                  </p>
                </div>
                <FolderTree className="h-5 w-5 text-[#84917C]" />
              </div>

              <div className="space-y-4">
                {categoryMetrics.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#292526]">{cat.name}</span>
                      <span className="text-[#686163]">
                        {cat.count} items ({cat.percentage})
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF6F2]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: cat.percentage, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Stream */}
            <div className="rounded-3xl border border-[#DCCDBD] bg-white p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
                <h3 className="font-serif-editorial text-xl font-bold text-[#452C3A]">
                  System Activity Log
                </h3>
                <Clock className="h-4 w-4 text-[#C58D91]" />
              </div>

              <div className="space-y-4">
                {activityFeed.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-[#F7F3EE]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF6F2] text-[#452C3A]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#84917C]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292526]">{act.event}</p>
                      <span className="text-[10px] text-[#686163]">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Users Registry */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-[#DCCDBD] bg-white p-7 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
              <div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
                  Registered Members Directory
                </h3>
                <p className="text-xs text-[#686163]">
                  Inspect member onboarding status and wardrobe item volume
                </p>
              </div>

              {/* Search user */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#686163]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter by name or email..."
                  className="h-10 w-full rounded-full border border-[#DCCDBD] bg-[#F7F3EE] pl-10 pr-4 text-xs text-[#292526] outline-none focus:border-[#452C3A]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E0D7] text-[#686163] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Style Profile</th>
                    <th className="py-3 px-4">Wardrobe Pieces</th>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D7]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF6F2] transition">
                      <td className="py-3.5 px-4 font-semibold text-[#292526]">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#686163]">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          u.profileCompleted
                            ? "bg-[#EDF1EC] text-[#84917C]"
                            : "bg-[#F4E8E9] text-[#C58D91]"
                        }`}>
                          {u.profileCompleted ? "Completed ✓" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#452C3A]">
                        {u.items} items
                      </td>
                      <td className="py-3.5 px-4 text-[#686163]">
                        {u.joined}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded-full bg-[#84917C]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#84917C]">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Taxonomy */}
        {activeTab === "taxonomy" && (
          <div className="rounded-3xl border border-[#DCCDBD] bg-white p-7 shadow-xs space-y-6 animate-fade-in">
            <div className="pb-4 border-b border-[#E8E0D7]">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
                Apparel Taxonomy & Enum Classifications
              </h3>
              <p className="text-xs text-[#686163]">
                Managed categories conforming to database schemas in backend/models
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Tops", desc: "Shirts, T-shirts, Blouses, Kurtis, Sweaters", count: "Schema Active" },
                { name: "Bottoms", desc: "Trousers, Jeans, Skirts, Palazzos, Shorts", count: "Schema Active" },
                { name: "Dresses", desc: "Maxi, Midi, Slip dresses, Gowns, Sarees", count: "Schema Active" },
                { name: "Outerwear", desc: "Blazers, Trenches, Coats, Leather jackets", count: "Schema Active" },
                { name: "Shoes", desc: "Loafers, Boots, Heels, Sneakers, Sandals", count: "Schema Active" },
                { name: "Bags & Accessories", desc: "Handbags, Totes, Scarves, Jewelry, Belts", count: "Schema Active" },
              ].map(item => (
                <div key={item.name} className="rounded-2xl border border-[#E8E0D7] bg-[#FAF6F2] p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#452C3A]">{item.name}</h4>
                    <span className="rounded-full bg-[#84917C] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-xs text-[#686163] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer variant="minimal" />

    </div>
  );
}
