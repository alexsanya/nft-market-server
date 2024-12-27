import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type SettlementEntity } from '../entities';

export abstract class SettlementDatasource {
	abstract getAll(pagination: PaginationDto): Promise<PaginationResponseEntity<SettlementEntity[]>>;
}