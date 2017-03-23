build:
	docker build -t jaramir/spoke .

run:
	docker run -it -p 3000:3000 jaramir/spoke

publish:
	docker push jaramir/spoke

run-local:
	npm start
