# Busca de Processos Judiciais

Biblioteca que utiliza a API Pública do CNJ para abstrair a busca de dados de processos judiciais de todas as Justiças (Estadual, Federal, Militar, Eleitoral, Trabalhista e Tribunais Superiores) do Brasil.

Possui como base de dados a [API Pública do CNJ](https://datajud-wiki.cnj.jus.br/api-publica/).

## Contribua

Pull Requests são EXTREMAMENTE bem-vindos, seja para corrigir bugs, melhorar o código ou criar novas funcionalidades.

Por enquanto, essa biblioteca permite apenas a busca por número de processo (função que será a mais utilizada pelos projetos feitos com essa API), mas as buscas podem utilizar inúmeros critérios, como exemplificado [aqui](https://datajud-wiki.cnj.jus.br/api-publica/exemplos/exemplo2).

Sendo assim, fique à vontade para contribuir com o projeto.

Para isso, dê um [fork](https://github.com/joaotextor/busca-processos-judiciais/fork) no repositório e depois clone para sua máquina:

`git clone https://github.com/joaotextor/busca-processos-judiciais.git`

Não se esqueça de usar a branch..

## Instalação

Para instalar localmente em seu projeto, utilize:

```bash
npm i --save busca-processos-judiciais
```

## Uso

```js
import { BuscaProcesso } from "busca-processos-judiciais";
```

ou

```js
const BuscaProcesso = require("busca-processos-judiciais");
```

```js
async function buscarProcesso() {
  const busca = new BuscaProcesso(
    "TJRS",
    "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==",
  );
  return busca.getCleanResult("51234927620238210001");
}

buscarProcesso()
  .then((data) => console.log(data))
  .catch((erro) => console.log(erro));
```

### Métodos

**`getFullObject(processo: string)`**: Retorna um Objeto Javascript completo, com todos os dados da requisição à API.

**`getStringified(processo: string)`**: Retorna todos os dados da requisição como uma String JSON.

**`getCleanResult(processo: string)`**: Retorna a Classe **`Processo`** com os principais dados da requisição. Esta é a estrutura desta classe:

````js
class Processo {
  public readonly numeroProcesso: string;
  public readonly classeProcessual: string;
  public readonly codigoClasseProcessual: number;
  public readonly sistemaProcessual: string;
  public readonly formatoProcesso: string;
  public readonly tribunal: string;
  public readonly ultimaAtualizacao: Date;
  public readonly grau: string;
  public readonly dataAjuizamento: Date;
  public readonly movimentos: Array<Movimentos>;
  public readonly orgaoJulgador: string;
  public readonly codigoMunicipio: number;
  public readonly assuntos: Array<Assuntos>;

//...constructor, etc...
}
````

Os tipos **`Movimentos`** e **`Assuntos`** são assim compostos:

```js
type Movimentos = {
nome: string;
  dataHora: Date;
  complemento: string | null;
};
```

```js
type Assuntos = {
  codigo: number;
  nome: string;
};
```

## Licença

[MIT](https://choosealicense.com/licenses/mit/)

