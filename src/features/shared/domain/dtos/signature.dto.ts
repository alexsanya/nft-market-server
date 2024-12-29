import { type ValidationType, AppError, ZERO } from '../../../../core';
import { isBytes32 } from '../../infrastructure';
import { type CoreDto } from './core.dto';

export class SignatureDto implements CoreDto<SignatureDto> {
	private constructor(
		public readonly v: number,
		public readonly r: string,
		public readonly s: string
	) {
		this.validate(this);
	}

	public validate(dto: SignatureDto): void {
		const errors: ValidationType[] = [];
		const { v, r, s } = dto;

		if (!v) {
			errors.push({ fields: ['v'], constraint: 'v is required' });
		}
		if (!isBytes32(r)) {
			errors.push({ fields: ['r'], constraint: 'r is required and must be bytes32' });
		}
		if (!isBytes32(s)) {
			errors.push({ fields: ['s'], constraint: 's is required and must be bytes32' });
		}

		if (errors.length > ZERO) throw AppError.badRequest('Error validating signature', errors);
	}

	/**
	 * This method creates a new instance of this DTO class with the given
	 * properties from body or query parameters.
	 * @param object
	 * @returns A new instance of this DTO
	 */
	public static create(object: Record<string, unknown>): SignatureDto {
		const { v, r, s } = object;
		return new SignatureDto(v as number, r as string, s as string);
	}
}
