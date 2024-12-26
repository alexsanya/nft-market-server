import { Router } from 'express';

import { BidRepositoryImpl, BidDatasourceImpl } from '../infrastructure';
import { BidsController } from './controller';

export class BidsRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new BidDatasourceImpl();
		const repository = new BidRepositoryImpl(datasource);
		const controller = new BidsController(repository);

		router.get('/', controller.getAll);

		return router;
	}
}