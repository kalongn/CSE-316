export default class Model {
    constructor() {
      this.data = {
        questions: [
          {
            qid: 'q1',
            title: 'Programmatically navigate using React router',
            text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
            tagIds: ['t1', 't2'],
            askedBy: 'JoJi John',
            askDate: new Date('December 17, 2020 03:24:00'),
            ansIds: ['a1', 'a2'],
            views: 10,
          },
          {
            qid: 'q2',
            title: 'android studio save string shared preference, start activity and load the saved string',
            text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
            tagIds: ['t3', 't4', 't2'],
            askedBy: 'saltyPeter',
            askDate: new Date('January 01, 2022 21:06:12'),
            ansIds: ['a3', 'a4', 'a5'],
            views: 121,
          }
        ],
        tags: [
          {
            tid: 't1',
            name: 'react',
          },
          {
            tid: 't2',
            name: 'javascript',
          },
          {
            tid: 't3',
            name: 'android-studio',
          },
          {
            tid: 't4',
            name: 'shared-preferences',
          }
        ],
  
        answers: [
          {
            aid: 'a1',
            text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
            ansBy: 'hamkalo',
            ansDate: new Date('March 02, 2022 15:30:00'),
          },
          {
            aid: 'a2',
            text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
            ansBy: 'azad',
            ansDate: new Date('January 31, 2022 15:30:00'),
          },
          {
            aid: 'a3',
            text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
            ansBy: 'abaya',
            ansDate: new Date('April 21, 2022 15:25:22'),
          },
          {
            aid: 'a4',
            text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
            ansBy: 'alia',
            ansDate: new Date('December 02, 2022 02:20:59'),
          },
          {
            aid: 'a5',
            text: 'I just found all the above examples just too confusing, so I wrote my own. ',
            ansBy: 'sana',
            ansDate: new Date('December 31, 2022 20:20:59'),
          }
        ]
      };
    }
    // add methods to query, insert, and update the model here. E.g.,
    // getAllQstns() {
    //   return this.data.questions;
    // }
    /**
     * 
     * @returns all the questions
     */
    getAllQuestions() {
      return this.data.questions;
    }
  
    /**
     * Find the question with the matching qid
     * @param {String} qid 
     *  the question id
     * @returns 
     *  the question object reference
     */
    getQuestion(qid) {
      return this.data.questions.find(question => question.qid === qid);
    }
  
  
    /**
     * 
     * @param {String} tid 
     *    tagId user want to find
     * @returns 
     *    the tag with that ID
     */
    getTags(tid) {
      let result = this.data.tags.filter(tag => tag.tid === tid);
      return result.length === 0 ? 'DNE' : result[0];
    }
  
    /**
     * 
     * @param {String} name 
     *    tagNAme user want to find.
     * @returns 
     *    the tag with that name.
     */
    getTagsFromName(name) {
      let result = this.data.tags.filter(tag => tag.name === name);
      return result.length === 0 ? 'DNE' : result[0];
    }
  
    /**
     * 
     * @param {String} tid 
     *    tagId user want to find.
     * @returns 
     *    an array of questions with that tag ID.
     */
    getAllQuestionsFromTag(tid) {
      let result = this.data.questions.filter(question => question.tagIds.includes(tid));
      return result.length === 0 ? 'DNE' : result;
    }
  
    /**
     * 
     * @returns 
     *    all possible tags.
     */
    getAllTags() {
      return this.data.tags;
    }
  
    /**
   * 
   * @param {*} tid 
   *    answerId user want to find
   * @returns 
   *    the name of the given ID.
   */
    getAnswers(aid) {
      let result = this.data.answers.filter(answer => answer.aid === aid);
      return result.length === 0 ? 'DNE' : result[0];
    }
  
    getAllAnswers() {
      return this.data.answers;
    }
  
    /**
   * If user input is valid, this function attempts to add the question to the model's question array.
   * also updates tags array if new tags are inputted
   * @param {string} titleInput 
   * @param {string} detailsInput 
   * @param {Array of id objects} tagArray 
   * @param {string} usernameInput 
   */
    addQuestionToModel(titleInput, detailsInput, tagArray, usernameInput) {
      const newQid = "q" + (this.data.questions.length + 1);
      const newTagIds = [];
  
      for (const newTag of tagArray) {
        let isPresent = false;
        for (const existingTag of this.data.tags) {
          if (newTag === existingTag.name) {
            newTagIds.push(existingTag.tid);
            isPresent = true;
          }
        }
  
        if (!isPresent) {
          const tagNum = `t${this.data.tags.length + 1}`;
          let tempObj = {
            tid: tagNum,
            name: newTag,
          };
          this.data.tags.push(tempObj);
          newTagIds.push(tagNum);
        }
      }
  
      this.data.questions.push({
        qid: newQid,
        title: titleInput,
        text: detailsInput,
        tagIds: newTagIds,
        askedBy: usernameInput,
        askDate: new Date(),
        ansIds: [],
        views: 0,
      });
    }
  
    /**
     * increments number of views a particular question has by 1.
     * @param {String} qid 
     *  The id of the question.
     */
    incrementQuestionViewsBy1(qid) {
      this.getQuestion(qid).views += 1;
    }
  
    /**
     * Adds a new answer to the model's answers array and updates the ansIds array
     * of the corresponding question.
     * @param {string} qid - The ID of the question to which the answer is being added.
     * @param {string} answerUsername - The username of the answerer.
     * @param {string} answerDetails - The details of the answer.
     */
    addAnswerToModel(qid, answerUsername, answerDetails) {
      // Find the question by its qid
      const question = this.data.questions.find(q => q.qid === qid);
  
      // Create a new answer object
      const newAid = `a${this.data.answers.length + 1}`;
      const newAnswer = {
        aid: newAid,
        text: answerDetails,
        ansBy: answerUsername,
        ansDate: new Date(),
      };
  
      // Add the new answer to the answers array
      this.data.answers.push(newAnswer);
  
      // Update the ansIds array of the corresponding question
      question.ansIds.push(newAid);
    }
  }
  