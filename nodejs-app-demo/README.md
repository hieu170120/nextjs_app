## Installation

```shell
npm install
npm start
```

## Build Docker image

```shell
# build the Docker image with a tag
docker build -t nodejs-app-demo:latest .

# test it locally to make sure it works
docker run -d -p 8080:8080 nodejs-app-demo:latest

# visit http://localhost:8080/todos to verify
```
