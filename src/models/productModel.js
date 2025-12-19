import { getConnection} from "../database/connection.js";
import { dumpAllProducts as dumpAllProductsQuery, bodyQueryProducts, updateProducts as updateProductsQuery, allProductsDumped, insertDumpQuery } from "../queries/productSql.js";
import oracledb from 'oracledb';

export async function getAllProducts() {
    const conn = await getConnection();

    try {
        const r = await conn.execute(allProductsDumped,{}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return r.rows;
    } finally {
        await conn.close();
    };
};

export async function dumpAllProducts() {
    const con = await getConnection();

    try {
        await con.execute('DELETE FROM DBAHUMS.PAD_PRO_HUMS', {}, { autoCommit: true });
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

    

        await connection.execute(sql, binds, { autoCommit: true });
      }
  
    } catch (err) {
      return err;
    };

    try {
      await con.execute(`INSERT INTO dbahums.HIST_PAD_PRO_HUMS (
                            CD_HIS_PAD_PRO,
                            DT_HIST_PAD_PRO,
                            CD_USUARIO
                          )
                          VALUES (
                            dbahums.SEQ_HIS_PAD_PRO_HUMS.NEXTVAL,
                            SYSDATE,
                            USER
                          )`, {}, { autoCommit: true });
    } catch (error) {
      console.error("Erro ao commitar transação:", error.message);
    }

  } finally {
    await con.close();
  };

};

export async function getHistoricalProducts() {
    const conn = await getConnection();

    try {
        const query_complete = `SELECT
                                    HPD.CD_HIS_PAD_PRO AS codigo_historico,
                                    TO_CHAR(DT_HIST_PAD_PRO, 'DD/MM/YYYY HH24:MI:SS') AS data_historico,
                                    CD_USUARIO AS usuario,
                                    QTD
                                FROM DBAHUMS.HIST_PAD_PRO_HUMS HPD
                                    Inner Join (
                                            Select
                                                Count(*) QTD,
                                                CD_HIS_PAD_PRO
                                            From
                                                DBAHUMS.ITHIST_PAD_PRO_HUMS
                                            Group By CD_HIS_PAD_PRO
                                    ) F On HPD.CD_HIS_PAD_PRO = F.CD_HIS_PAD_PRO
                                ORDER BY HPD.CD_HIS_PAD_PRO DESC`;
        const r = await conn.execute(query_complete,{}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return r.rows;
    } finally {
        await conn.close();
    };
}

export async function getDetailedHistoricalProducts(id) {
    const conn = await getConnection();
    try {
        const query_complete = `Select
                                  IH.CD_HIS_PAD_PRO,
                                  IH.CD_PRODUTO,
                                  P.DS_PRODUTO,
                                  Decode(IH.SN_PAD_ANTIGO, 'S', 'SIM', 'N', 'NAO', IH.SN_PAD_ANTIGO) PAD_ANTERIOR,
                                  Decode(IH.SN_PAD_ATUAL, 'S', 'SIM', 'N', 'NAO', IH.SN_PAD_ATUAL) PAD_SUGERIDO
                                From
                                  DBAHUMS.ITHIST_PAD_PRO_HUMS IH
                                  Inner Join DBAMV.PRODUTO P On IH.CD_PRODUTO = P.CD_PRODUTO
                                Where
                                  IH.CD_HIS_PAD_PRO = :id`;
        const r = await conn.execute(query_complete,{'id': id}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return r.rows;
    } finally {
        await conn.close();
    };
}