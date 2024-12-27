import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { CreateBidDto } from '../dtos';
import { type BidEntity } from '../entities';

export abstract class BidDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>>;
    abstract create(createDto: CreateBidDto): Promise<BidEntity>;
}