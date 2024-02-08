<div align="center">

<img src="https://joaotextor.com/busca-processos-judiciais/logo.png" alt="logo" height="300px"/>

[Início](#busca-de-processos-judiciais) ⦁
[Contribua](#-contribua-) ⦁
[Instalação](#-instalação) ⦁
[Comece a Usar](#-uso) ⦁
[Documentação](#-documentação) ⦁
[Reporte um Bug](#-bugs) ⦁
[Licença](#-licença)

</div>

# Busca de Processos Judiciais

## 🤔 O que é?

Biblioteca que utiliza a API Pública do CNJ para abstrair a busca de dados de processos judiciais de todas as Justiças (Estadual, Federal, Militar, Eleitoral, Trabalhista e Tribunais Superiores) do Brasil.

Possui como base de dados a [API Pública do CNJ](https://datajud-wiki.cnj.jus.br/api-publica/).

## 👨‍💻 Contribua 👩‍💻

Pull Requests são extremamente bem-vindos, seja para corrigir bugs, implementar testes, melhorar o código ou criar novas funcionalidades.

Por enquanto, essa biblioteca permite a busca por número do processo e também por código da classe processual em conjunto com o código do órgão julgador, com ou sem paginação.
No entanto, a API permite utilizar inúmeros critérios, como exemplificado [aqui](https://datajud-wiki.cnj.jus.br/api-publica/exemplos/exemplo2).

Sendo assim, fique à vontade para contribuir com o projeto adicionando novos tipos de busca.

Para isso, dê um [fork](https://github.com/joaotextor/busca-processos-judiciais/fork) no repositório e depois clone para sua máquina:

`git clone <seu-fork-do-repositório>`

Faça checkout para a branch `develop` antes de iniciar as alterações.

## 🔌 Instalação

Para instalar localmente em seu projeto, utilize:

```bash
npm i --save busca-processos-judiciais
```

## 📤 Uso

### 📂 Importação

```js
import BuscaProcesso from "busca-processos-judiciais";
```

ou

```js
const BuscaProcesso = require("busca-processos-judiciais");
```

Para fazer a importação de fora de um ambiente node (browser) em um ES6 Module, utilize:

```js
import BuscaProcesso from "./node_modules/busca-processos-judiciais/dist/index.mjs".
```

### 🚀️ Implementação

```js
async function buscarProcesso() {
  const busca = new BuscaProcesso(
    "TRF4",
    "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==",
  );
  return busca.getCleanResult("50342112220234040000");
}

buscarProcesso()
  .then((data) => console.log(data))
  .catch((erro) => console.log(erro));
```

### 🔑 Chave Pública da API

A API do CNJ é pública e a chave pode ser obtida [aqui](https://datajud-wiki.cnj.jus.br/api-publica/acesso).
O uso da API está sujeita aos **[Termos de Uso](https://formularios.cnj.jus.br/wp-content/uploads/2023/05/Termos-de-uso-api-publica-V1.1.pdf)** definidos pelo CNJ.

### 🔧 Métodos

**`constructor(tribunal, apiKey)`**: tanto a sigla do Tribunal quanto a chave pública da API são propriedades obrigatórias no construtor da classe.

**`getFullObject(processo: string)`**: Retorna um Objeto Javascript completo, com todos os dados da requisição à API.

**`getStringified(processo: string)`**: Retorna todos os dados da requisição como uma String JSON.

**`getCleanResult(processo: string)`**: Retorna a Classe **`Processo`** com os principais dados da requisição. Esta é a estrutura desta classe:

**`getProceduralClassAndJudgingBody(classCodigo: number, orgaoJulgadorCodigo: number)`**: Retorna uma lista de processos com base no código da classe processual informada e no código do órgão julgador.

**`getProceduralClassAndJudgingBodyWithPagination(classCodigo: number, orgaoJulgadorCodigo: number, sizePagination: number, searchAfter?: number[])`**: Mesmo que o anterior, mas com paginação.

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

### 📐 Objetos de suporte

Além da classe principal, esta biblioteca também exporta dois objetos de suporte: `tribunais` e `siglasTribunais`.

O primeiro traz o nome completo de todos os Tribunais na estrutura `{ sigla: "nome completo" }`. Exemplo:

```js
export const tribunais = {
  TST: "Tribunal Superior de Trabalho",
  TSE: "Tribunal Superior Eleitoral",
  STJ: "Superior Tribunal de Justiça",
  STM: "Superior Tribunal Militar",
  //...
```

O segundo traz as siglas dos Tribunais, que podem ser utilizadas como se fossem um `enum` ao instanciar a classe BuscaProcessos. Vejamos:

```js
import { siglasTribunais } from "busca-processos-judiciais"

const busca = new BuscarProcesso(siglasTribunais.TJRS, "api-key")
```

Isso reduz as chances de erro de digitação, visto que permite o uso do autocomplete de seu editor de código/IDE.

## 👀 Documentação

A documentação completa pode ser encontrada [AQUI](https://busca-processos-judiciais.joaotextor.com).

## 🪲 Bugs

Encontrando bugs, você pode reportá-los criando um [issue](https://github.com/joaotextor/busca-processos-judiciais/issues).
Se desejar corrigir, abra o issue e depois siga os passos para a [colaboração](#contribua).

## 📑 Licença

[Licença MIT](https://choosealicense.com/licenses/mit/) :

<div align="justify">

MIT License

Copyright (c) 2023, Busca Processos Judiciais (joaotextor/busca-processos-judiciais)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

</div>

