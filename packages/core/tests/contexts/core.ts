import { expect } from "chai";
import { createGlue, doneAllGlues } from "../initializer";
import { Glue42Core } from "../../glue";
import { dataStore } from "../data";
import { Update, testCases, verify } from "./cases";
import { init } from "../core/base";
// tslint:disable:no-unused-expression

describe("contexts.core", () => {

    let glue!: Glue42Core.GlueCore;
    let glue2!: Glue42Core.GlueCore;

    beforeEach(async () => {
        glue = await createGlue();
        glue2 = await createGlue();
    });

    afterEach(async () => {
        await doneAllGlues();
    });

    it("check if set works correctly", (done) => {
        const data: Update[] = dataStore.map((i) => {
            return {
                data: i
            };
        });
        verify(glue, glue, data, done, true);
    });

    for (const testCase of testCases) {
        it("hear myself - " + testCase.title, (done) => {
            verify(glue, glue, testCase.test, done);
        });

        it("hear others - " + testCase.title, (done) => {
            verify(glue, glue2, testCase.test, done);
        });
    }
});
