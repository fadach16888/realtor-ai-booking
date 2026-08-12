"use client";

import { useEffect, useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  status: string;
}

interface ListingContent {
  title: string;
  description: string;
}

interface GeneratedContent {
  facebook: { content: string };
  instagram: { content: string; hashtags: string };
  twitter: { tweets: string[] };
  s591: ListingContent;
  s5168: ListingContent;
  lehouse: ListingContent;
}

const LISTING_SITES = [
  { key: "s591", label: "591 房屋" },
  { key: "s5168", label: "5168 房市" },
  { key: "lehouse", label: "樂屋網" },
] as const;

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontFamily: "inherit",
} as const;

export default function ReviewPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      const data = await response.json();
      setProperties(data.filter((p: Property) => p.status === "draft"));
    } catch {
      setError("讀取房源失敗");
    }
  };

  const selectProperty = (property: Property) => {
    setSelected(property);
    setContent(null);
    setError("");
  };

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: selected.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "生成文案失敗");
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成文案失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selected || !content) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/properties/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", approvedContent: content }),
      });
      if (!response.ok) throw new Error("批准失敗");

      setSelected(null);
      setContent(null);
      fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : "批准失敗");
    } finally {
      setSaving(false);
    }
  };

  const updateTweet = (index: number, value: string) => {
    if (!content) return;
    const tweets = [...content.twitter.tweets];
    tweets[index] = value;
    setContent({ ...content, twitter: { tweets } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>文案審核</h1>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            alignSelf: "start",
          }}
        >
          <h3 style={{ marginTop: 0 }}>待審核房源</h3>
          {properties.length === 0 ? (
            <p style={{ color: "#666" }}>沒有待審核的房源</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => selectProperty(property)}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    backgroundColor: selected?.id === property.id ? "#007bff" : "white",
                    color: selected?.id === property.id ? "white" : "black",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{property.title}</div>
                  <div style={{ fontSize: "12px", marginTop: "5px" }}>{property.location}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {!selected ? (
            <p style={{ color: "#999" }}>選擇一個房源以開始審核</p>
          ) : (
            <div>
              <h2 style={{ marginTop: 0 }}>{selected.title}</h2>
              <p style={{ color: "#666" }}>{selected.location}</p>

              {error && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {!content ? (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                  }}
                >
                  {loading ? "生成中..." : "生成文案"}
                </button>
              ) : (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3>Facebook</h3>
                    <textarea
                      value={content.facebook.content}
                      onChange={(e) =>
                        setContent({ ...content, facebook: { content: e.target.value } })
                      }
                      style={{ ...inputStyle, minHeight: "150px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3>Instagram</h3>
                    <textarea
                      value={content.instagram.content}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          instagram: { ...content.instagram, content: e.target.value },
                        })
                      }
                      style={{ ...inputStyle, minHeight: "100px" }}
                    />
                    <label style={{ display: "block", marginTop: "10px" }}>
                      Hashtags：
                      <input
                        type="text"
                        value={content.instagram.hashtags}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            instagram: { ...content.instagram, hashtags: e.target.value },
                          })
                        }
                        style={inputStyle}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3>Twitter</h3>
                    {content.twitter.tweets.map((tweet, idx) => (
                      <div key={idx} style={{ marginBottom: "10px" }}>
                        <textarea
                          value={tweet}
                          onChange={(e) => updateTweet(idx, e.target.value)}
                          style={{ ...inputStyle, minHeight: "80px" }}
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            color: tweet.length > 280 ? "#dc3545" : "#999",
                          }}
                        >
                          {tweet.length} / 280
                        </div>
                      </div>
                    ))}
                  </div>

                  {LISTING_SITES.map(({ key, label }) => (
                    <div key={key} style={{ marginBottom: "20px" }}>
                      <h3>{label}</h3>
                      <label>
                        標題：
                        <input
                          type="text"
                          value={content[key].title}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              [key]: { ...content[key], title: e.target.value },
                            })
                          }
                          style={inputStyle}
                        />
                      </label>
                      <label style={{ display: "block", marginTop: "10px" }}>
                        描述：
                        <textarea
                          value={content[key].description}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              [key]: { ...content[key], description: e.target.value },
                            })
                          }
                          style={{ ...inputStyle, minHeight: "100px" }}
                        />
                      </label>
                    </div>
                  ))}

                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {saving ? "儲存中..." : "批准並儲存文案"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
