import os
import json

video_dir = "/home/jules/verification/videos"
videos = [os.path.join(video_dir, f) for f in os.listdir(video_dir) if f.endswith('.webm')]
print(json.dumps(videos))
