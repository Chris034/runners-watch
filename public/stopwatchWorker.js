self.onmessage = function (e) {
    const { command, state, stopWatchInterval } = e.data;

    if (command === 'start') {
        let intervalId = setInterval(() => {
            let { totalTime, totalWalkTime, totalRunTime, endOfLastInterval, isWalking, currentWalkInterval, currentRunInterval, walkLength, runLength, numberOfWalkIntervals, numberOfRunIntervals } = state;
            totalTime += stopWatchInterval;

            if (isWalking) {
                totalWalkTime += stopWatchInterval;
                const currentIntervalLength = totalTime - endOfLastInterval;
                if (currentIntervalLength >= walkLength * 60000) { // Convert walkLength to milliseconds
                    endOfLastInterval = totalTime;
                    isWalking = false;
                    currentWalkInterval += 1;
                }
            } else {
                totalRunTime += stopWatchInterval;
                const currentIntervalLength = totalTime - endOfLastInterval;
                if (currentIntervalLength >= runLength * 60000) { // Convert runLength to milliseconds
                    endOfLastInterval = totalTime;
                    isWalking = true;
                    currentRunInterval += 1;
                }
            }

            const isComplete = currentWalkInterval >= numberOfWalkIntervals && currentRunInterval >= numberOfRunIntervals;

            self.postMessage({
                totalTime,
                totalWalkTime,
                totalRunTime,
                endOfLastInterval,
                isWalking,
                currentWalkInterval,
                currentRunInterval,
                isComplete,
            });

            if (isComplete) {
                clearInterval(intervalId);
            }
        }, stopWatchInterval);
    }
};