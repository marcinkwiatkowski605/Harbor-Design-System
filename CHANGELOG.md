# [1.3.0](https://github.com/marcinkwiatkowski605/Harbor-Design-System/compare/v1.2.0...v1.3.0) (2026-07-09)


### Bug Fixes

* **select:** mark chevron optical-adjustment values as PLACEHOLDER ([f1a3d21](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/f1a3d21f0fa069bd7336cb85b7638cb1db45969e))


### Features

* **ci:** add token-audit script for component CSS ([4800a52](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/4800a5243819c75c94bb5bc1b8152f33ef4f9b0a))

# [1.2.0](https://github.com/marcinkwiatkowski605/Harbor-Design-System/compare/v1.1.0...v1.2.0) (2026-07-09)


### Bug Fixes

* **storybook:** address code review findings on RAC branch ([b684ed4](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/b684ed44fae5bd183eccc20792f2593f8497a3f7))


### Features

* **storybook:** rebuild Button and add Select/TextField/TextArea on react-aria-components ([590811f](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/590811ff0dda8c3319fcc8753acba74e63c880ab))

# [1.1.0](https://github.com/marcinkwiatkowski605/Harbor-Design-System/compare/v1.0.0...v1.1.0) (2026-07-08)


### Bug Fixes

* **button:** stop double-counting focus ring spread ([740d682](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/740d682d8e0793985afd10a61962600339180741))
* **storybook:** drop dimension previews, leave Preview blank instead ([ec2c10d](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/ec2c10ddc0cfc1f26b2702b94210440e09060bff))
* **storybook:** fix caption label contrast and size across all token stories ([39591a7](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/39591a76bf4497a56a2c8dd7ba5a6e79c5eb51de)), closes [#666](https://github.com/marcinkwiatkowski605/Harbor-Design-System/issues/666)
* **storybook:** match Tier 2 Color table column order ([0bc7d64](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/0bc7d64f29e3aae18598788993505fe459f834cd))
* **storybook:** render Button preview grid as real <button disabled> ([4c17382](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/4c17382f08a8cd9233f3d28458e743d53f907995))
* **storybook:** style alias as a chip matching Name, different hue ([4e28d31](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/4e28d314745b735e678ae26c6609ddcb33b55179)), closes [#0f766e](https://github.com/marcinkwiatkowski605/Harbor-Design-System/issues/0f766e) [#effcf9](https://github.com/marcinkwiatkowski605/Harbor-Design-System/issues/effcf9)
* **storybook:** use polling for file watching ([79c54af](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/79c54af62b590e57ffa2f386182c1192c17a559a))
* **storybook:** use real label/lg typography tokens in Button preview ([cf21c1f](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/cf21c1f5c79eea005b79f98bc882a346d9536189))
* **tokens:** resolve base-value/nested-state alias conflicts in tagTokens ([9876c5d](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/9876c5d047a293d3f16294cb13d2dcf5063585a7))
* **tokens:** resync brand/accent palette with fixed contrast ([3977bbb](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/3977bbb27af63d917fc24c1b15981e3adafb9cae))


### Features

* **storybook:** add Name/Value/Preview table to Tier 3 Button tokens ([f2eec77](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/f2eec774459c77e19b4d2b3fca60fc9f44b19dfd))
* **storybook:** add Spacing section to Tier 2 token showcase ([6fd8c91](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/6fd8c91823d75e2d9279bf7df22f79b7d73ca2e5))
* **storybook:** show alias instead of raw value in Tier 2/3 tables ([e77f9c0](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/e77f9c05ac9a6f395ac0a21f14524cccff8db78d))
* **tokens:** resync new nested token architecture from Figma ([fa190da](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/fa190da6eff628cd72e800cfc84b56ff3a637d5e))

# 1.0.0 (2026-07-07)


### Bug Fixes

* **button:** drop loading color rules referencing removed tokens ([17f7244](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/17f7244e305ba65923caa59df4853ddee9b7cfa9))
* **button:** resolve disabled+loading cursor to not-allowed, not default ([ab07aef](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/ab07aef962d8a31dd4cf3bc49548d790b0f70808))
* correct accent-presed→pressed typo; add full token coverage to stories ([a9aab9f](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/a9aab9f59787320df371bfa1c017b1fbf6b7cb3b))
* correct Style Dictionary 4 format signatures and async build ([f436c9c](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/f436c9c735d9ec7cf332210ad9fac6fd4dadcbfc))
* import token CSS directly in preview.ts instead of via SCSS ([d36bf49](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/d36bf49d460dd57e3c07d1e056d56e5f72c70ba6))
* **llms-docs:** stop stripping code-example imports, render JSX as text ([787baac](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/787baac7d9c899c4a8f59fecabc2eb2fab6d61cd))
* outline disabled keeps enabled (white) background, matching Figma ([fdefa86](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/fdefa86c416a33b78862efc0d146cf5134a9bdb4))
* publish tokens package as @harbords/tokens ([@harbor](https://github.com/harbor) scope is owned by CNCF's Harbor project) ([74adc13](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/74adc131c120623495b31f74a13cac1dbfeda66a))
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
* second failed 1.0.0 release commit (npm publish 403 — [@harbor](https://github.com/harbor) scope conflict) ([0b3a6e5](https://github.com/marcinkwiatkowski605/Harbor-Design-System/commit/0b3a6e53527da19da0516be979efcfbfd8f380db))
