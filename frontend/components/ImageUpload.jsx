"use client";

import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ImageUpload({ type, id, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFile(selectedFile);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/upload/${type}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setFile(null);
        setPreview(null);
        if (onSuccess) onSuccess(response.data.imageUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">
        Upload {type === "restaurant" ? "Restaurant" : "Menu Item"} Image
      </h3>

      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Max size: 5MB. Supported: JPEG, PNG, GIF, WebP
        </p>
      </div>

      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs rounded shadow"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
