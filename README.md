# book-app-backend

<img src="https://img.icons8.com/color/48/000000/javascript--v1.png"
     alt="Markdown Javascript icon"
     height="50px"
/>&nbsp;&nbsp;&nbsp;

### Introduction

## Usage

The app requires an `.env` file with the following variables:

```
APP_DB=<mongodb_url>
APP_SECRET=<secret_key>
APP_PORT=<port>
```

### Requirements

NodeJS installed on your system (12 or higher) -\*\* [NodeJS](https://nodejs.org)

### Usage

Install node_modules:

```
npm install
```

To execute app, run:

```
npm run dev
```

### Using Docker

To build and run Docker containers use the following command:

```
docker-compose up --build --remove-orphans
```
