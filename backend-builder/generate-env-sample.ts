import { requiredConfigVars } from './src/utils/config.vars';
import fs from 'fs';
import * as readline from 'readline';

function askQuestion(query: string) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise<string>(resolve => rl.question(query, ans => { rl.close(); resolve(ans); }));
}

const optionalArguments: string[] = ["env", "force"];

const tArgs = process.argv.slice(2);
let args: { [key: string]: string } = {};
tArgs.forEach(arg => {
    const split = arg.split('=');
    if (split.length) {
        if (!optionalArguments.includes(split[0].trim())) return;
        args[split[0].trim()] = (split[1] ? split[1].trim() : "default");
    }
});

let outputFilename = ".env-sample";
if (args["env"] && args["env"] === "live") {
    outputFilename = ".env";
}

const writeOutput: string[] = [];
requiredConfigVars.forEach(item => {
    let output: string = `${item.key}=`;
    if (item.note) {
        output += ` #${item.note}`;
    }
    if (!item.options) {
        writeOutput.push(output);
        return;
    }
    output += `#Allowed values: ${item.options.map(opt => opt.value).join(", ")}`;
    writeOutput.push(output);
    item.options.forEach(subopt => {
        if (subopt.dependencies) {
            subopt.dependencies.forEach(dependency => {
                writeOutput.push(`${dependency}= #Only required when using ${item.key}=${subopt.value}`);
            });
        }
    });
});

(async () => {
    let proceed = false;
    if (fs.existsSync(`./${outputFilename}`) && !args['force']) {
        const answer = await askQuestion(`The file \`${outputFilename}\` already exists. Would you like to overwrite? [y/N]`);
        proceed = (answer && answer.trim() === "y" ? true : false);
    } else {
        proceed = true;
    }

    if (!proceed) {
        console.log('Aborting...');
        return;
    }

    try {
        console.log(`Writing ${outputFilename}...`);
        fs.writeFile(`./${outputFilename}`, writeOutput.join("\r\n"), "utf8", (err) => {
            if (err) {
                throw err;
            }
        });
    } catch (error) {
        console.log(`Error writing \`${outputFilename}\`: ${JSON.stringify(error)}`);
        return;
    }
    console.log(`Complete.`);
})();
