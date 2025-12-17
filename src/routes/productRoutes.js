import { Router } from 'express';
import { getAllProducts, dumpAllProducts, updateProducts, getHistoricalProducts, getDetailedHistoricalProducts } from '../controllers/productController.js';
import { authorize } from "../middlewares/authorize.js"

const router = Router();

router.get('/all', getAllProducts, authorize(['A','L']));
router.get('/historical', getHistoricalProducts, authorize(['A','L']));
router.get('/detailed-historical/:id', getDetailedHistoricalProducts, authorize(['A','L']));

router.post('/dump', dumpAllProducts, authorize(['A','L']));

router.patch('/update', updateProducts, authorize(['A','L']));

export default router;