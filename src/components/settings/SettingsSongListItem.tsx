import { Link } from "react-router-dom"

import SongEditPanel from "./SongEditPanel.tsx"
import type { SongEditPanelProps } from "./types.ts"

interface SettingsSongListItemProps {
    song: Song
    isEditing: boolean
    onEdit: () => void
    onDelete: () => void
    editPanel: SongEditPanelProps
}

function SettingsSongListItem({
    song,
    isEditing,
    onEdit,
    onDelete,
    editPanel,
}: SettingsSongListItemProps) {
    return (
        <li className="settings-song-item">
            <div className="settings-song-row">
                <div className="settings-song-info">
                    <span className="settings-song-title">{song.song_title}</span>
                    <span className="settings-song-artist">
                        {song.artist_name ?? "Unknown Artist"}
                    </span>
                </div>
                <div className="settings-song-actions">
                    <Link to={`/songs/${song.song_id}`}>
                        <button type="button">View</button>
                    </Link>
                    <button type="button" onClick={onEdit}>
                        Edit
                    </button>
                    <button
                        type="button"
                        className="settings-delete"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {isEditing && <SongEditPanel {...editPanel} />}
        </li>
    )
}

export default SettingsSongListItem
