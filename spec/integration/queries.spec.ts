import {graphql, GraphQLSchema} from "graphql";
import {createSchema} from "../../lib";
import {Query} from "./types/Query";
import {Mutation} from "./types/Mutation";
import {expect} from 'chai';

describe("root query", () => {
    let schema:GraphQLSchema;
    beforeEach(() => {
        schema = createSchema(Query, Mutation)
    });

    describe("simple query", () => {
        it("returns correct data", async () => {
            let query = `
                query {
                    users {
                        id
                        firstName
                        firstNameUpperCase
                        roles
                        employers {
                            id
                            name
                        }
                    }
                }
            `;

            let response = await graphql(schema, query);
            let expectedResponseData = [
                {
                    id: '1',
                    firstName: 'Jane',
                    firstNameUpperCase: 'JANE',
                    roles: ['admin'],
                    employers: [
                        {
                            id: "1",
                            name: "Some Company"
                        }
                    ]
                },
                {
                    id: '2',
                    firstName: 'John',
                    firstNameUpperCase: 'JOHN',
                    roles: ['stuff'],
                    employers: [
                        {
                            id: "2",
                            name: "Some Other Company"
                        }
                    ]
                },
                {
                    id: '3',
                    firstName: 'Adam',
                    firstNameUpperCase: 'ADAM',
                    roles: ['guest'],
                    employers: [
                        {
                            id: "3",
                            name: "Company"
                        }
                    ]
                }];

            expect(response.data.users).to.eql(expectedResponseData);
        });
    });

    describe("query with params", () => {
        it("returns correct data", async () => {
            let query = `
                query Users($firstName: String){
                    users(params: {firstName: $firstName}) {
                        id
                    }
                }
            `;

            let response = await graphql(schema, query, {}, {}, {firstName: 'J'});
            let expectedResponseData = [{id: '1'}, {id: '2'}];

            expect(response.data.users).to.eql(expectedResponseData);
        });
    });


    describe("union example", () => {
        it("returns correct data", async () => {
            let query = `
                query {
                    search {
                        ... on User {
                            __typename
                            firstName
                            id
                        }
                        ... on Company {
                            __typename
                            name
                            id
                        }
                    }
                }
            `;

            let response = await graphql(schema, query, {}, {}, {firstName: 'J'});
            let expectedResponseData = [
                {
                    __typename: "User",
                    firstName: "Jane",
                    id: "1"
                },
                {
                    __typename: "User",
                    firstName: "John",
                    id: "2",
                },
                {
                    __typename: "User",
                    firstName: "Adam",
                    id: "3",
                },
                {
                    __typename: "Company",
                    id: "1",
                    name: "Some Company"
                },
                {
                    __typename: "Company",
                    id: "2",
                    name: "Some Other Company"
                },
                {
                    __typename: "Company",
                    id: "3",
                    name: "Company"
                }
            ];
            expect(response.data.search).to.eql(expectedResponseData);

        });
    });
});