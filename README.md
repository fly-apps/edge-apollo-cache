# Edge GraphQL with Apollo Server and Fly.io

> Run Apollo Server + Caching close to users with [Fly](https://fly.io/).

## Overview

<!---- cut here --->

This application demonstrates how to use Fly, Redis and Apollo to enable rapid GraphQL queries from a variety of data sources. 

Fly runs tiny virtual machines close to your users, and includes a global Redis cache. Apollo is a GraphQL server that integrates with a variety of data sources and can be run in Node. This application combines these three technologies to create a GraphQL server on Fly. 

It uses the [Open Library API](https://openlibrary.org/developers/api) as a backend source to serve two GraphQL endpoints, and caches responses in Fly's Redis instance.

## Deploying to Fly

- Install [flyctl](https://fly.io/docs/getting-started/installing-flyctl/)
- Login to Fly: `flyctl auth login`
- Create a new Fly app: `flyctl apps create`
- Deploy the app to Fly: `flyctl deploy`

Once deployed, you can launch the GraphQL Playground by running `flyctl open`.

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

If you prefer to use to command line, there's two scripts, [`scripts/bookfind.sh`](https://github.com/fly-examples/edge-apollo-cache/blob/master/scripts/bookfind.sh) and [`scripts/booksearch.sh`](https://github.com/fly-examples/edge-apollo-cache/blob/master/scripts/booksearch.sh) you can use. Set the environment variable APPNAME to your applications name- you can find the application name with `flyctl info`. 

## What Happens Inside The Application

There are a number of parts of the server which are mostly defining the configuration of the packages used. `apollo-server` handles the web interactions, `apollo-server-cache-redis` is a component for that server which manages Redis as a general purpose cache and `apollo-server-plugin-response-cache` uses that cache for the particular job of caching responses from API requests.

When a query arrives at the ApolloServer, it is filtered through the GraphQL types definition `typeDefs` and then matched with resolvers defined in `resolvers`. Both define the endpoints in terms of GraphQL types - for parsing the query - and in terms of datasources where the query can be resolved.

In this case there are two queries, book and search. The resolvers definition maps each of these to the same RESTDataSource which is configured in books-api.js. It's there that the connection to the openlibrary.org REST API is defined. 

Once the REST query has been fulfilled, the server will return the results as JSON to the client that made the query. And in the background if its been configured to cache that result, it'll cache that response. Needless to say, it will also check on incoming queries to see if it already has a cached result to return.

In `index.js`, after the definition of the `typeDefs` and `resolvers`, the application has code to create the RedisCache, either locally or using Fly's global Redis service. Environment variables with a connection string to the server determine which.

Finally an ApolloServer is created, is given all the configured items, the `typedefs`, `resolvers`, a list of datasources, a cache with parameters and the `responseCachePlugin` and the server is set off listening for incoming requests. 

If you are wondering where the GraphQL Playground comes from in this, that's an integrated part of the Apollo Server. 

## How Does Fly Fit Into This?

Traditionally, an application like this would run somewhere in the cloud and usually distant from its users thanks to geography. The biggest problem then is the latency of the connection between the user and the application.

As we previously mentioned, Fly runs tiny virtual machines close to users in datacenters around the world. Some of these machines handle connections, terminating TLS as close to the user as possible. As TLS needs a couple of connections to get going, thats a big boost, especially with an API. The connection handlers then pass the connection on to the application itself.

Applications are also run all over the world and Fly lets you put your applications in the most appropriate regions for your task. An edge cache like this could be located in the locations where you are finding the most traffic. When there is no immediatly local application, Fly automatically finds the closest place the application is running and directs connections to that place. 

Edge hosting (and Fly specifically) offers significant performance benefits over traditional centralized hosting. Because requests can be served from the node closest to the user, responses will be much faster. This example uses Redis to cache responses so after the first request is made to a region, duplicate requests in the next hour will be significantly faster.


## Testing latency with cURL

If you're running on MacOS or Linux, you likely already have the cURL command line tool installed. cURL can print timing data for requests, here are examples that show total request time, TCP connect time, and TLS handshake time.

#### GraphQL cURL request

See [`scripts/timegraphqlapi.sh`](https://github.com/fly-examples/edge-apollo-cache/blob/master/scripts/timegraphqlapi.sh)

```curl
curl 'https://<appname>.fly.dev/' \
  -o /dev/null -sS \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"operationName":null,"variables":{},"query":"{ book(bib_key: \"ISBN:0385472579\") {\n    bib_key\n    thumbnail_url\n    preview_url\n    info_url\n  }\n}\n"}' \
  -w "Timings\n------\ntotal:   %{time_total}\nconnect: %{time_connect}\ntls:     %{time_appconnect}\n"
```

#### Source API cURL request

See [`scripts/timesourceapi.sh`](https://github.com/fly-examples/edge-apollo-cache/blob/master/scripts/timesourceapi.sh)

```curl
curl 'https://openlibrary.org/api/books?bibkeys=ISBN:0385472579' \
    -o /dev/null -sS \
    -w "Timings\n------\ntotal:   %{time_total}\nconnect: %{time_connect}\ntls:     %{time_appconnect}\n"
```

## Latency Results

Here are some sample response times using this app hosted on Fly vs. making requests to the Open Library API directly:

| Request Method    | Test 1 | Test 2 | Test 3 |
|-------------------|--------|--------|--------|
| [Open Library API](#source-api-curl-request)  | 2.06s  | 1.70s  | 1.24s  |
| [Fly.io (uncached)](#graphql-curl-request) | 1.01s  | 1.03s  | 2.27s  |
| [Fly.io (cached)](#graphql-curl-request)   | 0.13s  | 0.11s  | 0.09s  |

On uncached requests, Fly.io must connect to the Open Library API, but subsequent requests will load data from the regional Fly cache. You can try these tests locally using [cURL](#testing-latency-with-curl)
