import { type NftOwnershipDto } from '../../../listings';

export abstract class OnChainDataSource {
	abstract isNftBelongsToOwner(nftOwnershipDto: NftOwnershipDto): Promise<boolean>;
	abstract isAddressPosessSufficientTokens(address: string, tokenContract: string, value: bigint): Promise<boolean>;
}
