import { ADDRESS_REGEX, AppError, BYTES32_REGEX, Signature, ZERO } from "../../../../core";
import { ListingEntity } from "../../../listings/domain/entities/listing.entity";

export class BidEntity {

	constructor(
        public bidder: string,
        public listing: ListingEntity,
        public tokenAddress: string,
        public validUntil: BigInt,
        public value: BigInt,
        public signature: Signature
    ) {}

	public static fromJson(obj: Record<string, unknown>): BidEntity {
        const { listing, bid, bidder, signature } = obj;
        if (!listing) {
			throw AppError.badRequest('This entity requires a listing', [{ constraint: 'listing is required', fields: ['listing'] }]);
        }
        if (!bidder || (bidder as string).length === ZERO || !ADDRESS_REGEX.test(bidder as string)) {
			throw AppError.badRequest('This entity requires a bider', [{ constraint: 'bider is required and must be an address', fields: ['bider'] }]);
        }
        if (!bid) {
			throw AppError.badRequest('This entity requires a bid', [{ constraint: 'bid is required', fields: ['bid'] }]);
        }
		if (!signature) {
			throw AppError.badRequest('This entity requires signature', [{ constraint: 'signature is required', fields: ['signature'] }]);
		}
        const { r, v, s } = signature as Record<string, unknown>;
        if (!v) {
			throw AppError.badRequest('This entity requires signature.v', [{ constraint: 'signature.v is required', fields: ['signature.v'] }]);
        }
        if (!r || (r as string).length === ZERO || !BYTES32_REGEX.test(r as string)) {
			throw AppError.badRequest('This entity requires signature.r', [{ constraint: 'signature.r is required', fields: ['signature.r'] }]);
        }
        if (!s || (s as string).length === ZERO || !BYTES32_REGEX.test(s as string)) {
			throw AppError.badRequest('This entity requires signature.s', [{ constraint: 'signature.s is required', fields: ['signature.s'] }]);
        }
        const { tokenAddress, validUntil, value } = bid as Record<string, unknown>;
        return new BidEntity(
            bidder as string,
            ListingEntity.fromJson(listing as Record<string, unknown>),
            tokenAddress as string,
            BigInt(validUntil as string),
            BigInt(value as string),
            signature as Signature
        );
    }
}