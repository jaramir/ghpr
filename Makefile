nodemon: node_modules public/bundle.js
	env PORT=3000 CLIENT_SECRET=test npm run nodemon

public/bundle.js: node_modules
	npm run webpack

node_modules:
	yarn
