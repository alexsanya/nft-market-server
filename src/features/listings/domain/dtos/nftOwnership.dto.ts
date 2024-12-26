import { ADDRESS_REGEX, AppError, ValidationType, ZERO } from "../../../../core";
import { CoreDto } from "../../../shared";

export class NftOwnershipDto implements CoreDto<NftOwnershipDto> {
	private constructor(
        public readonly chainId: BigInt,
        public readonly nftContract: string,
        public readonly tokenId: BigInt,
        public readonly owner: string
	) {
		this.validate(this);
	}

	public validate(dto: NftOwnershipDto): void {
		const errors: ValidationType[] = [];
		const { chainId, nftContract, tokenId, owner } = dto;

		if (!owner ||  (owner as string).length === ZERO || !ADDRESS_REGEX.test(owner as string)) {
			errors.push({ fields: ['owner'], constraint: 'Owner is required and must be an address' });
		}
		if (!nftContract || (nftContract as string).length === ZERO || !ADDRESS_REGEX.test(nftContract as string)) {
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
