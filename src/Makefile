build:
	@cat \
		js/intro.js \
		js/utils.js \
		js/config.js \
		js/panel.js \
		js/breadcrumb.js \
		js/spin.js \
		js/outro.js >../build/spin/spin.js
	@cat css/combo.css css/spin.css >../build/spin/spin.css
	@istanbul instrument ../build/spin/spin.js >../build/spin/spin-coverage.js
	@cp assets/* ../build/spin/