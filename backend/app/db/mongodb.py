from pymongo import MongoClient
import os
from dotenv import load_dotenv
from app.core.logging import logger

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI)
    db = client["resume_saas"]
    logger.info(f"Connected to MongoDB at {MONGO_URI}")
except Exception as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise e