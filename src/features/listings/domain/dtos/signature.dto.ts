import { type ValidationType, AppError, ZERO, BYTES32_REGEX } from '../../../../core';
import { type CoreDto } from '../../../shared';

export class SignatureDto implements CoreDto<SignatureDto> {
	private constructor(
		public readonly v: number,
		public readonly r: string,
		public readonly s: string,
	) {
		this.validate(this);
	}

	public validate(dto: SignatureDto): void {
		const errors: ValidationType[] = [];
		const { v, r, s } = dto;

		if (!v) {
			errors.push({ fields: ['v'], constraint: 'v is required' });
		}
		if (!r ||  (r as string).length === ZERO || !BYTES32_REGEX.test(r as string)) {
			errors.push({ fields: ['r'], constraint: 'r is required and must be bytes32' });
		}
		if (!s ||  (s as string).length === ZERO || !BYTES32_REGEX.test(s as string)) {
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
		return new SignatureDto(
			v as number,
			r as string,
            s as string
		);
	}
}