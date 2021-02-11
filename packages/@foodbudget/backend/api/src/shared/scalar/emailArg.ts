import { AppError } from '@foodbudget/errors';
import { scalarType } from '@nexus/schema';
import { Kind } from 'graphql';

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const emailArg = scalarType({
  name: 'Email',
  asNexusMethod: 'email',
  description: 'Verify email follows the format and lower case it',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new AppError({
        message: 'Email must be of a string format.',
        isOperational: true,
      });
    }

    if (!EMAIL_REG.test(value)) {
      throw new AppError({
        message: 'Email is not in a valid format.',
        isOperational: true,
      });
    }

    return value.toLowerCase();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING && EMAIL_REG.test(ast.value)) {
      return ast.value.toLowerCase();
    }

    throw new AppError({
      message: 'Email is not in a valid format.',
      isOperational: true,
    });
  },
});
