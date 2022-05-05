import { requiredConfigVars } from './src/utils/config.vars';
import fs from 'fs';
import * as readline from 'readline';
require('dotenv').config();

console.log("\n\x1b[31mBy default, `yarn generate-env` will generate an .env-sample file you can use as a template to create your own .env file. Using argument env=live will generate a blank .env file. Use argument interactive to fill out the required fields and generate the .env file.\x1b[0m");

function askQuestion(query: string) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise<string>(resolve => rl.question(query, ans => { rl.close(); resolve(ans); }));
}

const optionalArguments: string[] = ["env", "force", "interactive"];

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

(async () => {
    let proceed = false;
    if (fs.existsSync(`./${outputFilename}`) && !args['force']) {
        const answer = await askQuestion(`The file \`${outputFilename}\` already exists. Would you like to overwrite? [y/N] `);
        proceed = (answer && answer.trim().toLowerCase() === "y" ? true : false);
    } else {
        proceed = true;
    }

    if (!proceed) {
        console.log(`Aborting \`${outputFilename}\` file creation...`);
        return;
    }

    let inputValues: { [key: string]: string } = {};
    if (args["interactive"]) {
        for (const item of requiredConfigVars) {
            let thisDefault = (process.env[item.key] ? process.env[item.key] : (item.default ? item.default : ""));
            let question = `Value for ${item.key}` + (item.note ? ` (${item.note})` : '') + (item.options ? `. Allowed values: \"${item.options.map(opt => opt.value).join("\", \"")}\"` : '') + (thisDefault ? ` [${thisDefault}]` : "") + ": ";

            let answer = (await askQuestion(question)).trim();
            if ((!answer || answer === "") && thisDefault) {
                answer = thisDefault;
            }
            inputValues[item.key] = answer;

            if (item.options) {
                const check = item.options.filter(item => item.value.toLowerCase() === answer.toLowerCase());
                if (check.length) {
                    if (check[0].dependencies) {
                        for (const dependency of check[0].dependencies) {
                            const answer = (await askQuestion(`Value for ${dependency}: `)).trim();
                            inputValues[dependency] = answer;
                        }
                    }
                }
            }
        }
    }

    const writeOutput: string[] = [];
    requiredConfigVars.forEach(item => {
        let output: string = `${item.key}=${(inputValues[item.key] ? inputValues[item.key] : "")}`;
        if (!item.options) {
            writeOutput.push(output);
            return;
        }
        writeOutput.push(output);

        item.options.forEach(subopt => {
            if (subopt.dependencies) {
                subopt.dependencies.forEach(dependency => {
                    writeOutput.push(`${dependency}=${(inputValues[dependency] ? inputValues[dependency] : "")}`);
                });
            }
        });
    });

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
