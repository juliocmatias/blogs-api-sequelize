# 🌎 Welcome to the Blog API Repository

***This is an API with a database for producing blog content.***

## ℹ️ Summary
  
***This application was developed in the back-end module by [Trybe](https://www.betrybe.com/). Being developed in Node.js using Sequelize ORM for CRUD operations on posts, following the principles of a RESTful API with layered architecture, in addition to authentication via endpoints using Bearer Token with encryption using JWT.***

## 🚀 Technology Used

[![Technology](https://skillicons.dev/icons?i=docker,nodejs,mysql,express,js,sequelize)](https://skillicons.dev)

## 💻 Opening API

- copy the repository to a local folder using the terminal and passing the command:
  ```bash
  git clone git@github.com:juliomatiastrybe/blogs-api-sequelize.git
  ```

  If you don't have git installed, you can install it using this command in the shell and bash terminal:

  Debian/Ubuntu bash:
  ```bash
  apt-get install git
  ```

  other kernel follow the instructions on the website [Git](https://git-scm.com/download/linux).

  windows/powershell:
  ```shell
  winget install --id Git.Git -e --source winget
  ```

  Or you can follow the website [git](https://git-scm.com/downloads) documentation for more installation means.

> ## 🔍️ navigate to the folder created in the clone, and open the terminal.

- install the dependencies:
  ```bash
  npm install
  ```
  > This method of installing pending issues only works if the node installation package is npm, if you use another one, just switch to npm for the package used

  you need to have node installed to be able to install the dependency packages
  If you don't have it, you can run the command if your operating system is Linux:
  ```bash
  sudo apt update sudo apt install nodejs sudo apt install npm
  ```

  If not, follow the installation instructions on the [Node.js](https://nodejs.org/en/download) website.

>*:warning: For the application to run correctly, the node version must be >= 16.*
>
>*:warning: It's also important to remember that to run an API using Docker, you'll need to have it installed and configured on your machine. Consult the documentation to learn more about [Docker](https://docs.docker.com/get-docker/). In addition to having docker-compose installed and configured on your computer. To install for your operating system version click here [Docker Compose](https://docs.docker.com/compose/install/).*

<details> 
  <summary><strong>🐋 Docker</strong></summary>

>*:warning: Before you begin, your docker-compose needs to be at version 1.29 or higher. [See here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-pt) or [in the documentation](https://docs.docker.com/compose/install/) how to install it. In the first article, you can replace where it is with `1.26.0` with `1.29.2`.*
>
>*:warning: It's important to note that the containers will run on port 3001 for the API and 3306 for the MySQL database. Therefore, if you're using them, make sure to first terminate any apps or processes that utilize these ports.*


- For the API to start working, you first have to run docker-compose:

  ```bash
  npm run app:start
  ```

- When executing this command, wait for the API to become functional. checking through the blogs_api container log with the command:

  ```bash
  npm run app:log
  ```

  >When typing this command, a log should appear in the terminal with the same information as in the image below. Showing that the API is operational.

  ![STARTED_API](./public/started_api.png)

- To take advantage of default seeds you can run the command below, after the API is operational.

  ```bash
  npm run app:seed
  ```

  > INFO: After this command, the API will be pre-populated and ready to receive requests

- If you need to reset the API, run the command:

  ```bash
  npm run app:reset
  ```

- To stop the API, run the command:

  ```bash
  npm run app:stop
  ```

</details>

<details>
  <summary><strong>💻 Terminal</strong></summary>

*After cloning and accessing the project directory. Install dependencies with `npm install` if you have not already installed dependencies.*

- Run in the terminal:

  ```bash
  npm run app:start
  ```

  >*For the node API to be correctly configured in the terminal, environment variables must be configured. There is already a file with example environment variables, `.env.exemple`, to use it just remove `.exemple`. With this configuration you will be able to run the API locally through the terminal.*

- And stop the API container with:
    ```bash
    npm run app:terminal
    ```
- To seed the database with default data, run the command:
    ```bash
    env $(cat .env) npm run app:seed
    ```
*With these commands the API is functional via the terminal.*

- To reset the API, run the command:
    ```bash
    env $(cat .env) npm run app:reset
    ```

- To stop the API in terminal, press `Ctrl + C` or case macOS `Cmd + C`.

  
</details>

## 📚 API Documentation

<details>
  <summary><strong>📕 Swagger</strong></summary>

  
- *To access the API documentation, you can use Swagger. Swagger is a powerful tool that allows you to visualize and interact with APIs. It provides a user-friendly interface where you can explore the available endpoints, view request and response examples, and even test the API directly from the documentation.*

  <strong>To use the Swagger documentation for this API, follow these steps:</strong>

  >1. Start the API server by uploading the containers with `npm run app:start && npm run app:seed` in the terminal.
  >
  >2. Open your web browser and navigate to http://localhost:3001/api-doc/.
  >
  >3. You will see the Swagger UI interface, which displays all the available endpoints and their details.
  >
  >4. Explore the different endpoints, request parameters, and response schemas to understand how to interact with the API.
  >
  >5. You can also try out the API directly from the documentation by clicking on the "Try it out" button and providing the required input data.
  >
  >6. Swagger will generate the request URL and show the response data, making it easy to test and validate the API's functionality.

  Using Swagger documentation is a great way to understand and utilize the features of this API. It provides a comprehensive overview of the available endpoints and their functionalities, making it easier for developers to integrate and work with the API.

</details>

## 🧪 Tests

<details>
  <summary><strong>See about</strong></summary>

- *The API has integration testing coverage using mocha, with chaiHttp to request the API and sinon to simulate returns. If you want to see, just run the command:*

  ```bash
  npm run test:mocha
  ```
  >:warning:*Before running the tests, make sure to use valid environment variables in the `.env` file. Remove the `.exemple` extension from the file and fill the variables with the correct values. Or use example variables in the `.env.exemple` file.*

  *It is also possible to see test coverage using the command:*

  ```bash
  npm run test:coverage
  ```

</details>

## 👊 Authors and acknowledgment

*This project was followed by requirements pre-established by [Trybe](https://www.betrybe.com/), only the implementations are my own.*

## 🔒️ License ©️

[ISC](https://choosealicense.com/licenses/isc/)
