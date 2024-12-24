import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type ListingEntity } from '../entities';

export abstract class ListingRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<ListingEntity[]>>;
}