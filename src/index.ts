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
        const calculator = new MarsRoverCalculator(this.grid, rover);
        const result = calculator.simulate();
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

    simulate = (): RoverResult => {
        this.commands.forEach(command => {
            if (!this.lost) {
                this.handleCommand(command);
            }
        });
        return {
            position: this.currentPositon,
            lost: this.lost,
        };
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
