import { useEffect, useState } from "react";
import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { invokeContract } from "./soroban";

const CONTRACT_ID =
  "CAGLJO3AHFQVELPLULINXYRIPSKMWD3E4XVZUDKLTSO4LPIAJKIE6CAC";

export default function App() {
  const [wallet, setWallet] = useState("");
  const [item, setItem] = useState("");
  const [bid, setBid] = useState("");
  const [auction, setAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

 
  // WALLET CONNECT
   const connectWallet = async () => {
    try {
      const connected = await isConnected();

      if (!connected.isConnected) {
        alert("Please install Freighter wallet");
        return;
      }

      const result = await requestAccess();

      if (result.address) {
        setWallet(result.address);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  // CREATE AUCTION
  
  const createAuction = async () => {
    if (!wallet) return alert("Connect wallet first");

    await invokeContract({
      contractId: CONTRACT_ID,
      method: "create_auction",
      args: [
        wallet,
        item,
        CONTRACT_ID,
        1,
        Math.floor(Date.now() / 1000) + 3600,
      ],
      publicKey: wallet,
      signTransaction,
    });

    alert("Auction created!");
    getAuction();
  };

  
  // PLACE BID
  
  const placeBid = async () => {
    if (!wallet) return alert("Connect wallet first");

    await invokeContract({
      contractId: CONTRACT_ID,
      method: "place_bid",
      args: [wallet, Number(bid)],
      publicKey: wallet,
      signTransaction,
    });

    alert("Bid placed!");
    getAuction();
  };

  
  // FINALIZE
  
  const finalizeAuction = async () => {
    if (!wallet) return alert("Connect wallet first");

    await invokeContract({
      contractId: CONTRACT_ID,
      method: "finalize_auction",
      args: [wallet],
      publicKey: wallet,
      signTransaction,
    });

    alert("Auction finalized!");
    getAuction();
  };

  
  // GET AUCTION (LIVE DATA)
  
  const getAuction = async () => {
    try {
      const res = await invokeContract({
        contractId: CONTRACT_ID,
        method: "get_auction",
        args: [],
        publicKey: wallet || "dummy",
        signTransaction,
      });

      setAuction(res);
    } catch (err) {
      console.error(err);
    }
  };

  // AUTO REFRESH
  useEffect(() => {
    getAuction();
    const interval = setInterval(getAuction, 5000);
    return () => clearInterval(interval);
  }, [wallet]);

  // COUNTDOWN TIMER
  useEffect(() => {
    if (!auction?.deadline) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = auction.deadline - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  
  // UI
  
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1>🔥 No-Loss Auction DApp</h1>
        <button style={styles.button} onClick={connectWallet}>
          {wallet ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>

      <p style={styles.wallet}>
        <b>Wallet:</b> {wallet || "Not connected"}
      </p>

      {/* GRID */}
      <div style={styles.grid}>
        {/* LEFT PANEL */}
        <div style={styles.card}>
          <h2>Create Auction</h2>
          <input
            style={styles.input}
            placeholder="Item name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <button style={styles.button} onClick={createAuction}>
            Create Auction
          </button>

          <hr style={styles.hr} />

          <h2>Place Bid</h2>
          <input
            style={styles.input}
            placeholder="Bid amount"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
          />
          <button style={styles.button} onClick={placeBid}>
            Place Bid
          </button>

          <hr style={styles.hr} />

          <button
            style={{ ...styles.button, background: "#ff4d4d" }}
            onClick={finalizeAuction}
          >
            Finalize Auction
          </button>
        </div>

        {/* RIGHT PANEL (LEADERBOARD STYLE) */}
        <div style={styles.card}>
          <h2>📊 Live Auction</h2>

          {!auction ? (
            <p>Loading auction...</p>
          ) : (
            <div>
              <div style={styles.leaderCard}>
                <h3>{auction.item_name}</h3>

                <div style={styles.row}>
                  <span>🏆 Highest Bid:</span>
                  <b>{auction.highest_bid}</b>
                </div>

                <div style={styles.row}>
                  <span>👤 Highest Bidder:</span>
                  <b>
                    {auction.highest_bidder || "No bids yet"}
                  </b>
                </div>

                <div style={styles.row}>
                  <span>⏳ Time Left:</span>
                  <b>{timeLeft}</b>
                </div>

                <div style={styles.status}>
                  {auction.is_active ? "ACTIVE 🔥" : "ENDED ❌"}
                </div>
              </div>

              <button style={styles.button} onClick={getAuction}>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// STYLES 

const styles = {
  page: {
    fontFamily: "Arial",
    padding: 20,
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wallet: {
    marginTop: 10,
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 20,
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "none",
  },
  button: {
    padding: "10px 15px",
    background: "#38bdf8",
    color: "black",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 10,
    fontWeight: "bold",
  },
  hr: {
    margin: "20px 0",
    borderColor: "#334155",
  },
  leaderCard: {
    background: "#0f172a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  status: {
    marginTop: 15,
    padding: 8,
    background: "#334155",
    borderRadius: 8,
    textAlign: "center",
  },
};