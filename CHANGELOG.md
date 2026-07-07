# 1.0.0 (2026-07-07)


### Bug Fixes

* **button:** drop loading color rules referencing removed tokens ([17f7244](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/17f7244e305ba65923caa59df4853ddee9b7cfa9))
* **button:** resolve disabled+loading cursor to not-allowed, not default ([ab07aef](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/ab07aef962d8a31dd4cf3bc49548d790b0f70808))
* correct accent-presed→pressed typo; add full token coverage to stories ([a9aab9f](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/a9aab9f59787320df371bfa1c017b1fbf6b7cb3b))
* correct Style Dictionary 4 format signatures and async build ([f436c9c](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/f436c9c735d9ec7cf332210ad9fac6fd4dadcbfc))
* import token CSS directly in preview.ts instead of via SCSS ([d36bf49](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/d36bf49d460dd57e3c07d1e056d56e5f72c70ba6))
* **llms-docs:** stop stripping code-example imports, render JSX as text ([787baac](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/787baac7d9c899c4a8f59fecabc2eb2fab6d61cd))
* outline disabled keeps enabled (white) background, matching Figma ([fdefa86](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/fdefa86c416a33b78862efc0d146cf5134a9bdb4))
* regenerate lockfile after tokens version sync ([d0e7fcd](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/d0e7fcda992b576a9cc63700ed80bc51babb9536))
* remove loading spinner from Button — not in Figma ([9445abc](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/9445abcb930d048372e15128b812362e729685cf))
* **stories:** update tier-1/tier-2 token stories for renamed tokens ([746b32d](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/746b32de5eaeee4641b0e406293562c46c51f92a))
* **storybook:** outline disabled swatch/token use enabled background ([83b86ea](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/83b86ea093e03313a6384e6e3948ec6175140cb4))
* sync Tier 2 color contexts with actual design_tokens.json ([c545f31](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/c545f313685896ccfc1d434036867898576ddbba))
* **tokens:** sync icon/content naming and shadow-spread key from Figma ([73ed441](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/73ed441c275b9e24ff7496d708dfa7b222d116f3))
* untrack local_docs files accidentally committed despite .gitignore ([4625ca5](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/4625ca5d07f179df5051430f225b93e9de2432c4))
* use label/lg typography for Button label ([94abc23](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/94abc232731639e8e763f5c9504e793f0bbcece9))


### Features

* add Button component (from Figma) with stories ([ccfa553](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/ccfa553c44b2e46b58863ff1b8a50c503e90b187))
* add storySort to enforce Foundations > Components > Pages order ([616b071](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/616b07115d70505962d025f242244bca3198c37f))
* export Figma design tokens in W3C DTCG format ([dccdfcd](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/dccdfcd19697a1818c64438d639df7660ab91018))
* **llms:** index foundations docs in the LLM docs pipeline ([e8153cf](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/e8153cf41f5dcf52dd5dc11b1ffc74e82f91913b))
* reorganize Storybook sidebar into Foundations, Components, Pages ([690537a](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/690537a5509f93ee9e248d0dc03391e0fed36ce8))
* replace token placeholder stories with real visualizations ([82eb3a1](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/82eb3a135e903cdf0b264160e8741d4f899ca519))
* wire design_tokens.json to Style Dictionary 4 (DTCG) ([6270552](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/6270552f3620805e4b1cc11dcbb7e8a9803c1475))


### Reverts

* 1.0.0 release commit (npm publish failed before NPM_TOKEN was configured) ([f8dce04](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/f8dce04fcd484e82d810c522efd0ced3d8617acb))
