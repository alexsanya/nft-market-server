import { AppError, ValidationType, ZERO } from '../../../../core';
import { OnChainDataSource } from '../datasources';
import { CreateListingDto, NftOwnershipDto } from '../dtos';
import { type ListingEntity } from '../entities';
import { type ListingRepository } from '../repositories/repository';
import { type EvmUtils } from '../../infrastructure';

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
        if (!this.evmUtils.isSignatureCorrect(data)) {
			errors.push({ fields: ['signature'], constraint: 'Signature is invalid' });
        }
        // make sure owner posess listed NFT
        const nftDto = NftOwnershipDto.create({
            chainId: data.chainId,
            nftContract: data.nftContract,
            tokenId: data.tokenId,
            owner: data.owner
        });
        const isNftBelongsToOwner = await this.onChainDataSource.isNftBelongsToOwner(nftDto);
        if (!isNftBelongsToOwner) {
			errors.push({ fields: [], constraint: 'Owner doesn\'t posess listed NFT' });
        }
        
		if (errors.length > ZERO) throw AppError.badRequest('Error validating listing', errors);
		return await this.repository.create(data);
	}
}