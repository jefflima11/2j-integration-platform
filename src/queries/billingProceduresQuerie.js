export const verifyImpBraQuerie = `
    Select
        dp.*
    From
        dbamv.imp_bra ib
        Full Outer Join dbahums.de_para_hums dp On ib.cd_tuss = dp.cd_tuss
    Where
        ib.cd_tuss Is Null
        And dp.cd_tuss Is Not Null
`;

export const verifyValid = `SELECT DISTINCT 0 FROM DBAMV.VAL_PRO WHERE DT_VIGENCIA = TO_DATE(SYSDATE,'DD/MM/YY')`;

export const insertFromToQuerie = `
    insert into dbahums.de_para_hums (
        cd_tiss, 
        dt_vigencia, 
        vl_honorario, 
        vl_operacional, 
        vl_total, 
        sn_ativo, 
        nm_usuario
    ) values (
        :tiss,
        sysdate,
        0,
        0,
        :valor,
        'S',
        user
    )
`;


export const consultConfirmQuerie = `
     select
        dp.cd_tiss,
        ib.cd_pro_fat,
        dp.vl_total new_value,
        vp_ult.dt_vigencia old_date,
        vp_ult.vl_total old_value
    from
        dbahums.de_para_hums dp
        inner join dbamv.imp_bra ib on dp.cd_tiss = ib.cd_tuss
        inner join (
            select
                dt_vigencia,
                cd_pro_fat,
                vl_total
            from (
                select
                dt_vigencia,
                cd_pro_fat,
                vl_total,
                row_number() over (partition by cd_pro_fat order by dt_vigencia desc) rn
                from
                dbamv.val_pro vp
                where
                cd_tab_fat = 1)
            where
                rn = 1) vp_ult on ib.cd_pro_fat = vp_ult.cd_pro_fat
    where
        ib.cd_tab_fat = 1
`;


export const confirmProceduresQuerie = `
    INSERT INTO DBAMV.VAL_PRO(
        CD_TAB_FAT,
        CD_PRO_FAT,
        DT_VIGENCIA,
        VL_HONORARIO,
        VL_OPERACIONAL,
        VL_TOTAL,
        SN_ATIVO,
        NM_USUARIO
    ) VALUES (
        1,
        :pro_fat,
        to_date(sysdate, 'DD/MM/YY'),
        0,
        0,
        :new_value,
        'S',
        USER
    )
`;