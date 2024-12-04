import { Orientation, Position, Movement, GridDimensions } from './types';

const calculateNewPosition = (position: Position): Position => {
    const { orientation } = position;
    switch (orientation) {
        case 'N':
            return { ...position, y: position.y + 1 };
        case 'E':
            return { ...position, x: position.x + 1 };
        case 'S':
            return { ...position, y: position.y - 1 };
        case 'W':
            return { ...position, x: position.x - 1 };
    }
};

export const handleMovement = (grid: GridDimensions, position: Position): Position => {
    const newPosition = calculateNewPosition(position);

    if (
        newPosition.x < 0 ||
        newPosition.x > grid.width ||
        newPosition.y < 0 ||
        newPosition.y > grid.height
    ) {
        throw new Error('Rover has fallen off the grid');
    }

    return newPosition;
};

const DIRECTION_MAP: Record<Orientation, number> = {
    N: 0,
    E: 1,
    S: 2,
    W: 3,
};

const REVERSE_DIRECTION_MAP: Record<number, Orientation> = {
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W',
};

export const handleRotation = (command: Movement, position: Position): Position => {
    const { orientation } = position;
    const direction = DIRECTION_MAP[orientation];
    if (command === 'L') {
        const newDirection = (direction - 1 + 4) % 4;
        return { ...position, orientation: REVERSE_DIRECTION_MAP[newDirection] };
    } else {
        const newDirection = (direction + 1) % 4;
        return { ...position, orientation: REVERSE_DIRECTION_MAP[newDirection] };
    }
};
