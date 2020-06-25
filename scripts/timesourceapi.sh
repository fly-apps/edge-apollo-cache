curl 'https://openlibrary.org/api/books?bibkeys=ISBN:0385472579' \
    -o /dev/null -sS \
    -w "Timings\n------\ntotal:   %{time_total}\nconnect: %{time_connect}\ntls:     %{time_appconnect}\n"