curl "https://$APPNAME.fly.dev/" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"operationName":null,"variables":{},"query":"{ book(bib_key: \"ISBN:0385472579\") { bib_key thumbnail_url preview_url info_url } }"}'
