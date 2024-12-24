// src\features\todos\domain\entities\todo.entity.ts

import { AppError, ZERO } from '../../../../core';

const addressRegex = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);

export class ListingEntity {
	constructor(
        public minPriceCents: number,
		public nftContract: string,
		public tokenId: number
	) {}

	public static fromJson(obj: Record<string, unknown>): ListingEntity {
		const { minPriceCents, nftContract, tokenId } = obj;
		if (!minPriceCents) {
			throw AppError.badRequest('This entity requires minPriceCents', [{ constraint: 'minPriceCents is required', fields: ['minPriceCents'] }]);
		}
		if (!nftContract || (nftContract as string).length === ZERO || !addressRegex.test(nftContract as string)) {
			throw AppError.badRequest('This entity requires a nftContract', [{ constraint: 'nftContract is required', fields: ['nftContract'] }]);
		}
		return new ListingEntity(minPriceCents as number, nftContract as string, tokenId as number);
	}
}