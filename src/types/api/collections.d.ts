declare namespace Collections {
    type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

    interface Lesson {
        cabinet: string
        discipline: Discipline | null
        teacher: Teacher | null
        id: string
    }

    interface Schedule {
        id: string
        monday: Lesson[]
        tuesday: Lesson[]
        wednesday: Lesson[]
        thursday: Lesson[]
        friday: Lesson[]
    }

    interface Group {
        id: string
        name: string
        teacher: Teacher | null
        students: Student[]
        schedule: Schedule
        createdAt: string
        updatedAt: string
    }

    type GroupedCourses = Array<[string, Group[]]>

    interface SimpleGroup {
        id: string
        name: string
        createdAt: string
        updatedAt: string
    }

    interface Teacher {
        id: string
        name: string
        email: string
        discipline: Discipline
        group: SimpleGroup | null
        createdAt: string
        updatedAt: string
    }

    interface Student {
        id: string
        name: string
        email: string
        group: SimpleGroup | null
        birthDate?: string
        phone?: string
        createdAt: string
        updatedAt: string
    }

    interface Discipline {
        name: string
        id: string
        createdAt: string
        updatedAt: string
    }

    interface Admin {
        id: string
        name: string
        email: string
        createdAt: string
        updatedAt: string
    }

    interface Message {
        senderId: string
        text: string
        createdAt: string
        teacherSender: Teacher | null
        studentSender: Teacher | null
    }

    interface Chat {
        id: string
        groupId: string
        createdAt: string
        updatedAt: string
    }

    interface Lesson {
        id: string
        homework: string
        description: string
        title: string
        date: string
    }

    interface Grade {
        id: string
        grade: string
        date: string
    }

    interface DisciplineGrades {
        discipline: string
        grades: Grade[]
    }

    type StudentGrades = DisciplineGrades[]
}
