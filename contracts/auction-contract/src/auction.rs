use soroban_sdk::{
    contract, contractimpl, token, Address, Env, String,
};

use crate::{
    error::ContractError,
    storage::{Auction, DataKey},
};

#[contract]
pub struct AuctionContract;

#[contractimpl]
impl AuctionContract {

    // CREATE AUCTION
    pub fn create_auction(
        env: &Env,
        creator: Address,
        item_name: String,
        token: Address,
        starting_bid: i128,
        deadline: u64,
    ) -> Result<(), ContractError> {

        creator.require_auth();

        if env.storage().instance().has(&DataKey::Auction) {
            return Err(ContractError::AuctionAlreadyExists);
        }

        let auction = Auction {
            creator,
            item_name,
            token,
            highest_bid: starting_bid,
            highest_bidder: None,
            deadline,
            is_active: true,
        };

        env.storage()
            .instance()
            .set(&DataKey::Auction, &auction);

        Ok(())
    }

    // GET AUCTION
    pub fn get_auction(env: &Env) -> Auction {
        env.storage()
            .instance()
            .get(&DataKey::Auction)
            .unwrap()
    }
    pub fn place_bid(
    env: &Env,
    bidder: Address,
    amount: i128,
) -> Result<(), ContractError> {

    bidder.require_auth();

    let mut auction: Auction = env
        .storage()
        .instance()
        .get(&DataKey::Auction)
        .ok_or(ContractError::AuctionNotFound)?;

    // Check auction active
    if !auction.is_active {
        return Err(ContractError::AuctionEnded);
    }

    // Check deadline
    if env.ledger().timestamp() > auction.deadline {
        return Err(ContractError::AuctionEnded);
    }

    // New bid must be higher
    if amount <= auction.highest_bid {
        return Err(ContractError::BidTooLow);
    }

    let token_client = token::Client::new(env, &auction.token);

    // Take tokens from bidder
    token_client.transfer(
        &bidder,
        &env.current_contract_address(),
        &amount,
    );

    // Refund previous bidder
    if let Some(previous_bidder) = auction.highest_bidder.clone() {
        token_client.transfer(
            &env.current_contract_address(),
            &previous_bidder,
            &auction.highest_bid,
        );
    }

    // Update auction
    auction.highest_bid = amount;
    auction.highest_bidder = Some(bidder);

    env.storage()
        .instance()
        .set(&DataKey::Auction, &auction);

    Ok(())
}
}