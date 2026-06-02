#!/usr/bin/env python3
"""Downloader asset di gioco da Google Images con post-processing PNG.

Uso rapido:
    pip install icrawler pillow requests
    python scripts/game_asset_downloader.py
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

try:
    from icrawler.builtin import GoogleImageCrawler
except ModuleNotFoundError:  # pragma: no cover - depends on local environment
    GoogleImageCrawler = None

try:
    from PIL import Image
except ModuleNotFoundError:  # pragma: no cover - depends on local environment
    Image = None


# Dizionario: nome file output -> query Google
DEFAULT_ASSET_LIST: dict[str, str] = {
    "fire": "realistic fire flame transparent PNG",
    "water": "realistic water drop transparent PNG",
    "sword": "fantasy sword realistic transparent PNG",
    "potion_red": "red health potion bottle transparent PNG",
    "potion_blue": "blue mana potion bottle transparent PNG",
    "shield": "medieval shield realistic transparent PNG",
    "coin": "gold coin realistic transparent PNG",
    "chest": "treasure chest realistic transparent PNG",
    "heart": "red heart realistic transparent PNG",
    "skull": "skull realistic transparent PNG",
    "tree": "realistic tree transparent PNG",
    "rock": "realistic stone rock transparent PNG",
    "explosion": "explosion effect transparent PNG",
    "arrow": "wooden arrow realistic transparent PNG",
    "dragon": "dragon realistic transparent PNG",
}


def parse_size(size_text: str) -> tuple[int, int] | None:
    if size_text.strip().lower() in {"none", "off", "0", "disable"}:
        return None
    if "x" not in size_text.lower():
        raise ValueError("Formato size non valido. Usa ad esempio 128x128 o 'none'.")
    w_text, h_text = size_text.lower().split("x", 1)
    width = int(w_text)
    height = int(h_text)
    if width <= 0 or height <= 0:
        raise ValueError("La dimensione deve essere > 0.")
    return width, height


def create_output_dirs(output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    temp_dir = output_dir / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] Cartella output: {output_dir}")
    return temp_dir


def download_images(temp_asset_dir: Path, query: str, max_images: int, safe: bool) -> list[Path]:
    if GoogleImageCrawler is None:
        raise ModuleNotFoundError(
            "Dipendenza mancante: installa 'icrawler' con 'pip install icrawler'."
        )

    crawler = GoogleImageCrawler(storage={"root_dir": str(temp_asset_dir)}, log_level=50)

    filters: dict[str, str] = {
        "filetype": "png",
        # Limita ai risultati dichiarati riutilizzabili/modificabili.
        "license": "commercial,modify",
    }

    crawler.crawl(
        keyword=query,
        max_num=max_images,
        filters=filters,
        file_idx_offset=0,
        overwrite=True,
        min_size=(128, 128),
        safe=safe,
    )

    return [p for p in temp_asset_dir.iterdir() if p.is_file()]


def score_image(img: Image.Image) -> tuple[int, int, int]:
    rgba = img.convert("RGBA")
    width, height = rgba.size
    alpha = rgba.getchannel("A")
    opaque_pixels = sum(1 for px in alpha.getdata() if px > 0)
    return opaque_pixels, width * height, min(width, height)


def choose_best_image(paths: list[Path]) -> Path | None:
    best_path: Path | None = None
    best_score: tuple[int, int, int] | None = None

    for path in paths:
        try:
            with Image.open(path) as img:
                score = score_image(img)
        except Exception:
            continue

        if best_score is None or score > best_score:
            best_score = score
            best_path = path

    return best_path


def resize_and_save(src_path: Path, dest_path: Path, size: tuple[int, int] | None) -> bool:
    if Image is None:
        print("[ERROR] Dipendenza mancante: installa 'pillow' con 'pip install pillow'.")
        return False

    try:
        with Image.open(src_path) as img:
            img = img.convert("RGBA")
            if size:
                img = img.resize(size, Image.LANCZOS)
            img.save(dest_path, "PNG")
        return True
    except Exception as exc:
        print(f"[WARN] Errore nel processare {src_path.name}: {exc}")
        return False


def cleanup_temp(temp_dir: Path) -> None:
    shutil.rmtree(temp_dir, ignore_errors=True)
    print("[INFO] Cartella temporanea rimossa.")


def save_asset_map(output_dir: Path, asset_map: dict[str, str]) -> None:
    map_path = output_dir / "asset_map.json"
    with map_path.open("w", encoding="utf-8") as file:
        json.dump(asset_map, file, indent=2, ensure_ascii=False)
    print(f"[INFO] Mappa asset salvata in: {map_path}")


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scarica PNG realistici e li converte in asset di gioco.")
    parser.add_argument("--output", default="game_assets", help="Cartella output (default: game_assets)")
    parser.add_argument(
        "--images-per-search",
        type=int,
        default=5,
        help="Numero di immagini da provare per query (default: 5)",
    )
    parser.add_argument(
        "--target-size",
        default="128x128",
        help="Dimensione finale (es. 128x128) oppure 'none' per disattivare resize.",
    )
    parser.add_argument(
        "--asset-list-json",
        default="",
        help="Percorso opzionale a un JSON con mappa {nome_asset: query}.",
    )
    parser.add_argument(
        "--safe-off",
        action="store_true",
        help="Disattiva SafeSearch (sconsigliato).",
    )
    return parser


def load_asset_list(json_path: str) -> dict[str, str]:
    if not json_path:
        return DEFAULT_ASSET_LIST

    file = Path(json_path)
    if not file.exists():
        raise FileNotFoundError(f"File asset list non trovato: {json_path}")

    with file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in data.items()):
        raise ValueError("Il JSON deve essere un oggetto: {\"nome_asset\": \"query\"}.")

    return data


def main() -> int:
    parser = build_arg_parser()
    args = parser.parse_args()

    missing_deps: list[str] = []
    if GoogleImageCrawler is None:
        missing_deps.append("icrawler")
    if Image is None:
        missing_deps.append("pillow")
    if missing_deps:
        print(
            "[ERROR] Dipendenze Python mancanti: "
            + ", ".join(missing_deps)
            + ". Installa con: pip install "
            + " ".join(missing_deps)
        )
        return 1

    try:
        target_size = parse_size(args.target_size)
    except Exception as exc:
        parser.error(str(exc))
        return 2

    if args.images_per_search <= 0:
        parser.error("--images-per-search deve essere > 0")
        return 2

    try:
        asset_list = load_asset_list(args.asset_list_json)
    except Exception as exc:
        print(f"[ERROR] {exc}")
        return 1

    output_dir = Path(args.output)
    temp_root = create_output_dirs(output_dir)
    asset_map: dict[str, str] = {}

    total = len(asset_list)
    print("=" * 56)
    print("GAME ASSET DOWNLOADER")
    print("=" * 56)

    try:
        for idx, (asset_name, query) in enumerate(asset_list.items(), 1):
            print(f"\n[{idx}/{total}] Ricerca: {asset_name}")
            print(f"  Query: {query}")

            temp_asset_dir = temp_root / asset_name
            temp_asset_dir.mkdir(parents=True, exist_ok=True)

            downloaded = download_images(
                temp_asset_dir=temp_asset_dir,
                query=query,
                max_images=args.images_per_search,
                safe=not args.safe_off,
            )
            if not downloaded:
                print("  [MISS] Nessuna immagine scaricata")
                continue

            best = choose_best_image(downloaded)
            if best is None:
                print("  [MISS] Nessun file valido")
                continue

            destination = output_dir / f"{asset_name}.png"
            ok = resize_and_save(best, destination, target_size)
            if not ok:
                continue

            asset_map[asset_name] = str(destination.as_posix())
            if target_size:
                print(f"  [OK] Salvato {destination.name} ({target_size[0]}x{target_size[1]})")
            else:
                print(f"  [OK] Salvato {destination.name} (dimensione originale)")

    finally:
        cleanup_temp(temp_root)

    save_asset_map(output_dir, asset_map)

    print("\n" + "=" * 56)
    print(f"Completato: {len(asset_map)}/{total} asset")
    print(f"Output: {output_dir}")
    print("=" * 56)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())