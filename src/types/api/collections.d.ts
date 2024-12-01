declare namespace Collections {
    interface Chat {
        id: number
        messages: Collections.Message[]
        user1Id: number
        user2Id: number
        interlocutor: Collections.User
        unreadCount: number
        lastMessage: string
        lastSenderName: string
        lastSenderId: number

        createdAt: string
        updatedAt: string
    }

    interface Message {
        id: number
        chatId: number
        content: string | null
        audioUrl: string | null
        createdAt: string
        receiverId: number
        senderId: number
        receiver: Collections.User
        sender: Collections.User
        replyToMessage: Collections.ReplyToMessage | null
        replyToMessageId: number | null
        isRead: boolean
    }

    interface ReplyToMessage {
        id: number
        chatId: number
        content: string | null
        audioUrl: string | null
        createdAt: string
        receiverId: number
        senderId: number
        receiver: Collections.User
        sender: Collections.User
    }

    interface UserDetails {
        birthdate: string
        shortInfo: string | null
        city: string | null
        mobilePhone: string | null
        additionalPhone: string | null
        skype: string | null
        site: string | null
        activity: string | null
        interests: string | null
        music: string | null
        movies: string | null
        TVShows: string | null
        books: string | null
        games: string | null
        quotes: string | null
        grandparents: string[]
        parents: string[]
        siblings: string[]
        children: string[]
        grandsons: string[]
    }

    interface User {
        id: number
        patronymic: string | null
        surname: string
        name: string
        email: string
        ava: string | null
        isAdmin: boolean
        isOnline: boolean
        password: string
        friends: number[]
        incomingFriendRequests: number[]
        outgoingFriendRequests: number[]
        updatedAt: string
        createdAt: string
    }

    interface FullUser {
        id: number
        patronymic: string | null
        surname: string
        name: string
        email: string
        ava: string | null
        isAdmin: boolean
        password: string
        friends: number[]
        incomingFriendRequests: number[]
        outgoingFriendRequests: number[]
        updatedAt: string
        createdAt: string
        details: Collections.UserDetails
    }

    interface Post {
        id: number
        files: string[]
        description: string | null
        createdAt: string
        likes: Collections.User[]
        creator: Collections.User
    }

    interface Lesson {
        title: string
        teacher: Teacher
        cabinet: string
    }

    interface Schedule {
        id: string
        monday: Lesson[]
        tuesday: Lesson[]
        wednesday: Lesson[]
        thursday: Lesson[]
        friday: Lesson[]
    }

    type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

    interface Group {
        id: string
        name: string
        teacher: Teacher
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
        discipline: string
        group: SimpleGroup | null
        createdAt: string
        updatedAt: string
    }

    interface Student {
        id: string
        name: string
        email: string
        group: SimpleGroup
        birthDate?: string
        phone?: string
        createdAt: string
        updatedAt: string
    }

    interface User {
        birthdate: string
        createdAt: string
        email: string
        id: string
        isAdmin: boolean
        password: string
        updatedAt: string
        username: string
    }
}
