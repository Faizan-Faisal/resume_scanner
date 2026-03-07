import re
import requests
from app.core.config import DRIVE_API_KEY


def extract_folder_id(url: str) -> str:
    pattern = r"/folders/([a-zA-Z0-9_-]+)"
    match = re.search(pattern, url)
    if not match:
        raise ValueError("Invalid Google Drive folder URL")
    return match.group(1)


def list_files_in_folder(folder_id: str):
    endpoint = "https://www.googleapis.com/drive/v3/files"

    params = {
        "q": f"'{folder_id}' in parents",
        "key": DRIVE_API_KEY,
        "fields": "files(id, name, mimeType)"
    }

    response = requests.get(endpoint, params=params)
    response.raise_for_status()

    return response.json().get("files", [])


def download_file(file_id: str, destination: str):
    url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media&key={DRIVE_API_KEY}"
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(destination, "wb") as f:
        for chunk in response.iter_content(1024):
            f.write(chunk)