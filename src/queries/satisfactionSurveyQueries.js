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