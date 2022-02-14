const books = [
   {
      id: "1",
      title: "The Awakening",
      author: "Kate Chopin",
   },
   {
      id: "2",
      title: "City of Glass",
      author: "Paul Auster",
   },
];

const resolvers = {
   Query: {
      medias() {
         return books;
      },
      books() {
         return books;
      },
      book(parent, args, context, info) {
         return books.find((book) => book.id === args.id);
      },
   },
};

module.exports = resolvers;
