import * as React from "react";
import Head from "next/head";
import produce from "immer";

import styles from "../styles/Home.module.css";

import Answer from "../components/Answer";
import Question from "../components/Question";
import SetName from "../components/SetName";
import { usePusherChannel } from "../hooks/usePusher";

const initialState = {
  id: null,
  name: null,
  state: "set-name",
  question: null,
  options: null,
  showOptions: false,
  userAnswer: null,
  correctAnswer: null,
};

export default function Home() {
  const [
    {
      name,
      state,
      id,
      question,
      options,
      showOptions,
      userAnswer,
      correctAnswer,
    },
    dispatch,
  ] = React.useReducer(
    produce((draft, action) => {
      switch (action.type) {
        case "set-name":
          Object.assign(draft, {
            name: action.payload.name,
            state: "awaiting-question",
          });
          break;
        case "new-question":
          Object.assign(draft, action.payload, { state: "asking-question" });
          break;
        case "set-user-answer":
          Object.assign(draft, {
            userAnswer: action.payload,
            state: "question-answered",
          });
          break;
          break;
        case "correct-answer":
          draft.correctAnswer = action.payload.correctAnswer;
          break;
        case "clear-question":
          Object.assign(draft, initialState, {
            name: draft.name,
            state: "awaiting-question",
          });
          break;
        case "show-options":
          draft.showOptions = true;
          break;
      }
    }, initialState),
    initialState
  );

  React.useEffect(() => {
    if (question && !showOptions) {
      setTimeout(() => dispatch({ type: "show-options" }), 5000);
    }
  }, [question, showOptions]);

  const handlePusherMessage = React.useCallback(
    (evt, data) => dispatch({ type: evt, payload: data }),
    [dispatch]
  );
  usePusherChannel("fastest-finger-first", handlePusherMessage);

  let content = null;
  switch (state) {
    case "set-name":
      content = (
        <SetName
          onSubmit={(name) => {
            dispatch({
              type: "set-name",
              payload: { name },
            });
            fetch("/api/send-command", {
              method: "post",
              body: JSON.stringify({ event: "new-player", name }),
              headers: { "content-type": "application/json" },
            });
          }}
        />
      );
      break;
    case "awaiting-question":
      content = <p>Waiting for the next question {name}...</p>;
      break;
    case "asking-question":
      content = (
        <Question
          question={question}
          options={options}
          showOptions={showOptions}
          onSubmit={(ans) => {
            dispatch({
              type: "set-user-answer",
              payload: ans,
            });
            fetch("/api/send-command", {
              method: "post",
              body: JSON.stringify({ event: "user-answer", id, name, ...ans }),
              headers: { "content-type": "application/json" },
            });
          }}
        />
      );
      break;
    case "question-answered":
      content = (
        <Answer
          options={options}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
        />
      );
      break;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Fastest Finger First</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>{content}</main>
    </div>
  );
}
