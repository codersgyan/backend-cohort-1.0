import { test, describe } from 'node:test';
import assert from 'node:assert';
import { greet, greetInRussian } from '../app.js';

describe('Greeting functions', () => {
    test('greet returns the correct greeting', () => {
        // AAA
        /**
         * Arrange
         * Act
         * Assert
         */
        const expected = 'Hello, World!';
        const actual = greet('World');

        assert.strictEqual(actual, expected);
    });

    test('greet returns the correct greeting in Russian', () => {
        // AAA
        /**
         * Arrange
         * Act
         * Assert
         */
        const expected = 'Привет, Мир!';
        const actual = greetInRussian('Мир');

        assert.strictEqual(actual, expected);
    });
});
