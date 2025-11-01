curl -X PUT "http://localhost:5000/api/set-user-news-read" \
  -H "Content-Type: application/json" \
  -d '{"id_user":12,"all_readed": true}'