
# Binaries.
bin = ./node_modules/.bin
babel = $(bin)/babel
browserify = $(bin)/browserify
eslint = $(bin)/eslint
http-server = $(bin)/http-server
watchify = $(bin)/watchify

# Opts.
babel_opts =
browserify_opts = --debug --transform babelify
eslint_opts = --ignore-pattern "build.js" --ignore-pattern "mocha.js"

# Run all of the checks.
check: lint test

# Remove the generated files.
clean:
	@ rm -rf ./dist ./node_modules

# Build the source.
dist:
	$(babel) ./src $(babel_opts) --out-dir ./dist

# Build the example.
example:
	@ $(browserify) ./example/index.js $(browserify_opts) --outfile ./example/build.js

# Install the dependencies.
install:
	@ npm install

# Lint the source files.
lint:
	@ $(eslint) "{example,lib,test}/**/*.js" $(eslint_opts)

# Start the example server.
start:
	@ $(http-server) ./example

# Watch the source.
watch-dist:
	@ $(MAKE) dist babel_opts="$(babel_opts) --watch"

# Watch the example.
watch-example:
	@ $(MAKE) example browserify="$(watchify)"

# Phony targets.
.PHONY: dist
.PHONY: example
