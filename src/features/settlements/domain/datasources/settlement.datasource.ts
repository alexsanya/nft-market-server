import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { CreateSettlementDto } from '../dtos';
import { type SettlementEntity } from '../entities';

export abstract class SettlementDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>>;
	abstract create(createDto: CreateSettlementDto): Promise<SettlementEntity>;
}
