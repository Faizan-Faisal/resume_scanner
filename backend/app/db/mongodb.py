# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv
# from app.core.logging import logger

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")

# try:
#     client = MongoClient(MONGO_URI)
#     db = client["resume_saas"]
#         # Define collections here
#     jobs_collection = db["jobs"]
#     resumes_collection = db["resumes"]
#     logger.info(f"Connected to MongoDB at {MONGO_URI}")
# except Exception as e:
#     logger.error(f"MongoDB connection failed: {str(e)}")
#     raise e


from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from app.core.logging import logger

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["resume_saas"]

    # Define collections
    jobs_collection = db["jobs"]
    resumes_collection = db["resumes"]
    users_collection = db["users"]

    logger.info(f"Connected to MongoDB at {MONGO_URI}")

except Exception as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise e