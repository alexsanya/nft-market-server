import { CreateBidDto } from "../../../bids";
import { CreateListingDto } from "../../../listings";
import { CreateSettlementDto } from "../../../settlements";

export abstract class EvmUtils {
    abstract isListingSignatureCorrect(signedListingDto: CreateListingDto): boolean;
    abstract isBidSignatureCorrect(signedListingDto: CreateBidDto): boolean;
    abstract isSettlementSignatureCorrect(signedListingDto: CreateSettlementDto): boolean;
}