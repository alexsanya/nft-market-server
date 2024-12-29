import { type CreateBidDto } from '../../../bids';
import { type CreateListingDto } from '../../../listings';
import { type CreateSettlementDto } from '../../../settlements';

export abstract class EvmUtils {
	abstract isListingSignatureCorrect(signedListingDto: CreateListingDto): boolean;
	abstract isBidSignatureCorrect(signedListingDto: CreateBidDto): boolean;
	abstract isSettlementSignatureCorrect(signedListingDto: CreateSettlementDto): boolean;
}
