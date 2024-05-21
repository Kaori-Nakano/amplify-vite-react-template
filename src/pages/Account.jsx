import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post,get } from 'aws-amplify/api'


const initialState = { Username:'', Emailaddr:'', UserStatus:'', UserCreateDate:''};
const initialStateGrp = { Username:'', Groupname:''};

export const Account = () => {
  const [formState, setFormState] = useState(initialState);
  const [formStateGrp, setFormStateGrp] = useState(initialStateGrp);
  const [accounts, setAccounts] = useState([]);
  const [accountsGrp, setAccountsGrp] = useState([]);

  useEffect(() => {
    listUsers(10);
    listGrpUsers(10);
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  function setInputGrp(key, value) {
    setFormStateGrp({ ...formStateGrp, [key]: value });
  }

 //********************************************************** */
  // グループ処理
  async function addToGroup() { 
    try {
      let apiName = 'AdminQueries';
      let path = '/addUserToGroup';

      const authSession = (await fetchAuthSession()).tokens;
      let options = {
          body: {
            "username" : formStateGrp.Username,
            "groupname": formStateGrp.Groupname
          }, 
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${authSession?.accessToken.toString()}`
          } 
      }

      const restOperation = post({ 
        apiName: apiName,
        path: path,
        options: options
      });
      const response = await restOperation.response;
      const data = await response.body.json();

      setFormStateGrp(initialStateGrp);
      console.log('Admin Queries (addToGroup) call succeeded: ', data);
    } catch (e) {
      console.log('Admin Queries (addToGroup) call failed: ', e);
    }
}

async function removeFromGroup() { 
  try {
    let apiName = 'AdminQueries';
    let path = '/removeUserFromGroup';

    const authSession = (await fetchAuthSession()).tokens;
    let options = {
        body: {
          "username" : formStateGrp.Username,
          "groupname": formStateGrp.Groupname
        }, 
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${authSession?.accessToken.toString()}`
        } 
    }

    const restOperation = post({ 
      apiName: apiName,
      path: path,
      options: options
    });
    const response = await restOperation.response;
    const data = await response.body.json();

    setFormStateGrp(initialStateGrp);
    console.log('Admin Queries (removeFromGroup) call succeeded: ', data);
  } catch (e) {
    console.log('Admin Queries (removeFromGroup) call failed: ', e);
  }
}


async function listGrpUsers(limit){
  if(!formStateGrp) return;

  try {
    let apiName = 'AdminQueries';
    let path = '/listUsersInGroup';
    const authSession = (await fetchAuthSession()).tokens;
    let options = { 
      queryStringParameters: {
        "groupname": "Editors",
        "limit": limit
        //"token": nextToken
      },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${authSession?.accessToken.toString()}`
        }
    }

    const restOperation = get({apiName, path, options});
    const response = await restOperation.response;
    const data = await response.body.json();
    setAccountsGrp(data.Users);
    console.log('Admin Queries (listGrpUsers) call succeeded: ', data);
  } catch (e) {
    console.log('Admin Queries (listGrpUsers) call failed: ', e);
  }
};


  
  async function listUsers(limit){
    try {
      let apiName = 'AdminQueries';
      let path = '/listUsers';
      const authSession = (await fetchAuthSession()).tokens;
      let options = { 
          queryStringParameters: {
            "limit": limit,
          },
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${authSession?.accessToken.toString()}`
          }
      }

      const restOperation = get({apiName, path, options});
      const response = await restOperation.response;
      const data = await response.body.json();
      setAccounts(data.Users);
      console.log('Admin Queries (listeUser) call succeeded: ', data);
    } catch (e) {
      console.log('Admin Queries (listeUser) call failed: ', e);
    }
  };

 //********************************************************** */
// ユーザー作成
async function createUser() {

  try {
    if (!formState.Username || !formState.Emailaddr) return;

    const apiName = 'AdminQueries';
    const path = '/createUser';
    const userAttributes = [
      { "Name": "email", "Value": formState.Emailaddr },
    ]

    const authSession = (await fetchAuthSession()).tokens;
    const options = {
      body: {
        //"username": email,
        "username": formState.Username,
        'attributes': userAttributes
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${authSession?.accessToken.toString()}`
      }
    }

    const restOperation = post({ 
      apiName: apiName,
      path: path,
      options: options
    });
    const response = await restOperation.response;
    const data = await response.body.json();

    setFormState(initialState);
    listUsers(10);
    console.log('Admin Queries (createUser) call succeeded: ', data);
  } catch (e) {
    console.log('Admin Queries (createUser) call failed: ', e);
  }
};

// ユーザー削除
async function deleteUser() {
  try {
    if (!formState.Username) return;
    //const email="xxx@yyy.com"
    const apiName = 'AdminQueries';
    const path = '/deleteUser';
    const authSession = (await fetchAuthSession()).tokens;

    const options = {
      body: {
        "username": formState.Username,
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${authSession?.accessToken.toString()}`
      }
    }

    const restOperation = post({ 
      apiName: apiName,
      path: path,
      options: options
    });
    const response = await restOperation.response;
    const data = await response.body.json();

    setFormState(initialState);
    listUsers(10);
    console.log('Admin Queries (deleteUser) call succeeded: ', data);

  } catch (e) {
    console.log('Admin Queries (deleteUser) call failed: ', e);
  }
};

return (
    <div className="App">
      {/* <p>{message}</p> */}
      <br />
      <p>---------------------------------------------------</p>
      &nbsp;
      <input
        onChange={(event) => setInput('Username', event.target.value)}
        style={styles.input}
        value={formState.Username}
        placeholder="アカウント名"
      />
      &nbsp;
      <input
        onChange={(event) => setInput('Emailaddr', event.target.value)}
        style={styles.input}
        value={formState.Emailaddr}
        placeholder="メールアドレス"
      /><br />
      <button onClick={createUser}>アカウントの登録</button>
      <button onClick={deleteUser}>アカウントの削除</button>
    
      <h2>・アカウント一覧</h2>
      {accounts.map((account, index) => (
      <div key={account.Username ? account.Username : index} >
        <p>&nbsp;&nbsp;&nbsp;
           - {account.Username},{account.Attributes[0].Value} ,{account.UserStatus},{account.UserCreateDate}</p>
      </div>
      ))}
      <p>---------------------------------------------------</p>
      &nbsp;
      <input
        onChange={(event) => setInputGrp('Groupname', event.target.value)}
        style={styles.input}
        value={formStateGrp.Groupname}
        placeholder="グループ"
      />&nbsp;
        <input
        onChange={(event) => setInputGrp('Username', event.target.value)}
        style={styles.input}
        value={formStateGrp.Username}
        placeholder="アカウント"
      /><br />
      <button onClick={addToGroup}>グループへの登録</button>
      <button onClick={removeFromGroup}>グループからの削除</button>
      <br />
      <button onClick={listGrpUsers}>グループ一覧の取得</button>

      <h2>・アカウント一覧（グループ単位）</h2>
      {accountsGrp.map((account, index) => (
      <div key={account.Username ? account.Username : index} >
        <p>&nbsp;&nbsp;&nbsp;
           - {account.Username},{account.Attributes[0].Value} ,{account.UserStatus},{account.UserCreateDate}</p>
      </div>
      ))}
      <br />
  </div>
);
};
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
export default Account;