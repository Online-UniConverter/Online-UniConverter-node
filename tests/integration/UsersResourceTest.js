import OnlineUniConverter from '../../built/lib/OnlineUniConverter.js';
import apiKey from './ApiKey';
import { assert } from 'chai';

describe('UsersResource', () => {
    beforeEach(() => {
        this.onlineUniConverter = new OnlineUniConverter(apiKey, true);
    });

    describe('me()', () => {
        it('should fetch the current user', async () => {
            const data = await this.onlineUniConverter.users.me();

            console.log(data);

            assert.isObject(data);
            assert.containsAllKeys(data, [
                'id',
                'username',
                'email',
                'credits'
            ]);
        });
    });
});
