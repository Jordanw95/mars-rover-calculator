import { Main, MarsRoverCalculator } from '..';
import { handleMovement, handleRotation } from '../calculations';
import { parseArguments, parsePosition, parseCommands, parseResultsToString } from '../parsing';
import {
    GridDimensions,
    MarsRoverCommand,
    Movement,
    RoverInstructions,
    RoverResult,
} from '../types';
import '@jest/globals';

describe('Mars Rover Command Parser', () => {
    describe('parsePosition', () => {
        it('should correctly parse valid position string', () => {
            expect(parsePosition('(2,3,E)')).toEqual({
                x: 2,
                y: 3,
                orientation: 'E',
            });
        });

        it('should handle whitespace in position string', () => {
            expect(parsePosition('(2, 3, N)')).toEqual({
                x: 2,
                y: 3,
                orientation: 'N',
            });
        });

        it('should throw error for invalid orientation', () => {
            expect(() => parsePosition('(2,3,X)')).toThrow('Invalid orientation: X');
        });
    });

    describe('parseCommands', () => {
        it('should parse valid command string', () => {
            const result = parseCommands('LFRFF');
            const expected: Movement[] = ['L', 'F', 'R', 'F', 'F'];
            expect(result).toEqual(expected);
        });

        it('should throw error for invalid commands', () => {
            expect(() => parseCommands('LFXRFF')).toThrow('Invalid commands: LFXRFF');
        });
    });

    describe('parseArguments', () => {
        it('should parse valid input arguments', () => {
            const args = ['4', '8', '(2,3,E)', 'LFRFF', '(0,2,N)', 'FFLFRFF'];
            const expected: MarsRoverCommand = {
                grid: {
                    width: 4,
                    height: 8,
                },
                rovers: [
                    {
                        position: { x: 2, y: 3, orientation: 'E' },
                        commands: ['L', 'F', 'R', 'F', 'F'],
                    },
                    {
                        position: { x: 0, y: 2, orientation: 'N' },
                        commands: ['F', 'F', 'L', 'F', 'R', 'F', 'F'],
                    },
                ],
            };
            expect(parseArguments(args)).toEqual(expected);
        });

        it('should throw error when grid dimensions are missing', () => {
            const args = ['4'];
            expect(() => parseArguments(args)).toThrow();
        });

        it('should throw error when rover commands are missing', () => {
            const args = ['4', '8'];
            expect(() => parseArguments(args)).toThrow();
        });

        it('should throw error when rover commands are incomplete', () => {
            const args = ['4', '8', '(2,3,E)'];
            expect(() => parseArguments(args)).toThrow(
                'Each rover must have both a position and commands'
            );
        });

        it('should handle multiple rovers', () => {
            const args = ['4', '8', '(2,3,E)', 'LFRFF', '(0,2,N)', 'FFLFRFF', '(1,1,S)', 'LRF'];
            const result = parseArguments(args);
            expect(result.rovers).toHaveLength(3);
            expect(result.rovers[2].position).toEqual({
                x: 1,
                y: 1,
                orientation: 'S',
            });
        });

        it('should validate grid dimensions are numbers', () => {
            const args = ['a', '8', '(2,3,E)', 'LFRFF'];
            expect(() => parseArguments(args)).toThrow();
        });
    });

    describe('parseResultsToString', () => {
        it('should parse results to string', () => {
            const results: RoverResult[] = [{ position: { x: 4, y: 4, orientation: 'E' }, lost: false }];
            expect(parseResultsToString(results)).toEqual('(4, 4, E)');
        });

        it('should parse results to string when lost', () => {
            const results: RoverResult[] = [{ position: { x: 0, y: 4, orientation: 'E' }, lost: true }];
            expect(parseResultsToString(results)).toEqual('(0, 4, E) LOST');
        });
    });
});

