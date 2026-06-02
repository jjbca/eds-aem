TOKEN=$(cat .tokens)
curl -v -X POST https://json2html.adobeaem.workers.dev/config/jjbca/eds-aem/main \
  -H "Content-Type: application/json" \
  -H "Authorization: token $TOKEN" \
  -d '[
  {
    "path": "/events/list",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/coming-events.json",
    "template": "/templates/events-template.html"
  },
  {
    "path": "/events/",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/coming-events.json",
    "arrayKey": "data",
    "pathKey": "url",
    "template": "/templates/event-template.html"
  },
  {
    "path": "/blog/",
    "endpoint": "https://author-p178261-e1872848.adobeaemcloud.com/api/assets/jca-eds-aem/blog-posts/{{id}}.json",
    "regex": "/(?<=\\/blog\\/)(.+)$/",
    "template": "/cf-templates/blog-post.html",
    "relativeURLPrefix": "https://publish-p178261-e1872848.adobeaemcloud.com", 
"headers": {           
      "Accept": "application/json"
    },
    "forwardHeaders":[
        "Authorization"
    ]
  }
]' 
