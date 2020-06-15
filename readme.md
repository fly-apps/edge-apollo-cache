# Running an Apollo GraphQL Server on Fly.io

> Run and cache results from your Apollo GraphQL server on the edge with [Fly](https://fly.io/).

## About

Fly is an edge hosting solution that supports a distributed Redis cache. Apollo is a GraphQL server that
integrates with a variety of data sources and can be run in Node.

This application demonstrates using these three technologies together to serve a GraphQL server on Fly. It
uses the [Open Library API](https://openlibrary.org/developers/api) as a backend to serve two GraphQL endpoints, and
caches responses in Fly's Redis instance.

## Why Fly?

Edge hosting (and Fly specifically) offers significant performance benefits over traditional centralized hosting.
Because requests can be served from the node closest to the user, responses will be much faster. This demo uses 
Redis to cache responses so after the first request is made to a region, duplicate requests in the next hour 
will be significantly faster.

To illustrate this, here are some sample response times using this app hosted on Fly vs. making requests to the 
Open Library API directly:

| Request Method    | Test 1 | Test 2 | Test 3 |
|-------------------|--------|--------|--------|
| Open Library API  | 2.06s  | 1.70s  | 1.24s  |
| Fly.io (uncached) | 1.01s  | 1.03s  | 2.27s  |
| Fly.io (cached)   | 0.13s  | 0.11s  | 0.09s  |

On uncached requests, Fly.io must connect to the Open Library API, but subsequent cached request are an order of 
magnitude faster.

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
