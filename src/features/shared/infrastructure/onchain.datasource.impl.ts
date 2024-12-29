import { Contract, type Provider } from 'ethers';
import { NftOwnershipDto } from '../../listings';
import { ERC20_ABI, ERC721_ABI } from '../../../core';
import { OnChainDataSource } from '../domain';

export class OnChainDataSourceImpl implements OnChainDataSource {
	constructor(private readonly chainDataProvider: Provider) {}

	public async isNftBelongsToOwner(nftOwnershipDto: NftOwnershipDto): Promise<boolean> {
		const nftContractInstance = new Contract(nftOwnershipDto.nftContract, ERC721_ABI, this.chainDataProvider);
		const realOwner = await nftContractInstance.ownerOf(nftOwnershipDto.tokenId);
		return realOwner == nftOwnershipDto.owner;
	}

	public async isAddressPosessSufficientTokens(
		address: string,
		tokenContract: string,
		value: BigInt
	): Promise<boolean> {
		const erc20ContractInstance = new Contract(tokenContract, ERC20_ABI, this.chainDataProvider);
		const balance = await erc20ContractInstance.balanceOf(address);
		return balance >= value;
	}
}
