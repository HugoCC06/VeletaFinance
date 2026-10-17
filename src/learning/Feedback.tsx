import { useEffect, useRef } from 'react'
import type { Question } from '../content/types'
import { Icon } from '../components/Icon'
import { Button } from '../components/ui'
import { describeCorrect } from './answers'

const PRAISE = ['Nice work!', 'Exactly right!', 'Spot on!', 'Great thinking!', 'You’ve got it!']

export function Feedback({ question, correct, onContinue, retryLater }: { question: Question; correct: boolean; onContinue: () => void; retryLater: boolean }) {
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    btn.current?.focus()
  }, [])
  const praise = PRAISE[question.id.length % PRAISE.length]
  return (
    <section className={`feedback ${correct ? 'feedback--correct' : 'feedback--wrong'}`} aria-live="assertive" aria-labelledby="feedback-title">
      <div className="feedback__inner">
        <div className="feedback__body">
          <div className="feedback__title" id="feedback-title">
            <span className="feedback__icon"><Icon name={correct ? 'check' : 'x'} size={22} strokeWidth={3} /></span>
            {correct ? praise : 'Not quite'}
          </div>
          {!correct && (
            <p className="feedback__answer"><strong>Correct answer:</strong> {describeCorrect(question)}</p>
          )}
          {question.kind === 'numeric' && question.working && <p className="feedback__working"><strong>Working:</strong> {question.working}</p>}
          <p className="feedback__explanation">{question.explanation}</p>
          {!correct && retryLater && <p className="feedback__retry"><Icon name="refresh" size={16} /> You’ll see this question again before the end of the lesson.</p>}
        </div>
        <Button ref={btn} variant={correct ? 'success' : 'danger'} size="lg" onClick={onContinue} className="feedback__btn">Continue</Button>
      </div>
    </section>
  )
}
