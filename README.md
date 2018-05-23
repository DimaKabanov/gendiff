# gendiff

[![Maintainability](https://api.codeclimate.com/v1/badges/e016b7cfa41c3b5b316a/maintainability)](https://codeclimate.com/github/DimaKabanov/project-lvl2-s257/maintainability)
[![Build Status](https://travis-ci.org/DimaKabanov/project-lvl2-s257.svg?branch=master)](https://travis-ci.org/DimaKabanov/project-lvl2-s257)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

Utility to find differences in configuration files.

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

* [.json](https://github.com/DimaKabanov/project-lvl2-s257/tree/master/__tests__/__fixtures__/json)
* [.yaml](https://github.com/DimaKabanov/project-lvl2-s257/tree/master/__tests__/__fixtures__/yaml)
* [.yml](https://github.com/DimaKabanov/project-lvl2-s257/tree/master/__tests__/__fixtures__/yaml)
* [.ini](https://github.com/DimaKabanov/project-lvl2-s257/tree/master/__tests__/__fixtures__/ini)

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

[{"type":"nested","key":"common","depth":1,"children":[{"type":"unchanged","key":"setting1","depth":2,"oldValue":"Value 1"},{"type":"deleted","key":"setting2","depth":2,"oldValue":"200"},{"type":"changed","key":"setting3","depth":2,"oldValue":true,"newValue":{"key":"value"}},{"type":"nested","key":"setting6","depth":2,"children":[{"type":"unchanged","key":"key","depth":3,"oldValue":"value"},{"type":"added","key":"ops","depth":3,"newValue":"vops"}]},{"type":"added","key":"setting4","depth":2,"newValue":"blah blah"},{"type":"added","key":"setting5","depth":2,"newValue":{"key5":"value5"}}]},{"type":"nested","key":"group1","depth":1,"children":[{"type":"changed","key":"baz","depth":2,"oldValue":"bas","newValue":"bars"},{"type":"unchanged","key":"foo","depth":2,"oldValue":"bar"},{"type":"changed","key":"nest","depth":2,"oldValue":{"key":"value"},"newValue":"str"}]},{"type":"deleted","key":"group2","depth":1,"oldValue":{"abc":"12345"}},{"type":"added","key":"group3","depth":1,"newValue":{"fee":"100500"}}]
```