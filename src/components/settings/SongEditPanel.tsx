import SongEditForm from "./SongEditForm.tsx"
import LyricsEditor from "./LyricsEditor.tsx"
import type { SongEditPanelProps } from "./types.ts"

function SongEditPanel({ form, lyricsEditor }: SongEditPanelProps) {
    return (
        <div className="settings-edit-panel">
            <SongEditForm {...form} />
            <hr />
            <LyricsEditor {...lyricsEditor} />
        </div>
    )
}

export default SongEditPanel
