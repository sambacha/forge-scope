# Import Maps


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

