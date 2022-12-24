module.exports = `
insert into parametros (codigo, descricao)
values('HS', 'Configurações do MiniPCP-HS')
on conflict (codigo) do nothing;`;
