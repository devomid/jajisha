from pathlib import Path
from PIL import Image, ImageDraw

SOURCE = Path("docs/readme")
OUTPUT = SOURCE / "rounded"

OUTPUT.mkdir(parents=True, exist_ok=True)

files = [
    "landing home.png",
    "landing homeDark.png",
    "navigation.png",
    "navigationDark.png",
    "routePreview.png",
    "settings.png",
    "settingsDark.png",
    "satelliteMapType.png",
    "toiletInfo first snap.png",
    "toiletInfo second snap.png",
    "toiletInfoDark.png",
    "topSheet menu.png",
    "write comment and rate.png",
    "addWc.png",
    "addWcLocation.png",
    "saved toilets.png",
    "sign up.png",
    "sign in.png",
    "waiting.png",

    "farsi/signin.png",
    "farsi/signup.png",
    "farsi/settings.png",
    "farsi/toiletInfo.png",
    "farsi/addWc.png",
    "farsi/addWc1.png",
    "farsi/routePreview.png",
    "farsi/topSheet.png",
    "farsi/waiting.png",
]

RADIUS = 84

for relative_path in files:
    source = SOURCE / relative_path

    if not source.exists():
        print(f"SKIP: {source}")
        continue

    image = Image.open(source).convert("RGBA")

    width, height = image.size

    radius = min(
        RADIUS,
        width // 2,
        height // 2,
    )

    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)

    draw.rounded_rectangle(
        (0, 0, width - 1, height - 1),
        radius=radius,
        fill=255,
    )

    image.putalpha(mask)

    destination = OUTPUT / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)

    image.save(destination, "PNG", optimize=True)

    print(f"OK: {destination}")

print("\nFinished.")
print(f"Rounded images: {OUTPUT}")
