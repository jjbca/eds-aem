TOKEN=$(cat .tokens)
curl -v -X POST https://json2html.adobeaem.workers.dev/config/jjbca/eds-aem/main \
  -H "Content-Type: application/json" \
  -H "Authorization: token $TOKEN" \
  -d '[
  {
    "path": "/events/list",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/events-list.json",
    "template": "/templates/events-template.html"
  },
  {
    "path": "/events/",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/events-list.json",
    "arrayKey": "data",
    "pathKey": "url",
    "template": "/templates/event-template.html"
  }
]' 
