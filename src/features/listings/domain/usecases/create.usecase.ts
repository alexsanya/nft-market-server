import { AppError, type ValidationType, ZERO } from '../../../../core';
import { type CreateListingDto, NftOwnershipDto } from '../dtos';
import { type ListingEntity } from '../entities';
import { type ListingRepository } from '../repositories/repository';
import { type OnChainDataSource, type EvmUtils } from '../../../shared';

export interface CreateListingUseCase {
	execute: (data: CreateListingDto) => Promise<ListingEntity>;
}

export class CreateListing implements CreateListingUseCase {
	constructor(
		private readonly repository: ListingRepository,
		private readonly onChainDataSource: OnChainDataSource,
		private readonly evmUtils: EvmUtils
	) {}

	async execute(data: CreateListingDto): Promise<ListingEntity> {
		const errors: ValidationType[] = [];
		if (!this.evmUtils.isListingSignatureCorrect(data)) {
			errors.push({ fields: ['signature'], constraint: 'Signature is invalid' });
		}
		// make sure owner posess listed NFT
		const { chainId, nftContract, tokenId, nonce, owner } = data;
		const nftDto = NftOwnershipDto.create({
			chainId,
			nftContract,
			tokenId,
			nonce,
			owner
		});
		const isNftBelongsToOwner = await this.onChainDataSource.isNftBelongsToOwner(nftDto);
		if (!isNftBelongsToOwner) {
			errors.push({ fields: [], constraint: 'Owner doesn`t posess listed NFT' });
		}

		if (errors.length > ZERO) {
			console.error(errors);
			throw AppError.badRequest('Error validating listing', errors);
		}
		return await this.repository.create(data);
	}
}
