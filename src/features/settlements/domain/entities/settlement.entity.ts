import { AppError, Signature } from "../../../../core";
import { BidEntity } from "../../../bids";
import { isBytes32 } from "../../../shared";

export class SettlementEntity {
    constructor(
        private readonly bid: BidEntity,
        private readonly signature: Signature
    ) {}

	public static fromJson(obj: Record<string, unknown>): SettlementEntity {
        const { bid, signature } = obj;

        if (!bid) {
			throw AppError.badRequest('This entity requires bid', [{ constraint: 'bid is required', fields: ['bid'] }]);
        }
        if (!signature) {
			throw AppError.badRequest('This entity requires signature', [{ constraint: 'signature is required', fields: ['signature'] }]);
        }
        const { v, r, s } = signature as Record<string, unknown>;
        if (!v) {
			throw AppError.badRequest('This entity requires signature.v', [{ constraint: 'signature.v is required', fields: ['signature.v'] }]);
        }
        if (!isBytes32(r)) {
			throw AppError.badRequest('This entity requires signature.r', [{ constraint: 'signature.r is required', fields: ['signature.r'] }]);
        }
        if (!isBytes32(s)) {
			throw AppError.badRequest('This entity requires signature.s', [{ constraint: 'signature.s is required', fields: ['signature.s'] }]);
        }

        return new SettlementEntity(
            BidEntity.fromJson(bid as Record<string, unknown>),
            signature as Signature
        )

    }

}