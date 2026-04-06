import axios from '../api/axios';
import { useRef ,useState,useEffect} from "react";
import {faCheck ,faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/ ;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}/ ;
const REGISTER_URL = '/signup';


const Register = () => {
  const userNameRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

   useEffect(() => {
    const match = password === confirmPassword;
    setValidMatch(match);

    // Only show the error if the user has actually started typing in the second box
    if (confirmPassword && !match) {
        setErrMsg("Passwords do not match");
    } else {
        // Clear the error if they match or if the confirm box is empty
        setErrMsg(""); 
    }
}, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(REGISTER_URL, 
            { userName, email, password, confirmPassword }, // No stringify needed
            { withCredentials: true }
        );

        setSuccess(true);
        // Clear inputs
        setUserName('');
        setPassword('');
        setConfirmPassword('');
        setErrMsg(''); // Clear any old errors

    } catch (err) {
        // 1. Check if the server even responded (Network Error)
        if (!err?.response) {
            setErrMsg('No Server Response');
        } 
        // 2. Display the specific error message sent by your backend
        else if (err.response?.data?.error) {
            setErrMsg(err.response.data.error); 
        } 
        // 3. Fallback for generic errors
        else {
            setErrMsg('Registration Failed');
        }

        // Use that useRef we talked about to focus the error message for accessibility
        errRef.current.focus();
    }
}

    return (
          <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                        
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userNameRef}
                            autoComplete="off"
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                            required
                           
                        />
                      
                        <label htmlFor="email">email</label>
                        <input type="email"
                        id="email" onChange={(e) => setEmail(e.target.value)}
                        value={email} 
                        required/>

                        <label htmlFor="password">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) =>{ setPassword(e.target.value); }}
                            value={password}
                            required
                           
                        />
                       


                        <label htmlFor="confirmPassword">
                            Confirm Password:
                          
                            <FontAwesomeIcon icon="times" />
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) =>{ setConfirmPassword(e.target.value);}}
                            value={confirmPassword}
                            required
                         
                        />
                      

                        <button >Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
};

export default Register