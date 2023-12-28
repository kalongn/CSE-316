import '../stylesheets/App.css'
import '../stylesheets/SideNav.css';

import { useEffect } from 'react';
import { sortQuestionByLatest } from '../helper';


function SideNav(props) {

  function questionButtonOnClick() {
    props.setPageToDisplay("questions");
    props.setQuestionsHeaderDisplay(() => 0);
    props.setSearchTerm(() => '');
    props.setSearchFocus(false);
    props.setSearchResult(true);
    props.setDisplayQuestions(() => sortQuestionByLatest(props.questions));
  }

  function tagsButtonOnClick() {
    props.setSearchFocus(false);
    props.setPageToDisplay("tags");
    props.setSearchFocus(false);
    props.setSearchResult(true);
    props.setSearchTerm(() => '');
  }

  useEffect(() => {
    switch (props.pageToDisplay) {
      case "tags":
        document.getElementById("questions-button").classList.remove("sidenav-button-highlighted");
        document.getElementById("tags-button").classList.add("sidenav-button-highlighted");
        break;
      case "questions":
        document.getElementById("questions-button").classList.add("sidenav-button-highlighted");
        document.getElementById("tags-button").classList.remove("sidenav-button-highlighted");
        break;
      default:
        document.getElementById("questions-button").classList.remove("sidenav-button-highlighted");
        document.getElementById("tags-button").classList.remove("sidenav-button-highlighted");
        break;
    }
  }, [props.pageToDisplay])

  return (
    <div id="sidenav" className="sidenav">
      <button onClick={questionButtonOnClick} id="questions-button"
        className="sidenav-button-group sidenav-button-highlighted">Questions</button>
      <button onClick={tagsButtonOnClick} id="tags-button" className="sidenav-button-group">Tags</button>
    </div>
  );
}

export default SideNav;