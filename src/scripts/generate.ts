// generate wallet and signed listing

import { Wallet } from "ethers";
import { arrayify, splitSignature } from "ethers/lib/utils";
import { CreateListingDto } from "../features";


console.log('Generate wallet and signed listing');

const OWNER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123';
const DOMAIN_SEPARATOR = '0x89925f986235c2ea159d50a9fbe8b3c1715810e2df869dc3ea1aed1320f876c6';

async function generateListing() {
    const signer = new Wallet(OWNER_PRIVATE_KEY);
    const createListingDto = CreateListingDto.create({
        owner: signer.address,
        chainId: "11155111",
        minPriceCents: 150000,
        nftContract: "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9",
        tokenId: 72997,
        nonce: 0,
        signature: {
            v: 5,
            r: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712",
            s: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"
        }
    });
    const signature = await signer.signMessage(arrayify(createListingDto.hash(DOMAIN_SEPARATOR)));

    console.log({
        ...createListingDto,
        signature: splitSignature(signature)
    })
}

generateListing();