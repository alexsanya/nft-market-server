import { CreateListingDto } from "../../domain";
import { EvmUtils } from "./evm.utils";

export class EvmUtilsImpl implements EvmUtils {
    public isSignatureCorrect(signedListingDto: CreateListingDto): boolean {
        //#TODO implement signature verification
        return true;
    }
}