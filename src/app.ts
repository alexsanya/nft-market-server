import { envs } from './core/config/env';
import { Server } from './server';
import { AppRoutes } from './routes';
import { RedisClient } from './features/shared/infrastructure/redisClient.impl';

(() => {
	void main();
})();

async function main(): Promise<void> {
	const redisClient = RedisClient.getInstance();
	await redisClient.init();
	await redisClient.populate();

	const server = new Server({
		port: envs.PORT,
		apiPrefix: envs.API_PREFIX,
		routes: AppRoutes.routes
	});
	void server.start();
}
