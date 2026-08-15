export interface SongEditFormProps {
    title: string
    artist: string
    onTitleChange: (value: string) => void
    onArtistChange: (value: string) => void
    onSubmit: () => void
}

function SongEditForm({
    title,
    artist,
    onTitleChange,
    onArtistChange,
    onSubmit,
}: SongEditFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="settings-edit-form">
            <div className="form-group">
                <label htmlFor="edit-song-title">Song Title</label>
                <input
                    id="edit-song-title"
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="edit-artist-name">Artist</label>
                <input
                    id="edit-artist-name"
                    type="text"
                    value={artist}
                    onChange={(e) => onArtistChange(e.target.value)}
                    required
                />
            </div>
            <div className="edit-form-actions">
                <button type="submit">Save</button>
            </div>
        </form>
    )
}

export default SongEditForm
