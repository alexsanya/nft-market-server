import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type FiltersDto, type CreateListingDto } from '../dtos';
import { type ListingEntity } from '../entities';

export abstract class ListingDatasource {
	abstract getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<ListingEntity[]>>;
	abstract create(createDto: CreateListingDto): Promise<ListingEntity>;
}
