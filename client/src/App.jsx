import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({ name: "", age: "" });
  const [userId, setUserId] = useState("");

  // Get all users
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
    refetch: refetchUsers,
  } = useQuery(GET_USERS);

  // Get user by ID
  const {
    data: getUserByIdData,
    loading: getUserByIdLoading,
    refetch: refetchUserById,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  // Create user
  const [createUser] = useMutation(CREATE_USER);

  const handleCreateUser = async () => {
    try {
      await createUser({
        variables: {
          name: newUser.name,
          age: Number(newUser.age),
          isMarried: false,
        },
      });
      setNewUser({ name: "", age: "" }); // Reset form
      refetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error creating user:", err.message);
    }
  };

  const handleGetUser = () => {
    if (userId) {
      refetchUserById({ id: userId });
    }
  };

  if (getUsersLoading) return <p>Loading users...</p>;
  if (getUsersError) return <p>Error: {getUsersError.message}</p>;

  console.log(getUsersData);

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <h2>Create New User</h2>
        <input
          placeholder="Name..."
          value={newUser.name}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          type="number"
          value={newUser.age}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Get User by ID</h2>
        <input
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleGetUser}>Get User</button>

        {getUserByIdLoading ? (
          <p>Loading user...</p>
        ) : getUserByIdData?.getUserById ? (
          <div style={{ marginTop: "10px" }}>
            <h3>Chosen User:</h3>
            <p>Name: {getUserByIdData.getUserById.name}</p>
            <p>Age: {getUserByIdData.getUserById.age}</p>
            <p>
              Is Married: {getUserByIdData.getUserById.isMarried ? "Yes" : "No"}
            </p>
          </div>
        ) : userId ? (
          <p>No user found with ID {userId}</p>
        ) : null}
      </div>

      <h2>All Users</h2>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Is Married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
