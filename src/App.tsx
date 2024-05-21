import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import outputs from "../amplify_outputs.json";
import { Amplify } from 'aws-amplify';
import { get } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
//import { Auth } from 'aws-amplify';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

Amplify.configure(outputs);
const client = generateClient<Schema>();
// const { username, userId, signInDetails } = await getCurrentUser();

// console.log("username", username);
// console.log("user id", userId);
// console.log("sign-in details", signInDetails);

const initialState = { Emailaddr:''};

// export async function signOut() {
//   try {
//     await Auth.signOut();
//   } catch (error) {
//     console.log('error signing out: ', error);
//   }
// }

function App() {
//export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    // client.models.Todo.observeQuery().subscribe({
    //   next: (data) => setTodos([...data.items]),
    // });
    //mute();
    getItem();
  }, []);

  
  function setInput(key:any, value:any) {
    setFormState({ ...formState, [key]: value });
  }

  async function getItem() {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'items' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
    } catch (error) {
      console.log('GET call failed: ', error);
    }
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id:string){
    client.models.Todo.delete({id})
  }

  async function mute(){
    try {
      const res=await client.mutations.addUserToGroup({
        groupName: "ADMINS",
        userId: "8861a380-6011-7094-9c0c-f306c7f39eb6",
      });
      console.log('mute call succeeded',res);
    } catch (e) {
      console.log('mute call failed: ', e);
    }
  }

  async function createUser(){
    try {
      const res=await client.mutations.createUser({
        email: formState.Emailaddr,
      });
      console.log('createUser call succeeded',res);
    } catch (e) {
      console.log('createUser call failed: ', e);
    }
  }

  async function deleteUser(){
    try {
      const res=await client.mutations.deleteUser({
        email: formState.Emailaddr,
      });
      console.log('deleteUser call succeeded',res);
    } catch (e) {
      console.log('deleteUser call failed: ', e);
    }
  }

  return (
        
    <Authenticator>
    {/* {({ signOut}) => ( */}
    {({ signOut, user }) => (
    <main>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (          
          <li onClick={()=>deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      <p>---------------------------------------------------</p>
      &nbsp;
      {/* <input
        onChange={(event) => setInput('Username', event.target.value)}
        style={styles.input}
        value={formState.Username}
        placeholder="アカウント名"
      />
      &nbsp; */}
      <input
        onChange={(event) => setInput('Emailaddr', event.target.value)}
        style={styles.input}
        value={formState.Emailaddr}
        placeholder="メールアドレス"
      /><br />
      <button onClick={createUser}>アカウントの登録</button>
      <button onClick={deleteUser}>アカウントの削除</button>
    </main>
    
        
      )}
      </Authenticator>
  );
}

const styles = {
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px'
  }
};
export default App;
