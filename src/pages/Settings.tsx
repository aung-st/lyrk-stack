import "../styles/Settings.css"

import SettingsToolbar from "../components/settings/SettingsToolbar.tsx"
import SettingsSongListItem from "../components/settings/SettingsSongListItem.tsx"
import SongFilter from "../components/SongFilter.tsx"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { useManageSongs } from "../hooks/useManageSongs.ts"

function Settings() {
    const {
        songs,
        error,
        editingSongId,
        toggleSongEdit,
        handleDelete,
        handleExport,
        editPanel,
    } = useManageSongs()

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            {error && <ErrorDisplay error={error} />}
            <SettingsToolbar onExport={handleExport} />
            <hr />
            <h2>Manage Songs</h2>
            <SongFilter
                songs={songs}
                label="Filter songs"
                id="settings-filter"
                placeholder="Search by title or artist"
                noResultsMessage="No songs match your search."
            >
                {(filteredSongs) => (
                    <ul className="settings-song-list">
                        {filteredSongs.map((song) => (
                            <SettingsSongListItem
                                key={song.song_id}
                                song={song}
                                isEditing={editingSongId === song.song_id}
                                onEdit={() => toggleSongEdit(song)}
                                onDelete={() => handleDelete(song.song_id)}
                                editPanel={editPanel}
                            />
                        ))}
                    </ul>
                )}
            </SongFilter>
            <hr />
        </div>
    )
}

export default Settings
