import { CreateBidDto } from "../../../bids";
import { CreateListingDto } from "../../../listings";
import { CreateSettlementDto } from "../../../settlements";

export abstract class EvmUtils {
    abstract isListingSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean;
    abstract isBidSignatureCorrect(signedListingDto: CreateBidDto, domainSeparator: string): boolean;
    abstract isSettlementSignatureCorrect(signedListingDto: CreateSettlementDto, domainSeparator: string): boolean;
}