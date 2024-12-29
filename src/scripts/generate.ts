// generate wallet and signed listing
import { Wallet } from 'ethers';
import { CreateListingDto } from '../features';
import { CreateBidDto } from '../features/bids';
import { EvmUtilsImpl } from '../features/shared/infrastructure/utils/evm.utils.impl';
import { EIP712_DOMAIN, LISTING_TYPES, BID_TYPES } from './eip712data';
import { DOMAIN_SEPARATORS } from '../core';

console.log('Generate wallet and signed listing');

const BUYER_PRIVATE_KEY = process.env['OWNER_PRIVATE_KEY']!;
const OWNER_PRIVATE_KEY = process.env['BUYER_PRIVATE_KEY']!;
const MOCK_SIGNATURE = {
	v: 5,
	r: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712',
	s: '0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712'
};
const owner = new Wallet(OWNER_PRIVATE_KEY);

async function generateListing(): Promise<CreateListingDto> {
	const createListingDto = CreateListingDto.create({
		owner: owner.address,
		chainId: 11155111,
		minPriceCents: 150000,
		nftContract: '0xf44b599a0aB6b8cb14E992994BEC0dc59dF883B2',
		tokenId: '1',
		nonce: 0,
		signature: MOCK_SIGNATURE
	});
	const values = {
		nftContract: createListingDto.nftContract,
		tokenId: createListingDto.tokenId,
		minPriceCents: createListingDto.minPriceCents,
		nonce: createListingDto.nonce
	};
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
		tokenAddress: '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A',
		validUntil: '1735504160',
		value: '250',
		signature: MOCK_SIGNATURE
	});
	const domainSeparator = DOMAIN_SEPARATORS[createBidDto.listing.chainId.toString()];
	const listingHash = createBidDto.listing.hash(domainSeparator);
	const values = {
		tokenContract: createBidDto.tokenAddress,
		value: createBidDto.value,
		validUntil: createBidDto.validUntil,
		listingHash
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

export async function generateSettlement() {
	const bid = await generateBid();
	const values = {
		tokenContract: bid.tokenAddress,
		value: bid.value,
		validUntil: bid.validUntil,
		listingHash: bid.listing.hash(DOMAIN_SEPARATORS[bid.listing.chainId.toString()])
	};
	const signature = await owner.signTypedData(EIP712_DOMAIN, BID_TYPES, values);

	const settlement = {
		bid,
		signature: EvmUtilsImpl.splitSignature(signature)
	};
	console.log('Settlement: ', settlement);

	return settlement;
}
