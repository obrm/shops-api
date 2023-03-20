# SHPOS API

This repository contains the source code for the SHPOS API. It's built using Node.js, Express.js, and MongoDB.

## Getting Started

To get started with this project, clone the repository:

```bash
git clone https://github.com/obrm/shpos-api.git
```

## Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

## Installation
After cloning the repository, run the following command to install the required dependencies:

```bash
npm install
```

## Local Environment Variables
In order to run the project locally, you'll need to set some environment variables. Create a `config` folder in the root directory of the project, and add a file named `config.env` with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=<Your MongoDB URI>
```

Make sure to replace `<Your MongoDB URI>` with the actual URI for your MongoDB instance.

## Running the Project
To start the server in development mode with nodemon, run the following command:

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`.

## License
This project is licensed under the MIT License.