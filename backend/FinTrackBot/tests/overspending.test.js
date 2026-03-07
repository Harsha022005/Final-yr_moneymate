import test from "node:test";
import assert from "node:assert";
import { detectOverspendingML } from "../ml/detectOverspending.ml.js";

test("should NOT flag normal spending", () => {
  const history = [2000, 2200, 2100, 2050, 2150];
  const todaySpend = 2100;

  const result = detectOverspendingML(history, todaySpend);

  assert.strictEqual(result.isOverspending, false);
});

test("should flag overspending spike", () => {
  const history = [2000, 2200, 2100, 2050, 2150];
  const todaySpend = 5000;

  const result = detectOverspendingML(history, todaySpend);

  assert.strictEqual(result.isOverspending, true);
  assert.ok(result.zScore >= 1.5);
});

test("should handle empty history safely", () => {
  const result = detectOverspendingML([], 1000);

  assert.strictEqual(result.isOverspending, false);
});
