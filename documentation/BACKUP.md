# Backup & Restore

All database data is stored in the Docker volume `lyrk-stack_lyrk-data`
(mounted into the backend container at `/app/data`).

## Backup

```sh
npm run backup
```

This creates `backups/songbook-<timestamp>.tar.gz`, a gzipped archive of the
volume contents. The script finds the volume automatically, mounts it read-only
into a throwaway `alpine` container, and requires the stack to be running (it
errors if no matching volume exists).

## Restore

The restore command expects the volume to exist, and the backend must NOT be
running (stop it first to avoid concurrent writes):

```sh
docker compose stop lyrk-stack-backend

docker run --rm \
    -v lyrk-stack_lyrk-data:/data \
    -v "$(pwd)/backups:/backup:ro" \
    alpine \
    tar xzf "/backup/<file>.tar.gz" -C /data

docker compose start lyrk-stack-backend
```

Replace `<file>` with the name of the archive you want to restore.

## Notes

- Backups are plain tarballs of the volume; the database contents are not
  encrypted.
- The `backups/` directory is git-ignored.
- If the volume is ever deleted, restoring from the latest backup is the
  recovery path (see [Deployment](DEPLOYMENT.md) for the volume name).
