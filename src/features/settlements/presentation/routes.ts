import { Router } from 'express';

import { SettlementDatasourceImpl, SettlementRepositoryImpl } from '../infrastructure';
import { SettlementController } from './controller';
import { EvmUtilsImpl } from '../../shared';

export class SettlementRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new SettlementDatasourceImpl();
		const repository = new SettlementRepositoryImpl(datasource);
        const evmUtils = new EvmUtilsImpl();
		const controller = new SettlementController(repository, evmUtils);

		router.get('/', controller.getAll);
		router.post('/', controller.create);

		return router;
	}
}