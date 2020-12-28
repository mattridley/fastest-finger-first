import * as React from "react";

import s from './Question.module.css'

export default function Question({ question, options, showOptions, onSubmit }) {
  const [{ answer, start }, setState] = React.useState({
    answer: [],
    start: null,
  });

  React.useEffect(() => {
    if (showOptions && !start) {
      setState({ answer, start: performance.now() });
    }
  }, [showOptions]);

  React.useEffect(() => {
    if (answer.length === Object.keys(options).length) {
      onSubmit({ answer, duration: Math.round(performance.now() - start) });
    }
  }, [answer]);

  const selectOption = ({ target: { name } }) =>
    setState({ answer: [...answer, name], start });

  return (
    <>
      <h1>{question}</h1>
      {start && (
        <div className={s.options}>
          <button className={s.button} name="a" onClick={selectOption} disabled={answer.includes('a')}>A: {options.a}</button>
          <button className={s.button} name="b" onClick={selectOption} disabled={answer.includes('b')}>B: {options.b}</button>
          <button className={s.button} name="c" onClick={selectOption} disabled={answer.includes('c')}>C: {options.c}</button>
          <button className={s.button} name="d" onClick={selectOption} disabled={answer.includes('d')}>D: {options.d}</button>
        </div>
      )}
    </>
  );
}
