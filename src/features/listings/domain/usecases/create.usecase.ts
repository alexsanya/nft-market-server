import { AppError, ValidationType, ZERO, DOMAIN_SEPARATOR} from '../../../../core';
import { CreateListingDto, NftOwnershipDto } from '../dtos';
import { type ListingEntity } from '../entities';
import { type ListingRepository } from '../repositories/repository';
import { OnChainDataSource, type EvmUtils } from '../../../shared';

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
        //#TODO refactor
        if (!this.evmUtils.isListingSignatureCorrect(data, DOMAIN_SEPARATOR)) {
			errors.push({ fields: ['signature'], constraint: 'Signature is invalid' });
        }
        // make sure owner posess listed NFT
        const nftDto = NftOwnershipDto.create({
            chainId: data.chainId,
            nftContract: data.nftContract,
            tokenId: data.tokenId,
            nonce: data.nonce,
            owner: data.owner
        });
        const isNftBelongsToOwner = await this.onChainDataSource.isNftBelongsToOwner(nftDto);
        if (!isNftBelongsToOwner) {
			errors.push({ fields: [], constraint: 'Owner doesn\'t posess listed NFT' });
        }
        
		if (errors.length > ZERO) {
            console.error(errors);
            throw AppError.badRequest('Error validating listing', errors);
        }
		return await this.repository.create(data);
	}
}