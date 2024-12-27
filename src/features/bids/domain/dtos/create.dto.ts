import { AbiCoder, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { type ValidationType, AppError, ZERO } from '../../../../core';
import { isAddress, SignatureDto, type CoreDto } from '../../../shared';
import { CreateListingDto } from '../../../listings';

export class CreateBidDto implements CoreDto<CreateBidDto> {
	private constructor(
        public readonly bidder: string,
        public readonly listing: CreateListingDto,
        public readonly tokenAddress: string,
        public readonly validUntil: BigInt,
        public readonly value: BigInt,
		public readonly signature: SignatureDto,
	) {
		this.validate(this);
	}

	public validate(dto: CreateBidDto): void {
		const errors: ValidationType[] = [];
		const { bidder, listing, tokenAddress, validUntil, value, signature } = dto;

		if (!isAddress(bidder)) {
			errors.push({ fields: ['bidder'], constraint: 'bidder is required and must be an address' });
		}
        if (!isAddress(tokenAddress)) {
			errors.push({ fields: ['tokenAddress'], constraint: 'tokenAddress is required and must be an address' });
		}
		if (typeof listing === 'undefined') {
			errors.push({ fields: ['listing'], constraint: 'listing is required' });
		}
		if (typeof validUntil === 'undefined') {
			errors.push({ fields: ['validUntil'], constraint: 'validUntil is required' });
		}
		if (!signature) {
			errors.push({ fields: ['signature'], constraint: 'signature is required' });
		}

		if (errors.length > ZERO) throw AppError.badRequest('Error validating bid', errors);
	}

	/**
	 * This method creates a new instance of this DTO class with the given
	 * properties from body or query parameters.
	 * @param object
	 * @returns A new instance of this DTO
	 */
	public static create(object: Record<string, unknown>): CreateBidDto {
		const errors: ValidationType[] = [];
		const { bidder, listing, tokenAddress, validUntil, value, signature } = object;
		if (!signature || typeof(signature) !== 'object') {
			errors.push({ fields: ['signature'], constraint: 'signature is required' });
		}
        if (!listing || typeof(listing) !== 'object') {
			errors.push({ fields: ['listing'], constraint: 'listing is required' });
        }
		if (errors.length > ZERO) throw AppError.badRequest('Error validating bid', errors);
		const signatureDto = SignatureDto.create((signature as object) as Record<string, unknown>);
        const listingDto = CreateListingDto.create((listing as object) as Record<string, unknown>);
		return new CreateBidDto(
            bidder as string,
            listingDto,
            tokenAddress as string,
            BigInt(validUntil as string),
            BigInt(value as string),
			signatureDto as SignatureDto
		);
	}

	public toJson(): Record<string, unknown> {
		return {
            bidder: this.bidder,
            listing: this.listing.toJson(),
            tokenAddress: this.tokenAddress.toString(),
            validUntil: this.validUntil.toString(),
            value: this.value.toString(),
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
				["bytes32","address","uint256","uint256","bytes32"],
				[
					keccak256(toUtf8Bytes("Bid(address tokenContract,uint256 value,uint256 validUntil,bytes32 listingHash)")),
                    this.tokenAddress,
                    this.value,
                    this.validUntil,
                    this.listing.hash(domainSeparator)
				]
			)
		);
		//#TODO refactor
		return keccak256("0x1901"+encoder.encode(
			["bytes32","bytes32"],
			[
				domainSeparator,
				data
			]).split('x')[1]);
	}
}