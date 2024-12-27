import { AppError, ValidationType, ZERO, DOMAIN_SEPARATOR} from '../../../../core';
import { OnChainDataSource } from '../../../shared';
import { CreateBidDto } from '../dtos';
import { type BidEntity } from '../entities';
import { type BidRepository } from '../repositories/repository';
import { type EvmUtils } from '../../../shared';
import { NftOwnershipDto } from '../../../listings';

export interface CreateBidUseCase {
	execute: (data: CreateBidDto) => Promise<BidEntity>;
}

export class CreateBid implements CreateBidUseCase {
	constructor(
        private readonly repository: BidRepository,
        private readonly onChainDataSource: OnChainDataSource,
        private readonly evmUtils: EvmUtils
    ) {}

	async execute(data: CreateBidDto): Promise<BidEntity> {
		const errors: ValidationType[] = [];
        if (!this.evmUtils.isListingSignatureCorrect(data.listing, DOMAIN_SEPARATOR)) {
			errors.push({ fields: ['listing.signature'], constraint: 'Listing signature is invalid' });
        }
        if (!this.evmUtils.isBidSignatureCorrect(data, DOMAIN_SEPARATOR)) {
			errors.push({ fields: ['bid.signature'], constraint: 'Bid signature is invalid' });
        }
        // make sure owner posess listed NFT
        const { chainId, nftContract, tokenId, nonce, owner } = data.listing;
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
        // make sure bidder has enough tokens
        const isBidderPosessEnoughTokens = await this.onChainDataSource.isAddressPosessSufficientTokens(data.bidder, data.tokenAddress, data.value);
        if (!isBidderPosessEnoughTokens) {
			errors.push({ fields: [], constraint: 'Bidder doesn\'t posess sufficient tokens' });
        }
        
		if (errors.length > ZERO) throw AppError.badRequest('Error validating bid', errors);
		return await this.repository.create(data);
	}
}