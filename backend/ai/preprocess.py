from PIL import Image


def load_image(path):

    image = Image.open(path)

    image = image.convert("RGB")

    return image