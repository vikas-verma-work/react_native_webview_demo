import { ALLOWLIST } from "../utils/allowlist";

test("Allowlist blocks external navigation", () => {
  expect(ALLOWLIST.includes("malicious.com")).toBe(false);
  expect(ALLOWLIST.includes("localhost")).toBe(true);
});
