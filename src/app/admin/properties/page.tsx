"use client";

import { useEffect, useState } from "react";
import PropertyForm from "./PropertyForm";
import PropertyList from "./PropertyList";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyAdded = () => {
    setShowForm(false);
    fetchProperties();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>房源管理</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showForm ? "關閉表單" : "新增房源"}
      </button>

      {showForm && <PropertyForm onPropertyAdded={handlePropertyAdded} />}

      {loading ? (
        <p>載入中...</p>
      ) : (
        <PropertyList properties={properties} onRefresh={fetchProperties} />
      )}
    </div>
  );
}
