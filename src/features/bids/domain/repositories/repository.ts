import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type CreateBidDto } from '../dtos';
import { type BidEntity } from '../entities';

export abstract class BidRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>>;
	abstract create(createDto: CreateBidDto): Promise<BidEntity>;
}
