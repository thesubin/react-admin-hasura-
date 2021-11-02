import React ,{useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { userLogin as userLoginAction } from 'react-admin';
import { connect } from 'react-redux';
import styles from './custom.module.css'
import { auth0 } from "./utils/authProvider";

import { WbIncandescentOutlined } from "@material-ui/icons";
const LoginButton = ({userLogin}:any) => {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    console.log("login form rendered")
    const location = window.location.href;
    const url = new URL(window.location.href);
    const { searchParams } = url ;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // If code is present, we came back from the provider
    if (code && state) {
        console.log("oauth callback received",location)
        userLogin({ location });

    }
}, [userLogin]);

  useEffect(()=>{
    const checkAuth=async()=>{

      console.log('asd')
      const isAuthenticated = await auth0.isAuthenticated();
      if(isAuthenticated){
        window.location.replace(window.location.origin)
      }
    }
    
    checkAuth()
    
  },[window.location.href])

  return <div className={styles.container}>
      <div className={styles.frame}>
        <button onClick={() => userLogin()}>Log In</button>
      </div>
    </div>
};

const mapDispatchToProps = {
  userLogin: userLoginAction,
}

export default connect(undefined, mapDispatchToProps) (LoginButton);