import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type ListingEntity } from '../entities';

export abstract class ListingDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>>;
}