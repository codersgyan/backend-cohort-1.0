document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('glassCanvas')
    const ctx = canvas.getContext('2d')
    const progressText = document.getElementById('progressText')

    let receivedBytes = 0
    let totalBytes = 0 // Will be set from the response header or default

    // Draw the transparent glass and juice fill
    function drawGlass(progress) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Define glass dimensions
        const glassX = 50
        const glassY = 50
        const glassWidth = 100
        const glassHeight = 300
        const radius = 0

        // Draw the glass outline (transparent glass look)
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.beginPath()
        ctx.moveTo(glassX + radius, glassY)
        ctx.lineTo(glassX + glassWidth - radius, glassY)
        ctx.quadraticCurveTo(glassX + glassWidth, glassY, glassX + glassWidth, glassY + radius)
        ctx.lineTo(glassX + glassWidth, glassY + glassHeight - radius)
        ctx.quadraticCurveTo(
            glassX + glassWidth,
            glassY + glassHeight,
            glassX + glassWidth - radius,
            glassY + glassHeight
        )
        ctx.lineTo(glassX + radius, glassY + glassHeight)
        ctx.quadraticCurveTo(glassX, glassY + glassHeight, glassX, glassY + glassHeight - radius)
        ctx.lineTo(glassX, glassY + radius)
        ctx.quadraticCurveTo(glassX, glassY, glassX + radius, glassY)
        ctx.closePath()
        ctx.stroke()

        // Fill the glass with "cranberry juice"
        // Calculate fill height based on progress (from 0 to 1)
        const fillHeight = progress * glassHeight
        // Fill with a red translucent color to simulate cranberry juice
        ctx.fillStyle = 'rgba(220,20,60,0.6)' // Crimson tone
        ctx.beginPath()
        // Fill from the bottom upward
        ctx.rect(glassX, glassY + glassHeight - fillHeight, glassWidth, fillHeight)
        ctx.fill()
    }

    // Start fetching the streaming text
    fetch('http://localhost:3000/stream-text')
        .then((response) => {
            // Attempt to get the total bytes from the header (if available)
            const contentLengthHeader = response.headers.get('Content-Length')
            totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0
            // If not available, assume a default size (e.g., 100 KB)
            if (!totalBytes) {
                totalBytes = 11320941
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            // Function to process each chunk
            function readChunk() {
                reader
                    .read()
                    .then(({ done, value }) => {
                        if (done) {
                            progressText.textContent = `Completed: ${receivedBytes} bytes received.`
                            drawGlass(1) // Full glass when done
                            return
                        }
                        // Increase receivedBytes using the chunk's byte length
                        receivedBytes += value.length
                        // Calculate the progress (capped at 1)
                        const progress = Math.min(receivedBytes / totalBytes, 1)
                        progressText.textContent = `${receivedBytes} bytes received (${Math.floor(
                            progress * 100
                        )}%)`
                        drawGlass(progress)
                        // Continue with the next chunk
                        readChunk()
                    })
                    .catch((err) => {
                        console.error('Error reading chunk:', err)
                    })
            }

            readChunk()
        })
        .catch((error) => {
            console.error('Error fetching stream:', error)
            progressText.textContent = 'Error fetching data.'
        })
})
