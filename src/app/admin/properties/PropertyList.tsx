"use client";

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

interface PropertyListProps {
  properties: Property[];
  onRefresh: () => void;
}

export default function PropertyList({ properties, onRefresh }: PropertyListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此房源嗎？")) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      onRefresh();
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("刪除失敗");
    }
  };

  if (properties.length === 0) {
    return <p style={{ color: "#666" }}>目前沒有房源</p>;
  }

  return (
    <div>
      <h2>房源列表 ({properties.length})</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "15px",
        }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "15px",
              backgroundColor: "white",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{property.title}</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
              {property.location}
            </p>

            <div style={{ fontSize: "14px", marginBottom: "10px" }}>
              <p>
                <strong>價格：</strong>NT${property.price.toLocaleString()}
              </p>
              <p>
                <strong>規格：</strong>
                {property.bedrooms}房 {property.bathrooms}衛 {property.area}m²
              </p>
              <p>
                <strong>狀態：</strong>
                <span
                  style={{
                    backgroundColor:
                      property.status === "draft"
                        ? "#ffc107"
                        : property.status === "approved"
                          ? "#28a745"
                          : "#6c757d",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    fontSize: "12px",
                  }}
                >
                  {property.status}
                </span>
              </p>
            </div>

            <p style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>
              建立於 {new Date(property.createdAt).toLocaleString("zh-TW")}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  // 此處可連結到詳情或編輯頁面
                  alert("編輯功能開發中");
                }}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                編輯
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
