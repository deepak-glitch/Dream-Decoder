from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_interpret():
    res = client.post("/interpret", json={"dream_text": "I was lost in a forest."})
    assert res.status_code == 200
    assert res.json().get("error") is None

def test_poem():
    res = client.post("/poem", json={"dream_text": "I was flying through the stars."})
    assert res.status_code == 200
    assert "poem" in res.json()

def test_combined_analysis():
    res = client.post("/analyze", json={"dream_text": "I saw myself underwater."})
    data = res.json()
    assert res.status_code == 200
    assert "interpretation" in data
    assert "poem" in data
    assert "image" in data
