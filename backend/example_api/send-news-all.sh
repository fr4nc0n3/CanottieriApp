curl -X POST http://localhost:5000/api/send-news-to-groups \
  -H "Content-Type: application/json" \
  -d '{"id-user":1,"groups":["all"],"message":"ciao","title":"title"}'

