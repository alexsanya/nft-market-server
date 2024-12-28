import { recoverAddress } from "ethers";
import { CreateListingDto } from "../../../listings";
import { EvmUtils } from "./evm.utils";
import { Signature } from "../../../../core";
import { CreateBidDto } from "../../../bids";
import { CreateSettlementDto } from "../../../settlements";
import { arrayify } from "./types.utils";

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
        const rawSig = signatureHex.split('x')[1]
        return {
          v: parseInt(`0x${rawSig.slice(-2)}`),
          r: `0x${rawSig.slice(0,64)}`, 
          s: `0x${rawSig.slice(64,-2)}`
        }
    }
}
