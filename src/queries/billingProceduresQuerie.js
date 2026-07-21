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