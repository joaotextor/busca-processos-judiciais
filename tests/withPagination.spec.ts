import BuscaProcessos from "../index";

describe("getProceduralClassAndJudgingBodyWithPagination", () => {
  const sut = new BuscaProcessos(
    "TJDFT",
    "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==",
  );
  it("should return a list of processos judiciais of a given class and judging body, with the field 'sort' with the value for pagination", async () => {
    const result = await sut.getProceduralClassAndJudgingBodyWithPagination(1116, 13597, 10);
    expect(result[result.length - 1].sort).not.toBeUndefined();
  });
  it("should return the second page of processos judiciais of a given class and judging body", async () => {
    const firstPage = await sut.getProceduralClassAndJudgingBodyWithPagination(1116, 13597, 100);
    const secondPage = await sut.getProceduralClassAndJudgingBodyWithPagination(
      1116,
      13597,
      100,
      firstPage[firstPage.length - 1].sort,
    );
    expect(firstPage[0]._source.numeroProcesso).not.toEqual(secondPage[0]._source.numeroProcesso);
  });
});
