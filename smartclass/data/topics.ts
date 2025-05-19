export const topics = [
  // Mathematics Topics
  {
    id: "math-numbers",
    subjectId: "mathematics",
    title: "Foundations",
    description: "Start seeing the world through numbers and patterns",
    level: 1,
    subtopics: [
      {
        id: "counting",
        title: "Counting and Number Recognition",
        description: "Learn to count and recognize numbers up to 100",
        completed: true,
      },
      {
        id: "addition",
        title: "Addition",
        description: "Adding numbers and understanding the concept of sum",
        completed: true,
      },
      {
        id: "subtraction",
        title: "Subtraction",
        description: "Subtracting numbers and understanding the concept of difference",
        completed: false,
      },
      {
        id: "multiplication",
        title: "Multiplication",
        description: "Multiplying numbers and understanding the concept of product",
        completed: false,
      },
    ],
  },
  {
    id: "math-fractions",
    subjectId: "mathematics",
    title: "Fractions & Decimals",
    description: "Discover how to work with parts of a whole",
    level: 2,
    subtopics: [
      {
        id: "intro-fractions",
        title: "Introduction to Fractions",
        description: "Understanding the concept of parts of a whole",
        completed: true,
      },
      {
        id: "comparing-fractions",
        title: "Comparing Fractions",
        description: "Learning to compare fractions with different denominators",
        completed: false,
      },
      {
        id: "decimals",
        title: "Decimals",
        description: "Understanding decimal notation and place value",
        completed: false,
      },
    ],
  },
  {
    id: "math-geometry",
    subjectId: "mathematics",
    title: "Geometry & Measurement",
    description: "Explore shapes, sizes, and measurements in space",
    level: 3,
    subtopics: [
      {
        id: "shapes",
        title: "2D and 3D Shapes",
        description: "Identifying and describing various shapes",
        completed: false,
      },
      {
        id: "measurement",
        title: "Measurement",
        description: "Understanding length, weight, capacity, and time",
        completed: false,
      },
    ],
  },

  // English Topics
  {
    id: "eng-reading",
    subjectId: "english",
    title: "Reading Foundations",
    description: "Build essential reading skills and comprehension",
    level: 1,
    subtopics: [
      {
        id: "phonics",
        title: "Phonics and Word Recognition",
        description: "Learning letter sounds and word recognition",
        completed: true,
      },
      {
        id: "fluency",
        title: "Reading Fluency",
        description: "Practicing reading with proper speed and expression",
        completed: true,
      },
      {
        id: "comprehension",
        title: "Comprehension Strategies",
        description: "Understanding and analyzing what you read",
        completed: false,
      },
    ],
  },
  {
    id: "eng-writing",
    subjectId: "english",
    title: "Writing & Grammar",
    description: "Express yourself clearly through writing",
    level: 2,
    subtopics: [
      {
        id: "sentences",
        title: "Sentence Structure",
        description: "Learning to write complete and varied sentences",
        completed: false,
      },
      {
        id: "grammar",
        title: "Grammar Rules",
        description: "Understanding parts of speech and grammar conventions",
        completed: false,
      },
      {
        id: "writing-process",
        title: "The Writing Process",
        description: "Planning, drafting, revising, and editing written work",
        completed: false,
      },
    ],
  },

  // Science Topics
  {
    id: "sci-living",
    subjectId: "science",
    title: "Foundations",
    description: "Start seeing the world around you like a scientist",
    level: 1,
    subtopics: [
      {
        id: "plants",
        title: "Plants",
        description: "Structure, growth, and importance of plants",
        completed: false,
      },
      {
        id: "animals",
        title: "Animals",
        description: "Classification, habitats, and adaptations of animals",
        completed: false,
      },
      {
        id: "human-body",
        title: "Human Body",
        description: "Systems and functions of the human body",
        completed: false,
      },
    ],
  },
  {
    id: "sci-matter",
    subjectId: "science",
    title: "Chemistry & Physics",
    description: "Discover the core principles of chemistry and physics",
    level: 2,
    subtopics: [
      {
        id: "properties",
        title: "Properties of Matter",
        description: "Exploring physical and chemical properties of matter",
        completed: false,
      },
      {
        id: "energy-forms",
        title: "Forms of Energy",
        description: "Understanding different types of energy and transformations",
        completed: false,
      },
    ],
  },

  // Social Studies Topics
  {
    id: "soc-community",
    subjectId: "social-studies",
    title: "Communities",
    description: "Understand how people live and work together",
    level: 1,
    subtopics: [
      {
        id: "family",
        title: "Family and Home",
        description: "Exploring family structures and roles",
        completed: false,
      },
      {
        id: "community",
        title: "Community Helpers",
        description: "Learning about people who help in our communities",
        completed: false,
      },
      {
        id: "culture",
        title: "Cultural Diversity",
        description: "Appreciating different cultures and traditions",
        completed: false,
      },
    ],
  },
  {
    id: "soc-geography",
    subjectId: "social-studies",
    title: "Geography & Environment",
    description: "Explore places, landforms, and conservation",
    level: 2,
    subtopics: [
      {
        id: "maps",
        title: "Maps and Directions",
        description: "Reading maps and understanding directions",
        completed: false,
      },
      {
        id: "landforms",
        title: "Landforms and Bodies of Water",
        description: "Identifying major landforms and water bodies",
        completed: false,
      },
      {
        id: "conservation",
        title: "Environmental Conservation",
        description: "Understanding the importance of protecting our environment",
        completed: false,
      },
    ],
  },

  // Coding Topics
  {
    id: "code-basics",
    subjectId: "coding",
    title: "Programming Basics",
    description: "Start thinking like a programmer",
    level: 1,
    subtopics: [
      {
        id: "intro",
        title: "Introduction to Programming",
        description: "Understanding what programming is and how it works",
        completed: false,
      },
      {
        id: "variables",
        title: "Variables and Data Types",
        description: "Learning about different types of data in Python",
        completed: false,
      },
      {
        id: "operators",
        title: "Operators and Expressions",
        description: "Using operators to perform operations on data",
        completed: false,
      },
    ],
  },
  {
    id: "code-control",
    subjectId: "coding",
    title: "Control Structures",
    description: "Learn to control the flow of your programs",
    level: 2,
    subtopics: [
      {
        id: "conditionals",
        title: "Conditional Statements",
        description: "Making decisions in your code with if-else statements",
        completed: false,
      },
      {
        id: "loops",
        title: "Loops",
        description: "Repeating actions with for and while loops",
        completed: false,
      },
    ],
  },

  // Maps Topics
  {
    id: "maps-africa",
    subjectId: "maps",
    title: "African Geography",
    description: "Discover the diverse geography of Africa",
    level: 1,
    subtopics: [
      {
        id: "regions",
        title: "Regions of Africa",
        description: "Understanding the different regions of Africa",
        completed: false,
      },
      {
        id: "countries",
        title: "Countries and Capitals",
        description: "Learning about African countries and their capitals",
        completed: false,
      },
      {
        id: "features",
        title: "Geographic Features",
        description: "Exploring major landforms and water bodies in Africa",
        completed: false,
      },
    ],
  },
  {
    id: "maps-world",
    subjectId: "maps",
    title: "World Geography",
    description: "Explore the continents and oceans of our planet",
    level: 2,
    subtopics: [
      {
        id: "continents",
        title: "Continents and Oceans",
        description: "Learning about the seven continents and five oceans",
        completed: false,
      },
      {
        id: "major-countries",
        title: "Major Countries",
        description: "Exploring important countries around the world",
        completed: false,
      },
    ],
  },
]

