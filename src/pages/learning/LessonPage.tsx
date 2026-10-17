import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getLesson } from '../../content'
import { GUEST_LESSONS } from '../../content/guest'
import type { AnswerValue } from '../../content/types'
import { isLessonUnlocked } from '../../engine/progression'
import { LessonNotFound, LessonPlayer } from '../../learning/LessonPlayer'
import { useApp } from '../../state/AppContext'
import { addPending } from '../../state/pending'
import { snapshotFromState } from '../../state/selectors'
import { useMeta } from '../../lib/useMeta'
import { EmptyState, LinkButton } from '../../components/ui'


export function LessonPage() {
  const { lessonId = '' } = useParams()
  const ref = getLesson(lessonId)
  const { backend, state, user, refresh } = useApp()
  useMeta(ref ? ref.lesson.title : 'Lesson', { noindex: true })

  const onSubmit = useCallback(async (answers: Record<string, AnswerValue>, attemptId: string) => {
    const r = await backend!.submitLesson(lessonId, answers, attemptId)
    void refresh()
    return r
  }, [backend, lessonId, refresh])
  const onQueueOffline = useCallback((answers: Record<string, AnswerValue>, attemptId: string) => {
    if (user) addPending(user.id, { kind: 'lesson', targetId: lessonId, answers, attemptId, createdAt: new Date().toISOString() })
  }, [user, lessonId])

  if (!ref) return <LessonNotFound />
  const { course, unit, lesson } = ref
  const snap = snapshotFromState(state)
  const completed = !!state?.lessons[lesson.id]
  if (!completed && !isLessonUnlocked(course, lesson.id, snap)) {
    return (
      <div className="container page">
        <EmptyState title="This lesson is locked" mood="think" action={<LinkButton to={`/app/learn/${course.id}`} variant="primary">Back to the path</LinkButton>}>
          Complete the earlier lessons{unit.lessons[0].id === lesson.id ? ' and the previous unit’s checkpoint' : ''} first. Each lesson builds on the one before.
        </EmptyState>
      </div>
    )
  }
  const idx = unit.lessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = unit.lessons[idx + 1]
  const nextHref = nextLesson ? `/app/lesson/${nextLesson.id}` : `/app/assessment/${unit.checkpoint.id}`
  return (
    <LessonPlayer
      key={lesson.id}
      lesson={lesson}
      context={`${course.title} · ${unit.title}`}
      mode="learner"
      draftKey={`veleta.draft.${user?.id}.${lesson.id}`}
      onSubmit={onSubmit}
      onQueueOffline={onQueueOffline}
      exitTo={`/app/learn/${course.id}`}
      nextHref={nextHref}
      nextLabel={nextLesson ? 'Next lesson' : 'Take the unit checkpoint'}
      alreadyCompleted={completed}
    />
  )
}

export function GuestLessonPage() {
  const { lessonId = '' } = useParams()
  const ref = getLesson(lessonId)
  useMeta(ref ? `Try: ${ref.lesson.title}` : 'Sample lesson', { description: ref?.lesson.description })
  if (!ref) return <LessonNotFound />
  if (!GUEST_LESSONS.has(lessonId)) {
    return (
      <div className="container page">
        <EmptyState title="Create a free account to continue" mood="wave" action={<LinkButton to="/signup" variant="primary">Create free account</LinkButton>}>
          This lesson is part of the full learning path. Sample lessons are available from every course on the curriculum page.
        </EmptyState>
      </div>
    )
  }
  return (
    <LessonPlayer
      key={lessonId}
      lesson={ref.lesson}
      context={`Sample lesson · ${ref.course.title}`}
      mode="guest"
      draftKey={`veleta.draft.guest.${lessonId}`}
      exitTo={`/curriculum/${ref.course.slug}`}
    />
  )
}
