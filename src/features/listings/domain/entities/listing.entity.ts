// src\features\todos\domain\entities\todo.entity.ts

import { AppError, ZERO, ADDRESS_REGEX, Signature, BYTES32_REGEX } from '../../../../core';
import { isDefinedAndValidNumber } from '../../infrastructure';

export class ListingEntity {
	constructor(
        public owner: string,
        public chainId: number,
        public minPriceCents: number,
		public nftContract: string,
		public tokenId: number,
        public nonce: number,
        public signature: Signature
	) {}

	public static fromJson(obj: Record<string, unknown>): ListingEntity {
		const { owner, chainId, minPriceCents, nftContract, tokenId, signature, nonce } = obj;
        const { v, r, s } = signature as Record<string, unknown>;
		if (!owner || (owner as string).length === ZERO || !ADDRESS_REGEX.test(owner as string)) {
			throw AppError.badRequest('This entity requires a owner', [{ constraint: 'owner is required and must be an address', fields: ['owner'] }]);
		}
		if (!nftContract || (nftContract as string).length === ZERO || !ADDRESS_REGEX.test(nftContract as string)) {
			throw AppError.badRequest('This entity requires a nftContract', [{ constraint: 'nftContract is required and must be an address', fields: ['nftContract'] }]);
		}
		if (!chainId) {
			throw AppError.badRequest('This entity requires chainId', [{ constraint: 'chainId is required', fields: ['chainId'] }]);
		}
		if (!isDefinedAndValidNumber(nonce)) {
			throw AppError.badRequest('This entity requires nonce', [{ constraint: 'nonce is required', fields: ['nonce'] }]);
		}
		if (!isDefinedAndValidNumber(tokenId)) {
			throw AppError.badRequest('This entity requires tokenId', [{ constraint: 'tokenId is required', fields: ['tokenId'] }]);
		}
		if (!minPriceCents) {
			throw AppError.badRequest('This entity requires minPriceCents', [{ constraint: 'minPriceCents is required', fields: ['minPriceCents'] }]);
		}
        if (!v) {
			throw AppError.badRequest('This entity requires signature.v', [{ constraint: 'signature.v is required', fields: ['signature.v'] }]);
        }
        if (!r || (r as string).length === ZERO || !BYTES32_REGEX.test(r as string)) {
			throw AppError.badRequest('This entity requires signature.r', [{ constraint: 'signature.r is required', fields: ['signature.r'] }]);
        }
        if (!s || (s as string).length === ZERO || !BYTES32_REGEX.test(s as string)) {
			throw AppError.badRequest('This entity requires signature.s', [{ constraint: 'signature.s is required', fields: ['signature.s'] }]);
        }
		return new ListingEntity(
            owner as string,
            chainId as number,
            minPriceCents as number,
            nftContract as string,
            tokenId as number,
            nonce as number,
            signature as Signature
        );
	}
}