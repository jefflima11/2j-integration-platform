export const getAllEmployeesQuery = `SELECT
                f.CD_FUNC,
                f.NM_FUNC
            FROM
                dbamv.funcionario f
                inner join dbamv.func_espec fe on f.cd_func = fe.cd_func
            WHERE
                sn_ativo = 'S'
                and fe.cd_espec = 40`;