# forge-scope

> ~/.foundryrc or $XDG_CONFIG_HOME/foundry/foundryrc or ~/.config/foundry/foundryrc


## Overview


### Current

```sh
ds-test/=lib/ds-test/src/
@openzeppelin/=node_modules/@openzeppelin/
@rari-capital/=node_modules/@rari-capital/
@manifoldxyz/=node_modules/@manifoldxyz/
```

### Proposed

```json
{
	"imports": {
		"@openzeppelin/contracts/": "/node_modules/@openzeppelin/contracts/",
		"@uniswap/v2-core/": "/node_modules/@uniswap/v2-core/",
		"@uniswap/v3-periphery/": "/node_modules/@uniswap/v3-periphery/"
	},
	"scopes": {}
}
```

[TOC]
- scoping
- format
    - lockfile
    - deployments
- ref. impl.

## Motivation

t.b.d

## Scoping

One of the first way to speeding up build jobs is to use "scoping". 
Usually a change only affect a subset of the graph. 
We can get rid of the builds of `ContractProxy`, `ContractLibrary1` and `ContractLibrary2` if the only changes 
are inside `ContractFactory`. However, we'll note that `ContractChild` is still affected, resulting in this.

```mermaid
gantt
	title @Scoping
	dateFormat  DDD DDDD
axisFormat  %Y-%m-%d


  section Total
	Level 1: 0, 105s
  prepare: active, total_prepare, 0, 30s
	build  : active, total_build, after total_prepare, 45s
  test  : active, total_test, after total_build, 16s


	section InterfaceContract
	prepare: bt_prepare, 0, 10s
	build  : bt_build, after total_prepare, 10s
	test   : bt_test, after total_build, 6s

	section ContractProxy
	skipped: 0

  section ContractLibrary1
	skipped: 0

  section ContractLibrary2
	skipped: 0

  section ContractFactory *
	prepare: bc_prepare, after bt_prepare, 10s
	build: bc_build, after bt_build, 10s
	test: bc_test, after total_build, 16s

  section ContractChild
	prepare: bp_prepare, after bc_prepare, 10s
	build: bp_build, after bc_build, 25s
	test: bp_test, after total_build, 12s
```


## Monorepos


Yarn workspaces can share modules across child projects/packages by hoisting them up to their parent project’s node_modules: `monorepo/node_modules`. This optimization becomes even more prominent when considering these packages will most likely be dependent on each other (the main reason to have the monorepo), i.e. higher degree of redundancy.


## Import Maps


> Note to use with esm / URL based imports

```shell=
 ?pin=BUILD_VERSON
```

### Import Maps 

https://github.com/WICG/import-maps

```jsonc 
  "dependencies": {
    "@openzeppelin/contracts": "^4.5.0",
    "@uniswap/v2-core": "^1.0.1",
    "@uniswap/v3-periphery": "^1.4.0"
  }
}
```
## Generate the import mappings 

```sh 
$ npx importly < package.json > forge-importmap.json
$ cat forge-importmap.json
```

```jsonc 
{

"imports": {
	"@openzeppelin/contracts/": "/node_modules/@openzeppelin/contracts/",
	"@uniswap/v2-core/": "/node_modules/@uniswap/v2-core/",
	"@uniswap/v3-periphery/": "/node_modules/@uniswap/v3-periphery/"
	},
"scopes": {}
}
```

## File based Imports

```json 
  "files": [
    "contracts/base",
    "contracts/interfaces",
    "contracts/libraries",
    "artifacts/contracts/**/*.json",
    "!artifacts/contracts/**/*.dbg.json",
    "!artifacts/contracts/test/**/*",
    "!artifacts/contracts/base/**/*"
  ],

```


## Fetching Imports via Git 

```	ts
/**
* @note Fetch Imports via Git+HTTPS
*/

interface CommitIshInfoMatchResult {
  user: string;
  repo: string;
  subdirs?: string[];
}
const matchCommitIshInfo = match<CommitIshInfoMatchResult>(
  ":user/:repo/:subdirs*(/)?",
);
const matchFromUrl = match<MatchResult>(
  "/:url((?:[^?]+/)+[^?]+){\\?:commit([^?&=]+)}?(.+)?",
);
```
