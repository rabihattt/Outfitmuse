import { useState } from "react";
import { Sparkles, Shirt, LayoutDashboard, UserCheck, LogOut, Menu, X, PlusCircle, Compass } from "lucide-react";

export default function Navbar({ activePage, onNavigate, onLogout, user, onAddClothes }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: "userDashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "wardrobe",
      label: "Digital Wardrobe",
      icon: Shirt,
    },
    {
      id: "recommendations",
      label: "AI Recommendations",
      icon: Sparkles,
      badge: "AI",
    },
    {
      id: "styleProfile",
      label: "Style Profile",
      icon: UserCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E0D7] bg-[#F7F3EE]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate("userDashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#452C3A] text-sm font-bold text-[#F7F3EE] shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#57384A]">
            OM
          </span>
          <div className="flex flex-col">
            <span className="font-serif-editorial text-2xl font-bold tracking-wider text-[#452C3A] transition-colors group-hover:text-[#57384A]">
              OUTFITMUSE
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C58D91] font-semibold -mt-1">
              Haute Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-[#DCCDBD]/70 bg-white/70 p-1.5 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#452C3A] text-[#F7F3EE] shadow-sm"
                    : "text-[#686163] hover:text-[#452C3A] hover:bg-[#F5EFEB]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#C58D91]" : "text-[#686163]"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-widest ${
                    isActive ? "bg-[#C58D91] text-white" : "bg-[#F4E8E9] text-[#452C3A]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="hidden lg:flex items-center gap-3">
          {onAddClothes && (
            <button
              type="button"
              onClick={onAddClothes}
              className="flex items-center gap-2 rounded-full border border-[#DCCDBD] bg-white px-4 py-2 text-xs font-semibold text-[#452C3A] transition-all hover:border-[#C58D91] hover:bg-[#F5EFEB] hover:shadow-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 text-[#C58D91]" />
              <span>Add Clothing</span>
            </button>
          )}

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#E8E0D7]">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCCDBD] text-xs font-bold text-[#452C3A]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[#292526] line-clamp-1 max-w-[100px]">
                  {user?.name || "Muse Member"}
                </span>
                <span className="text-[10px] text-[#84917C] font-medium">Personal Stylist</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D7] bg-white text-[#686163] transition hover:border-[#C58D91] hover:bg-[#F4E8E9] hover:text-[#452C3A]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCCDBD] bg-white text-[#452C3A] shadow-xs"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E0D7] bg-[#F7F3EE] px-6 py-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E0D7]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCCDBD] text-sm font-bold text-[#452C3A]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-[#292526]">{user?.name || "Muse Member"}</p>
                <p className="text-xs text-[#686163]">{user?.email || "member@outfitmuse.style"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#452C3A] text-white"
                      : "text-[#292526] hover:bg-[#F5EFEB]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#C58D91]" : "text-[#686163]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-[#C58D91] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onAddClothes && (
              <button
                type="button"
                onClick={() => {
                  onAddClothes();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-[#DCCDBD] bg-white p-3 text-sm font-semibold text-[#452C3A] mt-2"
              >
                <PlusCircle className="h-4 w-4 text-[#C58D91]" />
                <span>Add New Clothing</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3 text-sm font-semibold text-red-700 mt-4"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
