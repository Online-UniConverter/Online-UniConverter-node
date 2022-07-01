import OnlineUniConverter from '../../built/lib/OnlineUniConverter.js';
import { assert } from 'chai';
import * as fs from 'fs';
import apiKey from './ApiKey';

describe('TasksResource', () => {
    beforeEach(() => {
        this.onlineUniConverter = new OnlineUniConverter(apiKey, true);
    });

    describe('upload()', () => {
        it('uploads input.png', async () => {
            let task = await this.onlineUniConverter.tasks.create(
                'import/upload',
                {
                    name: 'upload-test'
                }
            );

            const stream = fs.createReadStream(
                __dirname + '/../integration/files/input.png'
            );

            await this.onlineUniConverter.tasks.upload(task, stream);

            task = await this.onlineUniConverter.tasks.wait(task.id);

            assert.equal(task.status, 'finished');
            assert.equal(task.result.files[0].filename, 'input.png');

            // await this.onlineUniConverter.tasks.delete(task.id);
        }).timeout(30000);
    });
});
