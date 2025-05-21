from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "/interpret" in data["available_endpoints"]
    assert "/poem" in data["available_endpoints"]

def test_interpret():
    res = client.post("/interpret", json={"dream_text": "I was lost in a forest."})
    assert res.status_code == 200
    assert isinstance(res.json(), str)

def test_poem():
    res = client.post("/poem", json={"dream_text": "I was flying through the stars."})
    assert res.status_code == 200
    assert isinstance(res.json(), str)
