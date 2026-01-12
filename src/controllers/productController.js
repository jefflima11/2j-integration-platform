import productModel from '../models/productModel.js';

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function dumpAllProducts(req, res) {
    try {
        const dumpedProducts = await productModel.dumpAllProducts();
        res.status(200).json({return: dumpedProducts, message: 'Dump realizado com sucesso!'});
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function updateProducts(req, res) {
    const products  = req.body;
    
    try {
        const updatedProducts = await productModel.updateProducts(products);

        if (updatedProducts.rowsAffected === 0) {
            return res.status(400).json({ message: 'Dados invalidos ou mal formatados' });
        } else if (updatedProducts.rowsAffected < products.length) {
            return res.status(206).json({ 
                message: 'A atualização foi parcial. Nem todos os produtos foram atualizados.', 
                productsUpdated: updatedProducts.rowsAffected 
            });
        } else {
            return res.status(200).json({
                message: 'Atualização realizada.',
                productUpdated: updatedProducts.rowsAffected
            });
        }

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function getHistoricalProducts(req, res) {
    try {
        const historicalProducts = await productModel.getHistoricalProducts();
        res.status(200).json(historicalProducts);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export async function getDetailedHistoricalProducts(req, res) {
    const { id } = req.params;

    try {
        const detailedHistoricalProducts = await productModel.getDetailedHistoricalProducts(id);
        res.status(200).json(detailedHistoricalProducts);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export default {
    getAllProducts,
    dumpAllProducts,
    updateProducts,
    getHistoricalProducts,
    getDetailedHistoricalProducts
}