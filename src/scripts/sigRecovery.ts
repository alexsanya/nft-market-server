import { recoverAddress, Wallet } from "ethers";
import { CreateListingDto } from "../features";
import { EvmUtilsImpl } from "../features/shared";

//DOMAIN_SEPARATOR 0x18fe943f718ca9eea10beb465fad697a409bfdab62830c6218e6333db82a854b
const OWNER_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123';
const domain = {
    name: "NFT Marketplace",
    version: "1",
    chainId: "137",
    verifyingContract: "0x4a9C121080f6D9250Fc0143f41B595fD172E31bf"
}
const types = {
    Listing: [{
        name: "nftContract",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      },
      {
        name: "minPriceCents",
        type: "uint256"
      },
      {
        name: "nonce",
        type: "uint256"
      },
    ]
};
const values = {
    nftContract: "0x251be3a17af4892035c37ebf5890f4a4d889dcad",
    tokenId: 3,
    minPriceCents: 150000,
    nonce: 0
};
const MOCK_SIGNATURE = {
    v: 5,
    r: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712",
    s: "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"
};

const owner = new Wallet(OWNER_PRIVATE_KEY);

async function generateListing(): Promise<CreateListingDto> {
    const signature = await owner.signTypedData(domain,types,values);
    const createListingDto = CreateListingDto.create({
        owner: owner.address,
        chainId: domain.chainId,
        minPriceCents: values.minPriceCents,
        nftContract: values.nftContract,
        tokenId: values.tokenId,
        nonce: values.nonce,
        signature: MOCK_SIGNATURE
    });

    return CreateListingDto.create({
        ...createListingDto,
        signature: EvmUtilsImpl.splitSignature(signature)
    });
}

async function run() {
    const listing = await generateListing();
    const listingHash = listing.hash("0x18fe943f718ca9eea10beb465fad697a409bfdab62830c6218e6333db82a854b");
    console.log(listing);
    console.log({ listingHash });

    const signer = recoverAddress(listingHash, listing.signature);
    console.log({signer});
}

run();