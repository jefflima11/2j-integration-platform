import { Router } from 'express';
import productController from '../controllers/productController.js';
import { authorize } from "../middlewares/authorize.js"

const router = Router();

router.get('/all', authorize(['A','L']), productController.getAllProducts);
router.get('/historical',authorize(['A','L']), productController.getHistoricalProducts );
router.get('/detailed-historical/:id', authorize(['A','L']), productController.getDetailedHistoricalProducts);

router.post('/dump', authorize(['A','L']), productController.dumpAllProducts);

router.patch('/update', authorize(['A','L']), productController.updateProducts);

export default router;