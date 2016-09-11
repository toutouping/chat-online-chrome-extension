develop:
	node_modules/gulp/bin/gulp.js develop

crx:
	npm install
	node_modules/gulp/bin/gulp.js build
	google-chrome --pack-extension=dest --pack-extension-key=chat.pem
	mv dest.crx chat.crx
