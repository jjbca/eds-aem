curl -v -X POST https://json2html.adobeaem.workers.dev/config/jjbca/eds-aem/main \
  -H "Content-Type: application/json" \
  -H "Authorization: token eyJhbGciOiJSUzI1NiIsImtpZCI6Ijdzb2k4N3pkb3NJRnc4b19fbVR5a082QlVRNEZBVGhjaHlyNGZqY1dSbWcifQ.eyJlbWFpbCI6ImhlbGl4QGFkb2JlLmNvbSIsIm5hbWUiOiJIZWxpeCBBZG1pbiIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTc3OTIwNzkxNiwiaXNzIjoiaHR0cHM6Ly9hZG1pbi5obHgucGFnZS8iLCJhdWQiOiI4M2EzNjM1NS1hZDE3LTRlZDAtODcwMS1lOTlhMzAyMGY4NmEiLCJzdWIiOiJqamJjYS9lZHMtYWVtIiwiZXhwIjoxODEwNzQzOTE2LCJqdGkiOiIxY3M5a05rNTR2UGg4WDJlK3hlSkRHbktnWWkybDZDNlRySmlWQ0t5b01GcyJ9.w355slILhSMMOSHx9SUvbe1Iw5jH6WainarhGsgjxgqeDNFrRm1smm9BredK3OyKgyIDhZWhivYfC0uEm-qlAP1klTxWJrRAu97k6HLuI_ilDnwFkEy5yAsUGFOHl6CrS6epRtpN2JdlIRFqyuhG_Q7jq_ncnfSCtC6MwPw6R29_PNsn5DxMjz7oNbMSlMr3FLEBPgFwsLelqGIprbggsGiiKXfIFoWRdC7i_Tj2o0QrsLF98MjC3DKxWncaEQh0ziseROEeLGcqxInCkK8yfedKlUtWDGF33nB6PxG_TaXPGXYa_KHXHumPyMRm5aAmaDMYeTSUlzeaHKeOUMqf7w" \
  -d '[
  {
    "path": "/events/list",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/events/events.json",
    "template": "/templates/events-template.html"
  },
  {
    "path": "/events/",
    "endpoint": "https://main--eds-aem--jjbca.aem.page/events/events.json",
    "arrayKey": "data",
    "pathKey": "url",
    "template": "/templates/event-template.html"
  }
]' 
