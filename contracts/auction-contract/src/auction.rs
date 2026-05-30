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
}