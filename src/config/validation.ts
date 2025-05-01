import * as Joi from 'joi';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';


export const validationSchema = Joi.object({
  DB_URI: Joi.string().required(),
});



export function IsLocalizedString(
  allowedLangs: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLocalizedString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'object' || Array.isArray(value)) return false;

          return Object.entries(value).every(
            ([key, val]) =>
              allowedLangs.includes(key) && typeof val === 'string' && val.trim() !== '',
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object with language keys (${allowedLangs.join(
            ', ',
          )}) and non-empty string values.`;
        },
      },
    });
  };
}
