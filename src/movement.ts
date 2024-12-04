import { Orientation, Position, Movement } from './types';

export const handleMovement = (
    command: Movement,
    orientation: Orientation,
    position: Position
): Position => {
    return position;
};

export const handleRotation = (command: Movement, orientation: Orientation): Orientation => {
    return orientation;
};
