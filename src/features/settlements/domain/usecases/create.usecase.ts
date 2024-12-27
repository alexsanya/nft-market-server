import { AppError, ValidationType, ZERO, DOMAIN_SEPARATOR} from '../../../../core';
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
        if (!this.evmUtils.isListingSignatureCorrect(data.bid.listing, DOMAIN_SEPARATOR)) {
			errors.push({ fields: ['listing.signature'], constraint: 'Listing signature is invalid' });
        }
        if (!this.evmUtils.isBidSignatureCorrect(data.bid, DOMAIN_SEPARATOR)) {
			errors.push({ fields: ['bid.signature'], constraint: 'Bid signature is invalid' });
        }
        if (!this.evmUtils.isSettlementSignatureCorrect(data, DOMAIN_SEPARATOR)) {
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