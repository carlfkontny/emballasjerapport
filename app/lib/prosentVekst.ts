import { type SalesByYearCombined } from "@/components/LineChartAggregate";

export function beregnProsentVekst(
  data: SalesByYearCombined[]
): SalesByYearCombined[] {
  // Find the 2022 values to use as base
  const baseYear = data.find((d) => d.year === 2022);
  if (!baseYear) {
    throw new Error("Base year 2022 not found in data");
  }

  const baseCompanyValue = baseYear.numberSoldCompany;
  const baseAllValue = baseYear.numberSoldAll;

  return data.map((curr) => {
    const prosentVekstCompany =
      baseCompanyValue === 0 ||
      curr.numberSoldCompany === undefined ||
      baseCompanyValue === undefined
        ? undefined
        : (curr.numberSoldCompany / baseCompanyValue) * 100;
    const prosentVekstAll =
      baseAllValue === 0 ||
      curr.numberSoldAll === undefined ||
      baseAllValue === undefined
        ? undefined
        : (curr.numberSoldAll / baseAllValue) * 100;

    return {
      ...curr,
      prosentVekstCompany,
      prosentVekstAll,
    };
  });
}
