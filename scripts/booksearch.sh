curl "https://$APPNAME.fly.dev/" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"operationName":null,"variables":{},"query":"{ search(search:\"for whom the bell tolls\") { isbn author_name contributor title first_publish_year } }" }'
 