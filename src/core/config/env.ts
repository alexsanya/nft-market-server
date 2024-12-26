import 'dotenv/config';
import { get } from 'env-var';
import { ETH_MAINNET_ID } from '../constants';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	PROVIDER_JSON_RPC_ENDPOINTS: {
		[ETH_MAINNET_ID]: get('ETH_MAINNET_RPC').default('https://eth.llamarpc.com').asString()
	} as Record<number, string>
};