// Mock content for subtopics
export function getContentForSubtopic(subtopicId: string) {
  const contentMap: Record<string, any[]> = {
    counting: [
      {
        title: "Introduction to Counting",
        body: `<p>Counting is one of the first math skills we learn. It helps us understand how many objects are in a group.</p>
               <p>Let's start by counting from 1 to 10:</p>
               <div class="flex justify-center space-x-4 my-4">
                 ${Array.from(
                   { length: 10 },
                   (_, i) =>
                     `<div class="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full font-bold">${i + 1}</div>`,
                 ).join("")}
               </div>
               <p>Try counting these objects out loud!</p>`,
      },
      {
        title: "Counting Forward and Backward",
        body: `<p>We can count forward (1, 2, 3...) or backward (10, 9, 8...).</p>
               <p>Counting backward is like a countdown:</p>
               <div class="bg-gray-100 p-4 rounded-md my-4">
                 <p class="font-bold">10, 9, 8, 7, 6, 5, 4, 3, 2, 1, Blast off! 🚀</p>
               </div>
               <p>Practice counting backward from 10 to 1.</p>`,
        image: "/placeholder.svg?height=200&width=400",
      },
      {
        title: "Skip Counting",
        body: `<p>Sometimes we can skip numbers when counting. This is called <strong>skip counting</strong>.</p>
               <p>Skip counting by 2s: 2, 4, 6, 8, 10...</p>
               <p>Skip counting by 5s: 5, 10, 15, 20, 25...</p>
               <p>Skip counting by 10s: 10, 20, 30, 40, 50...</p>
               <div class="bg-yellow-50 p-4 rounded-md my-4 border-l-4 border-yellow-400">
                 <p class="font-semibold">Skip counting helps us count faster and prepares us for multiplication!</p>
               </div>`,
      },
    ],
    addition: [
      {
        title: "What is Addition?",
        body: `<p>Addition is combining groups of objects together to find the total.</p>
               <p>We use the plus sign (+) for addition.</p>
               <div class="flex items-center justify-center space-x-4 my-4">
                 <div class="flex space-x-1">
                   ${Array.from({ length: 3 }, () => `<div class="w-8 h-8 bg-red-100 rounded-full"></div>`).join("")}
                 </div>
                 <div class="text-xl">+</div>
                 <div class="flex space-x-1">
                   ${Array.from({ length: 2 }, () => `<div class="w-8 h-8 bg-blue-100 rounded-full"></div>`).join("")}
                 </div>
                 <div class="text-xl">=</div>
                 <div class="flex space-x-1">
                   ${Array.from({ length: 5 }, () => `<div class="w-8 h-8 bg-green-100 rounded-full"></div>`).join("")}
                 </div>
               </div>
               <p class="text-center font-bold">3 + 2 = 5</p>`,
      },
      {
        title: "Addition Facts",
        body: `<p>Addition facts are basic addition problems that we should memorize.</p>
               <p>Here are some examples:</p>
               <div class="grid grid-cols-2 gap-4 my-4">
                 <div class="bg-blue-50 p-3 rounded-md text-center">1 + 1 = 2</div>
                 <div class="bg-blue-50 p-3 rounded-md text-center">2 + 2 = 4</div>
                 <div class="bg-blue-50 p-3 rounded-md text-center">3 + 3 = 6</div>
                 <div class="bg-blue-50 p-3 rounded-md text-center">4 + 4 = 8</div>
                 <div class="bg-blue-50 p-3 rounded-md text-center">5 + 5 = 10</div>
                 <div class="bg-blue-50 p-3 rounded-md text-center">6 + 4 = 10</div>
               </div>
               <p>Practice these addition facts until you know them by heart!</p>`,
      },
      {
        title: "Adding on a Number Line",
        body: `<p>A number line can help us visualize addition.</p>
               <p>To add 3 + 2 on a number line:</p>
               <ol class="list-decimal pl-6 my-4 space-y-2">
                 <li>Start at 0</li>
                 <li>Move right 3 places</li>
                 <li>Then move right 2 more places</li>
                 <li>You end up at 5, so 3 + 2 = 5</li>
               </ol>
               <div class="bg-gray-100 p-4 rounded-md my-4 flex justify-center">
                 <div class="relative h-8 w-full max-w-md">
                   <div class="absolute top-4 left-0 right-0 h-1 bg-black"></div>
                   ${Array.from(
                     { length: 11 },
                     (_, i) =>
                       `<div class="absolute top-0 h-4 w-1 bg-black" style="left: ${i * 10}%"></div>
                      <div class="absolute top-6 text-xs" style="left: ${i * 10}%">${i}</div>`,
                   ).join("")}
                   <div class="absolute top-0 h-8 w-8 rounded-full bg-green-200 flex items-center justify-center font-bold" style="left: calc(50% - 16px)">5</div>
                 </div>
               </div>`,
        image: "/placeholder.svg?height=100&width=500",
      },
    ],
    intro: [
      {
        title: "What is Programming?",
        body: `<p>Programming is giving instructions to a computer to perform specific tasks.</p>
               <p>Just like you follow a recipe to bake a cake, computers follow programs to do things like:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>Display websites</li>
                 <li>Play games</li>
                 <li>Send messages</li>
                 <li>Solve math problems</li>
               </ul>
               <p>In this course, we'll learn Python, one of the most popular programming languages in the world!</p>`,
      },
      {
        title: "Why Learn Python?",
        body: `<p>Python is a great first programming language because:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>It's easy to read and write</li>
                 <li>It's used by professionals in many fields</li>
                 <li>It can be used for games, websites, data analysis, and more</li>
                 <li>It has a friendly community of users</li>
               </ul>
               <div class="bg-yellow-50 p-4 rounded-md my-4 border-l-4 border-yellow-400">
                 <p class="font-semibold">Fun fact: Python is named after the comedy group Monty Python, not the snake!</p>
               </div>`,
      },
      {
        title: "Your First Python Program",
        body: `<p>Let's write our first Python program! The traditional first program is called "Hello, World!"</p>
               <p>In the code editor, you'll see:</p>
               <pre class="bg-gray-100 p-3 rounded-md my-4 overflow-x-auto">
print("Hello, World!")
               </pre>
               <p>When you run this code, the computer will display the text: <strong>Hello, World!</strong></p>
               <p>The <code>print()</code> function tells Python to display whatever is inside the parentheses.</p>
               <p>Try changing the message to say hello with your name!</p>`,
      },
    ],
    regions: [
      {
        title: "Introduction to Africa",
        body: `<p>Africa is the second-largest continent in the world, with a rich diversity of cultures, landscapes, and wildlife.</p>
               <p>Africa is divided into several regions:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>North Africa</li>
                 <li>West Africa</li>
                 <li>Central Africa</li>
                 <li>East Africa</li>
                 <li>Southern Africa</li>
               </ul>
               <p>Each region has its own unique geography, climate, and cultural traditions.</p>`,
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        title: "North Africa",
        body: `<p>North Africa borders the Mediterranean Sea and includes countries like:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>Egypt</li>
                 <li>Libya</li>
                 <li>Tunisia</li>
                 <li>Algeria</li>
                 <li>Morocco</li>
               </ul>
               <p>This region is known for:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>The Sahara Desert - the largest hot desert in the world</li>
                 <li>The Nile River - the longest river in Africa</li>
                 <li>Ancient civilizations like Egypt</li>
                 <li>A mostly Arabic-speaking population</li>
               </ul>`,
      },
      {
        title: "West Africa",
        body: `<p>West Africa faces the Atlantic Ocean and includes countries like:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>Nigeria - Africa's most populous country</li>
                 <li>Ghana</li>
                 <li>Senegal</li>
                 <li>Côte d'Ivoire (Ivory Coast)</li>
                 <li>Mali</li>
               </ul>
               <p>This region is known for:</p>
               <ul class="list-disc pl-6 my-4 space-y-2">
                 <li>Rich musical traditions</li>
                 <li>The Niger River</li>
                 <li>Historical trade routes across the Sahara</li>
                 <li>Diverse languages and ethnic groups</li>
               </ul>
               <div class="bg-yellow-50 p-4 rounded-md my-4 border-l-4 border-yellow-400">
                 <p class="font-semibold">Did you know? West Africa was home to powerful empires like Ghana, Mali, and Songhai.</p>
               </div>`,
      },
    ],
  }

  // Return content for the requested subtopic, or a default if not found
  return (
    contentMap[subtopicId] || [
      {
        title: "Introduction",
        body: `<p>Welcome to this lesson! Content is being prepared for this topic.</p>
             <p>In the meantime, here's some general information about learning:</p>
             <ul class="list-disc pl-6 my-4 space-y-2">
               <li>Take notes as you learn</li>
               <li>Ask questions if something isn't clear</li>
               <li>Practice regularly to reinforce what you've learned</li>
               <li>Connect new information to things you already know</li>
             </ul>`,
      },
      {
        title: "Key Concepts",
        body: `<p>Every subject has important key concepts that form the foundation of learning.</p>
             <p>As you progress through this course, you'll discover the key concepts for this topic.</p>
             <p>Remember to take your time and make sure you understand each concept before moving on.</p>`,
      },
      {
        title: "Practice Makes Perfect",
        body: `<p>Learning requires practice and repetition.</p>
             <p>Don't worry if you don't understand everything right away - that's normal!</p>
             <p>Keep practicing, and you'll improve over time.</p>
             <div class="bg-blue-50 p-4 rounded-md my-4">
               <p class="font-semibold">Tip: Try explaining what you've learned to someone else. Teaching is one of the best ways to learn!</p>
             </div>`,
      },
    ]
  )
}

