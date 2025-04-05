import { describe, test, mock, it } from 'node:test';
import assert from 'node:assert';
import { fetchData } from '../app.js';

describe('User feature', () => {
    test('fetches the data from the server', (t) => {
        const data = fetchData(1);

        t.assert.snapshot(data);
    });
});
