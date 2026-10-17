import { useParams } from 'react-router-dom'
import { getCourse } from '../../content'
import { GUEST_LESSONS } from '../../content/guest'
import { Icon } from '../../components/Icon'
import { EmptyState, LinkButton } from '../../components/ui'
import { useMeta } from '../../lib/useMeta'
import { useApp } from '../../state/AppContext'

export function CoursePublic() {
  const { courseId = '' } = useParams()
  const course = getCourse(courseId)
  const { user } = useApp()
  useMeta(course?.title ?? 'Course', { description: course?.description })
  if (!course) return <div className="container page"><EmptyState title="Course not found" action={<LinkButton to="/curriculum" variant="primary">See all courses</LinkButton>} /></div>
  const lessons = course.units.flatMap((u) => u.lessons)
  const sample = lessons.find((l) => GUEST_LESSONS.has(l.id))
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0)
  return (
    <div className="container page">
      <header className="course-hero card">
        <span className={`icon-chip icon-chip--${course.colour}`} style={{ width: 64, height: 64 }}><Icon name={course.icon} size={32} /></span>
        <div className="stack-sm">
          <span className="eyebrow">Course</span>
          <h1 className="mb-0">{course.title}</h1>
          <p className="muted mb-0">{course.description}</p>
          <div className="cluster-sm">
            <span className="pill"><Icon name="book" size={14} />{lessons.length} lessons</span>
            <span className="pill"><Icon name="clock" size={14} />about {Math.round(minutes / 5) * 5} minutes</span>
            <span className="pill"><Icon name="flag" size={14} />{course.units.length} checkpoints</span>
            <span className="pill"><Icon name="graduation" size={14} />Final exam · pass {Math.round(course.passMark * 100)}%</span>
          </div>
          <div className="cluster mt-2">
            <LinkButton to={user ? `/app/learn/${course.id}` : '/signup'} variant="primary" iconRight="arrowRight">{user ? 'Open in your path' : 'Start this course free'}</LinkButton>
            {sample && <LinkButton to={`/try/${sample.id}`} icon="play">Try a sample lesson</LinkButton>}
          </div>
        </div>
      </header>
      <section className="mt-8" aria-labelledby="outcomes">
        <h2 id="outcomes">What you’ll be able to do</h2>
        <ul className="check-list">{course.outcomes.map((o) => <li key={o}><Icon name="check" size={18} />{o}</li>)}</ul>
      </section>
      <section className="mt-8 stack" aria-labelledby="units">
        <h2 id="units" className="mb-0">Units and lessons</h2>
        {course.units.map((u, ui) => (
          <div key={u.id} className="card">
            <h3>Unit {ui + 1}: {u.title}</h3>
            <p className="muted">{u.description}</p>
            <ol className="lesson-outline">
              {u.lessons.map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>{l.title}</strong>
                    <p className="small muted mb-0">{l.description}</p>
                  </div>
                  <span className="cluster-sm">
                    <span className="subtle nowrap">{l.minutes} min</span>
                    {GUEST_LESSONS.has(l.id) && <LinkButton to={`/try/${l.id}`} size="sm" variant="ghost" aria-label={`Try sample lesson: ${l.title}`}>Try it</LinkButton>}
                  </span>
                </li>
              ))}
              <li className="lesson-outline__checkpoint"><div><strong><Icon name="flag" size={16} /> Unit checkpoint</strong><p className="small muted mb-0">{u.checkpoint.questions.length} questions · pass {Math.round(u.checkpoint.passMark * 100)}%</p></div></li>
            </ol>
          </div>
        ))}
        <div className="card card--accent">
          <h3><Icon name="graduation" /> Final exam and certificate</h3>
          <p className="muted mb-0">{course.exam.questions.length} questions covering the whole course. Score {Math.round(course.passMark * 100)}% or more to complete the course and earn a Veleta Finance course-completion certificate. Retakes are always allowed.</p>
        </div>
      </section>
    </div>
  )
}
