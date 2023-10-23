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
  }
  public async getProceduralClassAndJudgingBody(classCodigo: Number, orgaoJulgadorCodigo: Number): Promise<any> {
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
  };

  public async getProceduralClassAddJudgingBodyWithPagination(classCodigo: Number, orgaoJulgadorCodigo: Number, sizePagination: Number): Promise<any> {
    try {
      const rawResult = await fetch(endpoints[this.tribunal], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.APIKey,
        }, body: JSON.stringify({
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

    }

  }
}

export { siglasTribunais, tribunais };
