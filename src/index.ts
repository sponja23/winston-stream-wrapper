import { Writable } from "stream";
import { Logger } from "winston";

type LogStreamWrapperOptions = {
    level: string;
};

/**
 * A stream that writes to the logger.
 */
class LogStreamWrapper extends Writable {
    private logger: Logger;
    private level: string;

    constructor(logger: Logger, { level }: LogStreamWrapperOptions) {
        super();
        this.logger = logger;
        this.level = level;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: Function) {
        const s: string = chunk.toString(encoding);

        const messages = s.split("\n").filter((message) => message.length > 0);

        for (const message of messages) this.logger.log(this.level, message);

        callback();
    }
}

export default LogStreamWrapper;
