import { arrayify, verifyMessage } from "ethers/lib/utils";
import { CreateListingDto } from "../../../listings";
import { EvmUtils } from "./evm.utils";
import { Signature } from "../../../../core";

export class EvmUtilsImpl implements EvmUtils {
    public isSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean {
        const hash = signedListingDto.hash(domainSeparator);
        return signedListingDto.owner === verifyMessage(arrayify(hash), signedListingDto.signature);
    }

    public splitSignature(signatureHex: string): Signature {
        const rawSig = signatureHex.split('x')[1]
        return {
          v: parseInt(`0x${rawSig.slice(-2)}`),
          r: `0x${rawSig.slice(0,64)}`, 
          s: `0x${rawSig.slice(64,-2)}`
        }
    }
}
