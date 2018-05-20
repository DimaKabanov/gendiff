# difference calculator

[![Maintainability](https://api.codeclimate.com/v1/badges/e016b7cfa41c3b5b316a/maintainability)](https://codeclimate.com/github/DimaKabanov/project-lvl2-s257/maintainability)
[![Build Status](https://travis-ci.org/DimaKabanov/project-lvl2-s257.svg?branch=master)](https://travis-ci.org/DimaKabanov/project-lvl2-s257)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

## Install

```console
npm install -g dk-gendiff
```

## Setup

```console
make install
```

## Test

```console
make test
```

## Supported format

* .json
* .yaml
* .yml
* .ini

## Report generation


- [pretty](#pretty) (by default)
- [plain](#plain)
- [json](#json)

## Usage example

**<a name="pretty"></a>pretty**
```console
$ gendiff first-config.json second-config.json

{
    common: {
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
        setting6: {
            key: value
          + ops: vops
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      - baz: bas
      + baz: bars
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
}
```

**<a name="plain"></a>plain**
```console
$ gendiff --format plain first-config.json second-config.json

Property 'common.setting2' was removed
Property 'common.setting6.ops' was added with 'vops'
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated from 'bas' to 'bars'
Property 'group1.nest' was updated from complex value to 'str'
Property 'group2' was removed
Property 'group3' was added with complex value
```

**<a name="json"></a>json**
```console
$ gendiff --format json first-config.ini second-config.ini

[{"type":"unchanged","key":"host","depth":1,"oldValue":"hexlet.io"},{"type":"changed","key":"timeout","depth":1,"oldValue":50,"newValue":20},{"type":"deleted","key":"proxy","depth":1,"oldValue":"123.234.53.22"},{"type":"added","key":"verbose","depth":1,"newValue":true}]
```