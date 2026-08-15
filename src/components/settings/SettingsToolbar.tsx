import { Link } from "react-router-dom"

interface SettingsToolbarProps {
    onExport: () => void
}

function SettingsToolbar({ onExport }: SettingsToolbarProps) {
    return (
        <div className="settings-toolbar">
            <Link to="/add-song">
                <button type="button">Add Song</button>
            </Link>
            <button type="button" onClick={onExport}>
                Export Data
            </button>
        </div>
    )
}

export default SettingsToolbar
