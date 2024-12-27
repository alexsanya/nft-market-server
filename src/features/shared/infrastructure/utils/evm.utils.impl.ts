import { arrayify, verifyMessage } from "ethers/lib/utils";
import { CreateListingDto } from "../../../listings";
import { EvmUtils } from "./evm.utils";
import { Signature } from "../../../../core";
import { CreateBidDto } from "../../../bids";
import { CreateSettlementDto } from "../../../settlements";

export class EvmUtilsImpl implements EvmUtils {
    public isListingSignatureCorrect(signedListingDto: CreateListingDto, domainSeparator: string): boolean {
        const hash = signedListingDto.hash(domainSeparator);
        return signedListingDto.owner === verifyMessage(arrayify(hash), signedListingDto.signature);
    }

    public isBidSignatureCorrect(signedBidDto: CreateBidDto, domainSeparator: string): boolean {
        const hash = signedBidDto.hash(domainSeparator);
        return signedBidDto.bidder === verifyMessage(arrayify(hash), signedBidDto.signature);
    }

    public isSettlementSignatureCorrect(signedSettlementDto: CreateSettlementDto, domainSeparator: string): boolean {
        const hash = signedSettlementDto.bid.hash(domainSeparator);
        return signedSettlementDto.bid.listing.owner === verifyMessage(arrayify(hash), signedSettlementDto.signature);
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
