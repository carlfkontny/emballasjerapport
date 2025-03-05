import { expect, test } from "vitest";
import { beregnProsentVekst } from "./prosentVekst";

test("beregnProsentVekst", () => {
  const antallSolgteEnheter = [
    { year: 2022, numberSoldCompany: 50, numberSoldAll: 200 },
    { year: 2023, numberSoldCompany: 75, numberSoldAll: 300 },
    { year: 2024, numberSoldCompany: 60, numberSoldAll: 240 },
    { year: 2025, numberSoldCompany: 80, numberSoldAll: 500 },
  ];

  const result = beregnProsentVekst(antallSolgteEnheter);

  // 2022 should be 100 for both (base year)
  expect(result[0].prosentVekstCompany).toBeCloseTo(100);
  expect(result[0].prosentVekstAll).toBeCloseTo(100);

  // 2023: Company = (75/50)*100 = 150%, Total = (300/200)*100 = 150%
  expect(result[1].prosentVekstCompany).toBeCloseTo(150);
  expect(result[1].prosentVekstAll).toBeCloseTo(150);

  // 2024: Company = (60/50)*100 = 120%, Total = (240/200)*100 = 120%
  expect(result[2].prosentVekstCompany).toBeCloseTo(120);
  expect(result[2].prosentVekstAll).toBeCloseTo(120);

  // 2025: Company = (80/50)*100 = 160%, Total = (500/200)*100 = 250%
  expect(result[3].prosentVekstCompany).toBeCloseTo(160);
  expect(result[3].prosentVekstAll).toBeCloseTo(250);
});


