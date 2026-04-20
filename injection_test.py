"""
LitePruner — Controlled Token Drain
Target: 687,000 tokens
Method: Concurrent requests until target consumed
"""

import requests
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://litepruner.ai"
API_KEY = "lpk_QboDn9OcPG0NxRnxfcVD2tof1klM4JD9S8UPLwFVl_c"
HEADERS = {"X-API-Key": API_KEY, "Content-Type": "application/json"}

TARGET_TOKENS = 687_000
TOKENS_PER_REQUEST = 280       # observed from previous tests
CONCURRENCY = 30               # threads
SAFETY_BUFFER = 500            # stop this many tokens before target

SEED = (
    "The mitochondria is the powerhouse of the cell. "
    "Neural networks are inspired by the human brain. "
    "Climate change is driven by greenhouse gas emissions. "
) * 10

lock = threading.Lock()
total_consumed = 0
request_count = 0
success_count = 0
error_count = 0
stop_flag = threading.Event()

def drain_request(idx):
    global total_consumed, request_count, success_count, error_count

    if stop_flag.is_set():
        return None

    try:
        resp = requests.post(
            f"{BASE_URL}/compress-text",
            json={"text": SEED, "compression_ratio": 0.5},
            headers=HEADERS,
            timeout=20,
        )
        data = resp.json()
    except Exception as e:
        with lock:
            error_count += 1
        return None

    if resp.status_code == 200 and data.get("success"):
        used = data.get("tokens_used", TOKENS_PER_REQUEST)
        remaining = data.get("tokens_remaining", 0)
        with lock:
            total_consumed += used
            request_count += 1
            success_count += 1
            if total_consumed >= TARGET_TOKENS - SAFETY_BUFFER:
                stop_flag.set()
        return {"used": used, "remaining": remaining}
    else:
        with lock:
            error_count += 1
            request_count += 1
        return {"error": data.get("error"), "status": resp.status_code}


print("\n" + "=" * 60)
print(f"TOKEN DRAIN — Target: {TARGET_TOKENS:,} tokens")
print("=" * 60)

init = requests.post(
    f"{BASE_URL}/compress-text",
    json={"text": SEED, "compression_ratio": 0.5},
    headers=HEADERS,
    timeout=20,
).json()

start_balance = init.get("tokens_remaining", 0)
total_consumed += init.get("tokens_used", 0)
success_count += 1

print(f"  Starting balance : {start_balance:,}")
print(f"  Target drain     : {TARGET_TOKENS:,}")
print(f"  Est. requests    : ~{TARGET_TOKENS // TOKENS_PER_REQUEST:,}")
print(f"  Concurrency      : {CONCURRENCY} threads")
print(f"\n  Draining...\n")

start_time = time.time()
batch = 0

while not stop_flag.is_set():
    batch += 1
    batch_size = min(CONCURRENCY, (TARGET_TOKENS - total_consumed) // TOKENS_PER_REQUEST + 1)
    if batch_size <= 0:
        break

    with ThreadPoolExecutor(max_workers=batch_size) as executor:
        futures = [executor.submit(drain_request, i) for i in range(batch_size)]
        for f in as_completed(futures):
            pass

    elapsed = time.time() - start_time
    pct = min(100, total_consumed / TARGET_TOKENS * 100)
    bar = "█" * int(pct / 2) + "░" * (50 - int(pct / 2))
    print(f"  [{bar}] {pct:.1f}% | {total_consumed:,}/{TARGET_TOKENS:,} tokens | {elapsed:.1f}s", end="\r")

    if stop_flag.is_set() or total_consumed >= TARGET_TOKENS - SAFETY_BUFFER:
        break

elapsed = time.time() - start_time
print(f"\n\n{'=' * 60}")
print(f"DRAIN COMPLETE")
print(f"{'=' * 60}")
print(f"  Tokens consumed  : {total_consumed:,}")
print(f"  Requests made    : {success_count:,}")
print(f"  Errors           : {error_count}")
print(f"  Time elapsed     : {elapsed:.1f}s")
print(f"  Avg rate         : {total_consumed / elapsed:.0f} tokens/sec")
print(f"  Est. remaining   : ~{start_balance - total_consumed:,}")