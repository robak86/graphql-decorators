import {list, description, field, fieldLazy, nonNull, listLazy, id} from "../../lib/decorators/fields";
import {GraphQLID, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/metadata/FieldsMetadata";
import {expect} from 'chai';

describe("fields decorators", () => {
    describe("@id()", () => {
        class SomeClass {
            @id()
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLID);
        });

        it("uses defaults values", () => {
            expect(fieldConfig.nonNull).to.eq(true);
        });
    });

    describe("@field()", () => {
        class SomeClass {
            @field(GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("uses defaults values", () => {
            expect(fieldConfig.nonNull).to.eq(false);
            expect(fieldConfig.array).to.eq(false);
            expect(fieldConfig.nonNullItem).to.eq(false);
        });
    });

    describe("@fieldLazy()", () => {
        class SomeClass {
            @fieldLazy(() => GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds thunkType to property config", () => {
            expect(fieldConfig.thunkType()).to.eq(GraphQLString);
        });

        it("uses defaults values", () => {
            expect(fieldConfig.nonNull).to.eq(false);
            expect(fieldConfig.array).to.eq(false);
            expect(fieldConfig.nonNullItem).to.eq(false);
        });
    });

    describe("@list()", () => {
        class SomeClass {
            @list(GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("sets list config property to true", () => {
            expect(fieldConfig.array).to.eq(true);
        });
    });

    describe("@listLazy()", () => {
        class SomeClass {
            @listLazy(() => GraphQLString)
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.thunkType()).to.eq(GraphQLString);
        });

        it("sets list config property to true", () => {
            expect(fieldConfig.array).to.eq(true);
        });
    });

    describe("decorators chaining", () => {
        class SomeClass {
            @description('Some Field description')
            @list(GraphQLString) @nonNull()
            someField:string
        }

        let fieldConfig;
        beforeEach(() => {
            fieldConfig = FieldsMetadata.getForClass(SomeClass).getField('someField');
        });

        it("adds type to property config", () => {
            expect(fieldConfig.type).to.eq(GraphQLString);
        });

        it("sets list config property to true", () => {
            expect(fieldConfig.array).to.eq(true);
        });

        it("sets nonNullItem", () => {
            expect(fieldConfig.nonNullItem).to.eq(true);
        });

        it("sets nonNull", () => {
            expect(fieldConfig.nonNull).to.eq(true);
        });

        it("sets description", () => {
            expect(fieldConfig.description).to.eq('Some Field description');
        });
    });

});