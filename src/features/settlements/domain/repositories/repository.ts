import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type CreateSettlementDto } from '../dtos';
import { type SettlementEntity } from '../entities';

export abstract class SettlementRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>>;
	abstract create(createDto: CreateSettlementDto): Promise<SettlementEntity>;
}
