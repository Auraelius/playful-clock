/*
  For some reason I decided to use all ESM imports
  But some of these packages are commonJS, which don't have named exports like ESM, so we have to import then assign
  So that's why we had all the import shenanigans below
*/
import logger from '../src/logger.js';

import chai_pkg from 'chai';
const {expect} = chai_pkg;
global.expect = expect;


import dotenv from 'dotenv';
const configuration = dotenv.config();
configuration.error
  ? logger.error('Testing setup error: ', configuration.error)
  : logger.info('Testing setup configuration: ', configuration.parsed);

import supertest from 'supertest';
global.supertest = supertest;

// finally some configuration

process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';

// logger.info('setup.js done')





