import Model from '../models/model.js';

import { useState } from 'react';
import { sortQuestionByLatest } from '../helper.js';

import Header from './Header.js';
import ContentWrapper from './ContentWrapper.js';

import '../stylesheets/App.css';
import '../stylesheets/fakestackoverflow.css';

export default function FakeStackOverflow() {

  const _model = new Model();
  const [_questions, setQuestions] = useState(_model.getAllQuestions());
  const [_tags, setTags] = useState(_model.getAllTags());
  const [_answers, setAnswers] = useState(_model.getAllAnswers());
  const [_displayQuestions, setDisplayQuestions] = useState(sortQuestionByLatest(_model.getAllQuestions()));
  const [_questionsHeaderDispay, setQuestionsHeaderDisplay] = useState(0);
  const [_searchTerm, setSearchTerm] = useState('');
  const [_searchFocus, setSearchFocus] = useState(false);
  const [_pageToDisplay, setPageToDisplay] = useState("questions");
  const [_questionAnswerId, setQuestionAnswerId] = useState("");

  return (
    <div className='page-wrapper'>
      <Header
        setSearchTerm={setSearchTerm}
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
      />
    </div>
  );
}
