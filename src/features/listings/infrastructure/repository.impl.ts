import { type PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
	type ListingEntity,
	type ListingDatasource,
	type ListingRepository
} from '../domain';

export class LisitingRepositoryImpl implements ListingRepository {
	constructor(private readonly datasource: ListingDatasource) {}

	async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>> {
		return await this.datasource.getAll(pagination);
	}
}