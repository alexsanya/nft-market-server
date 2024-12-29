import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type FiltersDto } from '../dtos';
import { type ListingEntity } from '../entities';
import { type ListingRepository } from '../repositories/repository';

export interface GetListingsUseCase {
	execute: (pagination: PaginationDto, filters: FiltersDto) => Promise<PaginationResponseEntity<ListingEntity[]>>;
}

export class GetListings implements GetListingsUseCase {
	constructor(private readonly repository: ListingRepository) {}

	async execute(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<ListingEntity[]>> {
		return await this.repository.getAll(pagination, filters);
	}
}
