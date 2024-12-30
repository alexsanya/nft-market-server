import { Router } from 'express';

import { SettlementDatasourceImpl, SettlementRepositoryImpl } from '../infrastructure';
import { SettlementController } from './controller';

export class SettlementRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new SettlementDatasourceImpl();
		const repository = new SettlementRepositoryImpl(datasource);
		const controller = new SettlementController(repository);

		router.get('/', controller.getAll);
		router.post('/', controller.create);

		return router;
	}
}
