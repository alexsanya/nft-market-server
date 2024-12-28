import { AppError, ValidationType, ZERO } from '../../../../core';
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
        if (!this.evmUtils.isListingSignatureCorrect(data.listing)) {
			errors.push({ fields: ['listing.signature'], constraint: 'Listing signature is invalid' });
        }
        if (!this.evmUtils.isBidSignatureCorrect(data)) {
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
        const [isNftBelongsToOwner, isBidderPosessEnoughTokens ] = await Promise.all([
            this.onChainDataSource.isNftBelongsToOwner(nftDto),
            this.onChainDataSource.isAddressPosessSufficientTokens(data.bidder, data.tokenAddress, data.value)
        ]);
        // make sure NFT belongs to owner
        if (!isNftBelongsToOwner) {
			errors.push({ fields: [], constraint: 'Owner doesn\'t posess listed NFT' });
        }
        // make sure bidder has enough tokens
        if (!isBidderPosessEnoughTokens) {
			errors.push({ fields: [], constraint: 'Bidder doesn\'t posess sufficient amount of tokens' });
        }
        
		if (errors.length > ZERO) {
            console.error(errors);
            throw AppError.badRequest('Error validating bid', errors);
        }
		return await this.repository.create(data);
	}
}