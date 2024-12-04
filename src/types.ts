export type GridDimensions = {
    width: number;
    height: number;
};

export type Orientation = 'N' | 'E' | 'S' | 'W';

export type Movement = 'F' | 'L' | 'R';

export type Position = {
    x: number;
    y: number;
    orientation: Orientation;
};

export type RoverInstructions = {
    position: Position;
    commands: Movement[];
};

export type MarsRoverCommand = {
    grid: GridDimensions;
    rovers: RoverInstructions[];
};

export type RoverResult = {
    position: Position;
    lost: boolean;
};
