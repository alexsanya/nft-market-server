import { Router } from 'express';

import { ListingsRoutes } from './features/listings';
import { BidsRoutes } from './features/bids';
import { SettlementRoutes } from './features/settlements';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/listings', ListingsRoutes.routes);
		router.use('/bids', BidsRoutes.routes);
		router.use('/settlements', SettlementRoutes.routes);

		return router;
	}
}
