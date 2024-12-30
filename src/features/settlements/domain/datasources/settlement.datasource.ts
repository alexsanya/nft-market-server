import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type FiltersDto, type CreateSettlementDto } from '../dtos';
import { type SettlementEntity } from '../entities';

export abstract class SettlementDatasource {
	abstract getAll(
		pagination: PaginationDto,
		filters: FiltersDto
	): Promise<PaginationResponseEntity<SettlementEntity[]>>;
	abstract create(createDto: CreateSettlementDto): Promise<SettlementEntity>;
}
