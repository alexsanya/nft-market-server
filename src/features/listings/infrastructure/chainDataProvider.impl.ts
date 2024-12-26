import { providers } from "ethers";
import { envs, ETH_MAINNET_ID } from "../../../core";

export const ChainDataProviderImpls = {
    [ETH_MAINNET_ID]: new providers.JsonRpcProvider(envs.PROVIDER_JSON_RPC_ENDPOINTS[ETH_MAINNET_ID], ETH_MAINNET_ID)
}