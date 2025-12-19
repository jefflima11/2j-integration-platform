import { getConnection} from "../database/connection.js";
import { dumpAllProducts as dumpAllProductsQuery, bodyQueryProducts, updateProducts as updateProductsQuery, allProductsDumped, insertDumpQuery, insertHistoricalQuery, historicalProductsQuery, detailedHistoricalProductsQuery, headerHistoricalProductsQuery } from "../queries/productSql.js";
import oracledb from 'oracledb';

export async function getAllProducts() {
    const connection = await getConnection();

    try {
        const r = await conn.execute(allProductsDumped,{}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return r.rows;
    } finally {
        await connection.close();
    };
};

export async function dumpAllProducts() {
    const connection = await getConnection();

    try {
        await connection.execute('DELETE FROM DBAHUMS.PAD_PRO_HUMS', {}, { autoCommit: true });
    } catch (error) {
        console.error("Erro ao tentar limpar tabela de dump:", error.message);
    }

    try {
        const query_complete = insertDumpQuery + dumpAllProductsQuery + bodyQueryProducts;
        await con.execute(query_complete,{}, { autoCommit: true });
    } catch(error) {
        console.error("Erro ao inserir dados na tabela de dump:", error.message);
    }
};

export async function updateProducts(products) {
  const connection = await getConnection();

  try {
    try {
      for (const p of products) {
        const campos = [];
        const binds = { produto: p.produto };
        
        if (p.bloqueio !== undefined) {
          campos.push("SN_BLO_COM = :bloqueio");
          binds.bloqueio = p.bloqueio;
        }
        
        if (p.padronizado !== undefined) {
          campos.push("SN_PADRONIZADO = :padronizado");
          binds.padronizado = p.padronizado;
        }
        
        if (p.controlado !== undefined) {
          campos.push("SN_CONTROLADO = :controlado");
          binds.controlado = p.controlado;
        }
        
        if (p.observacao !== undefined) {
          campos.push("DS_OBSERVACAO = :observacao");
          binds.observacao = p.observacao;
        }
        
        if (campos.length === 0) {
          continue;
        }
        
        const sqlFinal = updateProductsQuery.replace(
          "/*CAMPOS_DINAMICOS*/",
          campos.join(", ")
        );

        await connection.execute(sqlFinal, binds, { autoCommit: true });
      };
  
    } catch (err) {
      return err;
    };

    try {
      await connection.execute(insertHistoricalQuery, {}, { autoCommit: true });
    } catch (error) {
      console.error("Erro ao commitar transação:", error.message);
    }

    return ({ message: 'Produtos atualizados com sucesso!', productsUpdated: products.length });

  } finally {
    await connection.close();
  };

};

export async function getHistoricalProducts() {
    const connection = await getConnection();

    try {
      const historicalProducts = await connection.execute(historicalProductsQuery,{}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return historicalProducts.rows;
    } finally {
      await connection.close();
    };
}

export async function getDetailedHistoricalProducts(id) {
    const connection = await getConnection();
    try {
      const headerHistoricalProducts = await connection.execute(headerHistoricalProductsQuery,{id}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      
      const detailedHistoricalProducts = await connection.execute(detailedHistoricalProductsQuery,{id}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

      const teste = ({
        header: headerHistoricalProducts.rows,
        records: detailedHistoricalProducts.rows
      });

      return teste;
    } finally {
      await connection.close();
    };
}