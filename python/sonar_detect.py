"""
SonarShield — Real Detection Pipeline (classical CV, no training required)
============================================================================
Outputs JSON matching the exact `Survey` / `Detection` TypeScript types used
in src/data/mockData.ts, so the Next.js frontend can consume it with zero
shape conversion.

Runs the real 6-stage pipeline: preprocess -> detect -> context-filter ->
score -> geotag -> report, using classical computer vision (adaptive
thresholding + contour geometry + shadow-pair heuristics) as a stand-in for
a trained YOLOv8/U-Net model — appropriate for an idea-stage prototype since
it needs no labelled training data or GPU time.

USAGE (called by the Next.js API route, or standalone):
    python sonar_detect.py path/to/sonar_image.png

Prints a single JSON object to stdout:
    { "survey": {...}, "detections": [...] }
"""

import cv2
import numpy as np
import json
import sys
import os
import uuid
from datetime import datetime, timezone

# -----------------------------------------------------------------------
# CONFIG
# -----------------------------------------------------------------------
MIN_CONTOUR_AREA = 40
MAX_CONTOUR_AREA = 15000
ADAPTIVE_BLOCK_SIZE = 35
ADAPTIVE_C = -5

SURVEY_ORIGIN_LAT = -38.1800   # replace with real ping-header origin when available
SURVEY_ORIGIN_LON = 144.6300
METERS_PER_PIXEL = 0.15

# depth is NOT recoverable from a single 2D side-scan waterfall image without
# bathymetry/altitude data — this maps vertical pixel position to a plausible
# range as a clearly-labelled placeholder until real nav/bathy data is wired in
DEPTH_MIN_M, DEPTH_MAX_M = 5.0, 45.0

GREEN, AMBER, RED = "#1C8C5A", "#B14C15", "#DC2626"
THUMBNAIL_PALETTE = ["#1a3a4a", "#1e3d2f", "#162840", "#1c2e38", "#182230", "#1a3520", "#14253a"]


def preprocess(gray):
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    return clahe.apply(denoised)
    # TODO: slant-range correction + heave/pitch/roll dropout masking once
    #       real ping metadata / nav data is available


def detect_candidates(img):
    thresh = cv2.adaptiveThreshold(
        img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,
        ADAPTIVE_BLOCK_SIZE, ADAPTIVE_C
    )
    kernel = np.ones((3, 3), np.uint8)
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel, iterations=2)
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    for c in contours:
        area = cv2.contourArea(c)
        if MIN_CONTOUR_AREA <= area <= MAX_CONTOUR_AREA:
            x, y, w, h = cv2.boundingRect(c)
            out.append({"contour": c, "bbox": (x, y, w, h), "area": area})
    return out


def context_filter_score(img, candidate):
    x, y, w, h = candidate["bbox"]
    c = candidate["contour"]
    hull = cv2.convexHull(c)
    hull_area = cv2.contourArea(hull) or 1
    solidity = candidate["area"] / hull_area

    aspect_ratio = w / h if h > 0 else 0
    elongated_bonus = 0.15 if (aspect_ratio > 2.5 or aspect_ratio < 0.4) else 0

    img_h, img_w = img.shape
    shadow_y2 = min(y + h + h, img_h)
    shadow_band = img[y + h:shadow_y2, x:x + w] if shadow_y2 > y + h else None
    object_band = img[y:y + h, x:x + w]

    shadow_score = 0.0
    if shadow_band is not None and shadow_band.size > 0 and object_band.size > 0:
        contrast_drop = float(np.mean(object_band)) - float(np.mean(shadow_band))
        shadow_score = np.clip(contrast_drop / 60.0, 0, 1) * 0.35

    return float(np.clip(solidity + elongated_bonus + shadow_score, 0, 1))


