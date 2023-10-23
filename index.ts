import { Tribunais } from "./utils/types/tribunais-type";
import { endpoints } from "./utils/endpoints";
import { siglasTribunais, tribunais } from "./utils/tribunais";
import Processo, { Assuntos, Movimentos } from "./utils/classes/Processo";

export default class BuscaProcessos {
  private tribunal: Tribunais;
  private APIKey: string;
  constructor(tribunal: Tribunais, apiKey: string) {
    this.tribunal = tribunal;
    this.APIKey = apiKey;
  }

  public async getFullObject(processo: string): Promise<any> {
    /**
     * Fetches the full object of a process by making a POST request to an API endpoint.
     * 
     * @param processo - The process number for which the full object is to be fetched.
     * @returns The full object of the process as a JSON object.
     * @throws If an error occurs during the fetch request.
     * 
     * @example
     * const buscaProcessos = new BuscaProcessos(tribunal, apiKey);
     * const processo = "1234567890";
     * const result = await buscaProcessos.getFullObject(processo);
     * console.log(result);
     */
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

  public async getStringified(processo: string): Promise<any> {
    /**
     * Retrieves a stringified JSON representation of a process by making a POST request to an API endpoint.
     * 
     * @param processo - The process number for which to retrieve the stringified JSON representation.
     * @returns A Promise that resolves to a stringified JSON representation of the process.
     */
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

  public async getCleanResult(processo: string): Promise<any> {
    /**
     * Retrieves clean and formatted data from a given process.
     * 
     * @param processo - The process number for which clean data needs to be retrieved.
     * @returns An instance of the Processo class with relevant information extracted from the raw result.
     */
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
  public async getMovimentos(processo: string): Promise<any> {
    /**
     * Retrieves the movements of a given process.
     * 
     * @param processo - The process number for which to retrieve the movements.
     * @returns An array of movements, where each movement object has the properties `nome` (string), `dataHora` (Date), and `complemento` (string or null).
     */
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
  public async getProceduralClassAndJudgingBody(classCodigo: Number, orgaoJulgadorCodigo: Number): Promise<any> {
    /**
     * Fetches procedural class and judging body information from an API based on the provided class code and judging body code.
     * 
     * @param {Number} classCodigo - The code of the procedural class.
     * @param {Number} orgaoJulgadorCodigo - The code of the judging body.
     * @returns {Promise<any>} - The result of the API request, containing information about the procedural class and judging body.
     */
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
                { match: { classe: { codigo: classCodigo } } },
                { match: { orgaoJulgador: { codigo: orgaoJulgadorCodigo } } },
              ]
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

  public async getProceduralClassAddJudgingBodyWithPagination(classCodigo: Number, orgaoJulgadorCodigo: Number, sizePagination: Number): Promise<any> {
    /**
     * Retrieves procedural classes and judging bodies with pagination from an API endpoint.
     * 
     * @param {Number} classCodigo - The code of the procedural class.
     * @param {Number} orgaoJulgadorCodigo - The code of the judging body.
     * @param {Number} sizePagination - The number of results to be returned per page.
     * @returns {Promise<any>} - The API response as a JSON object.
     */
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
                { match: { classe: { codigo: classCodigo } } },
                { match: { orgaoJulgador: { codigo: orgaoJulgadorCodigo } } },
              ]
            },
          },
          sort: [{ "@timestamp": { "order": "asc" } }]
        }),
      });
      const result = await rawResult.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

export { siglasTribunais, tribunais };
