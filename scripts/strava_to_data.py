# scripts/strava_to_data.py
# usage (from the project root): python scripts/strava_to_data.py strava-export/activities.csv
import csv
import json
import sys
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

CSV_PATH = "./strava-activities/activities.csv"
OUT_PATH = "src/data/rides.generated.js"

TZ = ZoneInfo("Asia/Manila")      # the export stores UTC, so convert to your timezone
SINCE = "2024-01-01"              # only include rides on or after this date ("" = all)
MIN_KM = 1.0                      # skip tiny activities
DIST_IN_METERS = True             # if distances look 1000x too big or small, flip this
RIDE_TYPES = {"Ride"}             # add "E-Bike Ride" or "Mountain Bike Ride" if you want them

with open(CSV_PATH, newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = [h.strip() for h in next(reader)]
    rows = list(reader)


def col(name, last=False, required=True):
    idx = [i for i, h in enumerate(header) if h == name]
    if not idx:
        if required:
            sys.exit(f'Column "{name}" not found. Is the export in English?\nHeaders: {header}')
        return None
    return idx[-1] if last else idx[0]


i_date, i_name, i_type = col("Activity Date"), col("Activity Name"), col("Activity Type")
i_dist = col("Distance", last=True)         # the file has several Distance columns
i_gain = col("Elevation Gain", last=True, required=False)
needed = max(i for i in (i_date, i_name, i_type, i_dist, i_gain) if i is not None)


def num(s):
    try:
        return float(s.replace(",", ""))
    except ValueError:
        return None


def local_date(s):
    dt = datetime.strptime(s.strip(), "%b %d, %Y, %I:%M:%S %p").replace(tzinfo=timezone.utc)
    return dt.astimezone(TZ).strftime("%Y-%m-%d")


rides = []
for r in rows:
    if len(r) <= needed or r[i_type] not in RIDE_TYPES:
        continue
    date = local_date(r[i_date])
    if SINCE and date < SINCE:
        continue
    dist = num(r[i_dist])
    if dist is None:
        continue
    km = dist / 1000 if DIST_IN_METERS else dist
    if km < MIN_KM:
        continue
    item = {"name": r[i_name].strip(), "date": date, "km": round(km, 1)}
    gain = num(r[i_gain]) if i_gain is not None else None
    if gain:
        item["gain"] = round(gain)
    rides.append(item)

rides.sort(key=lambda x: x["date"], reverse=True)
body = ",\n".join("  " + json.dumps(i, ensure_ascii=False) for i in rides)
with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write(
        "// Generated from a Strava export. Review the names before publishing.\n"
        f"export const generated = [\n{body}\n];\n"
    )

print(f"{OUT_PATH}: {len(rides)} rides")
for i in rides[:3]:
    print("   ", i)          # check these against the Strava app