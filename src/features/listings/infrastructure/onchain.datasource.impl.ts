import { NftOwnershipDto, OnChainDataSource } from "../domain";
import { ChainDataProvider } from "../domain/datasources/chainDataProvider";

export class OnChainDataSourceImpl implements OnChainDataSource {
    constructor(private readonly chainDataProvider: ChainDataProvider) {}

    public isNftBelongsToOwner(nftOwnershipDto: NftOwnershipDto): Promise<boolean> {
        //#TODO implement
        return Promise.resolve(true);
    }
}