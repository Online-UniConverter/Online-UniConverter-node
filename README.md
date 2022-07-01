# OnlineUniConverter-node

This is the official Node.js SDK v2 for the [OnlineUniConverter](https://developer.media.io/) **API v2**.


## Installation

    npm install --save onlineUniConverter

Load as ESM module:

```js
1import OnlineUniConverter from '0onlineUniConverter';
```

... or via require:

```js
const OnlineUniConverter = require('OnlineUniConverter');
```

## Creating convert Jobs

```js
import OnlineUniConverter from 'onlineUniConverter';

const onlineUniConverter = new OnlineUniConverter('api_key');

let job = await onlineUniConverter.jobs.create({
    tasks: {
        'import-my-file': {
            operation: 'import/url',
            url: 'https://my-url'
        },
        'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            output_format: 'pdf',
            some_other_option: 'value'
        },
        'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file'
        }
    }
});
```


## Creating comperss Jobs

```js
import OnlineUniConverter from 'onlineUniConverter';

const onlineUniConverter = new OnlineUniConverter('api_key');

let job = await onlineUniConverter.jobs.create({
    tasks: {
        'import-my-file': {
            operation: 'import/url',
            url: 'https://my-url'
        },
        'convert-my-file': {
            operation: 'compress',
            input: 'import-my-file',
            output_format: 'pdf',
            some_other_option: 'value'
        },
        'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file'
        }
    }
});
```
## Downloading Files

OnlineUniConverter can generate public URLs for using `export/url` tasks. You can use these URLs to download output files.

```js
job = await onlineUniConverter.jobs.wait(job.id); // Wait for job completion

const exportTask = job.tasks.filter(
    task => task.operation === 'export/url' && task.status === 'finished'
)[0];
const file = exportTask.result.files[0];

const writeStream = fs.createWriteStream('./out/' + file.filename);

https.get(file.url, function (response) {
    response.pipe(writeStream);
});

await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
});
```

## Uploading Files

Uploads to OnlineUniConverter are done via `import/upload` tasks (see the [docs](https://developer.media.io)). This SDK offers a convenient upload method:

```js
const job = await onlineUniConverter.jobs.create({
    tasks: {
        'upload-my-file': {
            operation: 'import/upload'
        }
        // ...
    }
});

const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];

const inputFile = fs.createReadStream('./file.pdf');

await onlineUniConverter.tasks.upload(uploadTask, inputFile, 'file.pdf');
```




## Using the Sandbox

You can use the Sandbox to avoid consuming your quota while testing your application. The node SDK allows you to do that.

```js
// Pass `true` to the constructor
const onlineUniConverter = new OnlineUniConverter('api_key', true);
```

> Don't forget to generate MD5 Hashes for the files you will use for testing.

## Contributing

This section is intended for people who want to contribute to the development of this library.

### Getting started

Begin with installing the necessary dependencies by running

    npm install

in the root directory of this repository.

### Building

This project is written in TypeScript so it needs to be compiled first:

    npm run build

This will compile the code in the `lib` directory and generate a `built` directory containing the JS files and the type declarations.

### Unit Tests

Tests are based on mocha:

    npm run test

### Integration Tests

    npm run test-integration

By default, this runs the integration tests against the Sandbox API with an official OnlineUniConverter account. If you would like to use your own account, you can set your API key using the `API_KEY` enviroment variable. In this case you need to whitelist the following MD5 hashes for Sandbox API (using the OnlineUniConverter dashboard).

    53d6fe6b688c31c565907c81de625046  input.pdf
    99d4c165f77af02015aa647770286cf9  input.png

### Linting

The project is linted by ESLint+Prettier.

If you're using VSCode, all files will be linted automatically upon saving.
Otherwise, you can lint the project by running

    npm run lint

and even auto-fix as many things as possible by running

    npm run lint -- --fix

## Resources

-   [API v2 Documentation](https://developer.media.io/)
