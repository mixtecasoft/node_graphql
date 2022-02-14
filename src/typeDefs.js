const { gql } = require("apollo-server-express");

const typeDefs = gql`
   type Book {
      id: ID!
      title: String
      author: String
   }

   type Media {
      id: ID!
      type: String
      version: String
      created: String
      name: String
      title: String
      author: String
      pubDate: String
      description: String
      language: String
      audioLength: Int
      pageUrl: String
      downloadUrl: String
      multipart: Boolean
      mediaType: String
      segmentationType: String
   }

   type Query {
      medias: [Media]
      books: [Book]
      book(id: ID!): Book
   }
`;

module.exports = typeDefs;
