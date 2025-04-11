import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Sample data (in a real application, use a database)
const users = [
    { id: '1', name: 'Alice', posts: [] },
    { id: '2', name: 'Bob', posts: [] },
];

const posts = [{ id: '1', content: 'Hello world!', authorId: '1' }];

// The GraphQL schema
const typeDefs = `#graphql
   type User {
    id: ID!
    name: String!
    posts: [Post!]
  }

  type Post {
    id: ID!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]
    posts: [Post!]
    user(id: ID!): User
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!): User!
    createPost(content: String!, authorId: ID!): Post!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        users: () => users,
        posts: () =>
            posts.map((post) => ({
                ...post,
                author: users.find((u) => u.id === post.authorId),
            })),
        user: (_, { id }) => {
            // database query 
            return users.find((u) => u.id === id);
        },
        post: (_, { id }) => {
            const post = posts.find((p) => p.id === id);
            return post ? { ...post, author: users.find((u) => u.id === post.authorId) } : null;
        },
    },
    Mutation: {
        createUser: (_, { name }) => {
            const user = { id: String(users.length + 1), name, posts: [] };
            users.push(user);
            return user;
        },
        createPost: (_, { content, authorId }) => {
            const post = { id: String(posts.length + 1), content, authorId };
            posts.push(post);
            // Optionally, link the post to the user
            const user = users.find((u) => u.id === authorId);
            if (user) {
                user.posts.push(post);
            }
            return { ...post, author: user };
        },
    },
    User: {
        posts: (parent) => {
            // Return posts for the current user
            return posts.filter((post) => post.authorId === parent.id);
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server); // 4000
console.log(`🚀 Server ready at ${url}`);
