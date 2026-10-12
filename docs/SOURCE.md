# XZX_PACKAGE_NAME_ZXZ

XZX_BADGE_NPM_ZXZ XZX_BADGE_TYPES_ZXZ XZX_BADGE_DEPENDENCIES_ZXZ XZX_BADGE_SIZE_ZXZ XZX_BADGE_LICENCE_ZXZ XZX_BADGE_COVERAGE_ZXZ

`XZX_PACKAGE_NAME_ZXZ` — tiny personal-name utilities: split, normalise, initials and greetings. The name is the Russian word "имя" ("name"), which felt right for a package that does exactly one family of things: tidying up people's names.

Everything works on the "First [Middle...] Last" convention and is deliberately forgiving: extra whitespace, odd casing, and missing parts are all handled without complaint.

## Example

```ts
import { greeting, initials, normaliseName } from "XZX_PACKAGE_NAME_ZXZ";

normaliseName("jean-luc picard"); // "Jean-Luc Picard"
initials("John Q. Public"); // "J.Q.P."
console.log(greeting("jean-luc picard")); // "Hello, Jean-Luc."
```

## Install

```sh
npm add XZX_PACKAGE_NAME_ZXZ
```

## Contributing

- PRs welcome and accepted
- Issues also very welcome
- Treat others with common courtesy and respect

## Licence

XZX_LICENCE_ZXZ
