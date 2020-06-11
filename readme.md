# Running an Apollo GraphQL Server on Fly.io

> Run and cache results from your Apollo GraphQL server on the edge with [Fly](https://fly.io/).

## About

Fly is an edge hosting solution that supports a distributed Redis cache. Apollo is a GraphQL server that
integrates with a variety of data sources and can be run in Node.

This application demonstrates using these three technologies together to serve a GraphQL server on Fly. It
uses the [Open Library API](https://openlibrary.org/developers/api) as a backend to serve two GraphQL endpoints.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [flyctl](https://fly.io/docs/getting-started/installing-flyctl/) command line tool

## Running Locally

- Clone this repo
- Build the Docker image: `docker-compose build`
- Run the Docker image and a Redis instance locally: `docker-compose up`

Visit `localhost:4000` to view the GraphQL playground. 

## Deploying to Fly

- Create a new Fly app: `flyctl apps create -p 4000`
- Deploy the app to Fly: `flyctl deploy`
- Get the Hostname by running `flyctl info`

Visit the host in your browser to view the GraphQL playground.

## Running GraphQL queries

To search books, enter:

```
{
 search(search:"for whom the bell tolls") {
   isbn
   author_name
   contributor
   title
   first_publish_year
 }
}
```

To get a single book by ISBN, enter:

```
{
  book(bib_key:"ISBN:0385472579") {
    bib_key,
    thumbnail_url,
    preview_url,
    info_url
  }
}
```

Learn more about GraphQL playground [in the documentation](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/).
