import { AppError, ValidationType, ZERO } from '../../../../core';
import { CreateSettlementDto } from '../dtos';
import { type SettlementEntity } from '../entities';
import { type SettlementRepository } from '../repositories/repository';
import { OnChainDataSource, type EvmUtils } from '../../../shared';
import { NftOwnershipDto } from '../../../listings';

export interface CreateSettlementUseCase {
	execute: (data: CreateSettlementDto) => Promise<SettlementEntity>;
}

export class CreateSettlement implements CreateSettlementUseCase {
	constructor(
		private readonly repository: SettlementRepository,
		private readonly onChainDataSource: OnChainDataSource,
		private readonly evmUtils: EvmUtils
	) {}

	async execute(data: CreateSettlementDto): Promise<SettlementEntity> {
		const errors: ValidationType[] = [];
		if (!this.evmUtils.isListingSignatureCorrect(data.bid.listing)) {
			errors.push({ fields: ['listing.signature'], constraint: 'Listing signature is invalid' });
		}
		if (!this.evmUtils.isBidSignatureCorrect(data.bid)) {
			errors.push({ fields: ['bid.signature'], constraint: 'Bid signature is invalid' });
		}
		if (!this.evmUtils.isSettlementSignatureCorrect(data)) {
			errors.push({ fields: ['signature'], constraint: 'Settlement signature is invalid' });
		}
		//#TODO change for simulate transaction
		// make sure owner posess listed NFT
		const { chainId, nftContract, tokenId, nonce, owner } = data.bid.listing;
		const nftDto = NftOwnershipDto.create({
			chainId,
			nftContract,
			tokenId,
			nonce,
			owner
		});
		const { bidder, tokenAddress, value } = data.bid;

		const [isNftBelongsToOwner, isBidderPosessEnoughTokens] = await Promise.all([
			this.onChainDataSource.isNftBelongsToOwner(nftDto),
			this.onChainDataSource.isAddressPosessSufficientTokens(bidder, tokenAddress, value)
		]);
		// make sure NFT belongs to owner
		if (!isNftBelongsToOwner) {
			errors.push({ fields: [], constraint: "Owner doesn't posess listed NFT" });
		}
		// make sure bidder has enough tokens
		if (!isBidderPosessEnoughTokens) {
			errors.push({ fields: [], constraint: "Bidder doesn't posess sufficient amount of tokens" });
		}

		if (errors.length > ZERO) {
			console.error(errors);
			throw AppError.badRequest('Error validating listing', errors);
		}
		return await this.repository.create(data);
	}
}
