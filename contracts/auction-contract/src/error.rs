use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ContractError {
    AuctionAlreadyExists = 1,
    AuctionNotFound = 2,
    BidTooLow = 3,
    AuctionEnded = 4,
    NotAuthorized = 5,
    AuctionHasBids = 6,
    DeadlineNotReached = 7,
}