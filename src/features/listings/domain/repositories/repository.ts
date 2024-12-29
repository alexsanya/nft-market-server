import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type ListingEntity } from '../entities';
import { type FiltersDto, type CreateListingDto } from '../dtos';

export abstract class ListingRepository {
	abstract getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<ListingEntity[]>>;
	abstract create(createDto: CreateListingDto): Promise<ListingEntity>;
}
