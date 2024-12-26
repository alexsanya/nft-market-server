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
        chainId: 137,
        minPriceCents: 150000,
        nftContract: "0x251be3a17af4892035c37ebf5890f4a4d889dcad",
        tokenId: 108505515170052514308027011782423337813417608379034307815112798701969858676431,
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