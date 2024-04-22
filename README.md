# API

## Getting started
To get started with this project, clone the project and then run this command to install all dependencies
```bash
npm install
```

## Docker
Run docker using this command
```bash
npm run docker:up
```

## Development
To start the development server
```bash
npm run dev
```

## Environment Variables
Rename `.env.example` to `.env`\
Don't forget to configure your port and put the api keys
```
PORT=8080
SECRET_JWT_KEY=yoursupersecretkey
WEATHER_API_KEY="yourweatherapikey"
```
You can get your weather api key here https://www.weatherapi.com/
