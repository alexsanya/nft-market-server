import { type CreateListingDto } from '../dtos';
import { type ListingEntity } from '../entities';
import { type ListingRepository } from '../repositories/repository';

export interface CreateListingUseCase {
	execute: (data: CreateListingDto) => Promise<ListingEntity>;
}

export class CreateListing implements CreateListingUseCase {
	constructor(private readonly repository: ListingRepository) {}

	async execute(data: CreateListingDto): Promise<ListingEntity> {
		return await this.repository.create(data);
	}
}