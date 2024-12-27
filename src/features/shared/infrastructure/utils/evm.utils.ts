import { CreateListingDto } from "../../../listings";

export abstract class EvmUtils {
    abstract isSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean;
}