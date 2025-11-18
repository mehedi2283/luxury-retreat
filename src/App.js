import React, { useMemo, useState } from "react";
import "./App.css";

/* ------------------ PRICING (Hidden on UI, used only for webhook) ------------------ */
const PRICING = {
  living: { label: "Living Areas (Living/Family)", price: 7800 },
  dining: { label: "Dining Room", price: 5400 },
  bedroom: { label: "Bedroom", price: 3350 },
  bathroom: { label: "Bathroom", price: 250 },
  kitchenArt: { label: "Kitchen (Art & Accessories)", price: 100 },

  kitchenEssentials: { label: "Kitchen Essentials (Add-on)", price: 500 },
  patio: { label: "Patio Area (Add-on)", price: 1500 },

  entryway: { label: "Entryway Package (Add-on)", price: 750 },
  office: { label: "Office / Den Package (Add-on)", price: 1500 },
};

/* ------------------ STEPS ------------------ */
const STEPS = [
  {
    id: "living",
    kind: "qty",
    image: "/images/living.jpg",
    title: "Living Room",
    question: "How many living areas?",
    priceKey: "living",
  },
  {
    id: "dining",
    kind: "qty",
    image: "/images/dining.jpg",
    title: "Dining Room",
    question: "How many dining areas?",
    priceKey: "dining",
  },
  {
    id: "bedroom",
    kind: "qty",
    image: "/images/bedroom.jpg",
    title: "Bedroom",
    question: "How many bedrooms?",
    priceKey: "bedroom",
  },
  {
    id: "bathroom",
    kind: "qty",
    image: "/images/bathroom.jpg",
    title: "Bathroom",
    question: "How many bathrooms?",
    priceKey: "bathroom",
  },
  {
    id: "kitchenArt",
    kind: "qty",
    image: "/images/kitchen.jpg",
    title: "Kitchen Styling",
    question: "How many kitchens?",
    priceKey: "kitchenArt",
  },

  /* ADD-ONS (qty + input also required) */
  {
    id: "kitchenEssentials",
    kind: "qtyNoImage",
    title: "Kitchen Essentials (Add-on)",
    question: "Include Kitchen Essentials?",
    priceKey: "kitchenEssentials",
  },
  {
    id: "patio",
    kind: "qtyNoImage",
    title: "Patio Area (Add-on)",
    question: "Include patio setup?",
    priceKey: "patio",
  },

  /* FIXED ADD-ONS */
  {
    id: "entryway",
    kind: "fixedNoImage",
    title: "Entryway Package (Add-on)",
    question: "Would you like to include it?",
    priceKey: "entryway",
  },
  {
    id: "office",
    kind: "fixedNoImage",
    title: "Office / Den Package (Add-on)",
    question: "Would you like to include it?",
    priceKey: "office",
  },

  { id: "summary", kind: "summary", title: "Review Your Selections" },

  {
    id: "contact",
    kind: "contact",
    title: "Your Package Is Ready!",
    subtitle: "Enter your details and we’ll send your estimate.",
  },
];

/* ------------------ FINAL WEBHOOK ------------------ */
const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/9BZdBwDz8uXZfiw31MXE/webhook-trigger/39fded8a-339b-4721-afe7-ddd55985784b";

/* ------------------ Qty Pill ------------------ */
const QtyPill = ({ value, active, onClick }) => (
  <button className={`qty-pill ${active ? "active" : ""}`} onClick={onClick}>
    {value}
  </button>
);

