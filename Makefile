dev: node_modules
	yarn dev

prod: public/bundle.js
	env PORT=8080 CLIENT_SECRET=test yarn start

public/bundle.js: node_modules
	yarn build

node_modules:
	yarn
