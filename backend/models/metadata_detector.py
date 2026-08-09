import os
import hashlib


def detect_metadata(path):

    size = os.path.getsize(path)

    sha = hashlib.sha256()

    with open(path, "rb") as f:

        while True:

            chunk = f.read(4096)

            if not chunk:
                break

            sha.update(chunk)

    score = 95

    return {

        "metadata_score": score,

        "sha256": sha.hexdigest(),

        "file_size": size

    }