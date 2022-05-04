import { requiredConfigVars } from './src/utils/config';
import fs from 'fs';

const writeOutput: string[] = [];
requiredConfigVars.forEach(item => {
    let output: string = `${item.key}=`;
    if (!item.options) {
        writeOutput.push(output);
        return;
    }
    output += "\t" + `#Allowed values: ${item.options.map(opt => opt.value).join(", ")}`;
    writeOutput.push(output);
    item.options.forEach(subopt => {
        if (subopt.dependencies) {
            subopt.dependencies.forEach(dependency => {
                writeOutput.push(`${dependency}= #Only required when using ${item.key}=${subopt.value}`);
            });
        }
    });
});

try {
    fs.writeFile("./.env-sample", writeOutput.join("\r\n"), "utf8", (err) => {
        if (err) {
            throw err;
        }
    });
} catch (error) {
    console.log('Error writing .env-sample: ' + JSON.stringify(error));
}