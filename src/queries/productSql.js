export const getAllProducts = `
        select
                p.cd_produto as codigo_produto,
                p.ds_produto as descricao_produto,
                f.dt as data_ultima_movimentacao,
                (trunc(sysdate) - trunc(to_timestamp(f.dt)))  as dia,
                decode(p.sn_padronizado, 'S', 'SIM', 'N', 'NAO') as padronizado,
                decode(p.sn_bloqueio_de_compra, 'S', 'SIM', 'N', 'NAO') as bloqueio_de_compra,
                decode(p.sn_pscotropico, 'S', 'SIM', 'N', 'NAO') as psicotropico,
                es.ds_especie as descricao_especie,
                tp_mvto_estoque as tipo_ultima_movimentacao,
                ds_classe as descricao_classe,
                ds_sub_cla as descricao_sub_classe
`;

export const dumpAllProducts = `
        select  
                dbahums.seq_pad_pro.nextval,
                p.cd_produto,
                p.sn_bloqueio_de_compra,
                p.sn_padronizado,
                p.sn_pscotropico,
                sysdate,
                f.dt,
                'DUMP AUTOMATICO' as ds_observacao,
                user as cd_usuario
        
`;

export const bodyQueryProducts = `
        from   
                dbamv.produto p
                Inner Join (
                        select
                                distinct
                                p.cd_produto,
                                max(ime.cd_mvto_estoque)cd_mvto_estoque,
                                max(ime.dh_mvto_estoque)dt,
                                c.ds_classe,
                                s.ds_sub_cla
                        from
                                dbamv.mvto_estoque me
                                Inner Join dbamv.itmvto_estoque ime On me.cd_mvto_estoque = ime.cd_mvto_estoque
                                Inner Join dbamv.produto p On ime.cd_produto = p.cd_produto
                                Inner Join dbamv.classe c On p.cd_classe = c.cd_classe And p.cd_especie = c.cd_especie
                                Inner Join dbamv.sub_clas s On p.cd_sub_cla = s.cd_sub_cla And p.cd_especie = s.cd_especie And p.cd_classe = s.cd_classe
                        where
                                p.cd_especie in (1)
                                and p.sn_movimentacao = 'S'
                                and me.tp_mvto_estoque in ('P','S')
                                and c.cd_classe in (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27)
                        group by   
                                p.cd_produto, 
                                c.ds_classe, 
                                s.ds_sub_cla
                        Order by   
                                p.cd_produto
                ) f On p.cd_produto = f.cd_produto
                Inner Join dbamv.mvto_estoque me On f.cd_mvto_estoque = me.cd_mvto_estoque
                Inner Join dbamv.estoque e On me.cd_estoque = e.cd_estoque
                Inner Join dbamv.est_pro ep On e.cd_estoque = ep.cd_estoque And p.cd_produto = ep.cd_produto
                Inner Join dbamv.especie es On p.cd_especie = es.cd_especie
        where
                p.sn_mestre = 'N'
                and p.sn_movimentacao = 'S'
`;

export const updateProducts = `
    UPDATE 
        DBAHUMS.PADRONIZA_PRODUTOS_HUMS
    SET 
        SN_BLOQUEIO_DE_COMPRA = :bloqueio,
        SN_PADRONIZADO = :padronizado,
        SN_CONTROLADO = :controlado,
        DT_ALTERACAO = SYSDATE,
        DS_OBSERVACAO = :observacao,
        CD_USUARIO = USER
    WHERE 
        CD_PRODUTO = :produto
`;

export const orderByProducts = `
    ORDER BY 3,4
`;

export const allProductsDumped = `
        SELECT 
                P.CD_PRODUTO CODIGO_PRODUTO,
                P.DS_PRODUTO DESCRICAO_PRODUTO,
                DT_ULTIMA_MOVIMENTACAO DATA_ULTIMA_MOVIMENTACAO,
                DS_OBSERVACAO DESCRICAO_OBSERVACAO,
                Decode(PD.SN_PADRONIZADO, 'S', 'SIM', 'N', 'NAO', PD.SN_PADRONIZADO) PADRONIZADO,
                Decode(PD.SN_CONTROLADO, 'S', 'SIM', 'N', 'NAO', PD.SN_CONTROLADO) PSICOTROPICO,
                Decode(PD.SN_BLO_COM, 'S', 'SIM', 'N', 'NAO', PD.SN_BLO_COM) BLOQUEIO_DE_COMPRA,
                E.DS_ESPECIE,
                SC.DS_SUB_CLA
                
        FROM
                DBAHUMS.PAD_PRO_HUMS PD
                INNER JOIN DBAMV.PRODUTO P ON P.CD_PRODUTO = PD.CD_PRODUTO
                Inner Join DBAMV.ESPECIE E On P.CD_ESPECIE = E.CD_ESPECIE
                Inner Join DBAMV.SUB_CLAS SC On P.CD_SUB_CLA = SC.CD_SUB_CLA And P.CD_CLASSE = SC.CD_CLASSE And P.CD_ESPECIE = SC.CD_ESPECIE
`;

export const insertDumpQuery= `
        INSERT INTO DBAHUMS.PAD_PRO_HUMS (
                CD_PAD_PRO,
                CD_PRODUTO,
                SN_BLO_COM,
                SN_PADRONIZADO,
                SN_CONTROLADO,
                DT_ALTERACAO,
                DT_ULTIMA_MOVIMENTACAO,
                DS_OBSERVACAO,
                CD_USUARIO
        )
`;