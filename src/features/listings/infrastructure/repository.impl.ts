import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type FiltersDto, type CreateListingDto } from '../domain/dtos';

import { type ListingEntity, type ListingDatasource, type ListingRepository } from '../domain';

export class LisitingRepositoryImpl implements ListingRepository {
	constructor(private readonly datasource: ListingDatasource) {}

	async getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<ListingEntity[]>> {
		return await this.datasource.getAll(pagination, filters);
	}

	async create(createDto: CreateListingDto): Promise<ListingEntity> {
		return await this.datasource.create(createDto);
	}
}
