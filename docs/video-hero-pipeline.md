# Video hero pipeline — how the Board & Train hero was made (and how to reuse it)

This documents the raw-footage → website-hero workflow used on 2026-06-18 to build
`public/media/board-train-hero.mp4`, so it can be re-run for any future page hero or clip.

## The tool: FFmpeg

- **Engine:** FFmpeg — the open-source video swiss-army knife. Project / source repo:
  **https://github.com/FFmpeg/FFmpeg** · docs & filter reference: **https://ffmpeg.org/ffmpeg-filters.html**
- **We did NOT clone or compile FFmpeg.** We used the **prebuilt binary that ships with this repo**
  via the `ffmpeg-static` npm package (already a devDependency):
  - **`node_modules/ffmpeg-static/ffmpeg.exe`** (a full gyan.dev build — includes `zscale`,
    `tonemap`, `vidstab*`, `xfade`, `unsharp`, `minterpolate`).
  - ⚠️ There is **no `ffprobe`** in `ffmpeg-static`. To inspect a file use `ffmpeg -i <file>`
    (stream info prints to stderr).
- So to "use the repo again" you don't need GitHub at all — the working tool is already installed.
  (Clone the GitHub repo only if you ever want to build FFmpeg from source, which we never need.)

## The footage gotcha that matters most

The owner's iPhone clips are **HEVC 10-bit, HLG HDR (BT.2020 / arib-std-b67), 1080p30, Cinematic
mode**, most carrying a `-180°` rotation flag. Two consequences:

1. **You MUST tonemap HLG→SDR (BT.709)** or the web video looks washed-out / grey. Recipe below.
2. FFmpeg **autorotate is on by default**, so the `-180°` clips come out upright automatically — do
   **not** pass `-noautorotate`.

## Reusable recipe (Git Bash on Windows)

```bash
FF="node_modules/ffmpeg-static/ffmpeg.exe"

# HLG-HDR -> SDR BT.709 tonemap (REQUIRED for these iPhone clips)
TM="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"

# Warm "countryside-editorial" grade (contrast + selective warmth + gentle vignette)
GA="eq=contrast=1.06:saturation=1.12:gamma=0.99,colorbalance=rm=0.02:bm=-0.03:rh=0.04:bh=-0.05:bs=0.02,vignette=angle=PI/6"

# 1) PROBE a clip
"$FF" -hide_banner -i input.MOV 2>&1 | grep -E "Duration|Stream|color|rotat"

# 2) EXTRACT review frames every 2s (tonemapped, small) to choose the best moments
"$FF" -hide_banner -loglevel error -i input.MOV -vf "fps=1/2,${TM},scale=480:-2" frames/f%03d.jpg

# 3) CUT a graded segment (accurate, normalized to 1080p30, no audio)
VF="${TM},${GA},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,format=yuv420p"
"$FF" -hide_banner -y -ss <IN> -i input.MOV -t <DUR> -vf "$VF" -an -c:v libx264 -crf 14 -preset medium s1.mp4

# 4) ASSEMBLE several segments with 0.4s crossfades (offset = cumulative_dur - n*0.4)
"$FF" -hide_banner -y -i s1.mp4 -i s2.mp4 -i s3.mp4 \
  -filter_complex "[0][1]xfade=transition=fade:duration=0.4:offset=2.9[x1];[x1][2]xfade=transition=fade:duration=0.4:offset=4.8,scale=1280:720:flags=lanczos,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -profile:v high -preset slow -crf 23 master720.mp4

# 5) ENCODE web-optimized (2-pass, BT.709-tagged, faststart, muted) — target ~2 MB
"$FF" -hide_banner -y -i master720.mp4 -c:v libx264 -profile:v high -preset slow -b:v 1200k -pass 1 -passlogfile pl -an -f null /dev/null
"$FF" -hide_banner -y -i master720.mp4 -c:v libx264 -profile:v high -preset slow -b:v 1200k -pass 2 -passlogfile pl \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -an public/media/board-train-hero.mp4

# 6) POSTER (a strong still; matches a hero frame). 1600x900, optimized JPEG
"$FF" -hide_banner -y -ss <T> -i input.MOV -frames:v 1 -vf "${TM},${GA},scale=1600:900" -q:v 6 public/media/board-train-poster.jpg
```

## Output target for a website hero

- **1280×720, H.264 High, muted, looping, `+faststart`, BT.709-tagged, ~2 MB**, ~12 s.
- For a **seamless loop**, make the last segment's final frame the same source frame the first
  segment opens on (we bookended on one seafront clip).
- Page wiring is a true drop-in: keep the names `board-train-hero.mp4` + `board-train-poster.jpg`.
- Compose for **`object-cover` center-crop** (subjects centered survive tall-mobile) and remember the
  bottom ~40% is under a dark gradient + headline.

## File locations

- **Source clips & all working files:** `Videos\` (gitignored — never committed; too large for GitHub).
  - `Videos\_work\` — frames, segments, candidate encodes, final masters in `Videos\_work\out\`.
  - `Videos\_owner-dropins\` — preserved raw drop-ins the owner had placed in `public/media`.
- **Shipped hero + poster:** `public/media/` (committed; served at `/media/...`).

## Quickest way to reuse

Just drop new clips into `Videos\` and ask Claude: *"make a hero video from these."* Claude will
re-run this pipeline (probe → tonemap → pick best moments → grade → assemble → web-encode → poster).
Or run the commands above directly.
