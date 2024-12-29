// src\features\todos\domain\entities\todo.entity.ts

import { AppError, type Signature } from '../../../../core';
import { isAddress, isBytes32 } from '../../../shared';

export class ListingEntity {
	constructor(
		public owner: string,
		public chainId: bigint,
		public minPriceCents: number,
		public nftContract: string,
		public tokenId: bigint,
		public nonce: bigint,
		public signature: Signature
	) {}

	public static fromJson(obj: Record<string, unknown>): ListingEntity {
		const { owner, chainId, minPriceCents, nftContract, tokenId, signature, nonce } = obj;
		if (!signature) {
			throw AppError.badRequest('This entity requires signature', [
				{ constraint: 'signature is required', fields: ['signature'] }
			]);
		}
		const { v, r, s } = signature as Record<string, unknown>;
		if (!isAddress(owner)) {
			throw AppError.badRequest('This entity requires a owner', [
				{ constraint: 'owner is required and must be an address', fields: ['owner'] }
			]);
		}
		if (!isAddress(nftContract)) {
			throw AppError.badRequest('This entity requires a nftContract', [
				{ constraint: 'nftContract is required and must be an address', fields: ['nftContract'] }
			]);
		}
		if (typeof chainId === 'undefined') {
			throw AppError.badRequest('This entity requires chainId', [
				{ constraint: 'chainId is required', fields: ['chainId'] }
			]);
		}
		if (typeof nonce === 'undefined') {
			throw AppError.badRequest('This entity requires nonce', [{ constraint: 'nonce is required', fields: ['nonce'] }]);
		}
		if (typeof tokenId === 'undefined') {
			throw AppError.badRequest('This entity requires tokenId', [
				{ constraint: 'tokenId is required', fields: ['tokenId'] }
			]);
		}
		if (!minPriceCents) {
			throw AppError.badRequest('This entity requires minPriceCents', [
				{ constraint: 'minPriceCents is required', fields: ['minPriceCents'] }
			]);
		}
		if (!v) {
			throw AppError.badRequest('This entity requires signature.v', [
				{ constraint: 'signature.v is required', fields: ['signature.v'] }
			]);
		}
		if (!isBytes32(r)) {
			throw AppError.badRequest('This entity requires signature.r', [
				{ constraint: 'signature.r is required', fields: ['signature.r'] }
			]);
		}
		if (!isBytes32(s)) {
			throw AppError.badRequest('This entity requires signature.s', [
				{ constraint: 'signature.s is required', fields: ['signature.s'] }
			]);
		}
		return new ListingEntity(
			owner as string,
			BigInt(chainId as string),
			minPriceCents as number,
			nftContract as string,
			BigInt(tokenId as string),
			BigInt(nonce as string),
			signature as Signature
		);
	}
}
