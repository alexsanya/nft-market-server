import { AppError, type ValidationType, ZERO } from '../../../../core';
import { type CoreDto, isAddress } from '../../../shared';

export class NftOwnershipDto implements CoreDto<NftOwnershipDto> {
	private constructor(
		public readonly chainId: bigint,
		public readonly nftContract: string,
		public readonly tokenId: bigint,
		public readonly owner: string
	) {
		this.validate(this);
	}

	public validate(dto: NftOwnershipDto): void {
		const errors: ValidationType[] = [];
		const { chainId, nftContract, tokenId, owner } = dto;

		if (!isAddress(owner)) {
			errors.push({ fields: ['owner'], constraint: 'Owner is required and must be an address' });
		}
		if (!isAddress(nftContract)) {
			errors.push({ fields: ['nftContract'], constraint: 'nftContract is required and must be an address' });
		}
		if (typeof chainId === 'undefined') {
			errors.push({ fields: ['chainId'], constraint: 'chainId is required' });
		}
		if (typeof tokenId === 'undefined') {
			errors.push({ fields: ['tokenId'], constraint: 'tokenId is required' });
		}

		if (errors.length > ZERO) throw AppError.badRequest('Error validating nftOwnershipDto', errors);
	}

	/**
	 * This method creates a new instance of this DTO class with the given
	 * properties from body or query parameters.
	 * @param object
	 * @returns A new instance of this DTO
	 */
	public static create(object: Record<string, unknown>): NftOwnershipDto {
		const { chainId, nftContract, tokenId, owner } = object;
		return new NftOwnershipDto(
			BigInt(chainId as string),
			nftContract as string,
			BigInt(tokenId as string),
			owner as string
		);
	}
}
