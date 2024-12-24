import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { CreateListingDto } from '../dtos';
import { type ListingEntity } from '../entities';

export abstract class ListingDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>>;
    abstract create(createDto: CreateListingDto): Promise<ListingEntity>;
}