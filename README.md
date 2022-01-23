# book-app-backend

<img src="https://img.icons8.com/fluency/50/000000/node-js.png"/></span>
&nbsp;&nbsp;&nbsp;
<img src="https://img.icons8.com/color/48/000000/javascript--v1.png"
/>&nbsp;&nbsp;&nbsp;
<img src="https://img.icons8.com/color/50/000000/mongodb.png"/></span>
&nbsp;&nbsp;&nbsp;
<img src="https://img.icons8.com/fluency/48/000000/docker.png"/></span>
&nbsp;&nbsp;&nbsp;

### Introduction

This is backend server app for book web application

## Usage

The app requires an `.env` file with the following variables:

```
APP_DB=<mongodb_url>
APP_SECRET=<secret_key>
APP_PORT=<port>
```

### Requirements

NodeJS installed on your system (14 or higher) -\*\* [NodeJS](https://nodejs.org)

### Usage

Install node_modules:

```
npm install
```

To execute app, run:

```
npm run dev

```

To run tests:

```
npm run test

```

### Using Docker

To build Docker container use the following command:

```

docker build -t book-app-backend .

```

To run Docker container use the following command:

```

docker run -p 1337:1337 book-app-backend

```
