# winston-stream-wrapper

This package provides a type-safe wrapper for [winston](https://github.com/winstonjs/winston) `Logger` instances that allows them to easily be used as a [Node.js `WritableStream`](https://nodejs.org/api/stream.html).

## Motivation

I wrote this package because I needed to pipe a subprocess' output to a `Logger` instance. I tried using [`winston-stream`](https://www.npmjs.com/package/winston-stream), but it had a few issues around buffered streams that are solved by the `splitLines` option in this package.

## Installation

```bash
npm install winston-stream-wrapper
```

## Usage

The following example shows how to pipe a subprocess' `stdout` and `stderr` to a `Logger` instance:

```ts
import { spawn } from "child_process";
import { createLogger, format, transports } from 'winston';

import LogStreamWrapper from 'winston-stream-wrapper';

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.Console(),
    ],
});

const infoStream = new LogStreamWrapper(logger, {
    level: 'info',
    splitLines: true,
});

const errorStream = new LogStreamWrapper(logger, {
    level: 'error',
    splitLines: true,
});

const subprocess = spawn('some-command', ['some', 'args']);

// This will log each line of the subprocess' output as a separate log message.
subprocess.stdout.pipe(infoStream);
subprocess.stderr.pipe(errorStream);
```

## API

The package exports a single class, `LogStreamWrapper`, which is a `WritableStream` that can be used to pipe data to a `Logger` instance.

### `LogStreamWrapper`

```ts
class LogStreamWrapper extends Writable {
    constructor(logger: Logger, options: LogStreamWrapperOptions);
}
```

#### Options

The `LogStreamWrapper` constructor takes an options object with the following properties:

* `level`: The level to log messages at.
* `splitLines`: Whether to split the stream's input into separate log messages on newlines. If `false`, every chunk of data will be logged as a single log message. Defaults to `true`.
* `skipEmptyLines`: Whether to skip empty lines when `splitLines` is `true`. Defaults to `true`.
* `lineSeparator`: The line separator to use when `splitLines` is `true`. Defaults to `\n`.

## Issues

If you find any issues with this package, please [open an issue](https://github.com/sponja23/winston-stream-wrapper/issues) on GitHub.
