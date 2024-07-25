import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"
import { useAuth } from "../contexts/FakeAuthContext";


export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");


  useEffect(() => {
    function authenticate() {
      if (isAuthenticated) navigate('/app') 
       
    
    } 

    authenticate()
  }, [isAuthenticated, navigate, ])


  return (
    <main className={styles.login}>
      <PageNav/>
      <form className={styles.form} >
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Link>
            <button onClick={() => login(email, password)} className="cta">Login</button>
          </Link>
        </div>
      </form>
    </main>
  );
}
 