// src\routes.ts

import { Router } from 'express';

import { ListingsRoutes } from './features/listings';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/listings', ListingsRoutes.routes);

		return router;
	}
}