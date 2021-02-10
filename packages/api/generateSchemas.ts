import * as fs from 'fs';
import * as TJS from 'typescript-json-schema';
import { resolve, join } from 'path';

const BASEPATH = '../models/dto/';
//const BASEPATH_INCOMING = '../frontend-next/datatypes/dto/incoming/';
// optionally pass a base path
const basePath = './';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
};

const dirsOut: string[] = fs.readdirSync(BASEPATH);
//const dirsIncoming: string[] = fs.readdirSync(BASEPATH_INCOMING);

const fileOp = (file: string, base: string) => {
    if (file === 'incoming') return;
    const imported = require(base + file);
    // console.log(JSON.stringify(imported));
    console.log(Object.keys(imported));

    const program = TJS.getProgramFromFiles([resolve(base + file)], compilerOptions, basePath);
    Object.keys(imported).forEach((importedName) => {
        const schema = TJS.generateSchema(program, importedName, settings);
        console.log(schema);
        fs.writeFileSync(
            join('./src/validation-schemas/', importedName + '.json'),
            JSON.stringify(schema, null, 4),
            'utf-8'
        );
    });
};

dirsOut.forEach((file) => {
    fileOp(file, BASEPATH);
});
/*dirsIncoming.forEach((file) => {
    fileOp(file, BASEPATH_INCOMING);
});*/
