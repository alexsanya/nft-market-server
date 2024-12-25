import { NftOwnershipDto } from "../dtos";

export abstract class OnChainDataSource {
    abstract isNftBelongsToOwner(nftOwnershipDto: NftOwnershipDto): Promise<boolean>;
}