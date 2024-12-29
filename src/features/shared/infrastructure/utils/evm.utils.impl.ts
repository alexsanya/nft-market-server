import { recoverAddress } from 'ethers';
import { type CreateListingDto } from '../../../listings';
import { type EvmUtils } from './evm.utils';
import { MINUS_TWO, ONE, SIXTY_FOUR, ZERO, type Signature } from '../../../../core';
import { type CreateBidDto } from '../../../bids';
import { type CreateSettlementDto } from '../../../settlements';
import { arrayify } from './types.utils';

export class EvmUtilsImpl implements EvmUtils {
	constructor(private readonly domainSeparator: string) {}

	public isListingSignatureCorrect(signedListingDto: CreateListingDto): boolean {
		const hash = signedListingDto.hash(this.domainSeparator);
		return signedListingDto.owner === recoverAddress(arrayify(hash), signedListingDto.signature);
	}

	public isBidSignatureCorrect(signedBidDto: CreateBidDto): boolean {
		const hash = signedBidDto.hash(this.domainSeparator);
		return signedBidDto.bidder === recoverAddress(arrayify(hash), signedBidDto.signature);
	}

	public isSettlementSignatureCorrect(signedSettlementDto: CreateSettlementDto): boolean {
		const hash = signedSettlementDto.bid.hash(this.domainSeparator);
		return signedSettlementDto.bid.listing.owner === recoverAddress(arrayify(hash), signedSettlementDto.signature);
	}

	public static splitSignature(signatureHex: string): Signature {
		const rawSig = signatureHex.split('x')[ONE];
		return {
			v: parseInt(`0x${rawSig.slice(MINUS_TWO)}`),
			r: `0x${rawSig.slice(ZERO, SIXTY_FOUR)}`,
			s: `0x${rawSig.slice(SIXTY_FOUR, MINUS_TWO)}`
		};
	}
}
