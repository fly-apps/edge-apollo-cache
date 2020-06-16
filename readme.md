# Running an Apollo GraphQL Server on Fly.io

> Run Apollo Server + Caching close to users with [Fly](https://fly.io/).

## About

Fly runs tiny virtual machines close to your users, and includes a global Redis cache. Apollo is a GraphQL server that
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

On uncached requests, Fly.io must connect to the Open Library API, but subsequent requests will load data from the regional Fly cache.

## Deploying to Fly

- Install [flyctl](https://fly.io/docs/getting-started/installing-flyctl/)
- Login to Fly: `flyctl auth login`
- Create a new Fly app: `flyctl apps create`
- Deploy the app to Fly: `flyctl deploy`

Once deployed, you can launch the playground using `flyctl open`.

## Running Locally

You can run the example app locally with [Docker](https://www.docker.com/get-started).

- Clone this repo
- Build the Docker image: `docker-compose build`
- Run the Docker image and a Redis instance locally: `docker-compose up`

Visit `http://localhost:8080` to view the GraphQL playground.

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
