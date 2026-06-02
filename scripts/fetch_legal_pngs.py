#!/usr/bin/env python3
"""Fetch legal PNG assets from Wikimedia Commons.

This script is a safe alternative to scraping Google Images.
It searches Wikimedia Commons for PNG files, filters for common
open licenses, downloads the selected files, and writes a manifest.

Usage examples:
  python scripts/fetch_legal_pngs.py --query "playing card" --out public/generated-assets/cards
  python scripts/fetch_legal_pngs.py --all-defaults --out public/generated-assets
  python scripts/fetch_legal_pngs.py --query "trophy" --max-per-query 8 --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List, Optional

API_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "UNO-Ultras-LegalAssetFetcher/1.0 (+local dev)"
ALLOWED_LICENSE_HINTS = (
    "cc0",
    "public domain",
    "cc by",
    "cc-by",
    "cc by-sa",
    "cc-by-sa",
    "creative commons",
)

DEFAULT_QUERIES = {
    "cards": "playing card icon png",
    "avatars": "avatar portrait png",
    "coins": "coin icon png",
    "trophies": "trophy icon png",
    "stars": "star icon png",
    "buttons": "game button icon png",
    "effects": "sparkle effect png",
    "badges": "badge icon png",
}


@dataclass
class AssetRecord:
    query: str
    title: str
    file_name: str
    source_url: str
    page_url: str
    license_name: str
    license_url: str
    artist: str
    category: str


def safe_name(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip())
    value = re.sub(r"_+", "_", value).strip("_")
    return value or "asset"


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = response.read().decode("utf-8")
    return json.loads(payload)


def http_download(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read()


def license_allowed(meta: dict) -> bool:
    license_text = " ".join(
        str(meta.get(key, {}).get("value", ""))
        for key in ("LicenseShortName", "UsageTerms", "License", "Credit")
    ).lower()
    return any(hint in license_text for hint in ALLOWED_LICENSE_HINTS)


def extract_meta_value(meta: dict, key: str, default: str = "") -> str:
    item = meta.get(key, {})
    if isinstance(item, dict):
        return str(item.get("value", default) or default)
    return default


def search_pngs(query: str, limit: int) -> List[dict]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": str(max(limit * 4, 20)),
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
        "iiurlwidth": "512",
        "format": "json",
        "formatversion": "2",
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    data = http_get_json(url)
    pages = data.get("query", {}).get("pages", [])
    results = []
    for page in pages:
        info = (page.get("imageinfo") or [{}])[0]
        if info.get("mime") != "image/png":
            continue
        extmeta = info.get("extmetadata") or {}
        if not license_allowed(extmeta):
            continue
        source_url = info.get("thumburl") or info.get("url")
        if not source_url:
            continue
        results.append(
            {
                "title": page.get("title", ""),
                "page_url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(page.get('title', '').replace(' ', '_'))}",
                "source_url": source_url,
                "license_name": extract_meta_value(extmeta, "LicenseShortName", "Unknown"),
                "license_url": extract_meta_value(extmeta, "LicenseUrl", ""),
                "artist": extract_meta_value(extmeta, "Artist", ""),
            }
        )
        if len(results) >= limit:
            break
    return results


def download_assets(query: str, category: str, out_dir: Path, limit: int, dry_run: bool) -> List[AssetRecord]:
    matches = search_pngs(query, limit)
    if not matches:
        return []

    out_dir.mkdir(parents=True, exist_ok=True)
    records: List[AssetRecord] = []
    for idx, item in enumerate(matches, start=1):
        base = safe_name(f"{category}_{idx}_{Path(urllib.parse.urlparse(item['source_url']).path).stem}")
        file_name = f"{base}.png"
        file_path = out_dir / file_name

        if not dry_run:
            content = http_download(item["source_url"])
            file_path.write_bytes(content)

        records.append(
            AssetRecord(
                query=query,
                title=item["title"],
                file_name=str(file_path.as_posix()),
                source_url=item["source_url"],
                page_url=item["page_url"],
                license_name=item["license_name"],
                license_url=item["license_url"],
                artist=item["artist"],
                category=category,
            )
        )
    return records


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Download legally reusable PNG assets from Wikimedia Commons.")
    parser.add_argument("--query", action="append", default=[], help="Search query. Can be repeated.")
    parser.add_argument("--category", action="append", default=[], help="Category name for each --query. Must match in count if provided.")
    parser.add_argument("--all-defaults", action="store_true", help="Use built-in default queries for game-like assets.")
    parser.add_argument("--out", default="public/generated-assets", help="Output directory.")
    parser.add_argument("--max-per-query", type=int, default=5, help="Maximum PNGs to download per query.")
    parser.add_argument("--manifest", default="asset-manifest.json", help="Manifest file name inside output directory.")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be downloaded without writing files.")
    return parser


def normalize_queries(args: argparse.Namespace) -> List[tuple[str, str]]:
    pairs: List[tuple[str, str]] = []
    if args.all_defaults:
        pairs.extend(DEFAULT_QUERIES.items())
    if args.query:
        if args.category and len(args.category) not in (1, len(args.query)):
            raise SystemExit("--category must be provided once or once per --query")
        for idx, query in enumerate(args.query):
            category = args.category[idx] if len(args.category) == len(args.query) else (args.category[0] if args.category else safe_name(query)[:32])
            pairs.append((category, query))
    return pairs


def main(argv: Optional[Iterable[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    queries = normalize_queries(args)
    if not queries:
        parser.error("Provide --query or --all-defaults")

    out_dir = Path(args.out).resolve()
    manifest: List[AssetRecord] = []

    for category, query in queries:
        print(f"[fetch] {category}: {query}")
        try:
            records = download_assets(query, category, out_dir / category, args.max_per_query, args.dry_run)
            if not records:
                print(f"  no suitable PNGs found for '{query}'")
                continue
            manifest.extend(records)
            for rec in records:
                print(f"  - {rec.file_name}")
        except Exception as exc:  # pragma: no cover - defensive CLI guard
            print(f"  ! {category}: {exc}", file=sys.stderr)

    manifest_path = out_dir / args.manifest
    if not args.dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps([asdict(item) for item in manifest], indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"[done] wrote manifest -> {manifest_path}")
    else:
        print("[done] dry-run completed; no files written")

    print(f"[summary] downloaded {len(manifest)} assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
