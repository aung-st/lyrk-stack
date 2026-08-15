import "../styles/ErrorDisplay.css"

interface ErrorDisplayProps {
    message: string
}

function ErrorDisplay({ message }: ErrorDisplayProps) {
    return <div className="error-message">{message}</div>
}

export default ErrorDisplay
