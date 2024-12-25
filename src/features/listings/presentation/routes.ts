import { Router } from 'express';

import { ListingDatasourceImpl, LisitingRepositoryImpl, ChainDataProviderImpl, OnChainDataSourceImpl } from '../infrastructure';
import { ListingsController } from './controller';
import { EvmUtilsImpl } from '../infrastructure';

export class ListingsRoutes {
	static get routes(): Router {
		const router = Router();

		//* This datasource can be change
		const datasource = new ListingDatasourceImpl();
		const repository = new LisitingRepositoryImpl(datasource);
        const chainDataProvider = new ChainDataProviderImpl();
        const onChainDataSource = new OnChainDataSourceImpl(chainDataProvider);
        const evmUtils = new EvmUtilsImpl();
		const controller = new ListingsController(repository, onChainDataSource, evmUtils);

		router.get('/', controller.getAll);
        router.post('/', controller.create);

		return router;
	}
}