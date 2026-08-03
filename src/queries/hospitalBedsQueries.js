export const allHospitalBedsStatusQuery = `
    with leit as (
        select distinct
            a.cd_leito,
            ds_leito,
            ds_unid_int,
            a.cd_atendimento,
            p.nm_paciente
        from
            dbamv.leito l
            inner join dbamv.unid_int ui
                on l.cd_unid_int = ui.cd_unid_int
            inner join dbamv.atendime a
                on l.cd_leito = a.cd_leito
            inner join dbamv.paciente p
                on a.cd_paciente = p.cd_paciente
        where
            dt_desativacao is null
            and ui.cd_unid_int in (2,11)
            and a.dt_alta is null
        ),
        check_in as (
        select
            cd_atendimento,
            max(dt_registro) ult_registro
        from
            dbahums.check_list
        where
            tp_check_list = 1
        group by
            cd_atendimento
        ),
        check_out as (
        select
            cd_atendimento,
            max(dt_registro) ult_registro
        from
            dbahums.check_list
        where
            tp_check_list = 2
        group by
            cd_atendimento
        )

        select
        l.cd_leito,
        l.cd_atendimento,
        l.nm_paciente,
        l.ds_leito,
        l.ds_unid_int,
        case
            when ci.cd_atendimento is not null then 'S'
            else 'N'
        end check_in,
        case
            when co.cd_atendimento is not null then 'S'
            else 'N'
        end check_out
        from
        leit l
        left join check_in ci
            on l.cd_atendimento = ci.cd_atendimento
        left join check_out co
            on l.cd_atendimento = co.cd_atendimento
`;

export const hospitalBedsStatusQuery = `Select 
                ds_unid_int,
                status,
                Count(status) total
            From
                (Select
                    ds_unid_int,
                    cd_solic_limpeza,
                    l.ds_resumo,
                    Case 
                        When dt_inicio_higieniza Is Null And dt_hr_ini_rouparia Is Null And dt_hr_ini_pos_higieniza Is Null Then 'PARA HIGIENIZACAO'
                        When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Null Then 'EM HIGIENIZACAO'
                        When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Not Null Then 'POS HIGIENIZACAO'
                        Else 'N/A'
                    End status
                From
                    dbamv.solic_limpeza sl
                    Inner Join dbamv.leito l On sl.cd_leito = l.cd_leito
                    Inner Join dbamv.unid_int ui On l.cd_unid_int = ui.cd_unid_int
                Where
                    sn_realizado = 'N'
                    And sn_lib_limpeza_auto = 'N'
                    And dt_cancelamento Is Null
                Order By
                    2 Desc)
            Group By 
            ds_unid_int,
            status
`;

export const cleaningRequestQuery = `Select
                ds_unid_int,
                Case 
                    When dt_inicio_higieniza Is Null And dt_hr_ini_rouparia Is Null And dt_hr_ini_pos_higieniza Is Null Then 'PARA HIGIENIZACAO'
                    When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Null Then 'EM HIGIENIZACAO'
                    When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Not Null Then 'POS HIGIENIZACAO'
                    Else 'N/A'
                End status,
                Case
                    When Substr(l.ds_leito,1,3) = 'APT' then 'APARTAMENTO '||Substr(l.ds_leito,4)
                    When Substr(l.ds_leito,1,3) = 'ENF' Then 'ENFERMARIA '||Substr(Substr(l.ds_leito,4),1,3)||' - '||Substr(l.ds_leito,7)
                    When Substr(l.ds_leito,1,3) = 'UTI' Then 'U.T.I - LEITO '||Substr(l.ds_leito,5,2)
                    Else
                    ds_leito
                End ds_leito,
                cd_solic_limpeza,                
                dt_solic_limpeza,
                decode(sl.tp_solicitacao, 'C', 'Cadastrada', 'A', 'Alta', 'T', 'Transferencia', sl.tp_solicitacao) as tp_solicitacao,
                tl.ds_tipo_limpeza tp_limpeza,
                p.nm_paciente
                
            From
                dbamv.solic_limpeza sl
                Inner Join dbamv.leito l On sl.cd_leito = l.cd_leito
                Inner Join dbamv.unid_int ui On l.cd_unid_int = ui.cd_unid_int
                Inner join dbamv.atendime a on sl.cd_atendimento = a.cd_atendimento
                Inner join dbamv.paciente p on a.cd_paciente = p.cd_paciente
                left join dbamv.tipo_limpeza tl on sl.cd_tipo_limpeza = tl.cd_tipo_limpeza
            Where
                sn_realizado = 'N'
                And sn_lib_limpeza_auto = 'N'
                And dt_cancelamento Is Null
                And dt_hr_ini_pos_higieniza Is Null
`;

