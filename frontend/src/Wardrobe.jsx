import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  X, 
  UploadCloud, 
  Shirt, 
  Search, 
  Filter, 
  Sparkles, 
  Check, 
  Tag, 
  Calendar, 
  Compass, 
  Layers,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function WardrobePreview({ onOpenRecommendations }) {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
    season: "",
    occasion: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // Fetch Wardrobe items from backend
  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/wardrobe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load wardrobe collection");
      }

      setClothes(data.items || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please select a smaller file.");
      return;
    }

    setError("");
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // Reset Form
  const resetForm = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFormData({
      name: "",
      category: "",
      color: "",
      season: "",
      occasion: "",
      image: null,
    });

    setPreview(null);
    setShowForm(false);
    setError("");
  };

  // Add Clothing Item
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category || !formData.image) {
      setError("Name, category, and an image are required.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const token = sessionStorage.getItem("token");
      const uploadData = new FormData();

      uploadData.append("name", formData.name.trim());
      uploadData.append("category", formData.category);
      uploadData.append("color", formData.color.trim());
      uploadData.append("season", formData.season || "All Season");
      uploadData.append("occasion", formData.occasion || "Casual");
      uploadData.append("image", formData.image);

      const response = await fetch(`${API_URL}/wardrobe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload clothing piece");
      }

      setClothes((prev) => [data.item, ...prev]);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete Clothing Item
  const confirmDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/wardrobe/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setClothes((prev) => prev.filter((item) => item._id !== id));
      setItemToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter Categories
  const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];

  // Filter Logic
  const filteredClothes = clothes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.color && item.color.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSeason = selectedSeason === "All" || item.season === selectedSeason;
    const matchesOccasion = selectedOccasion === "All" || item.occasion === selectedOccasion;

    return matchesSearch && matchesCategory && matchesSeason && matchesOccasion;
  });

  // Calculate Category Counts
  const getCategoryCount = (cat) => {
    if (cat === "All") return clothes.length;
    return clothes.filter((item) => item.category === cat).length;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#DCCDBD] border-t-[#452C3A]" />
        <p className="mt-4 font-serif-editorial text-lg text-[#452C3A]">
          Opening your digital wardrobe sanctuary...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner / Actions */}
      <div className="rounded-3xl border border-[#DCCDBD] bg-white p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EFEB] px-3.5 py-1 text-xs font-bold text-[#452C3A]">
              <Shirt className="h-3.5 w-3.5 text-[#C58D91]" />
              <span>Digital Closet Management</span>
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#452C3A]">
              My Wardrobe Collection
            </h1>
            <p className="max-w-xl text-sm text-[#686163]">
              Organized by category, color taxonomy, and season. You have{" "}
              <strong className="text-[#452C3A]">{clothes.length} pieces</strong> cataloged in your atelier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-full bg-[#452C3A] px-6 py-3.5 text-xs font-semibold text-[#F7F3EE] shadow-sm transition-all duration-300 hover:bg-[#57384A] hover:shadow-md"
            >
              <Plus className="h-4 w-4 text-[#C58D91]" />
              <span>Add Clothing Piece</span>
            </button>

            {onOpenRecommendations && (
              <button
                type="button"
                onClick={onOpenRecommendations}
                className="flex items-center gap-2 rounded-full border border-[#DCCDBD] bg-white px-5 py-3.5 text-xs font-semibold text-[#452C3A] transition hover:border-[#C58D91] hover:bg-[#F5EFEB]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C58D91]" />
                <span>Pair Outfits</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mt-8 pt-6 border-t border-[#E8E0D7] space-y-4">
          
          {/* Search bar & dropdown filters row */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#686163]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by garment name or color..."
                className="h-10 w-full rounded-full border border-[#DCCDBD] bg-[#F7F3EE] pl-10 pr-4 text-xs text-[#292526] placeholder:text-[#686163]/50 outline-none transition focus:border-[#452C3A] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#686163] hover:text-[#452C3A]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Season & Occasion Dropdowns */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Season Select */}
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="h-10 rounded-full border border-[#DCCDBD] bg-white px-4 text-xs font-semibold text-[#452C3A] outline-none transition hover:border-[#C58D91]"
              >
                <option value="All">All Seasons</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Autumn">Autumn</option>
                <option value="All Season">All Season</option>
              </select>

              {/* Occasion Select */}
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="h-10 rounded-full border border-[#DCCDBD] bg-white px-4 text-xs font-semibold text-[#452C3A] outline-none transition hover:border-[#C58D91]"
              >
                <option value="All">All Occasions</option>
                <option value="Casual">Casual</option>
                <option value="Office">Office</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Wedding">Wedding</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#452C3A] text-[#F7F3EE] shadow-xs"
                      : "border border-[#E8E0D7] bg-[#F7F3EE] text-[#686163] hover:border-[#DCCDBD] hover:text-[#452C3A]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? "bg-[#C58D91] text-white" : "bg-[#DCCDBD]/50 text-[#452C3A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Global Error Banner if any */}
      {error && (
        <div className="rounded-2xl border border-[#C58D91] bg-[#F4E8E9] p-4 text-xs font-semibold text-[#452C3A] animate-fade-in flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-[#452C3A]">
            ✕
          </button>
        </div>
      )}

      {/* Add Clothing Modal Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292526]/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#DCCDBD] bg-white p-6 sm:p-8 shadow-2xl animate-scale-in">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E0D7]">
              <div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
                  Add New Garment
                </h3>
                <p className="text-xs text-[#686163]">
                  Catalog a new piece into your personal digital closet
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCCDBD] bg-[#F7F3EE] text-[#686163] hover:text-[#452C3A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Garment Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ivory Silk Blouse"
                    required
                    className="h-11 w-full rounded-xl border border-[#DCCDBD] px-3.5 text-sm text-[#292526] outline-none transition focus:border-[#452C3A] focus:ring-2 focus:ring-[#C58D91]/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-xl border border-[#DCCDBD] bg-white px-3.5 text-sm text-[#292526] outline-none transition focus:border-[#452C3A]"
                  >
                    <option value="">Select Category</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                    Color Tone
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Warm Champagne, Plum, Sage"
                    className="h-11 w-full rounded-xl border border-[#DCCDBD] px-3.5 text-sm text-[#292526] outline-none transition focus:border-[#452C3A] focus:ring-2 focus:ring-[#C58D91]/20"
                  />
                </div>

                {/* Season */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                    Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#DCCDBD] bg-white px-3.5 text-sm text-[#292526] outline-none transition focus:border-[#452C3A]"
                  >
                    <option value="">Select Season</option>
                    <option value="All Season">All Season</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Autumn">Autumn</option>
                  </select>
                </div>

                {/* Occasion */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#DCCDBD] bg-white px-3.5 text-sm text-[#292526] outline-none transition focus:border-[#452C3A]"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Casual">Casual</option>
                    <option value="Office">Office</option>
                    <option value="Formal">Formal</option>
                    <option value="Party">Party</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>

              </div>

              {/* Image Upload Dropzone */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#452C3A]">
                  Garment Photo *
                </label>

                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DCCDBD] bg-[#F7F3EE] p-6 text-center transition hover:border-[#C58D91]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!preview}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  />

                  {preview ? (
                    <div className="relative flex flex-col items-center">
                      <img
                        src={preview}
                        alt="Clothing Preview"
                        className="h-40 w-40 rounded-xl object-cover shadow-sm border border-[#DCCDBD]"
                      />
                      <span className="mt-2 text-xs font-medium text-[#84917C]">
                        Photo selected. Click or drag to change.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#452C3A] shadow-2xs">
                        <UploadCloud className="h-6 w-6 text-[#C58D91]" />
                      </div>
                      <p className="text-xs font-bold text-[#452C3A]">
                        Click to upload or drag & drop photo
                      </p>
                      <p className="text-[11px] text-[#686163]">
                        PNG, JPG, or WebP up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0D7]">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="rounded-full border border-[#DCCDBD] bg-white px-6 py-2.5 text-xs font-semibold text-[#686163] hover:text-[#452C3A]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-full bg-[#452C3A] px-7 py-2.5 text-xs font-semibold text-[#F7F3EE] shadow-sm transition hover:bg-[#57384A] disabled:opacity-50"
                >
                  <span>{uploading ? "Uploading to Atelier..." : "Save to Wardrobe"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292526]/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#DCCDBD] bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4E8E9] text-[#C58D91]">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
              Remove Garment?
            </h3>
            <p className="text-xs leading-relaxed text-[#686163]">
              Are you sure you want to remove <strong className="text-[#292526]">{itemToDelete.name}</strong> from your closet collection?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-full border border-[#DCCDBD] bg-white px-5 py-2 text-xs font-semibold text-[#686163]"
              >
                Keep Piece
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(itemToDelete._id)}
                className="rounded-full bg-red-600 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wardrobe Grid Display */}
      {filteredClothes.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#DCCDBD] bg-white/70 py-20 px-6 text-center animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF6F2] text-2xl mb-4 text-[#C58D91]">
            👗
          </div>
          <h3 className="font-serif-editorial text-2xl font-bold text-[#452C3A]">
            {clothes.length === 0 ? "Your Closet is Currently Empty" : "No Pieces Match Your Filter"}
          </h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-[#686163] mt-2 mb-6">
            {clothes.length === 0
              ? "Start building your digital wardrobe by uploading photos of your favorite tops, bottoms, shoes, and outerwear."
              : "Try adjusting your search criteria, season, or category filters to locate your pieces."}
          </p>

          <button
            type="button"
            onClick={() => {
              if (clothes.length === 0) {
                setShowForm(true);
              } else {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedSeason("All");
                setSelectedOccasion("All");
              }
            }}
            className="rounded-full bg-[#452C3A] px-6 py-3 text-xs font-semibold text-[#F7F3EE] shadow-sm transition hover:bg-[#57384A]"
          >
            {clothes.length === 0 ? "+ Add Your First Garment" : "Reset All Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredClothes.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DCCDBD] bg-white shadow-2xs transition-all duration-300 hover:border-[#C58D91] hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image Container with Luxury Overlay */}
              <div className="relative aspect-3/4 w-full overflow-hidden bg-[#FAF6F2]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Category Badge */}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#452C3A] shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Delete Icon Trigger */}
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  title="Remove from wardrobe"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#686163] shadow-xs transition hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Item Details */}
              <div className="p-4 space-y-1">
                <h4 className="font-semibold text-sm text-[#292526] truncate">
                  {item.name}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-[#686163]">
                  {item.color && (
                    <span className="text-[#84917C] font-medium">{item.color}</span>
                  )}
                  {item.color && item.season && <span>•</span>}
                  {item.season && <span>{item.season}</span>}
                </div>

                {item.occasion && (
                  <div className="pt-2">
                    <span className="inline-block rounded-md bg-[#F7F3EE] px-2 py-0.5 text-[10px] font-semibold text-[#452C3A]">
                      {item.occasion}
                    </span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
