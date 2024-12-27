// generate wallet and signed listing
import { pick } from "lodash";
import { Wallet } from "ethers";
import { arrayify, splitSignature } from "ethers/lib/utils";
import { CreateListingDto } from "../features";
import { CreateBidDto } from "../features/bids";


console.log('Generate wallet and signed listing');

const OWNER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123';
const BUYER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890124';
const DOMAIN_SEPARATOR = '0x89925f986235c2ea159d50a9fbe8b3c1715810e2df869dc3ea1aed1320f876c6';
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
    const signature = await owner.signMessage(arrayify(createListingDto.hash(DOMAIN_SEPARATOR)));

    return CreateListingDto.create({
        ...createListingDto,
        signature: pick(splitSignature(signature), ['r','v','s'])
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
    const signature = await buyer.signMessage(arrayify(createBidDto.hash(DOMAIN_SEPARATOR)));

    const bid = CreateBidDto.create({
        ...createBidDto,
        signature: pick(splitSignature(signature), ['r','v','s'])
    });

    console.log('Listing:', listing);
    console.log('Bid:', bid);

    return bid;
}

async function generateSettlement() {
    const bid = await generateBid();
    const signature = await owner.signMessage(arrayify(bid.hash(DOMAIN_SEPARATOR)));

    console.log('Settlement: ', {
        bid,
        signature: pick(splitSignature(signature), ['r','v','s'])
    });
}

generateSettlement();