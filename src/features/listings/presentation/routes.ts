import { Router } from 'express';

import { ListingDatasourceImpl, LisitingRepositoryImpl } from '../infrastructure';
import { ListingsController } from './controller';

export class ListingsRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new ListingDatasourceImpl();
		const repository = new LisitingRepositoryImpl(datasource);
		const controller = new ListingsController(repository);

		router.get('/', controller.getAll);

		return router;
	}
}