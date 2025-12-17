import { getAllProducts as getAllProductsModel, dumpAllProducts as dumpAllProductsModel, updateProducts as updateProductsModel, getHistoricalProducts as getHistoricalProductsModel, getDetailedHistoricalProducts as getDetailedHistoricalProductsModel} from '../models/productModel.js';

export async function getAllProducts(req, res) {
    try {
        const products = await getAllProductsModel();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function dumpAllProducts(req, res) {
    try {
        const dumpedProducts = await dumpAllProductsModel();
        res.status(200).json({return: dumpedProducts, message: 'Dump realizado com sucesso!'});
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function updateProducts(req, res) {
    try {
        const products  = req.body;
        const updatedProducts = await updateProductsModel(products);
        res.status(200).json(updatedProducts);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function getHistoricalProducts(req, res) {
    try {
        const historicalProducts = await getHistoricalProductsModel();
        res.status(200).json(historicalProducts);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function getDetailedHistoricalProducts(req, res) {
    const { id } = req.params;

    try {
        const detailedHistoricalProducts = await getDetailedHistoricalProductsModel(id);
        res.status(200).json(detailedHistoricalProducts);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}