import cv2
from insightface.app import FaceAnalysis

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1)

def extract_faces(image_path):
    image = cv2.imread(image_path)

    faces = app.get(image)

    crops = []

    for face in faces:

        x1, y1, x2, y2 = map(int, face.bbox)

        crop = image[y1:y2, x1:x2]

        crops.append(crop)

    return crops