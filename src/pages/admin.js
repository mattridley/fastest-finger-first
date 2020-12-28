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

export default function Admin() {
  const handlePusherMessage = () => {};
  usePusherChannel("fastest-finger-first", handlePusherMessage);

  const clearQuestion = (id) => {
    fetch("/api/send-command", {
      body: JSON.stringify({ event: "clear-question" }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    });
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
      {questions.map(({ id, question, options, correctAnswer }) => (
        <div key={id}>
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
            <button onClick={clearQuestion}>Clear Question</button>
          </div>
          <hr />
        </div>
      ))}
    </>
  );
}
