import { type ValidationType, AppError, ZERO } from '../../../../core';
import { SignatureDto, type CoreDto } from '../../../shared';
import { CreateBidDto } from '../../../bids';

export class CreateSettlementDto implements CoreDto<CreateSettlementDto> {
	private constructor(
		public readonly bid: CreateBidDto,
		public readonly signature: SignatureDto
	) {
		this.validate(this);
	}

	public validate(dto: CreateSettlementDto): void {
		const errors: ValidationType[] = [];
		const { bid, signature } = dto;

		if (!bid) {
			errors.push({ fields: ['bid'], constraint: 'bid is required' });
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
	public static create(object: Record<string, unknown>): CreateSettlementDto {
		const errors: ValidationType[] = [];
		const { bid, signature } = object;
		if (!signature || typeof signature !== 'object') {
			errors.push({ fields: ['signature'], constraint: 'signature is required' });
		}
		if (!bid || typeof bid !== 'object') {
			errors.push({ fields: ['bid'], constraint: 'bid is required' });
		}
		if (errors.length > ZERO) throw AppError.badRequest('Error validating settlement', errors);
		const signatureDto = SignatureDto.create(signature as object as Record<string, unknown>);
		const bidDto = CreateBidDto.create(bid as object as Record<string, unknown>);
		return new CreateSettlementDto(bidDto, signatureDto);
	}

	public toJson(): Record<string, unknown> {
		return {
			bid: this.bid.toJson(),
			signature: {
				v: this.signature.v,
				r: this.signature.r,
				s: this.signature.s
			}
		};
	}
}
