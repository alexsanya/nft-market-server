import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { FiltersDto } from '../dtos';
import { type SettlementEntity } from '../entities';
import { type SettlementRepository } from '../repositories/repository';

export interface GetSettlementsUseCase {
	execute: (pagination: PaginationDto, filters: FiltersDto) => Promise<PaginationResponseEntity<SettlementEntity[]>>;
}

export class GetSettlements implements GetSettlementsUseCase {
	constructor(private readonly repository: SettlementRepository) {}

	async execute(pagination: PaginationDto, filters: FiltersDto): Promise<PaginationResponseEntity<SettlementEntity[]>> {
		return await this.repository.getAll(pagination, filters);
	}
}
