import { useEffect, useState } from 'react';

import { sortQuestionByLatest } from '../helper.js';

import Header from './Header.js';
import ContentWrapper from './ContentWrapper.js';

import '../stylesheets/fakestackoverflow.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000"

export default function FakeStackOverflow() {
  const [_questions, setQuestions] = useState([]);
  const [_answers, setAnswers] = useState([]);
  const [_displayQuestions, setDisplayQuestions] = useState([]);
  const [_questionsHeaderDispay, setQuestionsHeaderDisplay] = useState(0);
  const [_searchTerm, setSearchTerm] = useState('');
  const [_searchFocus, setSearchFocus] = useState(false);
  const [_pageToDisplay, setPageToDisplay] = useState("questions");
  const [_questionAnswerId, setQuestionAnswerId] = useState("");
  const [_searchResult, setSearchResult] = useState(true);

  useEffect(() => {
    Axios.get(`${expressServer}/Questions`)
      .then(res => {
        setQuestions(res.data);
        setDisplayQuestions(sortQuestionByLatest(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const [_tags, setTags] = useState([]);
  useEffect(() => {
    Axios.get(`${expressServer}/Tags`)
      .then(res => {
        setTags(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  
  useEffect(() => {
    Axios.get(`${expressServer}/Answers`)
      .then(res => {
        setAnswers(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className='page-wrapper'>
      <Header
        searchTerm={_searchTerm} setSearchTerm={setSearchTerm}
        setSearchFocus={setSearchFocus}
      />
      <ContentWrapper
        questions={_questions} setQuestions={setQuestions}
        tags={_tags} setTags={setTags}
        answers={_answers} setAnswers={setAnswers}
        displayQuestions={_displayQuestions} setDisplayQuestions={setDisplayQuestions}
        questionsHeaderDisplay={_questionsHeaderDispay} setQuestionsHeaderDisplay={setQuestionsHeaderDisplay}
        searchTerm={_searchTerm} setSearchTerm={setSearchTerm}
        searchFocus={_searchFocus} setSearchFocus={setSearchFocus}
        pageToDisplay={_pageToDisplay} setPageToDisplay={setPageToDisplay}
        questionAnswerId={_questionAnswerId} setQuestionAnswerId={setQuestionAnswerId}
        searchResult={_searchResult} setSearchResult={setSearchResult}
      />
    </div>
  );
}
