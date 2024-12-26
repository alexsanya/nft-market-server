import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { BidEntity } from '../entities';

export abstract class BidRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>>;
}