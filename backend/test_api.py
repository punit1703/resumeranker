import urllib.request
import sys
try:
    response = urllib.request.urlopen("http://127.0.0.1:8000/api/ats/jobs/")
    print(response.read().decode("utf-8"))
except Exception as e:
    if hasattr(e, "read"):
        print(e.read().decode("utf-8"))
    else:
        print(str(e))
