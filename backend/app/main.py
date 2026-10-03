from fastapi import FastAPI

app = FastAPI(title="SupportPilot API")


@app.get("/health")
def health_check():
    return {"status": "ok"}