describe('Unit Test: Calculations', () => {
    describe('handleMovement', () => {
        it('should handle movement north', () => {
            expect(
                handleMovement({ width: 4, height: 8 }, { x: 2, y: 3, orientation: 'N' })
            ).toEqual({
                x: 2,
                y: 4,
                orientation: 'N',
            });
        });

        it('should handle movement east', () => {
            expect(
                handleMovement({ width: 4, height: 8 }, { x: 2, y: 3, orientation: 'E' })
            ).toEqual({
                x: 3,
                y: 3,
                orientation: 'E',
            });
        });

        it('should handle movement south', () => {
            expect(
                handleMovement({ width: 4, height: 8 }, { x: 2, y: 3, orientation: 'S' })
            ).toEqual({
                x: 2,
                y: 2,
                orientation: 'S',
            });
        });

        it('should handle movement west', () => {
            expect(
                handleMovement({ width: 4, height: 8 }, { x: 2, y: 3, orientation: 'W' })
            ).toEqual({
                x: 1,
                y: 3,
                orientation: 'W',
            });
        });

        it('should throw error if movement would go off the grid', () => {
            expect(() =>
                handleMovement({ width: 4, height: 8 }, { x: 2, y: 8, orientation: 'N' })
            ).toThrow();
        });
    });

    describe('handleRotation', () => {
        it('should handle rotation right from north', () => {
            expect(handleRotation('R', { x: 2, y: 3, orientation: 'N' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'E',
            });
        });

        it('should handle rotation left from north', () => {
            expect(handleRotation('L', { x: 2, y: 3, orientation: 'N' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'W',
            });
        });

        it('should handle rotation right from east', () => {
            expect(handleRotation('R', { x: 2, y: 3, orientation: 'E' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'S',
            });
        });

        it('should handle rotation left from east', () => {
            expect(handleRotation('L', { x: 2, y: 3, orientation: 'E' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'N',
            });
        });

        it('should handle rotation right from south', () => {
            expect(handleRotation('R', { x: 2, y: 3, orientation: 'S' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'W',
            });
        });

        it('should handle rotation left from south', () => {
            expect(handleRotation('L', { x: 2, y: 3, orientation: 'S' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'E',
            });
        });

        it('should handle rotation right from west', () => {
            expect(handleRotation('R', { x: 2, y: 3, orientation: 'W' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'N',
            });
        });

        it('should handle rotation left from west', () => {
            expect(handleRotation('L', { x: 2, y: 3, orientation: 'W' })).toEqual({
                x: 2,
                y: 3,
                orientation: 'S',
            });
        });
    });
});

describe('Unit Test:MarsRoverCalculator', () => {
    const testCases: {
        name: string;
        grid: GridDimensions;
        rover: RoverInstructions;
        expected: RoverResult;
    }[] = [
        {
            name: 'should move forward and rotate left and right',
            grid: { width: 4, height: 8 },
            rover: {
                position: { x: 2, y: 3, orientation: 'E' },
                commands: ['L', 'F', 'R', 'F', 'F'],
            },
            expected: { position: { x: 4, y: 4, orientation: 'E' }, lost: false },
        },
        {
            name: 'should handle multiple rotations',
            grid: { width: 5, height: 5 },
            rover: {
                position: { x: 1, y: 1, orientation: 'N' },
                commands: ['R', 'R', 'F', 'L', 'L', 'F'],
            },
            expected: { position: { x: 1, y: 1, orientation: 'N' }, lost: false },
        },
        {
            name: 'should handle edge of grid',
            grid: { width: 3, height: 3 },
            rover: {
                position: { x: 0, y: 0, orientation: 'W' },
                commands: ['F'],
            },
            expected: { position: { x: 0, y: 0, orientation: 'W' }, lost: true },
        },
        {
            name: 'should handle complex path',
            grid: { width: 10, height: 10 },
            rover: {
                position: { x: 5, y: 5, orientation: 'N' },
                commands: ['F', 'R', 'F', 'R', 'F', 'L', 'F', 'L', 'F'],
            },
            expected: { position: { x: 7, y: 6, orientation: 'N' }, lost: false },
        },
        {
            name: 'should handle complex path to get lost',
            grid: { width: 10, height: 10 },
            rover: {
                position: { x: 5, y: 5, orientation: 'N' },
                commands: ['F', 'R', 'F', 'R', 'F', 'L', 'F', 'L', 'F', 'F', 'F', 'F', 'F', 'F'],
            },
            expected: { position: { x: 7, y: 10, orientation: 'N' }, lost: true },
        },
        {
            name: 'should handle complex path to get lost return last position before lost',
            grid: { width: 10, height: 10 },
            rover: {
                position: { x: 5, y: 5, orientation: 'N' },
                commands: [
                    'F',
                    'R',
                    'F',
                    'R',
                    'F',
                    'L',
                    'F',
                    'L',
                    'F',
                    'F',
                    'F',
                    'F',
                    'F',
                    'F',
                    'F',
                    'L',
                    'F',
                ],
            },
            expected: { position: { x: 7, y: 10, orientation: 'N' }, lost: true },
        },
        {
            name: 'should handle multiple full rotations',
            grid: { width: 10, height: 10 },
            rover: {
                position: { x: 5, y: 5, orientation: 'N' },
                commands: ['R', 'R', 'R', 'R'],
            },
            expected: { position: { x: 5, y: 5, orientation: 'N' }, lost: false },
        },
    ];

    testCases.forEach(({ name, grid, rover, expected }) => {
        it(name, () => {
            const calculator = new MarsRoverCalculator(grid, rover);
            const result = calculator.simulate();
            expect(result).toEqual(expected);
        });
    });
});

describe('End to End Test: Main loop', () => {
    it('should handle multiple rovers', () => {
        const grid = { width: 10, height: 10 };
        const rovers: RoverInstructions[] = [
            {
                position: { x: 2, y: 3, orientation: 'E' },
                commands: ['L', 'F', 'R', 'F', 'F'],
            },
            {
                position: { x: 1, y: 1, orientation: 'N' },
                commands: ['R', 'R', 'F', 'L', 'L', 'F'],
            },
            {
                position: { x: 2, y: 3, orientation: 'E' },
                commands: ['L', 'F', 'R', 'F', 'F'],
            },
            {
                position: { x: 1, y: 1, orientation: 'N' },
                commands: ['R', 'R', 'F', 'L', 'L', 'F'],
            },
            {
                position: { x: 2, y: 3, orientation: 'E' },
                commands: ['L', 'F', 'R', 'F', 'F'],
            },
            {
                position: { x: 1, y: 1, orientation: 'N' },
                commands: ['R', 'R', 'F', 'L', 'L', 'F'],
            },
        ];
        const expected: RoverResult[] = [
            { position: { x: 4, y: 4, orientation: 'E' }, lost: false },
            { position: { x: 1, y: 1, orientation: 'N' }, lost: false },
            { position: { x: 4, y: 4, orientation: 'E' }, lost: false },
            { position: { x: 1, y: 1, orientation: 'N' }, lost: false },
            { position: { x: 4, y: 4, orientation: 'E' }, lost: false },
            { position: { x: 1, y: 1, orientation: 'N' }, lost: false },
        ];
        const main = new Main(grid, rovers);
        const results = main.run();
        expect(results).toEqual(expected);
    });
});
