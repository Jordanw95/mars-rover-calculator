import { parseArguments } from './parsing';
import { Main } from './index';

// Only run this if this file is being run directly
if (require.main === module) {
    console.log('Running parsing...');
    const command = parseArguments(process.argv.slice(2));
    // log parsed result as json with 2 spaces for readability
    console.log('Parsing result', '\n', JSON.stringify(command, null, 2));

    const main = new Main(command.grid, command.rovers);
    main.run();
}