def score_and_classify(candidate, context_score):
    x, y, w, h = candidate["bbox"]
    aspect_ratio = w / h if h > 0 else 0
    area = candidate["area"]

    size_score = np.clip((area - MIN_CONTOUR_AREA) / (MAX_CONTOUR_AREA - MIN_CONTOUR_AREA), 0, 1)
    confidence = round(float(np.clip(0.5 * context_score + 0.3 * size_score + 0.2, 0, 1)) * 100)

    # placeholder classification by shape — swap for real model output once
    # a trained detector/classifier is available; values match the
    # DetectionClass union in mockData.ts exactly
    if aspect_ratio > 3.0 or aspect_ratio < 0.33:
        label = "Pipe"
    elif area > 4000:
        label = "Shipwreck"
    elif 0.7 <= aspect_ratio <= 1.4 and area < 1200:
        label = "Cylinder"
    elif context_score < 0.55:
        label = "Unknown Object"
    else:
        label = "Entangled Net"

    return confidence, label


def geotag(bbox):
    x, y, w, h = bbox
    cx, cy = x + w / 2, y + h / 2
    dlat = (cy * METERS_PER_PIXEL) / 111_111
    dlon = (cx * METERS_PER_PIXEL) / (111_111 * np.cos(np.radians(SURVEY_ORIGIN_LAT)))
    return round(SURVEY_ORIGIN_LAT - dlat, 6), round(SURVEY_ORIGIN_LON + dlon, 6)


def bbox_color_for(confidence):
    if confidence >= 80:
        return GREEN
    if confidence >= 50:
        return AMBER
    return RED


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "usage: sonar_detect.py <image_path>"}))
        sys.exit(1)

    image_path = sys.argv[1]
    raw = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if raw is None:
        print(json.dumps({"error": f"could not read image: {image_path}"}))
        sys.exit(1)

    img_h, img_w = raw.shape
    pre = preprocess(raw)
    candidates = detect_candidates(pre)

    survey_id = f"survey-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc)
    detections = []
    idx = 0

    for cand in candidates:
        context_score = context_filter_score(pre, cand)
        if context_score < 0.35:
            continue  # filtered out as likely-natural (rock/shadow noise)

        idx += 1
        confidence, label = score_and_classify(cand, context_score)
        x, y, w, h = cand["bbox"]
        lat, lng = geotag(cand["bbox"])

        depth_frac = (y + h / 2) / img_h
        depth_m = round(DEPTH_MIN_M + depth_frac * (DEPTH_MAX_M - DEPTH_MIN_M), 1)

        detections.append({
            "id": f"det-{uuid.uuid4().hex[:8]}",
            "surveyId": survey_id,
            "index": idx,
            "classification": label,
            "confidence": confidence,
            "lat": lat,
            "lng": lng,
            "depth": f"{depth_m} m",
            "estimatedLength": f"{round(max(w, h) * METERS_PER_PIXEL, 1)} m",
            "estimatedWidth": f"{round(min(w, h) * METERS_PER_PIXEL, 1)} m",
            "status": "pending",
            "note": "",
            "thumbnailColor": THUMBNAIL_PALETTE[idx % len(THUMBNAIL_PALETTE)],
            "bboxTop": f"{round(y / img_h * 100)}%",
            "bboxLeft": f"{round(x / img_w * 100)}%",
            "bboxWidth": f"{round(w / img_w * 100)}%",
            "bboxHeight": f"{round(h / img_h * 100)}%",
            "bboxColor": bbox_color_for(confidence),
            "detectedAt": now.isoformat(),
        })

    survey = {
        "id": survey_id,
        "filename": os.path.basename(image_path),
        "uploadDate": now.isoformat(),
        "areaCovered": "—",  # unknown without real swath-width metadata
        "contactsDetected": len(detections),
        "status": "pending_review",
        "processingTime": "—",
        "vessel": "—",
        "operator": "—",
    }

    print(json.dumps({"survey": survey, "detections": detections}))


if __name__ == "__main__":
    main()