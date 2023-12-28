import '../stylesheets/App.css';
import '../stylesheets/ContentWrapper.css';
import SideNav from './SideNav';
import QuestionsDisplay from './QuestionsDisplay';
import TagsDisplay from './TagsDisplay';
import NewQuestion from './NewQuestion';
import AnswerDisplay from './AnswerDisplay';
import NewAnswer from './NewAnswer'

function ContentWrapper(props) {
  let itemToRender = '';
  switch (props.pageToDisplay) {
    case 'answer':
      itemToRender = <AnswerDisplay
        questions={props.questions} setQuestions={props.setQuestions}
        tags={props.tags} setTags={props.setTags}
        answers={props.answers} setAnswers={props.setAnswers}
        pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay}
        questionAnswerId={props.questionAnswerId} />
      break;
    case 'tags':
      itemToRender = <TagsDisplay
        questions={props.questions}
        tags={props.tags}
        setDisplayQuestions={props.setDisplayQuestions}
        setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay}
        setPageToDisplay={props.setPageToDisplay} />
      break;
    case 'newQuestions':
      itemToRender = <NewQuestion
      questions={props.questions} setQuestions={props.setQuestions}
      setDisplayQuestions={props.setDisplayQuestions}
      tags={props.tags} setTags={props.setTags} 
      pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay}/>
      break;
    case 'newAnswer':
      itemToRender = <NewAnswer
      questions={props.questions} setQuestions={props.setQuestions}
      answers={props.answers} setAnswers={props.setAnswers}
      pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay}
      questionAnswerId={props.questionAnswerId} />
      break
    case "questions":
    default:
      itemToRender = <QuestionsDisplay
        questions={props.questions} setQuestions={props.setQuestions}
        tags={props.tags} setTags={props.setTags}
        answers={props.answers} setAnswers={props.setAnswers}
        displayQuestions={props.displayQuestions} setDisplayQuestions={props.setDisplayQuestions}
        questionsHeaderDisplay={props.questionsHeaderDisplay} setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay}
        searchTerm={props.searchTerm}
        searchFocus={props.searchFocus} setSearchFocus={props.setSearchFocus}
        pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay}
        setQuestionAnswerId={props.setQuestionAnswerId} />
      break;
  }
  return (
    <div className="page-wrapper-content">
      <SideNav
        questions={props.questions}
        setDisplayQuestions={props.setDisplayQuestions}
        setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay}
        pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay} />
      {itemToRender}
    </div>
  );
}

export default ContentWrapper;