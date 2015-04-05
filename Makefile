KARMA=./node_modules/karma/bin/karma

test:
	$(KARMA) start karma.conf.js

.PHONY: test
