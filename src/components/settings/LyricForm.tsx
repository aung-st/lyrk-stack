interface LyricFormProps {
    idPrefix: string
    label: string
    showLanguageInput: boolean
    language: string
    onLanguageChange: (value: string) => void
    draft: string
    onDraftChange: (value: string) => void
    isTranslated: boolean
    onIsTranslatedChange: (value: boolean) => void
    onSubmit: () => void
    showCancel: boolean
    onCancel: () => void
}

function LyricForm({
    idPrefix,
    label,
    showLanguageInput,
    language,
    onLanguageChange,
    draft,
    onDraftChange,
    isTranslated,
    onIsTranslatedChange,
    onSubmit,
    showCancel,
    onCancel,
}: LyricFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            {showLanguageInput && (
                <div className="form-group">
                    <label htmlFor={`${idPrefix}-language`}>Language</label>
                    <input
                        id={`${idPrefix}-language`}
                        type="text"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        required
                    />
                </div>
            )}
            <div className="form-group">
                <label htmlFor={`${idPrefix}-text`}>{label}</label>
                <textarea
                    id={`${idPrefix}-text`}
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    rows={10}
                    required
                />
            </div>
            <div className="form-group checkbox">
                <label htmlFor={`${idPrefix}-translated`}>
                    <input
                        id={`${idPrefix}-translated`}
                        type="checkbox"
                        checked={isTranslated}
                        onChange={(e) => onIsTranslatedChange(e.target.checked)}
                    />
                    This is a translation
                </label>
            </div>
            <div className="edit-form-actions">
                <button type="submit">Save</button>
                {showCancel && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default LyricForm
