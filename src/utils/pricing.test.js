import { describe, expect, it } from "vitest";
import { computeConfigurationTotal } from "./pricing";

describe("computeConfigurationTotal", () => {
  it("calculates total with multiple items", () => {
    const map = new Map([
      [1, { price_huf: 10000 }],
      [2, { price_huf: 20000 }]
    ]);
    const total = computeConfigurationTotal(
      [
        { component_id: 1, quantity: 1 },
        { component_id: 2, quantity: 2 }
      ],
      map
    );

    expect(total).toBe(50000);
  });

  it("skips missing component ids", () => {
    const map = new Map([[1, { price_huf: 5000 }]]);
    const total = computeConfigurationTotal([{ component_id: 999, quantity: 3 }], map);
    expect(total).toBe(0);
  });
});
