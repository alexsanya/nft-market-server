import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import { generateSettlement } from './generate';

const NFT_MARKETPLACE_ADDRESS = '0x42d2C93839ED64b73Baa59A8ceB1C464287C8113';
const ERC20_ADDRESS = '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A';
const NFT_ADDRESS = '0xf44b599a0aB6b8cb14E992994BEC0dc59dF883B2';

const BUYER_PRIVATE_KEY = process.env['BUYER_PRIVATE_KEY']!;
const OWNER_PRIVATE_KEY = process.env['OWNER_PRIVATE_KEY']!;
const RPC_ENDPOINT = process.env['SEPOLIA_RPC']!;

export const ERC20_ABI = [
	'function balanceOf(address) external view returns (uint256)',
	'function allowance(address, address) public view returns (uint256)',
	'function approve(address, uint256) public returns (bool)',
	'function transfer(address, uint256) external'
];

export const ERC721_ABI = [
	'function setApprovalForAll(address, bool) public',
	'function isApprovedForAll(address, address) public view returns (bool)'
];

export const NFT_MARKETPLACE_ABI =
	'[{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"components":[{"internalType":"contract IERC721","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"minPriceCents","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"}],"indexed":false,"internalType":"struct ListingData","name":"listingData","type":"tuple"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validUntil","type":"uint256"}],"indexed":false,"internalType":"struct BidData","name":"bidData","type":"tuple"}],"name":"Settlement","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"components":[{"internalType":"contract IERC721","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"minPriceCents","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"}],"internalType":"struct ListingData","name":"listingData","type":"tuple"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"validUntil","type":"uint256"}],"internalType":"struct BidData","name":"bidData","type":"tuple"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct Signature","name":"listingSig","type":"tuple"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct Signature","name":"bidSig","type":"tuple"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct Signature","name":"settlementSig","type":"tuple"}],"name":"settle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]';

async function makeTransaction() {
	const provider = new JsonRpcProvider(RPC_ENDPOINT);

	const owner = new Wallet(OWNER_PRIVATE_KEY, provider);
	const buyer = new Wallet(BUYER_PRIVATE_KEY, provider);
	console.log(`Owner's address: ${owner.address}`);
	console.log(`Buyer's address: ${buyer.address}`);
	const erc20Contract = new Contract(ERC20_ADDRESS, ERC20_ABI, owner);

	const ownersErc20Balance = await erc20Contract.balanceOf(owner.address);
	const buyersErc20Balance = await erc20Contract.balanceOf(buyer.address);

	console.log({ ownersErc20Balance, buyersErc20Balance });

	// send all ERC20 from owner to buyer
	if (ownersErc20Balance) {
		await erc20Contract.transfer(buyer.address, ownersErc20Balance, owner);
	}

	const allowance = await erc20Contract.allowance(buyer.address, NFT_MARKETPLACE_ADDRESS);
	console.log('Allowance from buyer to NftMarketplace ', allowance);
	// approve all ERC20 to NFT Marketplace if not approved
	if (allowance < buyersErc20Balance) {
		console.log('Setting allowance...');
		await (erc20Contract.connect(buyer) as any).approve(NFT_MARKETPLACE_ADDRESS, buyersErc20Balance);
	}

	const erc721Contract = new Contract(NFT_ADDRESS, ERC721_ABI, owner);

	const isApprovedForAll = await erc721Contract.isApprovedForAll(owner.address, NFT_MARKETPLACE_ADDRESS);
	console.log({ isApprovedForAll });
	if (!isApprovedForAll) {
		await erc721Contract.setApprovalForAll(NFT_MARKETPLACE_ADDRESS, true);
	}

	const nftMarketplaceContract = new Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, owner);
	// execute settlement
	const settlement = await generateSettlement();

	await nftMarketplaceContract.settle(
		owner.address,
		buyer.address,
		{
			nftContract: settlement.bid.listing.nftContract,
			tokenId: settlement.bid.listing.tokenId,
			minPriceCents: settlement.bid.listing.minPriceCents,
			nonce: settlement.bid.listing.nonce
		},
		{
			tokenContract: settlement.bid.tokenAddress,
			validUntil: settlement.bid.validUntil,
			value: settlement.bid.value
		},
		{
			v: settlement.bid.listing.signature.v,
			r: settlement.bid.listing.signature.r,
			s: settlement.bid.listing.signature.s
		},
		{
			v: settlement.bid.signature.v,
			r: settlement.bid.signature.r,
			s: settlement.bid.signature.s
		},
		{
			v: settlement.signature.v,
			r: settlement.signature.r,
			s: settlement.signature.s
		}
	);
}

makeTransaction();