/* ------------------ MAIN APP ------------------ */
export default function App() {
  const [mode, setMode] = useState("landing");
  const [selectedRetreat, setSelectedRetreat] = useState(null);

  const [step, setStep] = useState(0);
  const [isBack, setIsBack] = useState(false);

  const [qty, setQty] = useState(
    Object.keys(PRICING).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const current = STEPS[step];

  /* ---------- required steps (Next disabled until qty selected) ---------- */
  const requiredQtySteps = ["living", "dining", "bedroom", "bathroom", "kitchenArt"];

  const isNextDisabled = () => {
    if (
      (current.kind === "qty" || current.kind === "qtyNoImage") &&
      requiredQtySteps.includes(current.priceKey)
    ) {
      return !qty[current.priceKey];
    }
    return false;
  };

  /* ---------- auto-next helper (used only for pills / Add) ---------- */
  const autoNext = () => {
    setTimeout(() => {
      setIsBack(false);
      setStep((p) => p + 1);
      window.scrollTo(0, 0);
    }, 150);
  };

  /* ---------- quantity setter: auto-next only when fromPill = true ---------- */
  const setQuantity = (key, val, fromPill = false) => {
    setQty((prev) => ({ ...prev, [key]: val }));
    setError("");

    if (fromPill && val && val > 0) {
      autoNext();
    }
  };

  /* ------------------ BACKEND TOTALS (hidden in UI) ------------------ */
  const lineItems = useMemo(() => {
    return Object.entries(qty)
      .filter(([_, q]) => q > 0)
      .map(([key, q]) => ({
        key,
        label: PRICING[key].label,
        qty: q,
        unit: PRICING[key].price,
        total: q * PRICING[key].price,
      }));
  }, [qty]);

  const addOnKeys = ["kitchenEssentials", "patio", "entryway", "office"];

  const addOnsTotal = useMemo(() => {
    return addOnKeys.reduce((sum, key) => {
      const q = qty[key] || 0;
      return sum + q * PRICING[key].price;
    }, 0);
  }, [qty]);

  const grandTotal = useMemo(
    () => lineItems.reduce((s, i) => s + i.total, 0),
    [lineItems]
  );

  /* ------------------ Navigation ------------------ */
  const next = () => {
    const optional = ["kitchenEssentials", "patio", "entryway", "office"];

    if (
      (current.kind === "qty" || current.kind === "qtyNoImage") &&
      !optional.includes(current.priceKey) &&
      qty[current.priceKey] === null
    ) {
      setError("Please select a quantity");
      return;
    }

    setIsBack(false);
    setStep((p) => p + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    setIsBack(true);
    setStep((p) => p - 1);
    window.scrollTo(0, 0);
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.email || !formData.phone) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    const payload = {
      retreatType: selectedRetreat,
      ...formData,
      items: lineItems,
      addOnsTotal,
      grandTotal,
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (error) {
      setError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ LUXURY LANDING PAGE ------------------ */
  if (mode === "landing") {
    return (
      <div className="luxury-container">
        <div className="luxury-header">
          <h2>What kind of Luxury Retreat are you building?</h2>
          <p>Select the retreat type to begin your quote.</p>
        </div>

        <div className="luxury-grid">
          <div className="luxury-item">
            <img src="/images/condo_Cue_Photo.jpg" alt="" />
            <h3>Condo Luxe Living</h3>
            <button
              className="fancy-btn luxury-sub-btn"
              onClick={() => {
                setSelectedRetreat("Condo Luxe Living");
                setMode("wizard");
              }}
            >
              Condo Luxe — Start Quote
            </button>
          </div>

          <div className="luxury-item">
            <img src="/images/grand_Estate_Cue_photo.jpg" alt="" />
            <h3>Grand Estate Luxury</h3>
            <button
              className="fancy-btn luxury-sub-btn"
              onClick={() => {
                setSelectedRetreat("Grand Estate Luxury");
                setMode("wizard");
              }}
            >
              Grand Estate — Start Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------ WIZARD ------------------ */
  return (
    <div className="page">
      <div className="topbar">
        Step {step + 1} / {STEPS.length}
      </div>

      <div
        className={`step-anim ${isBack ? "slide-in-left" : "slide-in-right"}`}
      >
        {/* ------------------ QUANTITY PAGES ------------------ */}
        {(current.kind === "qty" || current.kind === "qtyNoImage") && (
          <section
            className={`step card ${
              current.kind === "qtyNoImage" ? "no-image" : ""
            }`}
          >
            <h2 className="lux-h2">
              {selectedRetreat} – {current.title}
            </h2>

            {/* ------------------ ROOMS W/ IMAGE ------------------ */}
            {current.kind === "qty" && (
              <div className="fixed-grid">
                <div className="media">
                  <img src={current.image} alt="" />
                </div>

                <div className="content">
                  <p className="question">{current.question}</p>

                  <div className="pill-row">
                    {[1, 2, 3].map((n) => (
                      <QtyPill
                        key={n}
                        value={n}
                        active={qty[current.priceKey] === n}
                        onClick={() =>
                          setQuantity(
                            current.priceKey,
                            qty[current.priceKey] === n ? null : n,
                            true // pill → auto-next
                          )
                        }
                      />
                    ))}

                    {/* Quantity Input */}
                    <input
                      type="number"
                      min="1"
                      className="qty-input"
                      placeholder="Qty"
                      value={
                        qty[current.priceKey] > 3 ? qty[current.priceKey] : ""
                      }
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setQuantity(
                          current.priceKey,
                          isNaN(v) ? null : v,
                          false // manual input → no auto-next
                        );
                      }}
                    />
                  </div>

                  {error && <div className="inline-error">{error}</div>}

                  <div className="nav-row">
                    {step > 0 && (
                      <button className="fancy-btn reverse" onClick={back}>
                        ← Back
                      </button>
                    )}
                    <button
                      className="fancy-btn"
                      onClick={next}
                      disabled={isNextDisabled()}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------ ADD-ONS WITH QUANTITY ------------------ */}
            {current.kind === "qtyNoImage" && (
              <>
                <p className="question">{current.question}</p>

                <div className="pill-row">
                  {[1, 2, 3].map((n) => (
                    <QtyPill
                      key={n}
                      value={n}
                      active={qty[current.priceKey] === n}
                      onClick={() =>
                        setQuantity(
                          current.priceKey,
                          qty[current.priceKey] === n ? null : n,
                          true // pills → auto-next even for add-ons
                        )
                      }
                    />
                  ))}

                  {/* ⭐ ADD-ON QUANTITY INPUT */}
                  <input
                    type="number"
                    min="1"
                    className="qty-input"
                    placeholder="Qty"
                    value={qty[current.priceKey] > 3 ? qty[current.priceKey] : ""}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setQuantity(
                        current.priceKey,
                        isNaN(v) ? null : v,
                        false // manual → no auto-next
                      );
                    }}
                  />
                </div>

                <div className="nav-row">
                  <button className="fancy-btn reverse" onClick={back}>
                    ← Back
                  </button>
                  <button className="fancy-btn" onClick={next}>
                    Next →
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* ------------------ FIXED ADD-ON ------------------ */}
        {current.kind === "fixedNoImage" && (
          <section className="step card no-image">
            <h2 className="lux-h2">
              {selectedRetreat} – {current.title}
            </h2>

            <div className="pill-row">
              <QtyPill
                value="Add"
                active={qty[current.priceKey] === 1}
                onClick={() =>
                  setQuantity(
                    current.priceKey,
                    qty[current.priceKey] === 1 ? null : 1,
                    true // Add → auto-next
                  )
                }
              />
            </div>

            <div className="nav-row">
              <button className="fancy-btn reverse" onClick={back}>
                ← Back
              </button>
              <button className="fancy-btn" onClick={next}>
                Next →
              </button>
            </div>
          </section>
        )}

        {/* ------------------ SUMMARY (NO PRICES SHOWN) ------------------ */}
        {current.kind === "summary" && (
          <section className="summary card">
            <h2 className="lux-h2">Review Your Selections</h2>

            <ul className="summary-list">
              {lineItems.map((item) => (
                <li key={item.key}>
                  {item.qty} × {item.label}
                </li>
              ))}
            </ul>

            <div className="nav-row">
              <button className="fancy-btn reverse" onClick={back}>
                ← Back
              </button>
              <button className="fancy-btn" onClick={next}>
                Continue →
              </button>
            </div>
          </section>
        )}

        {/* ------------------ CONTACT ------------------ */}
        {current.kind === "contact" && !submitted && (
          <section className="contact card">
            <h2 className="lux-h2">{selectedRetreat} Package</h2>
            <p className="sub">Enter your details below.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              {["name", "address", "email", "phone"].map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    value={formData[field]}
                    placeholder={`Enter your ${field}`}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                </label>
              ))}

              {error && <div className="inline-error">{error}</div>}

              <button className="fancy-btn wide" disabled={loading}>
                {loading ? "Sending..." : "Send My Quote"}
              </button>
            </form>
          </section>
        )}

        {/* ------------------ THANK YOU ------------------ */}
        {submitted && (
          <section className="thankyou card">
            <h2 className="lux-h2">Thank You!</h2>
            <p>Your quote has been successfully submitted.</p>
          </section>
        )}
      </div>
    </div>
  );
}
