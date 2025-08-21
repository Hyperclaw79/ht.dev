// Jest globals setup - this must run before other setup files
import { jest, expect, describe, it, test, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// Make jest available globally
global.jest = jest;
global.expect = expect;
global.describe = describe;
global.it = it;
global.test = test;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;