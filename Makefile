nodemon: node_modules
	env PORT=3000 CLIENT_SECRET=test npm run nodemon

start: node_modules
	env PORT=3000 CLIENT_SECRET=test npm start

node_modules:
		yarn
