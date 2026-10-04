import requests

login_data = {"email": "test@example.com", "password": "password"}
r = requests.post("http://localhost:8000/auth/login", json=login_data)
print(r.status_code, r.text)

cookies = r.cookies
r2 = requests.get("http://localhost:8000/auth/me", cookies=cookies)
print(r2.status_code, r2.text)
