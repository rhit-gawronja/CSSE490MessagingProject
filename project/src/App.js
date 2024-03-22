import './App.css';
import { useState} from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,signInWithRedirect} from "firebase/auth";
import { getFirestore,collection, addDoc,getDocs,doc,getDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { useAuthState } from 'react-firebase-hooks/auth';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDk53KyMpPmX6blCDISkg-yF4-qEXA82hw",
    authDomain: "tweeter-89ead.firebaseapp.com",
    projectId: "tweeter-89ead",
    storageBucket: "tweeter-89ead.appspot.com",
    messagingSenderId: "1007916827539",
    appId: "1:1007916827539:web:c9be969d190aa26c355e66",
    measurementId: "G-M33JKGLTK0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
function App() {
    const [message,setMessage]=useState('');
    const [userName,setUserName]=useState('');
    const [pubMessages,setPubMessages]=useState([]);
    const [priMessage,setPriMessage]=useState([]);
    const [inbox,setInbox]= useState([]);
    const [user] =useAuthState(auth);
    function handleMessageChange(e){
        setMessage(e.target.value);
    }
    function handleUserNameChange(e){
        setUserName(e.target.value);
    }
    async function updatePubs() {
        console.log("getting messages")
        let dataArray=[]
        const querySnapshot = await getDocs(collection(db, 'pubmessage'));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
            dataArray.push(doc.data());
        });
        setPubMessages(dataArray);
    }
    async function checkInbox(){
        let dataArray=[]
        console.log('pressed');
        const docRef = doc(db ,'inboxes',userName);
        const docSnapshot = await getDoc(docRef);
        if(docSnapshot.exists()){
            console.log('we exsist');
            let messages = docSnapshot.data().message;
            let senderId = docSnapshot.data().senderId;
            let i=0;
            messages.forEach((msg)=>{
                console.log(senderId[i]);
                dataArray.push({
                    message:msg,
                    userName:senderId[i]
                })
                i+=1;
            })
            setInbox(dataArray);
        }
    }
    async function sendPubMessage(){
        try {
            console.log("before send")
            const docRef = await addDoc(collection(db, 'pubmessage'), {
                message: `${message}`,
                userName: `${userName}`,
                createdAt: Date.now()
            });
            console.log("doc written",docRef.id);
        }catch(e){
            console.error("error sending",e);
        }
    }
    function messageCardFactory(data){
return(<>
    <div>{data.userName}</div>
    <div>{data.message}</div>
    </>)
    }
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(provider);
    }
  return (
      <div className="App">
        <button id="loginBar" className="navbar navbar-dark ">
          <a href={'/' } className="navbar-brand">Login</a>
        </button>

          <div className="container">
              <h1 id="MsgTitle">Tweeter</h1>
              <button id="directButton">Direct Chat</button>
              <button id="groupButton">Group Chat</button>
              <button id="publicButton">Public Chat</button>
              <select id="chatDropdown">
                  <option value="">Select Chat</option>
              </select>
              <h2>Private inbox</h2>
              <button onClick={checkInbox}>check inbox</button>

              <div>Username<input value={userName} onChange={handleUserNameChange}/></div>
              {inbox&& inbox.map(doc=> messageCardFactory(doc))}
              <div id="chatMessages"></div>
              <h2>Public messages</h2>
              <div>Username<input value={userName} onChange={handleUserNameChange}/></div>
              <div>message<input value={message} onChange={handleMessageChange}/></div>
              <button onClick={sendPubMessage}>Send Message</button>
              <button onClick={updatePubs}>Update public messages</button>
              {pubMessages && pubMessages.map(msg => messageCardFactory(msg))}
              {/*<button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>*/}
          </div>
      </div>
  );
}

export default App;
