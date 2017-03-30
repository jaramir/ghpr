run: node_modules public/bundle.js
	env PORT=3000 CLIENT_SECRET=test yarn run run

public/bundle.js: node_modules
	yarn build

node_modules:
	yarn
