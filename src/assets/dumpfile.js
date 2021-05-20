let asignments = [
    {
        id: 'a1',
        name: 'Math Test One',
        subject: 'Math',
        possibleScore: 100,
        courseId: 'c1',
        chapter: 1,
        time: 1
      },
      {
        id: 'a8',
        name: 'Math Test 11',
        subject: 'Math',
        possibleScore: 100,
        courseId: 'c1',
        chapter: 2,
        time: 1
      },
      {
        id: 'a2',
        name: 'Reading Test One',
        subject: 'Reading',
        possibleScore: 100,
        courseId: 'c1',
        chapter: 2,
        time: 1
      },
      {
        id: 'a3',
        name: 'Reading Test Two',
        subject: 'Reading',
        possibleScore: 100,
        courseId: 'c1',
        chapter: 2,
        time: 1
      },
      {
        id: 'a22',
        name: 'Science Test One',
        subject: 'Science',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 1,
        time: 1
      },
      {
        id: 'a55',
        name: 'Science Test Two',
        subject: 'Science',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 1,
        time: 2
      },
      {
        id: 'a4',
        name: 'Writing quiz 1',
        subject: 'Writing',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 1,
        time: 1
      },
      {
        id: 'a5',
        name: 'Writing quiz 111',
        subject: 'Writing',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 2,
        time: 3
      },
      {
        id: 'a6',
        name: 'Writing quiz 12',
        subject: 'Writing',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 4,
        time: 2
      },
      {
        id: 'a90',
        name: 'Math 2',
        subject: 'Math',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 4,
        time: 2
      },
      {
        id: 'a99',
        name: 'Math 4',
        subject: 'Math',
        possibleScore: 100,
        courseId: 'c2',
        chapter: 4,
        time: 2
      }
]
courses: [
    {
      courseId: 'c1',
      courseName: 'second grade',
      numberOfStudents: 0,
      initilizedStudents: true,
      courseStudents: [
      { 
        id: 's2',
        name: 'Susan'
      }, 
      {
        id: 's1',
        name: 'Bill'
      }
      ],
    },
      {
        courseId: 'c2',
        courseName: '1st grade',
        numberOfStudents: 3,
        initilizedStudents: false,
        courseStudents: [],
      }
  ]