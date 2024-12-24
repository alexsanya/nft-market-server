import { type ValidationType, AppError, ZERO, ADDRESS_REGEX } from '../../../../core';
import { type CoreDto } from '../../../shared';
import { SignatureDto } from './signature.dto';

export class CreateListingDto implements CoreDto<CreateListingDto> {
	private constructor(
		public readonly owner: string,
		public readonly chainId: number,
		public readonly minPriceCents: number,
		public readonly nftContract: string,
		public readonly tokenId: number,
		public readonly signature: SignatureDto,
	) {
		this.validate(this);
	}

	public validate(dto: CreateListingDto): void {
		const errors: ValidationType[] = [];
		const { owner, chainId, minPriceCents, nftContract, tokenId } = dto;

		if (!owner ||  (owner as string).length === ZERO || !ADDRESS_REGEX.test(owner as string)) {
			errors.push({ fields: ['owner'], constraint: 'Owner is required and must be an address' });
		}
		if (!nftContract || (nftContract as string).length === ZERO || !ADDRESS_REGEX.test(nftContract as string)) {
			errors.push({ fields: ['nftContract'], constraint: 'nftContract is required and must be an address' });
		}
		if (!chainId) {
			errors.push({ fields: ['chainId'], constraint: 'chainId is required' });
		}
		if (!tokenId) {
			errors.push({ fields: ['tokenId'], constraint: 'tokenId is required' });
		}
		if (!minPriceCents) {
			errors.push({ fields: ['minPriceCents'], constraint: 'minPriceCents is required' });
		}

		if (errors.length > ZERO) throw AppError.badRequest('Error validating listing', errors);
	}

	/**
	 * This method creates a new instance of this DTO class with the given
	 * properties from body or query parameters.
	 * @param object
	 * @returns A new instance of this DTO
	 */
	public static create(object: Record<string, unknown>): CreateListingDto {
		const errors: ValidationType[] = [];
		const { owner, chainId, minPriceCents, nftContract, tokenId, signature } = object;
		if (!signature || typeof(signature) !== "object") {
			errors.push({ fields: ['signature'], constraint: 'signature is required' });
		}
		if (errors.length > ZERO) throw AppError.badRequest('Error validating listing', errors);
		const signatureDto = SignatureDto.create((signature as object) as Record<string, unknown>);
		return new CreateListingDto(
			owner as string,
			chainId as number,
			minPriceCents as number,
			nftContract as string,
			tokenId as number,
			signatureDto as SignatureDto
		);
	}

	public toJson(): Record<string, unknown> {
		return {
			owner: this.owner,
			chainId: this.chainId,
			minPriceCents: this.minPriceCents,
			nftContract: this.nftContract,
			tokenId: this.tokenId,
			signature: {
				v: this.signature.v,
				r: this.signature.r,
				s: this.signature.s
			}
		}
	}
}