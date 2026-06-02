TOKEN=$(cat .tokens)
curl -v -X GET https://json2html.adobeaem.workers.dev/config/jjbca/eds-aem/main \
  -H "Content-Type: application/json" \
  -H "Authorization: token $TOKEN" 
