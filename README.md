# Zefiros Node Standard
This package makes it easy to share development dependencies across Zefiros packages.

<!-- toc -->
* [Zefiros Node Standard](#zefiros-node-standards)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @zefiros-software/node-standards
$ node-standards COMMAND
running command...
$ node-standards (-v|--version|version)
@zefiros-software/node-standards/0.2.0-beta.50 linux-x64 node-v12.16.3
$ node-standards --help [COMMAND]
USAGE
  $ node-standards COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`node-standards ci`](#node-standards-ci)
* [`node-standards create TYPE NAME`](#node-standards-create-type-name)
* [`node-standards env`](#node-standards-env)
* [`node-standards help [COMMAND]`](#node-standards-help-command)
* [`node-standards lint`](#node-standards-lint)
* [`node-standards make-release`](#node-standards-make-release)
* [`node-standards release`](#node-standards-release)

## `node-standards ci`

run all ci tests

```
USAGE
  $ node-standards ci
```

_See code: [dist/commands/ci.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/ci.ts)_

## `node-standards create TYPE NAME`

run all ci tests

```
USAGE
  $ node-standards create TYPE NAME

ARGUMENTS
  TYPE  (library|oclif-cli) [default: library] the package type
  NAME  the package name
```

_See code: [dist/commands/create.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/create.ts)_

## `node-standards env`

provision global environment

```
USAGE
  $ node-standards env

OPTIONS
  -h, --help  show CLI help
  --install   install the environment
```

_See code: [dist/commands/env.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/env.ts)_

## `node-standards help [COMMAND]`

display help for node-standards

```
USAGE
  $ node-standards help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.0/src/commands/help.ts)_

## `node-standards lint`

lint the project configuration

```
USAGE
  $ node-standards lint

OPTIONS
  --fix
```

_See code: [dist/commands/lint.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/lint.ts)_

## `node-standards make-release`

create a pull request to release to stable

```
USAGE
  $ node-standards make-release
```

_See code: [dist/commands/make-release.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/make-release.ts)_

## `node-standards release`

release the package (standard-release)

```
USAGE
  $ node-standards release
```

_See code: [dist/commands/release.ts](https://github.com/zefiros-software/node-standards/blob/v0.2.0-beta.50/dist/commands/release.ts)_
<!-- commandsstop -->
