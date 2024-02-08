import { Tribunais } from "./utils/types/tribunais-type";
import { endpoints } from "./utils/endpoints";
import { siglasTribunais, tribunais } from "./utils/tribunais";
import Processo, { Assuntos, Movimentos } from "./utils/classes/Processo";

export default class BuscaProcessos {
  private tribunal: Tribunais;
  private APIKey: string;
  /**
   * @param tribunal - A sigla do tribunal. Também pode ser importada do objeto `siglasTribunais`
   * @param apiKey - A chave da API Pública do DataJud/CNJ. Pode ser encontrada [aqui](https://datajud-wiki.cnj.jus.br/api-publica/acesso).
   */
  constructor(tribunal: Tribunais, apiKey: string) {
    this.tribunal = tribunal;
    this.APIKey = apiKey;
  }

  /**
   * Realiza uma requisição à API com o método POST, retornando um objeto com todas as propriedades.
   *
   * @param processo - O número do processo cujos dados serão buscados.
   * @returns - Um Objeto JSON com todas as propriedades do processo.
   * @throws - Erro do servidor caso um erro ocorra durante o `fetch`
   *
   * @example
   * ```js
   * const buscaProcessos = new BuscaProcessos(tribunal, apiKey);
   * const processo = "1234567890";
   * const result = await buscaProcessos.getFullObject(processo);
   * console.log(result);
   * ```
   */
  public async getFullObject(processo: string): Promise<any> {
    try {
      const rawResult = await fetch(endpoints[this.tribunal], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.APIKey,
        },
        body: JSON.stringify({
          query: {
            match: {
              numeroProcesso: processo,
            },
          },
        }),
      });
      const result = await rawResult.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Retorna um JSON em string com os dados do processo informado, por meio de requisição com o método POST para o endpoint da API.
   *
   * @param processo - O número do processo cujos dados serão buscados.
   * @returns - Uma `Promise` que resolve em um JSON do processo.
   * @throws - Erro do servidor caso um erro ocorra durante o `fetch`
   */
  public async getStringified(processo: string): Promise<any> {
    try {
      const rawResult = await fetch(endpoints[this.tribunal], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.APIKey,
        },
        body: JSON.stringify({
          query: {
            match: {
              numeroProcesso: processo,
            },
          },
        }),
      });
      const result = await rawResult.json();
      return JSON.stringify(result);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Busca os dados mais importantes relacionados a determinado processo
   *
   * @param processo - O número do processo cujos dados serão buscados.
   * @returns - Uma `Promise` que retorna uma instância da classe `Processo` com as informações mais relevantes do processo, extraídas do resultado da requisição.
   * @throws - Erro do servidor caso um erro ocorra durante o `fetch`
   */
  public async getCleanResult(processo: string): Promise<any> {
    const result = await this.getFullObject(processo);
    const resultProcesso = result.hits.hits[0]._source;

    let movimentos: Array<Movimentos> = [];
    let assuntos: Array<Assuntos> = [];

    resultProcesso.movimentos.forEach((movimento: typeof resultProcesso.movimentos) => {
      movimentos.push({
        nome: movimento.nome,
        dataHora: movimento.dataHora,
        complemento: movimento.complementosTabelados?.nome || null,
      });
    });

    resultProcesso.assuntos.forEach((assunto: typeof resultProcesso.assuntos) => {
      assuntos.push({
        codigo: assunto.codigo,
        nome: assunto.nome,
      });
    });

    return new Processo(
      resultProcesso.numeroProcesso,
      resultProcesso.classe.nome,
      resultProcesso.classe.codigo,
      resultProcesso.sistema.nome,
      resultProcesso.formato.nome,
      resultProcesso.tribunal,
      resultProcesso.dataHoraUltimaAtualizacao,
      resultProcesso.grau,
      resultProcesso.dataAjuizamento,
      movimentos,
      resultProcesso.orgaoJulgador.nome,
      resultProcesso.orgaoJulgador.codigoMunicipioIBGE,
      assuntos,
    );
  }
  /**
   * Retorna apenas os movimentos de determinado processo.
   *
   * @param processo - O número do processo cujos movimentos serão buscados.
   * @returns - Uma `Array` de movimentos. Cada movimento possui as seguintes propriedades: `nome` (string), `dataHora` (Date), and `complemento` (string or null).
   * @throws - Erro do servidor caso um erro ocorra durante o `fetch`
   */
  public async getMovimentos(processo: string): Promise<any> {
    try {
      const result = await this.getFullObject(processo);
      const resultProcesso = result.hits.hits[0]._source;
      let movimentos: Array<Movimentos> = [];
      resultProcesso.movimentos.forEach((movimento: typeof resultProcesso.movimentos) => {
        movimentos.push({
          nome: movimento.nome,
          dataHora: movimento.dataHora,
          complemento: movimento.complementosTabelados?.nome || null,
        });
      });
      return movimentos;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Busca uma lista de processos com base no código da Classe Processual e no código do Órgão Julgador.
   *
   * @param classCodigo - Código da Classe Processual
   * @param orgaoJulgadorCodigo - Código do órgão julgador
   * @returns - Uma `Promise` com a lista de processos judiciais de determinada classe e de determinado órgão julgador.
   */
  public async getProceduralClassAndJudgingBody(
    classCodigo: number,
    orgaoJulgadorCodigo: number,
  ): Promise<any> {
    try {
      const rawResult = await fetch(endpoints[this.tribunal], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.APIKey,
        },
        body: JSON.stringify({
          query: {
            bool: {
              must: [
                { match: { "classe.codigo": classCodigo } },
                { match: { "orgaoJulgador.codigo": orgaoJulgadorCodigo } },
              ],
            },
          },
        }),
      });
      const result = await rawResult.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * O mesmo que `getProceduralClassAndJudgingBody`, mas com paginação de dados.
   *
   * @param classCodigo - Código da Classe Processual
   * @param orgaoJulgadorCodigo - Código do órgão julgador
   * @param sizePagination - O número de resultados por página.
   * @param searchAfter - Propriedade opcional. Deverá ser um array com o número do campo 'sort' existente no últimoprocesso do resultado anterior.
   * @returns - Uma `Promise` com a lista de processos judiciais de determinada classe e de determinado órgão julgador.
   */
  public async getProceduralClassAndJudgingBodyWithPagination(
    classCodigo: number,
    orgaoJulgadorCodigo: number,
    sizePagination: number,
    searchAfter?: number[],
  ): Promise<any> {
    try {
      const rawResult = await fetch(endpoints[this.tribunal], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.APIKey,
        },
        body: JSON.stringify({
          size: sizePagination,
          query: {
            bool: {
              must: [
                { match: { "classe.codigo": classCodigo } },
                { match: { "orgaoJulgador.codigo": orgaoJulgadorCodigo } },
              ],
            },
          },
          sort: [{ "@timestamp": { order: "asc" } }],
          search_after: searchAfter,
        }),
      });
      const result = await rawResult.json();
      if (result.hits.hits.length === 0) return { hits: "empty" };
      return result.hits.hits;
    } catch (error) {
      console.log(error);
    }
  }
}

export { siglasTribunais, tribunais };
