function Data(components) {

    async function data(args) {
        console.log(args);
        return [
            {
                Tipo: "Teste",
                Produto: "1234ABCX",
                Descrição: "Produto de teste para este relatório",
                Unidade: "Kg",
                Físico: 1234.56,
                "Custo unit.": 2.34,
                Custo: 1234.56*2.34,
                Disponível: 344.1,
            }
        ];
    }

    return {
        data,
    };
}

module.exports = Data;

// query de movimentação de lotes
/*
select
tipo, codigo, lote, producao, consumo, valorunitario, datahora, tipo_de_movimento
from
prd_lotes_mov
    where (consumo > 0 or producao > 0)
order by
tipo, codigo, datahora
*/
