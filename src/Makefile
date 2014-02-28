build:

	# putting all js dev files into one big file in the release directory
	@cat \
		js/intro.js \
		js/utils.js \
		js/config.js \
		js/panel.js \
		js/breadcrumb.js \
		js/spin.js \
		js/outro.js >../build/spin/spin.js

	# putting all css dev files into one big file in the release directory
	@cat css/combo.css css/spin.css >../build/spin/spin.css

	# adding code coverage support
	@istanbul instrument ../build/spin/spin.js >../build/spin/spin-coverage.js

	# moving all assets into the release directory
	@cp assets/* ../build/spin/