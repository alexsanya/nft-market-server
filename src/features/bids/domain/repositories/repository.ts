import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { CreateBidDto } from '../dtos';
import { BidEntity } from '../entities';

export abstract class BidRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>>;
	abstract create(createDto: CreateBidDto): Promise<BidEntity>;
}
