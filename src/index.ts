#!/usr/bin/env node
/**!
 * You @license CC-BY-4.0 imya from Tom Golden <oss@tmgldn.com>.
 *
 * Tiny personal-name utilities: split, normalise, initials and greetings.
 * The name is the Russian word "имя" ("name"), which felt right for a package
 * that does exactly one family of things: tidying up people's names.
 *
 * Everything here works on the "First [Middle...] Last" convention and is
 * deliberately forgiving: extra whitespace, odd casing, and missing parts
 * are all handled without complaint.
 */

/** split a full name into its first, middle and last parts */
export interface NameParts {
  first: string;
  middle: string[];
  last: string;
}

/** options for {@link initials} */
export interface InitialsOptions {
  /** join letters with periods (default true) */
  dots?: boolean;
  /** uppercase the letters (default true) */
  upper?: boolean;
}

/** options for {@link greeting} */
export interface GreetingOptions {
  /** defaults to "Hello" */
  salutation?: string;
}

/**
 * Split a full name into its parts.
 *
 * @param full e.g. "Jean-Luc  Picard" or "John Q. Public"
 * @returns middle is only populated when three or more tokens are present
 */
export function splitName(full: string): NameParts {
  if (typeof full !== "string") {
    throw new TypeError("splitName expects a string");
  }
  const parts = full.trim().split(/\s+/);
  const first = parts.shift() ?? "";
  const last = parts.pop() ?? "";
  return { first, middle: parts, last };
}

/**
 * Build initials from a full name.
 *
 * @param full e.g. "John Q. Public"
 * @param opts dots — join with periods (default true), upper — uppercase (default true)
 * @returns "John Q. Public" -> "J.Q.P." (dots) or "JQP"
 */
export function initials(
  full: string,
  { dots = true, upper = true }: InitialsOptions = {},
): string {
  const { first, middle, last } = splitName(full);
  const letters = [first, ...middle, last]
    .filter(Boolean)
    .map((word) => (upper ? (word[0] ?? "").toUpperCase() : (word[0] ?? "")));
  return letters.join(dots ? "." : "") + (dots && letters.length > 0 ? "." : "");
}

/**
 * Normalise casing of a name: lowercases, then re-capitalises each word
 * segment, including after hyphens and apostrophes, and fixes the casing of
 * the common Scottish prefixes (macdonald -> MacDonald, mcdonald -> McDonald).
 *
 * @param full e.g. "jean-luc picard" or "o'bRIEN"
 * @returns "jean-luc picard" -> "Jean-Luc Picard", "o'bRIEN" -> "O'Brien"
 */
export function normaliseName(full: string): string {
  if (typeof full !== "string") {
    throw new TypeError("normaliseName expects a string");
  }
  return full
    .trim()
    .toLowerCase()
    .replace(/(^|[\s'-])([a-zà-ÿ])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/\b(ma?c)([a-zà-ÿ])/gi, (_, pre: string, ch: string) => {
      const fixed = (pre[0] ?? "").toUpperCase() + pre.slice(1).toLowerCase();
      return fixed + ch.toUpperCase();
    });
}

/**
 * A short, friendly greeting.
 *
 * @param full e.g. "Jean-Luc Picard" (or an empty string)
 * @param opts salutation — defaults to "Hello"
 * @returns "Hello, Jean-Luc." / "Hello, stranger."
 */
export function greeting(full: string, { salutation = "Hello" }: GreetingOptions = {}): string {
  const { first, last } = splitName(normaliseName(full));
  return `${salutation}, ${first || last || "stranger"}.`;
}

export default { splitName, initials, normaliseName, greeting };

/* CLI Entrypoint */
if (import.meta.main === true) {
  const [target] = process.argv.slice(2);
  if (typeof target === "string" && target.trim() !== "") {
    console.log(greeting(target));
  } else {
    console.error("imya requires a name argument");
  }
}
