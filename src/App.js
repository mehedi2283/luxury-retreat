import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [step, setStep] = useState("start");

  // ---------- Step 1: Retreat Selection ----------
  const retreats = [
    {
      id: "condo",
      title: "Condo Luxe Living",
      subtitle: "Condo Luxe – tailored for Urban Retreats",
      image: "/images/condo_Cue_Photo.jpg",
    },
    {
      id: "estate",
      title: "Grand Estate Luxury",
      subtitle: "Grand Estate – designed for Spacious Homes",
      image: "/images/grand_Estate_Cue_photo.jpg",
    },
  ];

  // ---------- Step 2–4 Data ----------
  const rooms = [
    {
      id: "living",
      title: "Living Room",
      image: "/images/living.jpg",
      details: [
        "Rug 7×9 $600",
        "Sofa $2,000",
        "Coffee Table $800",
        "2 End Tables $400",
        "2 Accent Chairs $700",
        "Credenza $700",
        "2 Lamps $300",
        "Wall Hanging $900",
        "Accessories $400",
        "Soft Goods (pillows / throws) $400",
      ],
      subtitle: "Living Areas (Living / Family Room) – $7,800",
    },
    {
      id: "dining",
      title: "Dining Room",
      image: "/images/dining.jpg",
      details: [
        "Dining Table $2,000",
        "6 Dining Chairs $2,000",
        "Rug $600",
        "Console $350",
        "Wall Hanging $450",
      ],
      subtitle: "Dining Room – $5,400",
    },
    {
      id: "bedroom",
      title: "Bedroom",
      image: "/images/bedroom.jpg",
      details: [
        "Rug $450",
        "Bed $600",
        "Mattress $500",
        "Bedding $300",
        "2 Nightstands $400",
        "2 Lamps $300",
        "Wall Hanging $450",
        "Console $350",
      ],
      subtitle: "Bedroom – $3,350 (each)",
    },
    {
      id: "bathroom",
      title: "Bathroom",
      image: "/images/bathroom.jpg",
      details: ["Includes: Towels, Soap Dispenser, Art"],
      subtitle: "Bathroom – $250 (each)",
    },
    {
      id: "kitchen",
      title: "Kitchen Accessories",
      image: "/images/kitchen.jpg",
      details: ["Includes: Decorative art and styling accessories"],
      subtitle: "Kitchen (Art & Accessories) – $100",
    },
    {
      id: "office",
      title: "Office",
      image: "/images/office.jpg",
      details: ["Desk setup, chair, décor accessories"],
      subtitle: "Office – $1,500",
    },
  ];

  const addOns = [
    {
      name: "Kitchen Essentials",
      details: "Cookware set, utensils, dishware, glassware $500",
    },
    { name: "Patio Area", details: "Patio Set $1,500" },
    {
      name: "Entryway Package",
      details: "Mirror $100 + Console $250 + Accessories/Lamp $250 $750",
    },
    {
      name: "Den Package",
      details: "Desk setup, chair, décor accessories $1,500",
    },
  ];

  // ---------- Step 1 ----------
  if (step === "start") {
    return (
      <div className="luxury-container">
        <div className="luxury-header">
          <h2>What kind of Luxury Retreat are you building?</h2>
          <p>
            Select the option that best matches your property — this helps us
            tailor your furniture layout, scale, and overall design package.
          </p>
        </div>

        <div className="luxury-grid">
          {retreats.map((opt) => (
            <div key={opt.id} className="luxury-item">
              <img src={opt.image} alt={opt.title} />
              <h3>{opt.title}</h3>
              <button
                className="fancy-btn"
                onClick={() =>
                  setStep(opt.id === "estate" ? "estate" : "main")
                }
              >
                {opt.subtitle}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Step 2: Condo Main ----------
  if (step === "main") {
    return (
      <div className="room-container">
        <h2 className="lux-h2">Condo Luxe Living</h2>
        <div className="room-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room.id}>
              <img src={room.image} alt={room.title} />
              <div className="room-title">
                <button className="fancy-btn" onClick={() => setStep(room.id)}>
                  {room.title} Price
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="dual-btn-row">
          <button className="btn-back" onClick={() => setStep("start")}>
            Back
          </button>
          <button className="fancy-btn" onClick={() => setStep("addons")}>
            Add-Ons
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 3: Room Details ----------
  const currentRoom = rooms.find((r) => r.id === step);
  if (currentRoom) {
    return (
      <div className="detail-container">
        <h2>{currentRoom.title}</h2>
        <div className="detail-layout">
          <img src={currentRoom.image} alt={currentRoom.title} />
          <div className="detail-info">
            <p className="subtitle">
              <span className="square"></span> {currentRoom.subtitle}
            </p>
            <ul>
              {currentRoom.details.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dual-btn-row">
          <button className="btn-back" onClick={() => setStep("main")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 4: Add-Ons ----------
  if (step === "addons") {
    return (
      <div className="detail-container">
        <h2>Add-Ons</h2>
        <div className="addons-content">
          <ul>
            {addOns.map((item, idx) => (
              <li key={idx}>
                <strong>{item.name}</strong>
                <p>{item.details}</p>
              </li>
            ))}
          </ul>
        </div>

        <button className="btn-back" onClick={() => setStep("main")}>
          Back
        </button>
      </div>
    );
  }

  // ---------- Step 5: Grand Estate ----------
if (step === "estate") {
  return (
    <div className="estate-container">
      <h2 className="lux-h2">Grand Estate Luxury</h2>

      <div className="estate-gallery">
        <div className="estate-row">
          <img src="/images/img1.webp" alt="Estate Living" />
          <img src="/images/img2.webp" alt="Estate Dining" />
        </div>
        <button
          className="fancy-btn quote-btn"
          onClick={() => alert("Quote request form will go here")}
        >
          Request a Quote
        </button>

        <div className="estate-row">
          <img src="/images/img3.webp" alt="Estate Lounge" />
          <img src="/images/img4.webp" alt="Estate Bedroom" />
        </div>
        <button
          className="fancy-btn quote-btn"
          onClick={() => alert("Quote request form will go here")}
        >
          Request a Quote
        </button>

        <div className="estate-row">
          <img src="/images/img5.webp" alt="Estate Kitchen" />
          <img src="/images/img6.webp" alt="Estate Suite" />
        </div>
        <button
          className="fancy-btn quote-btn"
          onClick={() => alert("Quote request form will go here")}
        >
          Request a Quote
        </button>
      </div>

      <div className="dual-btn-row">
        <button className="btn-back" onClick={() => setStep("start")}>
          Back
        </button>
      </div>
    </div>
  );
}


  return null;
}
