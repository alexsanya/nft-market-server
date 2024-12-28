export const EIP712_DOMAIN = {
    name: "NFT Marketplace",
    version: "1",
    chainId: "11155111",
    verifyingContract: "0x42d2C93839ED64b73Baa59A8ceB1C464287C8113"
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