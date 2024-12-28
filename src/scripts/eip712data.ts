export const EIP712_DOMAIN = {
    name: "NFT Marketplace",
    version: "1",
    chainId: "137",
    verifyingContract: "0x4a9C121080f6D9250Fc0143f41B595fD172E31bf"
}
export const LISTING_TYPES = {
    Listing: [
        {name: "nftContract", type: "address"},
        {name: "tokenId", type: "uint256"},
        {name: "minPriceCents", type: "uint256"},
        {name: "nonce",type: "uint256"}
    ]
};

export const BID_TYPES = {
    Bid: [
        {name: "tokenContract",type: "address"},
        {name: "value", type: "uint256"},
        {name: "validUntil", type: "uint256"},
        {name: "listingHash", type: "bytes32"}
    ]
};