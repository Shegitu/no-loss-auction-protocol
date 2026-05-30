#  No-Loss Auction Protocol (Soroban + React)

A decentralized auction platform built on **Stellar Soroban smart contracts** with a React frontend.  
Users can create auctions, place bids, and finalize auctions using Freighter wallet.

---

##  Live Features

- Create auction on blockchain
- Place bids using Freighter wallet
- Auto-refunded bidding logic (no-loss design)
- Finalize auction after deadline
- Live auction dashboard
- Countdown timer
- Auto-refresh every 5 seconds
- Leaderboard-style UI

---

## Tech Stack

- Soroban Smart Contracts (Rust)
- Stellar Testnet
- React (Vite)
- Freighter Wallet API
- Stellar SDK

---

##  Smart Contract Functions

- `create_auction`
- `place_bid`
- `finalize_auction`
- `get_auction`
- `cancel_auction`
- `claim_refund`

---

##  Contract Deployment

- **Network:** Stellar Testnet  
- **ContractID:**CAGLJO3AHFQVELPLULINXYRIPSKMWD3E4XVZUDKLTSO4LPIAJKIE6CAC


---

##  How to Run Frontend

```bash
cd frontend
npm install
npm run dev