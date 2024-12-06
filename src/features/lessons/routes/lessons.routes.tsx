import { lessonsPaths } from './lessons.paths.ts'
import Lessons from '../pages/Lessons'
import CreateLesson from '../pages/CreateLesson'

export const lessonsRoutes = [
    {
        path: lessonsPaths.lessons,
        element: <Lessons/>
    },
    {
        path: lessonsPaths.create_lesson,
        element: <CreateLesson/>
    }
]
