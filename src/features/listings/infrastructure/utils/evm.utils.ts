import { CreateListingDto } from "../../domain";

export abstract class EvmUtils {
    abstract isSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean;
}