export const waitingConfirmationQuery = `Select
                    ds_unid_int,
                    Case 
                        When dt_inicio_higieniza Is Null And dt_hr_ini_rouparia Is Null And dt_hr_ini_pos_higieniza Is Null Then 'PARA HIGIENIZACAO'
                        When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Null Then 'EM HIGIENIZACAO'
                        When dt_inicio_higieniza Is Not Null And dt_hr_ini_rouparia Is Not Null And dt_hr_ini_pos_higieniza Is Not Null Then 'POS HIGIENIZACAO'
                        Else 'N/A'
                    End status,
                    Case
                        When Substr(l.ds_leito,1,3) = 'APT' then 'APARTAMENTO '||Substr(l.ds_leito,4)
                        When Substr(l.ds_leito,1,3) = 'ENF' Then 'ENFERMARIA '||Substr(Substr(l.ds_leito,4),1,3)||' - '||Substr(l.ds_leito,7)
                        When Substr(l.ds_leito,1,3) = 'UTI' Then 'U.T.I - LEITO '||Substr(l.ds_leito,5,2)
                        Else
                        ds_leito
                    End ds_leito,
                    cd_solic_limpeza,                
                    dt_solic_limpeza,
                    decode(sl.tp_solicitacao, 'C', 'Concorrente', 'A', 'Terminal', sl.tp_solicitacao) as tp_solicitacao,
                    p.nm_paciente
                    
                From
                    dbamv.solic_limpeza sl
                    Inner Join dbamv.leito l On sl.cd_leito = l.cd_leito
                    Inner Join dbamv.unid_int ui On l.cd_unid_int = ui.cd_unid_int
                    Inner join dbamv.atendime a on sl.cd_atendimento = a.cd_atendimento
                    Inner join dbamv.paciente p on a.cd_paciente = p.cd_paciente
                Where
                    sn_realizado = 'N'
                    And sn_lib_limpeza_auto = 'N'
                    And dt_cancelamento Is Null
                    And dt_hr_ini_pos_higieniza Is not Null
`;

export const startCleaningQuery = `UPDATE dbamv.solic_limpeza
                SET DT_INICIO_HIGIENIZA = sysdate,
                    HR_INICIO_HIGIENIZA = sysdate,
                    DT_HR_FIM_AG_HIGIENIZA = sysdate,
                    DT_HR_INI_ROUPARIA = sysdate,
                    DT_HR_FIM_ROUPARIA = sysdate
                WHERE
                    cd_solic_limpeza = :request
`; 

export const verifyRequestQuery = `Select 
                dt_inicio_higieniza,
                dt_hr_ini_rouparia,
                dt_hr_ini_pos_higieniza
            From
                dbamv.solic_limpeza
            where
                cd_solic_limpeza = :request
`;

export const updateAfterCleaningQuery = `UPDATE 
                    dbamv.solic_limpeza
                SET DT_HR_FIM_HIGIENIZA = sysdate,
                    DT_HR_INI_POS_HIGIENIZA = sysdate
                WHERE
                    cd_solic_limpeza = :request
`;

export const requestCompleteQuery = `SELECT 
                    sn_realizado 
                FROM 
                    dbamv.solic_limpeza 
                WHERE 
                    cd_solic_limpeza = :request
`;

export const checkEmployeeQuery = `SELECT 
                    1
                FROM
                    dbamv.funcionario f
                    Inner join dbamv.func_espec fe on f.cd_func = fe.cd_func
                WHERE
                    f.cd_func = :employee
                    and fe.cd_espec = 40
`;

export const confirmationRequestQuery = `UPDATE 
                    dbamv.solic_limpeza
                SET 
                    DT_REALIZADO = sysdate,
                    HR_REALIZADO = sysdate,
                    DT_HR_FIM_POS_HIGIENIZA = sysdate,
                    SN_REALIZADO = 'S',
                    CD_FUNC = :employee,
                    DS_OBSERVACAO = :observation
                WHERE
                    cd_solic_limpeza = :request
`;

export const refuseCleanRequestQuery = `UPDATE 
                    dbamv.solic_limpeza
                SET DT_INICIO_HIGIENIZA = null,
                    HR_INICIO_HIGIENIZA = null,
                    DT_HR_FIM_AG_HIGIENIZA = null,
                    DT_HR_INI_ROUPARIA = null,
                    DT_HR_FIM_ROUPARIA = null,
                    DT_HR_FIM_HIGIENIZA = null,
                    DT_HR_INI_POS_HIGIENIZA = NULL,
                    DS_OBSERVACAO = null
                WHERE
                    cd_solic_limpeza = :request
`;

export const checkListFormQuery = `
    begin
        dbahums.sp_insert_check_list_2j_hums(
            :solicLimp,
            :tipo,
            :userName, 
            :leito, 
            :tv, 
            :cama, 
            :travesseiro, 
            :enxoval, 
            :sofa, 
            :poltrona, 
            :escada, 
            :toalha, 
            :telefone, 
            :observacao,
            :cd_atendimento,
            :signature,
            :cadeira,
            :controle_tv,
            :controle_ar,
            :carrinho_refeicao,
            :frigobar,
            :suporte_soro,
            :pertences_pessoais,
            :ds_pertences
        );
    end;
`;
