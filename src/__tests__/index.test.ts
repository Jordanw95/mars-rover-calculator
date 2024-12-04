import { handleMovement, handleRotation } from '../calculations';
import { parseArguments, parsePosition, parseCommands } from '../parsing';
import { MarsRoverCommand, Movement } from '../types';
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
