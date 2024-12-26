import { Contract, providers } from "ethers";
import { NftOwnershipDto, OnChainDataSource } from "../domain";
import { ERC721_ABI } from "../../../core";

export class OnChainDataSourceImpl implements OnChainDataSource {
    constructor(private readonly chainDataProvider: providers.Provider) {}

    public async isNftBelongsToOwner(nftOwnershipDto: NftOwnershipDto): Promise<boolean> {
        const nftContractInstance = new Contract(nftOwnershipDto.nftContract, ERC721_ABI, this.chainDataProvider);
        const realOwner = await nftContractInstance.ownerOf(nftOwnershipDto.tokenId);
        return realOwner == nftOwnershipDto.owner;
    }
}