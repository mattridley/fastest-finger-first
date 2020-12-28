import * as React from "react";
import produce from "immer";
import { usePusherChannel } from "../hooks/usePusher";

const questions = [
  {
    id: 0,
    question:
      "In what order do these words appear in the nursery rhyme 'Jack and Jill'?",
    options: {
      a: "Crown",
      b: "Hill",
      c: "Tumbling",
      d: "Water",
    },
    correctAnswer: ["b", "d", "a", "c"],
  },
  {
    id: 1,
    question: "Starting with 'Stop', what is the order of a UK traffic light?",
    options: {
      a: "Red and Amber",
      b: "Green",
      c: "Red",
      d: "Amber",
    },
    correctAnswer: ["c", "a", "b", "d"],
  },
  {
    id: 2,
    question:
      "Starting with the earliest, put these forms of transport in the order they were introduced",
    options: {
      a: "Airbus A380",
      b: "Flying Scotsman",
      c: "Model T Ford",
      d: "Penny-fathing",
    },
    correctAnswer: ["d", "c", "b", "a"],
  },
  {
    id: 3,
    question: "Put these UK National Parks in order from north to south",
    options: {
      a: "Carnigorms",
      b: "Brecon Beacons",
      c: "Dartmoor",
      d: "Yorkshire Dales",
    },
    correctAnswer: ["a", "d", "b", "c"],
  },
  {
    id: 4,
    question:
      "Starting with the earliest, put these life stages of a butterfly in order",
    options: {
      a: "Adult",
      b: "Caterpillar",
      c: "Egg",
      d: "Chrysalis",
    },
    correctAnswer: ["c", "b", "d", "a"],
  },
  {
    id: 5,
    question:
      "Starting with with the earliest, put these TV cooks in the order they were born",
    options: {
      a: "Delia Smith",
      b: "Nadiya Hussain",
      c: "Mary Berry",
      d: "Nigella Lawson",
    },
    correctAnswer: ["c", "a", "d", "b"],
  },
];

const initialState = {
  doneQuestions: [],
  players: {},
};

export default function Admin() {
  const [{ doneQuestions, players }, dispatch] = React.useReducer(
    produce((draft, action) => {
      switch (action.type) {
        case "question-cleared":
          draft.doneQuestions.push(action.payload.id);
          draft.players = Object.entries(draft.players).reduce(
            (players, [name]) => ({ ...players, [name]: null }),
            {}
          );
          break;
        case "user-answer":
          draft.players[action.payload.name] = action.payload;
          break;
          break;
        case "new-player":
          draft.players[action.payload.name] = null;
          break;
      }
    }, initialState),
    initialState
  );

  const handlePusherMessage = React.useCallback(
    (evt, data) => dispatch({ type: evt, payload: data }),
    [dispatch]
  );
  usePusherChannel("fastest-finger-first", handlePusherMessage);

  const clearQuestion = (id) => {
    fetch("/api/send-command", {
      body: JSON.stringify({ event: "clear-question" }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    });
    dispatch({ type: "question-cleared", payload: { id } });
  };

  const sendQuestion = (id) => {
    const { correctAnswer, ...data } = questions[id];
    fetch("/api/send-command", {
      body: JSON.stringify({ event: "new-question", ...data }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    });
  };

  const sendAnswer = (id) => {
    const { correctAnswer } = questions[id];
    fetch("/api/send-command", {
      body: JSON.stringify({ event: "correct-answer", id, correctAnswer }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    });
  };

  return (
    <>
      <div>
        {Object.entries(players).map(([name, data]) => {
          const { id, duration, answer } = data ?? {};
          return (
            <>
              <div>{name}</div>
              {duration && <div>{duration / 1000}s</div>}
              {answer && (
                <div>
                  {answer.map((option, idx) => (
                    <span
                      style={{
                        color: option === questions[id].correctAnswer[idx] ? 'green' : 'red',
                      }}
                    >
                      {questions[id].options[option]},
                    </span>
                  ))}
                </div>
              )}
            </>
          );
        })}
      </div>
      <hr />
      {questions.map(({ id, question, options, correctAnswer }) => (
        <div key={id} style={{ opacity: doneQuestions.includes(id) ? 0.5 : 1 }}>
          <h3>Q{id + 1}</h3>
          <p>{question}</p>
          <p>
            {correctAnswer
              .map((option) => `${option.toUpperCase()}: ${options[option]}`)
              .join(", ")}
          </p>
          <div>
            <button onClick={() => sendQuestion(id)}>Send Question</button>
            <button onClick={() => sendAnswer(id)}>Send Answer</button>
            <button onClick={() => clearQuestion(id)}>Clear Question</button>
          </div>
          <hr />
        </div>
      ))}
    </>
  );
}
