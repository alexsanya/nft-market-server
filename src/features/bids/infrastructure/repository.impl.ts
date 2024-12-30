import { type PaginationDto, type PaginationResponseEntity } from '../../shared';
import { type BidEntity, type BidDatasource, type BidRepository, type CreateBidDto, type FiltersDto } from '../domain';

export class BidRepositoryImpl implements BidRepository {
	constructor(private readonly datasource: BidDatasource) {}

	async getAll(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<BidEntity[]>> {
		return await this.datasource.getAll(pagination, filters);
	}

	async create(createDto: CreateBidDto): Promise<BidEntity> {
		return await this.datasource.create(createDto);
	}
}
