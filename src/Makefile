all: buildjs buildcss copyassets coverage

# combine all javascript files into one.
buildjs:
	@cat \
		js/intro.js \
		js/utils.js \
		js/config.js \
		js/panel.js \
		js/breadcrumb.js \
		js/spin.js \
		js/outro.js >../build/spin/spin.js

# combine all css files into one.
buildcss:
	@cat \
		css/combo.css \
		css/spin.css \
		css/animation.css >../build/spin/spin.css

# copy all assets into the release directory
copyassets:
	@cp assets/* ../build/spin/

# adding code coverage support
coverage:
	@istanbul instrument ../build/spin/spin.js >../build/spin/spin-coverage.js

# run unit tests
test: buildjs buildcss copyassets
	@grover tests/unit/testrunner.html

.PHONY: all buildjs buildcss copyassets coverage test