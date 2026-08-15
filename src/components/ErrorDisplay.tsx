import "../styles/ErrorDisplay.css"

interface ErrorDisplayProps {
    error: Error | string
}

function toMessage(error: Error | string): string {
    if (error instanceof Error) return error.message
    return error || "Something went wrong"
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
    return <div className="error-message">{toMessage(error)}</div>
}

export default ErrorDisplay
