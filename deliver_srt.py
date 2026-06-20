import json

caps = json.load(open("/home/anon/videogen/captions.json", encoding="utf-8"))


def ts(s):
    h = int(s // 3600)
    m = int(s % 3600 // 60)
    sec = int(s % 60)
    ms = int(round((s - int(s)) * 1000))
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"


with open("/home/anon/videogen/out/master_xtts.srt", "w", encoding="utf-8") as f:
    for i, c in enumerate(caps, 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n\n")

print("srt OK:", len(caps), "lignes")
