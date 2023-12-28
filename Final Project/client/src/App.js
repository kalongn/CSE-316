// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from 'react';
import { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Questions from './pages/Questions';
import Search from './pages/Search';
import Tags from './pages/Tags';
import NewQuestions from './pages/NewQuestions';
import NewComments from './pages/NewComments';
import Answers from './pages/Answers';
import NewAnswers from './pages/NewAnswers';
import Profile from './pages/Profile';
import EditTags from './pages/EditTags';
import EditAnswers from './pages/EditAnswers';
import EditQuestions from './pages/EditQuestions';
import DeleteUser from './pages/DeleteUser';

import './stylesheets/App.css';
import './stylesheets/general.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function App() {

  const [isLogin, setIsLogin] = useState(false);

  // 401 of unknown request will log use out immediently
  Axios.interceptors.response.use((response) => response, (error) => {
    console.log(error.code);
    if (error.code === 'ERR_NETWORK') {
      setIsLogin(false);
    }
    if (error.response && error.response.status === 401 && error.response.data.errorMessage === "User not found") {
      setIsLogin(false);
      Axios.get(`${expressServer}/logout`, { withCredentials: true });
    }
    return Promise.reject(error);
  }
  );

  useEffect(() => {
    Axios.get(`${expressServer}/`, { withCredentials: true })
      .then(res => {
        if (res.data === 'guest') {
          setIsLogin(false);
        } else {
          setIsLogin(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <div className='page-wrapper'>
      <LoginContext.Provider value={{ isLogin }}>
        <NavigationBar setIsLogin={setIsLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/questions" element={<Questions />}>
            <Route path=":tagName" element={<Questions />} />
          </Route>
          <Route path="/question/:questionId" element={<Answers />}>
            <Route path=":uid" element={<Answers />} />
          </Route>
          <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
          <Route path="/search/:param" element={<Search />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/newquestions" element={<NewQuestions />} />
          <Route path="/newcomments/:type/:id/:qid" element={<NewComments />} />
          <Route path="/newanswers/:qid" element={<NewAnswers />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/edittag/:tagname/:tid/:uid" element={<EditTags />} />
          <Route path="/editanswer/:aid/:answertext/:qid/:uid" element={<EditAnswers />} />
          <Route path="/editquestion/:qid/:uid" element={<EditQuestions />} />
          <Route path="/deleteuser/:urep/:username/:uid" element={<DeleteUser setIsLogin={setIsLogin} />} />
        </Routes>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
export const LoginContext = createContext(null);
