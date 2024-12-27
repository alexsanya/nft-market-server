import { Router } from 'express';

import { BidRepositoryImpl, BidDatasourceImpl } from '../infrastructure';
import { BidsController } from './controller';
import { EvmUtilsImpl } from '../../shared';

export class BidsRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new BidDatasourceImpl();
		const repository = new BidRepositoryImpl(datasource);
        const evmUtils = new EvmUtilsImpl();
		const controller = new BidsController(repository, evmUtils);

		router.get('/', controller.getAll);
		router.post('/', controller.create);

		return router;
	}
}