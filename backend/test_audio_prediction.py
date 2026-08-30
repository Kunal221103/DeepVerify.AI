from ai.audio.inference import predict


AUDIO = "uploads/movie_audio.wav"


print()
print("=" * 50)
print("AUDIO SEGMENT DIAGNOSTIC")
print("=" * 50)

result = predict(AUDIO)

print()
print("Overall Result")
print("-" * 50)

print(
    "Real:",
    result["real_probability"],
    "%"
)

print(
    "Fake:",
    result["fake_probability"],
    "%"
)

print(
    "Segments:",
    result["segments_analyzed"]
)

print()
print("Segment Results")
print("-" * 50)


for index, segment in enumerate(
    result["segment_predictions"],
    start=1
):

    print(
        f"Segment {index:02d}: "
        f"real={segment['real_probability']:6.2f}% "
        f"fake={segment['fake_probability']:6.2f}%"
    )


print()
print("=" * 50)