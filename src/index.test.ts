/**
 * imya test suite — split, initials, normalise and greeting behaviours,
 * including the forgiving edge cases the library promises to handle.
 */

import { deepStrictEqual, equal, throws } from "node:assert/strict";
import { test } from "node:test";
import imya, { greeting, initials, normaliseName, splitName } from "./index.ts";

test("splitName basic and multi-space", () => {
  deepStrictEqual(splitName("Jean-Luc  Picard"), {
    first: "Jean-Luc",
    middle: [],
    last: "Picard",
  });
});

test("splitName with middle names", () => {
  deepStrictEqual(splitName("John Q. Public"), {
    first: "John",
    middle: ["Q."],
    last: "Public",
  });
});

test("splitName single token has empty last", () => {
  deepStrictEqual(splitName("Solo"), { first: "Solo", middle: [], last: "" });
});

test("splitName rejects non-strings", () => {
  throws(() => {
    splitName(undefined as unknown as string);
  }, TypeError);
});

test("initials with dots and uppercase", () => {
  equal(initials("John Q. Public"), "J.Q.P.");
});

test("initials without dots", () => {
  equal(initials("John Q. Public", { dots: false }), "JQP");
});

test("initials without uppercase", () => {
  equal(initials("jean-luc picard", { upper: false }), "j.p.");
});

test("initials of empty name is empty", () => {
  equal(initials("   "), "");
});

test("normaliseName fixes casing, hyphens and apostrophes", () => {
  equal(normaliseName("jean-luc picard"), "Jean-Luc Picard");
  equal(normaliseName("o'bRIEN"), "O'Brien");
});

test("normaliseName fixes Scottish prefixes", () => {
  equal(normaliseName("macdonald"), "MacDonald");
  equal(normaliseName("mcdonald"), "McDonald");
});

test("normaliseName rejects non-strings", () => {
  throws(() => {
    normaliseName(42 as unknown as string);
  }, TypeError);
});

test("greeting defaults and salutation option", () => {
  equal(greeting("jean-luc picard"), "Hello, Jean-Luc.");
  equal(greeting("jean-luc picard", { salutation: "Hi" }), "Hi, Jean-Luc.");
  equal(greeting(""), "Hello, stranger.");
});

test("default export has all functions", () => {
  deepStrictEqual(Object.keys(imya).sort(), ["greeting", "initials", "normaliseName", "splitName"]);
  equal(imya.greeting("jean-luc picard"), "Hello, Jean-Luc.");
});
