import { mock } from "jest-mock-extended";
import { Logger } from "winston";

import LogStreamWrapper from "../src/index";

function expectCallsWith(logger: Logger, params: [string, string][]) {
    params.forEach((param, i) => {
        expect(logger.log).toHaveBeenNthCalledWith(i + 1, param[0], param[1]);
    });
}

describe("LogStreamWrapper tests", () => {
    it("logs a single message", () => {
        const logger = mock<Logger>();
        const wrapper = new LogStreamWrapper(logger, {
            level: "info",
        });

        wrapper.write("Hello world!");

        expectCallsWith(logger, [["info", "Hello world!"]]);
    });
});
