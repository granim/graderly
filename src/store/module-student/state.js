export default function () {
  return {
    // Data Structure
    // id: number
    // name: String,
    // asignments: Array[objects]
    // grades: array[objects]

    studentList: [
      {
        courseId: 'c1',
        id: 's1',
        name: 'Bill',
        asignments: [
          {
            id: 'a1',
            score: 79
          },
          {
            id: 'a2',
            score: 98
          },
          {
            id: 'a3',
            score: 92
          }
        ],
        grades: []
      },
      {
        courseId: 'c1',
        id: 's2',
        name: 'Susan',
        asignments: [
          {
            id: 'a90',
            score: 0,
            
          },
          {
            id: 'a99',
            score: 0,
          },

          {
            id: 'a1',
            score: 65
          },
          {
            id: 'a8',
            score: 89
          },
          {
            id: 'a11',
            score: 65
          },
          {
            id: 'a112',
            score: 65
          },
          {
            id: 'a6',
            score: 87
          },
          {
            id: 'a43',
            score: 87
          },
          {
            id: 'a5',
            score: 87
          },
          {
            id: 'a4',
            score: 100
          },
          {
            id: 'a44',
            score: 100
          },
          {
            id: 'a55',
           score: 22
          },
          {
            id: 'a22',
            score: 44
          },
        ],
        grades: [
          {
             id: 'g1',
              name: 'math',
              avaibleScore: 0,
              score:   0,
          },
           {
             id: 'g2',
              name: 'reading',
              avaibleScore: 0,
              score:   0,
              
          },
           {
              id: 'g3',
              name: 'music',
              avaibleScore: 0,
              score:   0,
              
          },
           {
              id: 'g4',
              name: 'history',
              avaibleScore: 0,
              score:   0,
              
          },
           {
              id: 'g5',
              name: 'geography',
              avaibleScore: 0,
              score:   0,
          }]
      }
    ]


  }
}
