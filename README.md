# forge-scope

## Overview

- scoping
- format
    - lockfile
    - deployments
- ref. impl.


## Motivation



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



Yarn workspaces can share modules across child projects/packages by hoisting them up to their parent project’s node_modules: `monorepo/node_modules`. This optimization becomes even more prominent when considering these packages will most likely be dependent on each other (the main reason to have the monorepo), i.e. higher degree of redundancy.

