import { useState } from "react";

export default function App() {
  const [item, setItem] = useState("");
  const [bid, setBid] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>No-Loss Auction Protocol</h1>

      {/* CREATE AUCTION */}
      <h3>Create Auction</h3>
      <input
        placeholder="Item name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button>Create</button>

      <hr />

      {/* PLACE BID */}
      <h3>Place Bid</h3>
      <input
        placeholder="Bid amount"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
      />
      <button>Bid</button>

      <hr />

      {/* ACTIONS */}
      <button>Finalize Auction</button>
      <button>Cancel Auction</button>
      <button>Claim Refund</button>
    </div>
  );
}