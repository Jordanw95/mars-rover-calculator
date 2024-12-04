import { MarsRoverCommand, Orientation, Movement } from "./types";

export const parsePosition = (positionStr: string): { x: number; y: number; orientation: Orientation } => {
    // Remove parentheses and split by comma
    const [x, y, orientation] = positionStr
        .replace(/[()]/g, '')
        .split(',')
        .map(s => s.trim());

    if (!['N', 'E', 'S', 'W'].includes(orientation)) {
        throw new Error(`Invalid orientation: ${orientation}`);
    }

    return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        orientation: orientation as Orientation
    };
}

export const parseCommands = (commandStr: string): Movement[] => {
    const commands = commandStr.split('') as Movement[];
    
    // Validate each command
    const validCommands = commands.every(cmd => ['F', 'L', 'R'].includes(cmd));
    if (!validCommands) {
        throw new Error(`Invalid commands: ${commandStr}`);
    }

    return commands;
}

const validateGridDimensions = (width?: string, height?: string): void => {
    if (!width || !height) {
        throw new Error('Grid dimensions are required');
    }

    const gridWidth = parseInt(width, 10);
    const gridHeight = parseInt(height, 10);

    if (isNaN(gridWidth) || isNaN(gridHeight)) {
        throw new Error('Grid dimensions must be valid numbers');
    }
}

const validateRoverCommands = (commands: string[]): void => {
    if (!commands || commands.length === 0) {
        throw new Error('Rover commands are required');
    }

    // Check that number of commands is even so we know we always have a position and command
    if (commands.length % 2 !== 0) {
        throw new Error('Each rover must have both a position and commands');
    }
}


export const parseArguments =(args: string[]): MarsRoverCommand =>  {
    const [width, height, ...robotCommands] = args;

    validateGridDimensions(width, height);
    validateRoverCommands(robotCommands);
    
    const rovers = [];
    for (let i = 0; i < robotCommands.length; i += 2) {
        rovers.push({
            position: parsePosition(robotCommands[i]),
            commands: parseCommands(robotCommands[i + 1])
        });
    }
    
    return {
        grid: {
            width: parseInt(width, 10),
            height: parseInt(height, 10)
        },
        rovers
    };
}