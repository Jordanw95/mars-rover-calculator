import { parseArguments, parseResultsToString } from './parsing';
import { Main } from './index';

// Only run this if this file is being run directly
if (require.main === module) {
    // Only arguments after the first two are the input
    const input = process.argv.slice(2);
    console.log("*".repeat(20))
    console.log('INPUT', '\n', input.join(' '));
    console.log("*".repeat(20))

    const command = parseArguments(input);
    const main = new Main(command.grid, command.rovers);
    const result = main.run();
    console.log("*".repeat(20))
    console.log('Results', '\n', parseResultsToString(result));
    console.log("*".repeat(20))

}
