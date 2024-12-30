import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type FiltersDto, type CreateBidDto } from '../dtos';
import { type BidEntity } from '../entities';

export abstract class BidDatasource {
	abstract getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<BidEntity[]>>;
	abstract create(createDto: CreateBidDto): Promise<BidEntity>;
}
