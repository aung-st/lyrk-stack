import LyricForm from "./LyricForm.tsx"

export interface LyricsEditorProps {
    lyrics: LyricsBySong[]
    editingLyricId: number | null
    draft: string
    language: string
    isTranslated: boolean
    onEdit: (lyric: LyricsBySong) => void
    onDraftChange: (value: string) => void
    onLanguageChange: (value: string) => void
    onIsTranslatedChange: (value: boolean) => void
    onSubmit: () => void
    onCancel: () => void
}

function LyricsEditor({
    lyrics,
    editingLyricId,
    draft,
    language,
    isTranslated,
    onEdit,
    onDraftChange,
    onLanguageChange,
    onIsTranslatedChange,
    onSubmit,
    onCancel,
}: LyricsEditorProps) {
    return (
        <div className="settings-lyrics-section">
            <h3>Lyrics</h3>
            {lyrics.length === 0 ? (
                <LyricForm
                    idPrefix="new-lyric"
                    label="Lyrics"
                    showLanguageInput
                    language={language}
                    onLanguageChange={onLanguageChange}
                    draft={draft}
                    onDraftChange={onDraftChange}
                    isTranslated={isTranslated}
                    onIsTranslatedChange={onIsTranslatedChange}
                    onSubmit={onSubmit}
                    showCancel={false}
                    onCancel={onCancel}
                />
            ) : (
                <ul className="settings-lyrics-list">
                    {lyrics.map((lyric) => (
                        <li key={lyric.lyric_id} className="settings-lyric-item">
                            {editingLyricId === lyric.lyric_id ? (
                                <LyricForm
                                    idPrefix={`lyric-${lyric.lyric_id}`}
                                    label={`${lyric.language} Lyrics`}
                                    showLanguageInput={false}
                                    language={language}
                                    onLanguageChange={onLanguageChange}
                                    draft={draft}
                                    onDraftChange={onDraftChange}
                                    isTranslated={isTranslated}
                                    onIsTranslatedChange={onIsTranslatedChange}
                                    onSubmit={onSubmit}
                                    showCancel={lyric.lyric_id != null}
                                    onCancel={onCancel}
                                />
                            ) : (
                                <div className="settings-lyric-row">
                                    <span className="settings-lyric-language">
                                        {lyric.language}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(lyric)}
                                    >
                                        Edit Lyrics
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default LyricsEditor
