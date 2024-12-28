// generate wallet and signed listing
import { Wallet } from "ethers";
import { CreateListingDto } from "../features";
import { CreateBidDto } from "../features/bids";
import { EvmUtilsImpl } from "../features/shared/infrastructure/utils/evm.utils.impl"
import { arrayify } from "../features/shared";
import { EIP712_DOMAIN, LISTING_TYPES, BID_TYPES } from "./eip712data";
import { DOMAIN_SEPARATORS } from "../core";

console.log('Generate wallet and signed listing');

const OWNER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123';
const BUYER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890124';
const MOCK_SIGNATURE = {
    v: 5,
    r: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712",
    s: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"
};
const owner = new Wallet(OWNER_PRIVATE_KEY);

async function generateListing(): Promise<CreateListingDto> {
    const createListingDto = CreateListingDto.create({
        owner: owner.address,
        chainId: 137,
        minPriceCents: 150000,
        nftContract: "0x251be3a17af4892035c37ebf5890f4a4d889dcad",
        tokenId: "108505515170052514308027011782423337813417608379034307815112798701969858676431",
        nonce: 0,
        signature: MOCK_SIGNATURE
    });
    const values = {
        nftContract: createListingDto.nftContract,
        tokenId: createListingDto.tokenId,
        minPriceCents: createListingDto.minPriceCents,
        nonce: createListingDto.nonce
    }
    const signature = await owner.signTypedData(EIP712_DOMAIN, LISTING_TYPES, values);

    return CreateListingDto.create({
        ...createListingDto,
        signature: EvmUtilsImpl.splitSignature(signature)
    });
}

async function generateBid() {
    const buyer = new Wallet(BUYER_PRIVATE_KEY);
    const listing = await generateListing();
    const createBidDto = CreateBidDto.create({
        bidder: buyer.address,
        listing,
        tokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        validUntil: "1735255023397",
        value: "100500",
        signature: MOCK_SIGNATURE
    });
    const values = {
        tokenContract: createBidDto.tokenAddress,
        value: createBidDto.value,
        validUntil: createBidDto.validUntil,
        listingHash: createBidDto.listing.hash(DOMAIN_SEPARATORS[createBidDto.listing.chainId.toString()])
    };
    const signature = await buyer.signTypedData(EIP712_DOMAIN, BID_TYPES, values);

    const bid = CreateBidDto.create({
        ...createBidDto,
        signature: EvmUtilsImpl.splitSignature(signature)
    });

    console.log('Listing:', listing);
    console.log('Bid:', bid);

    return bid;
}

async function generateSettlement() {
    const bid = await generateBid();
    const values = {
        tokenContract: bid.tokenAddress,
        value: bid.value,
        validUntil: bid.validUntil,
        listingHash: bid.listing.hash(DOMAIN_SEPARATORS[bid.listing.chainId.toString()])
    };
    const signature = await owner.signTypedData(EIP712_DOMAIN, BID_TYPES, values);

    console.log('Settlement: ', {
        bid,
        signature: EvmUtilsImpl.splitSignature(signature)
    });
}


generateSettlement();