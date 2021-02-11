import { execSync } from 'child_process';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { Client } from 'pg';
import { config } from '../../config';

const schema = `test_${nanoid()}`;
const databaseUrl = `${config.db.testUrl}?schema=${schema}`;

export const createTestDatabase = (nodeModulesPath: string): PrismaClient => {
  // TODO: Verify path is valid
  const prismaBinary = join(nodeModulesPath, '.bin', 'prisma');

  process.env.DATABASE_URL = databaseUrl;

  execSync(`${prismaBinary} migrate up --create-db --experimental`, {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });

  const prismaClient = new PrismaClient();

  return prismaClient;
};

export const tearDownTestDatabase = async (
  prismaClient: PrismaClient,
): Promise<void> => {
  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();

  await prismaClient.$disconnect();
};
