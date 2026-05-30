use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub struct Auction {
    pub creator: Address,
    pub item_name: soroban_sdk::String,
    pub token: Address,
    pub highest_bid: i128,
    pub highest_bidder: Option<Address>,
    pub deadline: u64,
    pub is_active: bool,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Auction,
}