// Mock quiz data
export function getQuizForTopic(topicId: string, quizType: "mid" | "main" | "exam") {
  // Default quiz questions
  const defaultQuiz = [
    {
      question: "What is the main purpose of learning?",
      options: ["To pass tests", "To gain knowledge and skills", "To please teachers", "To get good grades"],
      correctAnswer: "To gain knowledge and skills",
      explanation:
        "The main purpose of learning is to gain knowledge and skills that will help you understand the world and solve problems.",
    },
    {
      question: "Which of these is a good study habit?",
      options: [
        "Studying only the night before a test",
        "Studying in a noisy environment",
        "Regular practice and review",
        "Memorizing without understanding",
      ],
      correctAnswer: "Regular practice and review",
      explanation:
        "Regular practice and review helps reinforce learning and move information from short-term to long-term memory.",
    },
    {
      question: "What should you do if you don't understand something?",
      options: [
        "Skip it and move on",
        "Pretend you understand",
        "Ask questions and seek help",
        "Give up on the subject",
      ],
      correctAnswer: "Ask questions and seek help",
      explanation:
        "Asking questions is an important part of learning. It helps clarify confusion and deepen understanding.",
    },
  ]

  // Topic-specific quizzes
  const quizMap: Record<string, Record<string, any[]>> = {
    "math-numbers": {
      mid: [
        {
          question: "What comes after 7 when counting?",
          options: ["6", "7", "8", "9"],
          correctAnswer: "8",
          explanation: "When counting forward, the number after 7 is 8.",
        },
        {
          question: "What is 3 + 4?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
          explanation: "3 + 4 = 7. You can count 3 objects and then 4 more to get a total of 7.",
        },
        {
          question: "Which number is greater: 9 or 6?",
          options: ["6", "9", "They are equal", "Cannot be determined"],
          correctAnswer: "9",
          explanation: "9 is greater than 6 because it comes after 6 when counting.",
        },
      ],
      main: [
        {
          question: "What is 5 + 3?",
          options: ["7", "8", "9", "10"],
          correctAnswer: "8",
          explanation: "5 + 3 = 8. You can count 5 objects and then 3 more to get a total of 8.",
        },
        {
          question: "What is 10 - 4?",
          options: ["4", "5", "6", "7"],
          correctAnswer: "6",
          explanation: "10 - 4 = 6. If you have 10 objects and take away 4, you are left with 6.",
        },
        {
          question: "What is 2 × 3?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "6",
          explanation: "2 × 3 = 6. This means 2 groups of 3, which is 3 + 3 = 6.",
        },
        {
          question: "What is 8 ÷ 2?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4",
          explanation: "8 ÷ 2 = 4. If you divide 8 objects into 2 equal groups, each group will have 4 objects.",
        },
      ],
      exam: [
        {
          question: "If you have 15 apples and give away 7, how many do you have left?",
          options: ["7", "8", "9", "22"],
          correctAnswer: "8",
          explanation:
            "This is a subtraction problem: 15 - 7 = 8. You started with 15 apples and gave away 7, leaving 8 apples.",
        },
        {
          question: "What is the value of 4 × 3 + 2?",
          options: ["14", "18", "20", "24"],
          correctAnswer: "14",
          explanation: "Following the order of operations, multiply first: 4 × 3 = 12, then add: 12 + 2 = 14.",
        },
        {
          question: "If you have 3 bags with 4 marbles in each bag, how many marbles do you have in total?",
          options: ["7", "10", "12", "16"],
          correctAnswer: "12",
          explanation:
            "This is a multiplication problem: 3 × 4 = 12. You have 3 bags with 4 marbles each, for a total of 12 marbles.",
        },
        {
          question: "What is half of 18?",
          options: ["6", "8", "9", "10"],
          correctAnswer: "9",
          explanation: "Half means dividing by 2: 18 ÷ 2 = 9.",
        },
        {
          question: "If today is Tuesday, what day will it be in 4 days?",
          options: ["Friday", "Saturday", "Sunday", "Monday"],
          correctAnswer: "Saturday",
          explanation:
            "Starting from Tuesday, count 4 days forward: Wednesday (1), Thursday (2), Friday (3), Saturday (4).",
        },
      ],
    },
    "code-basics": {
      mid: [
        {
          question: "What does the print() function do in Python?",
          options: [
            "It prints the document on a printer",
            "It displays text on the screen",
            "It takes a picture of the screen",
            "It creates a print of a variable",
          ],
          correctAnswer: "It displays text on the screen",
          explanation: "The print() function in Python displays text or the value of variables on the screen.",
        },
        {
          question: "Which of these is a valid variable name in Python?",
          options: ["2myVariable", "my-variable", "my_variable", "my variable"],
          correctAnswer: "my_variable",
          explanation:
            "Variable names in Python can contain letters, numbers, and underscores, but cannot start with a number or contain spaces or hyphens.",
        },
        {
          question: "What is the result of 5 + 3 * 2 in Python?",
          options: ["16", "11", "13", "10"],
          correctAnswer: "11",
          explanation:
            "Python follows the order of operations: multiplication happens before addition. So 3 * 2 = 6, then 5 + 6 = 11.",
        },
      ],
      main: [
        {
          question: "What is a string in Python?",
          options: ["A type of number", "A sequence of characters", "A mathematical operation", "A programming error"],
          correctAnswer: "A sequence of characters",
          explanation: "A string in Python is a sequence of characters enclosed in quotes, like \"hello\" or 'world'.",
        },
        {
          question: "How do you create a comment in Python?",
          options: ["Use /* comment */", "Use // comment", "Use # comment", "Use <!-- comment -->"],
          correctAnswer: "Use # comment",
          explanation:
            "In Python, comments start with the # symbol. Everything after # on that line is ignored by Python.",
        },
        {
          question: "What does the following code do? x = 5",
          options: [
            "Prints 5 on the screen",
            "Creates a variable named x with the value 5",
            "Checks if x equals 5",
            "Multiplies x by 5",
          ],
          correctAnswer: "Creates a variable named x with the value 5",
          explanation: "This code creates a variable named x and assigns it the value 5.",
        },
        {
          question: 'What is the result of "Hello" + " " + "World" in Python?',
          options: ["HelloWorld", "Hello World", "Error - cannot add strings", "Hello + World"],
          correctAnswer: "Hello World",
          explanation:
            'In Python, the + operator concatenates (joins) strings. "Hello" + " " + "World" combines the three strings into "Hello World".',
        },
      ],
      exam: [
        {
          question: "What will the following code print? print(2 ** 3)",
          options: ["5", "6", "8", "23"],
          correctAnswer: "8",
          explanation:
            "In Python, ** is the exponentiation operator. 2 ** 3 means 2 raised to the power of 3, which is 2 × 2 × 2 = 8.",
        },
        {
          question: "Which of these is NOT a basic data type in Python?",
          options: ["Integer", "String", "Boolean", "Array"],
          correctAnswer: "Array",
          explanation:
            "Python has integers, strings, and booleans as basic data types, but uses lists instead of arrays. Arrays are available through the NumPy library.",
        },
        {
          question: "What does the len() function do when used with a string?",
          options: [
            "Returns the largest character",
            "Returns the number of characters",
            "Returns the string in lowercase",
            "Returns the string length in bytes",
          ],
          correctAnswer: "Returns the number of characters",
          explanation:
            "The len() function returns the number of items in an object. For strings, it returns the number of characters.",
        },
        {
          question: 'What will the following code print? print("Python"[2])',
          options: ["P", "y", "t", "h"],
          correctAnswer: "t",
          explanation:
            'In Python, string indexing starts at 0. So "Python"[0] is "P", "Python"[1] is "y", and "Python"[2] is "t".',
        },
        {
          question: 'Which of the following will convert the string "42" to an integer?',
          options: ['convert("42")', 'int("42")', 'integer("42")', '"42".toInt()'],
          correctAnswer: 'int("42")',
          explanation: 'The int() function converts a string to an integer. int("42") will return the integer 42.',
        },
      ],
    },
    "maps-africa": {
      mid: [
        {
          question: "Which is the largest country by area in Africa?",
          options: ["Nigeria", "South Africa", "Egypt", "Algeria"],
          correctAnswer: "Algeria",
          explanation: "Algeria is the largest country by area in Africa, covering over 2.3 million square kilometers.",
        },
        {
          question: "Which desert covers much of North Africa?",
          options: ["Kalahari Desert", "Sahara Desert", "Namib Desert", "Arabian Desert"],
          correctAnswer: "Sahara Desert",
          explanation: "The Sahara Desert is the largest hot desert in the world and covers much of North Africa.",
        },
        {
          question: "Which of these countries is NOT in West Africa?",
          options: ["Ghana", "Nigeria", "Kenya", "Senegal"],
          correctAnswer: "Kenya",
          explanation:
            "Kenya is located in East Africa, not West Africa. Ghana, Nigeria, and Senegal are all in West Africa.",
        },
      ],
      main: [
        {
          question: "What is the longest river in Africa?",
          options: ["Congo River", "Niger River", "Nile River", "Zambezi River"],
          correctAnswer: "Nile River",
          explanation:
            "The Nile River is the longest river in Africa and one of the longest in the world, flowing through 11 countries.",
        },
        {
          question: 'Which African country is known as the "Rainbow Nation"?',
          options: ["Kenya", "Nigeria", "South Africa", "Ethiopia"],
          correctAnswer: "South Africa",
          explanation:
            'South Africa is known as the "Rainbow Nation" due to its multicultural diversity following the end of apartheid.',
        },
        {
          question: "Which mountain is the highest peak in Africa?",
          options: ["Mount Kenya", "Mount Kilimanjaro", "Atlas Mountains", "Mount Meru"],
          correctAnswer: "Mount Kilimanjaro",
          explanation:
            "Mount Kilimanjaro in Tanzania is the highest mountain in Africa, standing at 5,895 meters (19,341 feet) above sea level.",
        },
        {
          question: "Which of these African countries is landlocked (has no coastline)?",
          options: ["Angola", "Mali", "Mozambique", "Tunisia"],
          correctAnswer: "Mali",
          explanation:
            "Mali is a landlocked country in West Africa. Angola, Mozambique, and Tunisia all have coastlines.",
        },
      ],
      exam: [
        {
          question: "Which African country was never colonized by European powers?",
          options: ["Ghana", "Ethiopia", "Kenya", "Nigeria"],
          correctAnswer: "Ethiopia",
          explanation:
            "Ethiopia is the only African country that was never fully colonized by European powers, although it was briefly occupied by Italy from 1936-1941.",
        },
        {
          question: "Which body of water separates Africa from Europe?",
          options: ["Red Sea", "Mediterranean Sea", "Atlantic Ocean", "Indian Ocean"],
          correctAnswer: "Mediterranean Sea",
          explanation:
            "The Mediterranean Sea separates Africa from Europe, with the Strait of Gibraltar being the narrowest point between the two continents.",
        },
        {
          question: "Which of these is NOT one of the Great Lakes of Africa?",
          options: ["Lake Victoria", "Lake Tanganyika", "Lake Chad", "Lake Malawi"],
          correctAnswer: "Lake Chad",
          explanation:
            "The African Great Lakes include Victoria, Tanganyika, and Malawi, among others. Lake Chad is a separate lake in Central Africa.",
        },
        {
          question: "Which African country has the largest population?",
          options: ["Egypt", "Ethiopia", "South Africa", "Nigeria"],
          correctAnswer: "Nigeria",
          explanation: "Nigeria has the largest population in Africa, with over 200 million people.",
        },
        {
          question: "The prime meridian (0° longitude) passes through which African country?",
          options: ["Ghana", "Algeria", "Egypt", "South Africa"],
          correctAnswer: "Ghana",
          explanation:
            "The prime meridian (0° longitude) passes through Ghana in West Africa, specifically through the town of Tema.",
        },
      ],
    },
  }

  // Return quiz for the requested topic and type, or a default if not found
  return (quizMap[topicId] && quizMap[topicId][quizType]) || defaultQuiz
}
