import { Router } from 'express';

import { ListingDatasourceImpl, LisitingRepositoryImpl } from '../infrastructure';
import { ListingsController } from './controller';
import { EvmUtilsImpl } from '../../shared';

export class ListingsRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new ListingDatasourceImpl();
		const repository = new LisitingRepositoryImpl(datasource);
        const evmUtils = new EvmUtilsImpl();
		const controller = new ListingsController(repository, evmUtils);

		router.get('/', controller.getAll);
        router.post('/', controller.create);

		return router;
	}
}