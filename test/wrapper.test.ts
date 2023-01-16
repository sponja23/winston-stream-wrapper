import { transcode, TranscodeEncoding } from "buffer";
import { mock } from "jest-mock-extended";
import { Logger } from "winston";

import LogStreamWrapper from "../src/index";

function expectLogs(logger: Logger, level: string, messages: string[]) {
    expect(logger.log).toHaveBeenCalledTimes(messages.length);

    messages.forEach((message, i) => {
        expect(logger.log).toHaveBeenNthCalledWith(i + 1, level, message);
    });
}

describe("Base log tests", () => {
    it("logs a single message", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
        });

        wrapper.write("Hello world!");

        expectLogs(logger, "info", ["Hello world!"]);
    });

    it("logs multiple messages", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
        });

        wrapper.write("foo");
        wrapper.write("bar");
        wrapper.write("baz");

        expectLogs(logger, "info", ["foo", "bar", "baz"]);
    });

    it("logs a large message", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
        });

        const message = "foo".repeat(10000);
        wrapper.write(message);

        expectLogs(logger, "info", [message]);
    });

    it("logs a lot of messages", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
        });

        const messages = Array.from({ length: 10000 }, (_, i) => `foo${i}`);

        messages.forEach((message) => wrapper.write(message));

        expectLogs(logger, "info", messages);
    });

    it("logs with different levels", () => {
        for (const level of ["info", "warn", "error"]) {
            const logger = mock<Logger>();
            const wrapper = new LogStreamWrapper(logger, {
                level,
            });

            wrapper.write("Hello world!");

            expectLogs(logger, level, ["Hello world!"]);
        }
    });

    it("logs with different encodings", () => {
        for (const encoding of [
            "utf8",
            "ascii",
            "binary",
        ] as TranscodeEncoding[]) {
            const logger = mock<Logger>();
            const wrapper = new LogStreamWrapper(logger, {
                level: "info",
                decodeStrings: false,
            });

            const message = "Hello world!";
            const buffer = transcode(Buffer.from(message), "utf8", encoding);

            wrapper.write(buffer.toString());

            expectLogs(logger, "info", [message]);
        }
    });
});

describe("Split lines tests", () => {
    it("splits lines", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: true,
        });

        wrapper.write("foo\nbar\nbaz");

        expectLogs(logger, "info", ["foo", "bar", "baz"]);
    });

    it("splits many lines", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: true,
        });

        const messages = Array.from({ length: 10000 }, (_, i) => `foo${i}`);
        wrapper.write(messages.join("\n"));

        expectLogs(logger, "info", messages);
    });

    it("doesn't split lines", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: false,
        });

        wrapper.write("foo\nbar\nbaz");

        expectLogs(logger, "info", ["foo\nbar\nbaz"]);
    });

    it("splits lines with custom separator", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: true,
            lineSeparator: " ",
        });

        wrapper.write("foo bar baz");

        expectLogs(logger, "info", ["foo", "bar", "baz"]);
    });

    it("skips empty lines", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: true,
            skipEmptyLines: true,
        });

        wrapper.write("foo\n\n\nbar\n\nbaz");

        expectLogs(logger, "info", ["foo", "bar", "baz"]);
    });

    it("doesn't skip empty lines", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
            splitLines: true,
            skipEmptyLines: false,
        });

        wrapper.write("foo\n\n\nbar\n\nbaz");

        expectLogs(logger, "info", ["foo", "", "", "bar", "", "baz"]);
    });
});
