import {
    GridDimensions,
    RoverInstructions,
    RoverResult,
    Position,
    Orientation,
    Movement,
} from './types';
import { handleMovement, handleRotation } from './movement';

export class Main {
    grid: GridDimensions;
    rovers: RoverInstructions[];
    results: RoverResult[] = [];

    constructor(grid: GridDimensions, rovers: RoverInstructions[]) {
        this.grid = grid;
        this.rovers = rovers;
    }

    run = (): void => {
        this.rovers.forEach(rover => {
            this.processRover(rover);
        });
    };

    processRover = (rover: RoverInstructions): void => {
        const result: RoverResult = {
            position: rover.position,
            lost: false,
        };
        this.results.push(result);
    };
}

export class MarsRoverCalculator {
    grid: GridDimensions;
    startPosition: Position;
    startingOrientation: Orientation;
    commands: Movement[];

    currentPositon: Position;
    currentOrientation: Orientation;
    lost: boolean;

    constructor(grid: GridDimensions, rover: RoverInstructions) {
        this.grid = grid;
        this.startPosition = rover.position;
        this.startingOrientation = rover.position.orientation;
        this.commands = rover.commands;

        this.currentPositon = rover.position;
        this.currentOrientation = rover.position.orientation;
        this.lost = false;
    }

    simulate = (): void => {
        this.commands.forEach(command => {
            this.handleCommand(command);
        });
    };

    handleCommand = (command: Movement): void => {
        try {
            if (command === 'F') {
                handleMovement(command, this.currentOrientation, this.currentPositon);
            } else {
                handleRotation(command, this.currentOrientation);
            }
        } catch (error) {
            this.lost = true;
        }
    };
}
