install: install-deps install-flow-typed

install-deps:
	npm install

install-flow-typed:
	npm run flow-typed install

start:
	npm run babel-node -- src/bin/numbers.js

publish:
	npm publish

lint:
	npm run eslint .

check-types:
	npm run flow

test:
	npm test

.PHONY: test