import { useState } from "react";
import {
  requestAccess,
  isConnected,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

const CONTRACT_ID =
  "CAGLJO3AHFQVELPLULINXYRIPSKMWD3E4XVZUDKLTSO4LPIAJKIE6CAC";

export default function App() {
  const [wallet, setWallet] = useState("");
  const [item, setItem] = useState("");
  const [bid, setBid] = useState("");

  // CONNECT WALLET
  const connectWallet = async () => {
    const connected = await isConnected();

    if (!connected.isConnected) {
      alert("Install Freighter wallet first");
      return;
    }

    const result = await requestAccess();

    if (result.address) {
      setWallet(result.address);
      alert("Wallet connected!");
    }
  };

  // -----------------------------
  // HELPERS (Soroban invocation)
  // -----------------------------
  const invoke = async (method, args = []) => {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org` // placeholder endpoint not used for real tx signing
      );

      console.log("Calling:", method, args);

      alert(
        `${method} called (UI ready). Next step: Soroban transaction wiring`
      );
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE AUCTION
  const createAuction = async () => {
    if (!wallet) return alert("Connect wallet first");

    console.log("create_auction");

    await invoke("create_auction", [
      wallet,
      item,
      CONTRACT_ID,
      1, // starting bid (dummy)
      Math.floor(Date.now() / 1000) + 3600, // 1 hour deadline
    ]);
  };

  // PLACE BID
  const placeBid = async () => {
    if (!wallet) return alert("Connect wallet first");

    console.log("place_bid");

    await invoke("place_bid", [wallet, Number(bid)]);
  };

  // FINALIZE AUCTION
  const finalizeAuction = async () => {
    if (!wallet) return alert("Connect wallet first");

    console.log("finalize_auction");

    await invoke("finalize_auction", [wallet]);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>No-Loss Auction Protocol</h1>

      <button onClick={connectWallet}>Connect Wallet</button>

      <p>Wallet: {wallet || "Not connected"}</p>

      <p>Contract ID: {CONTRACT_ID}</p>

      <hr />

      <h2>Create Auction</h2>
      <input
        placeholder="Item name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={createAuction}>Create Auction</button>

      <hr />

      <h2>Place Bid</h2>
      <input
        placeholder="Bid amount"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
      />
      <button onClick={placeBid}>Place Bid</button>

      <hr />

      <button onClick={finalizeAuction}>Finalize Auction</button>
    </div>
  );
}