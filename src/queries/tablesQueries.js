const verifySequence = `
    Select
        sequence_name
    From
        All_Sequences
    Where
        sequence_name = 'SEQ_PAD_PRO'
`;

const createSequence = `
    CREATE SEQUENCE  
        DBAHUMS.SEQ_PAD_PRO  MINVALUE 1 MAXVALUE 9999999999999999999999999999 
    INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE
`;

const verifyExistTablePadPro = `
    select 
        1
    from
        dbahums.pad_pro_hums
`;

const createTablePadPro = `
    CREATE TABLE DBAHUMS.PAD_PRO_HUMS (
        CD_PAD_PRO INT PRIMARY KEY,
        CD_PRODUTO INT NOT NULL,
        SN_BLO_COM VARCHAR2(1) NOT NULL,
        SN_PADRONIZADO VARCHAR2(1) NOT NULL,
        SN_CONTROLADO VARCHAR2(1) NOT NULL,
        DT_ALTERACAO DATE NOT NULL,
        DT_ULTIMA_MOVIMENTACAO DATE NOT NULL,
        DS_OBSERVACAO VARCHAR2(500),
        CD_USUARIO VARCHAR(55) NOT NULL
    )
`;

export {
    verifySequence,
    createSequence,
    verifyExistTablePadPro,
    createTablePadPro
}