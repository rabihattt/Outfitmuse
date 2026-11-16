
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export default function WardrobePreview() {

    const [clothes, setClothes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        color: "",
        season: "",
        occasion: "",
        image: null
    });

    const [preview, setPreview] = useState(null);

    // GET USER'S WARDROBE
    const fetchWardrobe = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(`${API_URL}/wardrobe`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load wardrobe");
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

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // HANDLE IMAGE SELECTION
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setError("");

        setFormData(prev => ({
            ...prev,
            image: file
        }));

        setPreview(URL.createObjectURL(file));
    };

    // RESET FORM
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
            image: null
        });

        setPreview(null);
        setShowForm(false);
        setError("");
    };

    // ADD CLOTHING ITEM
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.category || !formData.image) {
            setError("Name, category and image are required.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const token = sessionStorage.getItem("token");

            const uploadData = new FormData();

            uploadData.append("name", formData.name.trim());
            uploadData.append("category", formData.category);
            uploadData.append("color", formData.color);
            uploadData.append("season", formData.season);
            uploadData.append("occasion", formData.occasion);
            uploadData.append("image", formData.image);

            const response = await fetch(`${API_URL}/wardrobe`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: uploadData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            // Show newly uploaded item immediately
            setClothes(prev => [data.item, ...prev]);

            resetForm();

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // DELETE CLOTHING ITEM
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this clothing item?"
        );

        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/wardrobe/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setClothes(prev =>
                prev.filter(item => item._id !== id)
            );

        } catch (err) {
            setError(err.message);
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="text-center py-16 text-gray-500">
                Loading your wardrobe...
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h2 className="text-2xl font-bold">
                        My Wardrobe
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {clothes.length} clothing items
                    </p>
                </div>

                {/* ADD BUTTON */}
                <button
                    onClick={() => {
                        setError("");
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-white hover:bg-neutral-700 transition"
                >
                    <span className="text-xl">+</span>
                    <span className="text-sm font-semibold">
                        Add Clothes
                    </span>
                </button>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* UPLOAD FORM */}
            {showForm && (

                <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-xl font-bold">
                            Add New Clothing
                        </h2>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={uploading}
                            className="text-gray-500 text-xl"
                        >
                            ✕
                        </button>

                    </div>

                    <form onSubmit={handleUpload}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* CLOTHING NAME */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Clothing Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Red Shirt"
                                    required
                                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-neutral-800"
                                />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category *
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border p-3"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Tops">Tops</option>
                                    <option value="Bottoms">Bottoms</option>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Outerwear">Outerwear</option>
                                    <option value="Shoes">Shoes</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            {/* COLOR */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Color
                                </label>

                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="e.g. Red"
                                    className="w-full rounded-lg border p-3"
                                />
                            </div>

                            {/* SEASON */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Season
                                </label>

                                <select
                                    name="season"
                                    value={formData.season}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                >
                                    <option value="">Select Season</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Autumn">Autumn</option>
                                    <option value="All Season">All Season</option>
                                </select>
                            </div>

                            {/* OCCASION */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Occasion
                                </label>

                                <select
                                    name="occasion"
                                    value={formData.occasion}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                >
                                    <option value="">Select Occasion</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Party">Party</option>
                                    <option value="Office">Office</option>
                                    <option value="Wedding">Wedding</option>
                                </select>
                            </div>

                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mt-6">

                            <label className="block text-sm font-medium mb-2">
                                Upload Clothing Image *
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="w-full rounded-lg border p-3"
                            />

                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Clothing Preview"
                                        className="h-48 w-48 rounded-xl border object-cover"
                                    />
                                </div>
                            )}

                        </div>

                        {/* FORM BUTTONS */}
                        <div className="flex gap-3 mt-7">

                            <button
                                type="submit"
                                disabled={uploading}
                                className="rounded-lg bg-neutral-900 px-7 py-3 text-white font-semibold hover:bg-neutral-700 disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload Clothes"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={uploading}
                                className="rounded-lg border px-7 py-3 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* CLOTHING GRID */}
            {clothes.length === 0 ? (

                <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">

                    <div className="text-5xl mb-4">👗</div>

                    <h3 className="text-xl font-semibold">
                        Your wardrobe is empty
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Click Add Clothes to upload your first outfit.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                    {clothes.map((item) => (

                        <div
                            key={item._id}
                            className="group overflow-hidden rounded-xl border bg-white shadow-sm"
                        >

                            <div className="relative">

                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-64 w-full object-cover"
                                />

                                {/* DELETE BUTTON */}
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    title="Delete clothing"
                                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:bg-red-50"
                                >
                                    🗑
                                </button>

                            </div>

                            <div className="p-4">

                                <h3 className="font-semibold">
                                    {item.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {item.category}
                                    {item.color && ` • ${item.color}`}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    {[item.season, item.occasion]
                                        .filter(Boolean)
                                        .join(" • ")}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}
