import { ADDRESS_REGEX, AppError, BYTES32_REGEX, Signature, ZERO } from "../../../../core";
import { ListingEntity } from "../../../listings/domain/entities/listing.entity";
import { isAddress, isBytes32 } from "../../../shared";

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
        const { listing, bidder, tokenAddress, validUntil, value, signature } = obj;
        if (!listing) {
			throw AppError.badRequest('This entity requires a listing', [{ constraint: 'listing is required', fields: ['listing'] }]);
        }
        if (!isAddress(bidder)) {
			throw AppError.badRequest('This entity requires a bider', [{ constraint: 'bider is required and must be an address', fields: ['bider'] }]);
        }
		if (!isAddress(tokenAddress)) {
			throw AppError.badRequest('This entity requires tokenAddress', [{ constraint: 'tokenAddress is required and must be an address', fields: ['tokenAddress'] }]);
		}
        if (typeof validUntil === 'undefined') {
			throw AppError.badRequest('This entity requires a validUntil', [{ constraint: 'validUntil is required', fields: ['validUntil'] }]);
        }
        if (typeof value === 'undefined') {
			throw AppError.badRequest('This entity requires a value', [{ constraint: 'value is required', fields: ['value'] }]);
        }
		if (!signature) {
			throw AppError.badRequest('This entity requires signature', [{ constraint: 'signature is required', fields: ['signature'] }]);
		}
        const { r, v, s } = signature as Record<string, unknown>;
        if (!v) {
			throw AppError.badRequest('This entity requires signature.v', [{ constraint: 'signature.v is required', fields: ['signature.v'] }]);
        }
        if (!isBytes32(r)) {
			throw AppError.badRequest('This entity requires signature.r', [{ constraint: 'signature.r is required', fields: ['signature.r'] }]);
        }
        if (!isBytes32(s)) {
			throw AppError.badRequest('This entity requires signature.s', [{ constraint: 'signature.s is required', fields: ['signature.s'] }]);
        }
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