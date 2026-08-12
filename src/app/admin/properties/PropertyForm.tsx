"use client";

import { useState } from "react";

interface PropertyFormProps {
  onPropertyAdded: () => void;
}

export default function PropertyForm({ onPropertyAdded }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create property");
      }

      // 清空表單
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
      });

      onPropertyAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold" as const,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "4px",
        marginBottom: "20px",
        maxWidth: "600px",
      }}
    >
      <h2>新增房源</h2>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      <label style={labelStyle}>
        標題 *
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle as any}
        />
      </label>

      <label style={labelStyle}>
        描述 *
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          style={inputStyle as any}
        />
      </label>

      <label style={labelStyle}>
        地點 *
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle as any}
        />
      </label>

      <label style={labelStyle}>
        價格 (元) *
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          style={inputStyle as any}
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <label style={labelStyle}>
          房數 *
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            style={inputStyle as any}
          />
        </label>

        <label style={labelStyle}>
          衛浴 *
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            style={inputStyle as any}
          />
        </label>
      </div>

      <label style={labelStyle}>
        面積 (m²) *
        <input
          type="number"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
          style={inputStyle as any}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "新增中..." : "新增房源"}
      </button>
    </form>
  );
}
