import 'dotenv/config';
import { get } from 'env-var';
import { ETH_MAINNET_ID, POLYGON_ID, SEPOLIA_ID } from '../constants';

const PROVIDER_JSON_RPC_ENDPOINTS: Record<string, string> = {
	[ETH_MAINNET_ID]: get('ETH_MAINNET_RPC').default('https://eth.llamarpc.com').asString(),
	[POLYGON_ID]: get('POLYGON_RPC').default('https://polygon.llamarpc.com').asString(),
	[SEPOLIA_ID]: get('SEPOLIA_RPC').default('').asString()
};
export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	PROVIDER_JSON_RPC_ENDPOINTS
};
