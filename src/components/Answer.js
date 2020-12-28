import s from "./Answer.module.css";

export default function Answer({ options, userAnswer, correctAnswer }) {
  return (
    <>
      <h2 className={s.duration}>{userAnswer.duration / 1000}s</h2>
      <div className={s.answers}>
        <div className={s.userAnswer}>
          <h3>Your Answer</h3>
          {userAnswer.answer.map((option, idx) => (
            <div
              key={option}
              style={{
                color: correctAnswer
                  ? correctAnswer[idx] === option
                    ? "green"
                    : "red"
                  : undefined,
              }}
            >
              {option.toUpperCase()}: {options[option]}
            </div>
          ))}
        </div>
        <div className={s.correctAnswer}>
          <h3>Correct Answer</h3>
          {(correctAnswer || []).map((option) => (
            <div key={option}>
              {option.toUpperCase()}: {options[option]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
