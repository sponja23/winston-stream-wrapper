import { Writable } from "stream";
import { Logger } from "winston";

type LogStreamWrapperOptions = {
    level: string;
    splitLines?: boolean;
    skipEmptyLines?: boolean;
    lineSeparator?: string;
};

/**
 * A stream that writes to the logger.
 */
class LogStreamWrapper extends Writable {
    private logger: Logger;
    private level: string;
    private splitLines: boolean;
    private skipEmptyLines: boolean;
    private lineSeparator: string;

    constructor(
        logger: Logger,
        {
            level,
            splitLines = true,
            skipEmptyLines = true,
            lineSeparator = "\n",
        }: LogStreamWrapperOptions
    ) {
        super();

        this.logger = logger;

        // Config options
        this.level = level;
        this.splitLines = splitLines;
        this.skipEmptyLines = skipEmptyLines;
        this.lineSeparator = lineSeparator;
    }

    _write(
        chunk: any,
        encoding: BufferEncoding | "buffer",
        callback: Function
    ) {
        const decoded: string =
            encoding === "buffer" ? chunk.toString() : chunk.toString(encoding);

        if (!this.splitLines) {
            this.logger.log(this.level, decoded);
        } else {
            let messages = decoded.split(this.lineSeparator);

            if (this.skipEmptyLines)
                messages = messages.filter((message) => message.length > 0);

            for (const message of messages)
                this.logger.log(this.level, message);
        }

        callback();
    }
}

export default LogStreamWrapper;
