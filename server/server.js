import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import User from "./User.js"; // Import the Mongoose model

// Replace with your MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/mydatabase"; // or Atlas URI

await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("✅ MongoDB connected");

const typeDefs = `
    type Query {
      getUsers: [User]
      getUserById(id: ID!): User
    }

    type Mutation {
      createUser(name: String!, age: Int!, isMarried: Boolean!): User
    }

    type User {
      id: ID
      name: String
      age: Int
      isMarried: Boolean
    }
`;


const resolvers = {
  Query: {
    getUsers: async () => await User.find(),
    getUserById: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, age, isMarried }) => {
      const newUser = new User({ name, age, isMarried });
      await newUser.save();
      return newUser;
    },
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server Running at: ${url}`);

///// Query, Mutation
//// typeDefs, resolvers
