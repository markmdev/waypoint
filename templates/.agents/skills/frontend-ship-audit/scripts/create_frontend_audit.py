#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sys

TEMPLATE = """# Frontend Ship-Readiness Audit

Generated: {generated}

## Scope
- Requested scope: {requested_scope}
- Assumed reviewable unit: 
- In scope: 
- Important dependencies: 
- Explicitly out of scope: 

## Deployment Context
- Established context: 
- Missing context that affects the bar: 
- Assumptions used for this audit: 

## Repository Coverage
- Files and docs read completely: 
- Areas intentionally skipped as irrelevant: 

## Summary
- Verdict: Ready / Ready with accepted risk / Not ready
- Highest-risk themes: 
- What would need to change before shipping, if not ready: 

## Findings

## Positive evidence

## Open questions

## Release recommendation
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a timestamped frontend audit file in .waypoint/audit.")
    parser.add_argument("--project-root", default=".", help="Path to the repository root.")
    parser.add_argument("--requested-scope", default="", help="Original requested scope for the audit.")
    parser.add_argument("--timestamp", help="Override timestamp in dd-mm-yyyy-hh-mm format.")
    parser.add_argument("--stdout-path-only", action="store_true", help="Print the output path without creating the file.")
    parser.add_argument("--force", action="store_true", help="Overwrite the file if it already exists.")
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    if args.timestamp:
        stamp = args.timestamp
        if len(stamp) == 16:
            generated = f"{stamp[:10]} {stamp[11:13]}:{stamp[14:16]}"
        else:
            generated = stamp
    else:
        now = datetime.now()
        stamp = now.strftime("%d-%m-%Y-%H-%M")
        generated = now.strftime("%d-%m-%Y %H:%M")

    out_path = project_root / ".waypoint" / "audit" / f"{stamp}-frontend-audit.md"
    if args.stdout_path_only:
        print(out_path)
        return 0

    out_path.parent.mkdir(parents=True, exist_ok=True)
    if out_path.exists() and not args.force:
        raise SystemExit(f"Refusing to overwrite existing file: {out_path}")

    content = TEMPLATE.format(generated=generated, requested_scope=args.requested_scope)
    out_path.write_text(content, encoding="utf-8")
    print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
