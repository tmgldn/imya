// imya — tiny personal-name utilities.
// The name is the Russian word "имя" ("name"), which felt right for a package
// that does exactly one family of things: tidying up people's names.
//
// Everything here works on the "First [Middle...] Last" convention and is
// deliberately forgiving: extra whitespace, odd casing, and missing parts
// are all handled without complaint.

/**
 * Split a full name into its parts.
 *
 * @param {string} full - e.g. "Jean-Luc  Picard" or "John Q. Public".
 * @returns {{ first: string, middle: string[], last: string }}
 *   Middle is only populated when three or more tokens are present.
 */
export function splitName(full) {
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
 * @param {string} full
 * @param {{ dots?: boolean, upper?: boolean }} [opts]
 *   dots — join with periods (default true).
 *   upper — uppercase the letters (default true).
 * @returns {string} "John Q. Public" -> "J.Q.P." (dots) or "JQP".
 */
export function initials(full, { dots = true, upper = true } = {}) {
  const { first, middle, last } = splitName(full);
  const letters = [first, ...middle, last]
    .filter(Boolean)
    .map((word) => (upper ? word[0].toUpperCase() : word[0]));
  return letters.join(dots ? "." : "") + (dots && letters.length ? "." : "");
}

/**
 * Normalise casing of a name: lowercases, then re-capitalises each word
 * segment, including after hyphens and apostrophes, and fixes the casing
 * of the common Scottish prefixes (macdonald -> MacDonald,
 * mcdonald -> McDonald — the prefix itself is preserved).
 *
 * @param {string} full
 * @returns {string}
 *   "jean-luc picard" -> "Jean-Luc Picard"
 *   "o'bRIEN"         -> "O'Brien"
 */
export function normaliseName(full) {
  if (typeof full !== "string") {
    throw new TypeError("normaliseName expects a string");
  }
  return full
    .trim()
    .toLowerCase()
    .replace(/(^|[\s'\-])([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase())
    .replace(/\b(ma?c)([a-zà-ÿ])/gi, (_, pre, ch) => {
      const fixed = pre[0].toUpperCase() + pre.slice(1).toLowerCase();
      return fixed + ch.toUpperCase();
    });
}

/**
 * A short, friendly greeting.
 *
 * @param {string} full
 * @param {{ salutation?: string }} [opts] - defaults to "Hello".
 * @returns {string} "Hello, Jean-Luc." / "Hello, stranger."
 */
export function greeting(full, { salutation = "Hello" } = {}) {
  const { first, last } = splitName(normaliseName(full));
  return `${salutation}, ${first || last || "stranger"}.`;
}

export default { splitName, initials, normaliseName, greeting };
