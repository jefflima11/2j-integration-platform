export const patientInfoQuery = `
    SELECT
        a.dt_atendimento,
        a.dt_alta,
        a.cd_atendimento,
        decode(a.tp_atendimento, 'U', 'URGENCIA', 'E', 'EXTERNO', 'I', 'INTERNACAO', 'A', 'AMBULATORIAL') as tp_atendimento,
        p.nm_paciente,
        p.nr_ddd_celular,
        TO_NUMBER(p.nr_celular) as nr_celular
    FROM atendime a
    INNER JOIN paciente p
        ON p.cd_paciente = a.cd_paciente
    WHERE a.cd_atendimento = :cdPatient
`;

export const allPatientsQuerie = `
    SELECT
        TO_CHAR(a.dt_alta, 'DD-MM-YYYY') AS data_alta,
        a.cd_atendimento AS atendimento,
        p.nm_paciente AS paciente,

        CASE a.tp_atendimento
            WHEN 'I' THEN 'INTERNAÇÃO'
            WHEN 'U' THEN 'URGÊNCIA'
        END AS tipo_atendimento,

        o.ds_ori_ate AS origem_atendimento,

        CASE
            WHEN p.nr_ddd_celular IS NOT NULL
            AND p.nr_celular IS NOT NULL
            THEN
                '55' ||
                p.nr_ddd_celular ||
                CASE
                    WHEN LENGTH(p.nr_celular) = 9
                    THEN SUBSTR(p.nr_celular, 2)
                    ELSE p.nr_celular
                END
            ELSE NULL
        END AS celular

      FROM atendime a

      INNER JOIN paciente p
          ON p.cd_paciente = a.cd_paciente

      INNER JOIN ori_ate o
          ON o.cd_ori_ate = a.cd_ori_ate

      WHERE a.dt_alta >= TRUNC(SYSDATE) - 120
        AND a.dt_alta < TRUNC(SYSDATE) + 1
        AND a.tp_atendimento IN ('I', 'U')
        AND p.nm_paciente NOT LIKE 'RN%'
`