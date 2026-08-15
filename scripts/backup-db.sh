#!/usr/bin/env bash
set -euo pipefail

volume="$(docker volume ls --format '{{.Name}}' | rg '_lyrk-data$' | head -n 1 || true)"
if [[ -z "${volume}" ]]; then
    echo "error: could not find the lyrk-data docker volume (is the stack running?)" >&2
    exit 1
fi

backup_dir="$(pwd)/backups"
mkdir -p "${backup_dir}"

filename="songbook-$(date +%Y-%m-%d_%H-%M-%S).tar.gz"

docker run --rm \
    -v "${volume}":/data:ro \
    -v "${backup_dir}:/backup" \
    alpine \
    tar czf "/backup/${filename}" -C /data .

echo "backup written to ${backup_dir}/${filename}"
