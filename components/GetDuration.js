const getDuration = (endTime, startTime) => {    
    // If the durations are already in 0.0 format, return the difference
    if (endTime - startTime !== NaN) {
        return String(endTime - startTime)
    }

    // Convert start time in MM:SS format into S.S format
    const startSeconds = parseInt(startTime.slice(-2))
    const startMinutes = parseInt(startTime.slice(0,3))
    const startSum = (startMinutes * 60) + startSeconds

    // Convert end time in MM:SS format into S.S format
    const endSeconds = parseInt(endTime.slice(-2))
    const endMinutes = parseInt(endTime.slice(0,3))
    const endSum = (endMinutes * 60) + endSeconds

    return String(endSum - startSum)
}

export default getDuration;