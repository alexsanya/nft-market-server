// src\routes.ts

import { Router } from 'express';

import { ListingsRoutes } from './features/listings';
import { BidsRoutes } from './features/bids';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/listings', ListingsRoutes.routes);
		router.use('/bids', BidsRoutes.routes);

		return router;
	}
}