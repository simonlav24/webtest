


export function detectFlick(startX, startY, endX, endY, startTime, endTime) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    // Adjust thresholds as needed
    const speedThreshold = 0.3; // pixels/ms
    const distanceThreshold = 50; // pixels

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const speed = distance / deltaTime;

    if (speed > speedThreshold && distance > distanceThreshold) {
        const direction = getDirection(deltaX, deltaY);
        console.log(`Flick detected! Speed: ${speed}, Direction: ${direction}`);
    }

    // return a 2vector (1,0) for right, (-1,0) for left, (0,1) for up, (0,-1) for down
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            return [1, 0];
        } else {
            return [-1, 0];
        }
    } else {
        if (deltaY > 0) {
            return [0, 1];
        } else {
            return [0, -1];
        }
    }
}

function getDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}


