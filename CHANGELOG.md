## [2.1.1](https://github.com/tyler-johnson/simple-text-parser/tree/release/3/) - Nov 7, 2020

### Fixes
- Removed 'util' dependency so this works properly in all JS environments.

### Commits
[`0e1acff7..a14e680e`](https://github.com/tyler-johnson/simple-text-parser/compare/0e1acff7ca6388795e6079c1bb2721f7e6442b03..a14e680e02e861442301ffbe996e4a857d698286)
- [`a14e680e`](https://github.com/tyler-johnson/simple-text-parser/commit/a14e680e02e861442301ffbe996e4a857d698286) Merge pull request #8 from tyler-johnson/develop
- [`73900849`](https://github.com/tyler-johnson/simple-text-parser/commit/73900849c748ad75df7ba62b5f1c5a8470c0ff89) remove uitl dep


## [2.1.0](https://github.com/tyler-johnson/simple-text-parser/tree/release/2/) - Oct 20, 2020

### Features
- Added renderTree static method.
- addRule method takes a full rule object, or a 3rd argument for type.

### Fixes
- Corrected regression in which nodes from presets did not have the correct type.

### Commits
[`6504fe5b..75d493dc`](https://github.com/tyler-johnson/simple-text-parser/compare/6504fe5b4189b51b35346d4eca85338fe1829689..75d493dc96a35550866bcfe8ec1f7c34f8ff4e3f)
- [`75d493dc`](https://github.com/tyler-johnson/simple-text-parser/commit/75d493dc96a35550866bcfe8ec1f7c34f8ff4e3f) Merge pull request #7 from tyler-johnson/develop
- [`1987a4ed`](https://github.com/tyler-johnson/simple-text-parser/commit/1987a4ed4cb88f612a4de9e0bd09c7c46d37c86a) improved example
- [`915c0c32`](https://github.com/tyler-johnson/simple-text-parser/commit/915c0c32c11ce83eee873f27ea5c3978f5e5529f) improvements
- [`37e157de`](https://github.com/tyler-johnson/simple-text-parser/commit/37e157def9b2f258fb77a2b414a12244f5e5ce6a) update dot-prop in yarn.lock


## [2.0.0](https://github.com/tyler-johnson/simple-text-parser/tree/release/1/) - Oct 20, 2020

### Breaking
- Rewritten in TypeScript. API remains largely the same.
- Removed the deprecated method `parse()`.
- Dropped support for all Node versions below 10.

### Dependencies
- @pagedip/tool-autorelease: none → `^3.9.2`
- @types/jest: none → `^26.0.14`
- @types/node: none → `^14.11.10`
- @typescript-eslint/eslint-plugin: none → `^4.5.0`
- @typescript-eslint/parser: none → `^4.5.0`
- babel-eslint: none → `^10.1.0`
- eslint: none → `^7.11.0`
- eslint-config-prettier: none → `^6.13.0`
- eslint-plugin-prettier: none → `^3.1.4`
- jest: none → `^26.6.0`
- npm-run-all: none → `^4.1.5`
- prettier: none → `^2.1.2`
- shx: none → `^0.3.2`
- ts-jest: none → `^26.4.1`
- typescript: none → `^4.0.3`

### Commits
[`2c1ebe1e..09765e8d`](https://github.com/tyler-johnson/simple-text-parser/compare/2c1ebe1e4811800193578e2f9599b95ef9891226..09765e8d86da06eff09c472a1e865e857e2518cb)
- [`09765e8d`](https://github.com/tyler-johnson/simple-text-parser/commit/09765e8d86da06eff09c472a1e865e857e2518cb) Merge pull request #6 from tyler-johnson/develop
- [`f14c4c7d`](https://github.com/tyler-johnson/simple-text-parser/commit/f14c4c7dbb7326e31255e85d366a13f5b5a52e7c) update yarn lock
- [`5239b16c`](https://github.com/tyler-johnson/simple-text-parser/commit/5239b16c824e1ab5dd2ef3174a4280093981f48e) reset release
- [`d4801ecb`](https://github.com/tyler-johnson/simple-text-parser/commit/d4801ecb115d07d110daf9a5ffccd417c46fa40b) switch back to npm so correct registry is used
- [`0fb88211`](https://github.com/tyler-johnson/simple-text-parser/commit/0fb88211556099107ad893339280f7632935d17a) release 2.0.0 [autorelease] [skip ci]
- [`842dce70`](https://github.com/tyler-johnson/simple-text-parser/commit/842dce7083caad46cf8014c29f643eb70c1e10c1) Merge pull request #5 from tyler-johnson/develop
- [`4164f87d`](https://github.com/tyler-johnson/simple-text-parser/commit/4164f87deff9a70dc39c3facbf34cf3c66b425b4) reset release
- [`6e258993`](https://github.com/tyler-johnson/simple-text-parser/commit/6e258993a9c50e4a424b96cfa98e42845a417942) Merge remote-tracking branch 'origin/master' into develop
- [`8dca6389`](https://github.com/tyler-johnson/simple-text-parser/commit/8dca638975c3cae6f875b616dae8a8b9ebf846d2) auth with npm for release
- [`6c83ca70`](https://github.com/tyler-johnson/simple-text-parser/commit/6c83ca702c1da442075d0bd433183bb904152420) release 2.0.0 [autorelease] [skip ci]
- [`8ca0f56f`](https://github.com/tyler-johnson/simple-text-parser/commit/8ca0f56f3e0b372609a77d6042888223272cd837) release 2.0.0 [autorelease] [skip ci]
- [`07e70d22`](https://github.com/tyler-johnson/simple-text-parser/commit/07e70d2284be80c0ba57f657296123e77d0f7840) Merge pull request #4 from tyler-johnson/develop
- [`c8d4a4c0`](https://github.com/tyler-johnson/simple-text-parser/commit/c8d4a4c05b1bfdc91db203915a599827b0fdb6e3) clean up
- [`a1788fee`](https://github.com/tyler-johnson/simple-text-parser/commit/a1788feea4d5620f77dd75dfdd47637403e81176) separate stages
- [`1e1700e9`](https://github.com/tyler-johnson/simple-text-parser/commit/1e1700e95b9fd126acf01f29c610ee77c38c7ee8) correct jobs
- [`039007b7`](https://github.com/tyler-johnson/simple-text-parser/commit/039007b7a682ecf26f44b24bd9ae5b60b8aa785f) test in more node versions
- [`c389621d`](https://github.com/tyler-johnson/simple-text-parser/commit/c389621d6edce4f06c895b86945d682329a4745e) remove install script
- [`75c3ac03`](https://github.com/tyler-johnson/simple-text-parser/commit/75c3ac03c079ea0719e5b250e27db74d15c7cdc0) fix ci autorelease
- [`f85b4afb`](https://github.com/tyler-johnson/simple-text-parser/commit/f85b4afbec88ef6274afe4e7c93e43fee86635be) update release notes
- [`84e3428d`](https://github.com/tyler-johnson/simple-text-parser/commit/84e3428d85ecba1afa19ea8415455cddb9a8c0b1) trigger build
- [`8a0782b9`](https://github.com/tyler-johnson/simple-text-parser/commit/8a0782b9dfa3f120fca2c9d25036fa6ec6703931) rewrote in typescript and upgraded for modern js


