export type Movimentos = {
  nome: string;
  dataHora: Date;
  complemento: string | null;
};

export type Assuntos = {
  codigo: number;
  nome: string;
};

export default class Processo {
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

  constructor(
    numeroProcesso: string,
    classeProcessual: string,
    codigoClasseProcessual: number,
    sistemaProcessual: string,
    formatoProcesso: string,
    tribunal: string,
    ultimaAtualizacao: Date,
    grau: string,
    dataAjuizamento: Date,
    movimentos: Array<Movimentos>,
    orgaoJulgador: string,
    codigoMunicipio: number,
    assuntos: Array<Assuntos>,
  ) {
    this.numeroProcesso = numeroProcesso;
    this.classeProcessual = classeProcessual;
    this.codigoClasseProcessual = codigoClasseProcessual;
    this.sistemaProcessual = sistemaProcessual;
    this.formatoProcesso = formatoProcesso;
    this.tribunal = tribunal;
    this.ultimaAtualizacao = ultimaAtualizacao;
    this.grau = grau;
    this.dataAjuizamento = dataAjuizamento;
    this.movimentos = movimentos;
    this.orgaoJulgador = orgaoJulgador;
    this.codigoMunicipio = codigoMunicipio;
    this.assuntos = assuntos;
  }
}
