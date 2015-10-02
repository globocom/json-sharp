BUMP ?= 'patch'

patch:
	@$(eval BUMP := 'patch')

minor:
	@$(eval BUMP := 'minor')

major:
	@$(eval BUMP := 'major')

release:
	@grunt bump-only:${BUMP}
	@grunt build
	@grunt bump-commit
	@npm publish

setup_npm:
	@npm install --always-auth false --registry http://registry.npmjs.org/

setup: setup_npm

run:
	@grunt server

build:
	@grunt build

test:
	@grunt test
