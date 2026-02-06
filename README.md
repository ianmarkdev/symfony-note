
### Requirements
To run this project you will need:
* Docker: >24
* Docker Compose: >1.29
* NodeJS: >18
* PHP: >7.4

### First steps:

    $ cp .env.dist .env
    $ composer install
    $ yarn install
    $ docker-compose up -d
    $ yarn watch

After running this set of commands, without errors; you should be able to open `http://localhost:81/` and see `Hello World!!!` in the middle of the page.