import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type BidEntity } from '../entities';

export abstract class BidDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>>;
}