import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { SettlementEntity } from '../entities';

export abstract class SettlementRepository {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>>;
}