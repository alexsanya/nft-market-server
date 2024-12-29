import { type PaginationDto, type PaginationResponseEntity } from '../../shared';

import { type BidEntity, type BidDatasource, type BidRepository, type CreateBidDto } from '../domain';

export class BidRepositoryImpl implements BidRepository {
	constructor(private readonly datasource: BidDatasource) {}

	async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>> {
		return await this.datasource.getAll(pagination);
	}

	async create(createDto: CreateBidDto): Promise<BidEntity> {
		return await this.datasource.create(createDto);
	}
}
