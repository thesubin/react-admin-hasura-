import React, {useEffect ,useState} from "react";
import { Admin, Resource } from "react-admin";
import { TodoList, TodoEdit, TodoCreate } from "./todos";
import { UserList, UserShow } from "./users";
import PostIcon from "@material-ui/icons/Book";
import UserIcon from "@material-ui/icons/Group";
import Login from "./login";
import { createBrowserHistory as createHistory } from "history";

import { ApolloClient, InMemoryCache } from '@apollo/client';

import { Auth0Provider } from "@auth0/auth0-react";
import authConfig from "./utils/authConfig";

import authProvider from './utils/authProvider';
import { auth0 } from "./utils/authProvider";

import buildHasuraProvider from "ra-data-hasura";

const uri = "https://react-admin-low-code.hasura.app/v1/graphql";

type AppProps = {
  dataProvider: Function;
};

function App(props:AppProps) {
  const history = createHistory();


const createApolloClient = async (token : any) => {
  return new ApolloClient({
      uri: 'https://react-admin.hasura.app/v1/graphql',
      cache: new InMemoryCache(),
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
}


  const [dataProvider, setDataProvider] = useState({});

  useEffect(() => {
      const buildDataProvider = async () => {

          const isAuthenticated = await auth0.isAuthenticated();
          if(!isAuthenticated) {
              return;
          }
          const token = await auth0.getIdTokenClaims();
          const idToken = token.__raw;
        
          const apolloClient = await createApolloClient(idToken);
      try{
          const dataProvider = await buildHasuraProvider({
              client: apolloClient
          });
          setDataProvider(() => dataProvider);}
          catch(e){
            console.log("Error on Api")
          }
      }

        buildDataProvider();
 
      
      
    }, []);
  
  return (
    <Admin
      dataProvider={props.dataProvider}
      history={history}
      authProvider={authProvider}
      loginPage={Login}
    >
      <Resource
        name="todos"
        icon={PostIcon}
        list={TodoList}
        edit={TodoEdit}
        create={TodoCreate}
      />
      <Resource name="users" icon={UserIcon} list={UserList} show={UserShow} />
    </Admin>
  );
}

export default App;
