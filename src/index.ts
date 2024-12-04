import {
    GridDimensions,
    RoverInstructions,
    RoverResult,
    Position,
    Orientation,
    Movement,
} from './types';
import { handleMovement, handleRotation } from './calculations';

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
    commands: Movement[];

    currentPositon: Position;
    lost: boolean = false;

    constructor(grid: GridDimensions, rover: RoverInstructions) {
        this.grid = grid;
        this.startPosition = rover.position;
        this.commands = rover.commands;

        this.currentPositon = rover.position;
    }

    simulate = (): void => {
        this.commands.forEach(command => {
            if (!this.lost) {
                this.handleCommand(command);
            }
        });
    };

    handleCommand = (command: Movement): void => {
        try {
            if (command === 'F') {
                this.currentPositon = handleMovement(this.grid, this.currentPositon);
            } else {
                this.currentPositon = handleRotation(command, this.currentPositon);
            }
        } catch (error) {
            this.lost = true;
        }
    };
}
