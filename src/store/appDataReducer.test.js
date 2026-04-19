import { describe, expect, it } from "vitest";
import { appDataReducer, initialState } from "./AppDataContext";

describe("appDataReducer", () => {
  it("sets loading state", () => {
    const next = appDataReducer(initialState, { type: "SET_LOADING", payload: true });
    expect(next.isLoading).toBe(true);
  });

  it("sets error message", () => {
    const next = appDataReducer(initialState, { type: "SET_ERROR", payload: "Hiba" });
    expect(next.error).toBe("Hiba");
  });

  it("sets categories list", () => {
    const next = appDataReducer(initialState, { type: "SET_CATEGORIES", payload: [{ id: 1 }] });
    expect(next.categories).toHaveLength(1);
  });

  it("sets components list", () => {
    const next = appDataReducer(initialState, { type: "SET_COMPONENTS", payload: [{ id: 1 }] });
    expect(next.components).toHaveLength(1);
  });

  it("sets configurations list", () => {
    const next = appDataReducer(initialState, {
      type: "SET_CONFIGURATIONS",
      payload: [{ id: 1 }]
    });
    expect(next.configurations).toHaveLength(1);
  });

  it("sets toast payload", () => {
    const next = appDataReducer(initialState, {
      type: "SET_TOAST",
      payload: { type: "success", message: "OK" }
    });
    expect(next.toast?.message).toBe("OK");
  });

  it("keeps state on unknown action", () => {
    const next = appDataReducer(initialState, { type: "UNKNOWN_ACTION" });
    expect(next).toEqual(initialState);
  });
});
