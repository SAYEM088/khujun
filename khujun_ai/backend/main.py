# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from nodefind import find_closest_pois
from llmapi import generate_summaries

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class RequestModel(BaseModel):
    latitude: float
    longitude: float
    poi_type: str       
    count: int = 5     
    device: str = "cpu" 
@app.post("/search")
def search_pois(req: RequestModel):

    pois = find_closest_pois(
        user_lat=req.latitude,
        user_lon=req.longitude,
        type_filter=req.poi_type,
        top_n=req.count
    )

    if not pois:
        return {"count": 0, "pois": []}

    pois = generate_summaries(pois)

    return {
        "count": len(pois),
        "pois": pois
    }
