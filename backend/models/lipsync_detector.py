import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh


def detect_lipsync(video_path):

    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True
    )

    cap = cv2.VideoCapture(video_path)

    mouth_movements = []

    total_frames = 0

    while True:

        success, frame = cap.read()

        if not success:
            break

        total_frames += 1

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        result = face_mesh.process(rgb)

        if result.multi_face_landmarks:

            landmarks = result.multi_face_landmarks[0].landmark

            upper = landmarks[13]
            lower = landmarks[14]

            distance = np.sqrt(
                (upper.x - lower.x) ** 2 +
                (upper.y - lower.y) ** 2
            )

            mouth_movements.append(distance)

    cap.release()

    if len(mouth_movements) == 0:

        return {

            "lipsync_score": 0,

            "frames_analyzed": total_frames,

            "mouth_motion": 0,

            "details": "No face detected."

        }

    variation = np.std(mouth_movements)

    score = min(100, variation * 5000)

    return {

        "lipsync_score": round(score, 2),

        "frames_analyzed": total_frames,

        "mouth_motion": round(float(variation), 5),

        "details": "MediaPipe mouth motion analysis"

    }