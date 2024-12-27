import { CreateBidDto } from "../../../bids";
import { CreateListingDto } from "../../../listings";

export abstract class EvmUtils {
    abstract isListingSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean;
    abstract isBidSignatureCorrect(signedListingDto: CreateBidDto, domainSeparator: string): boolean;
}