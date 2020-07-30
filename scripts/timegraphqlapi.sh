curl "https://$APPNAME.fly.dev/" \
  -o /dev/null -sS \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"operationName":null,"variables":{},"query":"{ book(bib_key: \"ISBN:0385472579\") {\n    bib_key\n    thumbnail_url\n    preview_url\n    info_url\n  }\n}\n"}' \
  -w "Timings\n------\ntotal:   %{time_total}\nconnect: %{time_connect}\ntls:     %{time_appconnect}\n"
