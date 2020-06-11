# Running an Apollo GraphQL Server on Fly.io

> Run and cache results from your Apollo GraphQL server on the edge with [Fly](https://fly.io/).

## About

Fly is an edge hosting solution that supports a distributed Redis cache. Apollo is a GraphQL server that
integrates with a variety of data sources and can be run in Node.

This application demonstrates using these three technologies together to serve a GraphQL server on Fly.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [flyctl](https://fly.io/docs/getting-started/installing-flyctl/) command line tool

## Running Locally

- Clone this repo: `git ...`
- Build the Docker image: `docker-compose build`
- Run the Docker image and a Redis instance locally: `docker-compose up`

Visit `localhost:4000` to view the GraphQL playground. 

## Deploying to Fly

- Create a new Fly app: `flyctl apps create -p 4000`
- Deploy the app to Fly: `flyctl deploy`
- Get the Hostname by running `flyctl info`

Visit the host in your browser to view the GraphQL playground.

## Running GraphQL queries

To view all the records, enter:

```
{
  books {
    title,
    author
  }
}
```

You should see a results object on the right half of your screen:

![Serving GraphQL on Fly with Apollo](https://i.imgur.com/yBsCHNf.png)

Learn more about GraphQL playground [in the documentation](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/).
