# NodeJS Authentication with encrypted JWT

This repo containing the following packages: `express` `jsonwebtoken` `mocha` and `chai`

## How to get started?
- Clone this repo into your local machine
- Run `yarn install`
- Run `yarn dev`
- Let's Rock!

## How to get tested?
- Run `yarn test`
- Optional: you probably test with Postman by import `postman_collection.json` into your Postman app
  - Firstly, you must call `POST Auth` first to get a token stored on project's Variable
  - Then you can call the rest requests with stored token

## How to get dockerize?
- Run `docker build -t hongjsx/nodejs-auth . `
- Run `docker-compose up`

## What to do next?
- Secure secret key
- Interaction with real Database instead of json file
- Add more coverage test cases
- Automate build docker image using Github Action
