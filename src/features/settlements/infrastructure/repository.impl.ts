import { type PaginationDto, type PaginationResponseEntity } from '../../shared';

import {
	type SettlementDatasource,
	type SettlementRepository,
	type SettlementEntity,
	type CreateSettlementDto
} from '../domain';

export class SettlementRepositoryImpl implements SettlementRepository {
	constructor(private readonly datasource: SettlementDatasource) {}

	async getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>> {
		return await this.datasource.getAll(pagination);
	}

	async create(createDto: CreateSettlementDto): Promise<SettlementEntity> {
		return await this.datasource.create(createDto);
	}
}
