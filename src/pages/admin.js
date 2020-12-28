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
      <button onClick={clearQuestion}>Clear Question</button>
      {questions.map(({ id, question, options, correctAnswer }) => (
        <div key={id}>
          <p>{question}</p>
          <p>
            {correctAnswer
              .map((option) => `${option.toUpperCase()}: ${options[option]}`)
              .join(", ")}
          </p>
          <div>
            <button onClick={() => sendQuestion(id)}>Send Question</button>
            <button onClick={() => sendAnswer(id)}>Send Answer</button>
          </div>
        </div>
      ))}
    </>
  );
}
