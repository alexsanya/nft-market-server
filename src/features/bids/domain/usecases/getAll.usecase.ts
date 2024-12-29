import { type PaginationDto, type PaginationResponseEntity } from '../../../shared';
import { type BidEntity } from '../entities';
import { type BidRepository } from '../repositories/repository';

export interface GetBidsUseCase {
	execute: (pagination: PaginationDto) => Promise<PaginationResponseEntity<BidEntity[]>>;
}

export class GetBids implements GetBidsUseCase {
	constructor(private readonly repository: BidRepository) {}

	async execute(pagination: PaginationDto): Promise<PaginationResponseEntity<BidEntity[]>> {
		return await this.repository.getAll(pagination);
	}
}
