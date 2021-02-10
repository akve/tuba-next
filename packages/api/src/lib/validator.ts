import * as Ajv from 'ajv';
import { Errors } from 'typescript-rest';
import { sentryLog } from '../utils/sentry';

class ValidationError extends Errors.HttpError {
    constructor(message?: string, statusCode: number = 422) {
        super('ValidationError', message);
        this.statusCode = statusCode;
    }
}

const validator = {
    validate: (objectToValidate: any, classNames: string) => {
        const singleClass = (className: string, skipLog?: boolean) => {
            const schema = require(`../validation-schemas/${className}.json`);

            // console.log('Validating', objectToValidate, className);
            try {
                const ajv = new Ajv({ allErrors: true });
                const valid = ajv.validate(schema, objectToValidate);
                if (!valid) {
                    if (!skipLog) console.log(ajv.errors);
                    throw new Error('validation failed: ' + ajv.errorsText());
                }

                // v.validate(objectToValidate, schema, { allowUnknownAttributes: false, throwError: true });
            } catch (e) {
                if (!skipLog) {
                    sentryLog('exception', e);
                    console.log(e);
                }
                throw new ValidationError(e.message);
            }
        };
        if (classNames.indexOf('|') < 0) return singleClass(classNames);
        const classes = classNames.split('|');
        let result = false;
        let resultError = null;
        classes.forEach((singleName) => {
            try {
                singleClass(singleName, true);
                result = true;
            } catch (e) {
                resultError = e.message;
            }
        });
        if (!result) {
            console.log('Validation failed');
            sentryLog('exception', resultError);
            throw new ValidationError(resultError);
        }
    },
};

export default validator;
