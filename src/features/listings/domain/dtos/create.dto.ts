import { AbiCoder, arrayify, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { type ValidationType, AppError, ZERO, ADDRESS_REGEX } from '../../../../core';
import { type CoreDto } from '../../../shared';
import { SignatureDto } from './signature.dto';
import { isDefinedAndValidNumber } from '../../infrastructure';

export class CreateListingDto implements CoreDto<CreateListingDto> {
	private constructor(
		public readonly owner: string,
		public readonly chainId: number,
		public readonly minPriceCents: number,
		public readonly nftContract: string,
		public readonly tokenId: number,
		public readonly nonce: number,
		public readonly signature: SignatureDto,
	) {
		this.validate(this);
	}

	public validate(dto: CreateListingDto): void {
		const errors: ValidationType[] = [];
		const { owner, chainId, minPriceCents, nftContract, tokenId, nonce } = dto;

		if (!owner ||  (owner as string).length === ZERO || !ADDRESS_REGEX.test(owner as string)) {
			errors.push({ fields: ['owner'], constraint: 'Owner is required and must be an address' });
		}
		if (!nftContract || (nftContract as string).length === ZERO || !ADDRESS_REGEX.test(nftContract as string)) {
			errors.push({ fields: ['nftContract'], constraint: 'nftContract is required and must be an address' });
		}
		if (!chainId) {
			errors.push({ fields: ['chainId'], constraint: 'chainId is required' });
		}
		if (!isDefinedAndValidNumber(nonce)) {
			errors.push({ fields: ['nonce'], constraint: 'nonce is required' });
		}
		if (!isDefinedAndValidNumber(tokenId)) {
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
		const { owner, chainId, minPriceCents, nftContract, tokenId, signature, nonce } = object;
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
			nonce as number,
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
			nonce: this.nonce,
			signature: {
				v: this.signature.v,
				r: this.signature.r,
				s: this.signature.s
			}
		}
	}

	public hash(domainSeparator: string): string {
		const encoder = new AbiCoder();
		const data = keccak256(
			encoder.encode(
				["bytes32","address","uint256","uint256","uint256"],
				[
					keccak256(toUtf8Bytes("Listing(address nftContract,uint256 tokenId,uint256 minPriceCents,uint256 nonce)")),
                    this.nftContract,
                    this.tokenId,
                    this.minPriceCents,
                    this.nonce
				]
			)
		);
		//#TODO refactor
		//arrayify(hash).entries
		return keccak256("0x1901"+encoder.encode(
			["bytes32","bytes32"],
			[
				domainSeparator,
				data
			]).split('x')[1]);
	}
}