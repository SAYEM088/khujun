# nodefind.py
import pandas as pd
from geopy.distance import geodesic

dset = pd.read_csv("../dataset/dhaka_division.csv")

def find_closest_pois(user_lat, user_lon, type_filter, top_n):
    results = []

    for _, row in dset.iterrows():
        if pd.isna(row["type"]):  
            continue

        if row["type"].lower() != type_filter.lower():
            continue

        distance = geodesic((user_lat, user_lon), (row["lat"], row["lon"])).km

        results.append({
            "name": row["name"] if pd.notna(row["name"]) else "Unknown",
            "category": row.get("category", ""),
            "type": row["type"],
            "lat": row["lat"],
            "lon": row["lon"],
            "distance_km": round(distance, 2)
        })

    return sorted(results, key=lambda x: x["distance_km"])[:top_n]
