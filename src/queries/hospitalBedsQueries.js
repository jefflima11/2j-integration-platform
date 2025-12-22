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