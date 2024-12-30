import { AppError, ZERO, type ValidationType } from '../../../../core';
import { type CoreDto, isAddress } from '../../../shared';

export class FiltersDto implements CoreDto<FiltersDto> {
	private constructor(public readonly bidder: string) {
		this.validate(this);
	}

	/**
	 * This method validates the properties of the PaginationDto class.
	 * @param dto The instance of the PaginationDto class to be validated.
	 * @returns void
	 */
	public validate(dto: FiltersDto): void {
		const errors: ValidationType[] = [];

		if (dto.bidder && !isAddress(dto.bidder)) {
			errors.push({ fields: ['bidder'], constraint: 'bidder must be an address' });
		}

		if (errors.length > ZERO) throw AppError.badRequest('Error validating filters', errors);
	}

	/**
	 * This method creates a new instance of this DTO class with the given
	 * properties from body or query parameters.
	 * @param object
	 * @returns A new instance of this DTO
	 */
	public static create(object: Record<string, unknown>): FiltersDto {
		const { bidder } = object;
		return new FiltersDto(bidder as string);
	}
}
