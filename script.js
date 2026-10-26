/* =========================================================
   PyLearn — application logic
   Vanilla JS, Local Storage persistence, no frameworks.
   ========================================================= */

/* ---------------------------------------------------------
   1. STORAGE KEYS & HELPERS
   --------------------------------------------------------- */

const STORAGE_USER_KEY = 'pylearn_user';
const STORAGE_PROGRESS_KEY = 'pylearn_progress';

/** Shorthand querySelector */
function $(selector, scope) {
  return (scope || document).querySelector(selector);
}
function $all(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

/** Read the registered user object from Local Storage (or null) */
function getUser() {
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** Persist the user object to Local Storage */
function saveUser(user) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

/** Read progress data, creating a fresh default object if none exists */
function getProgress() {
  const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
  if (raw) return JSON.parse(raw);
  return { completedLessons: [], quizzes: {} };
}

/** Persist progress data to Local Storage */
function saveProgress(progress) {
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
}

/** Wipe every trace of the user's account from Local Storage */
function clearAllData() {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_PROGRESS_KEY);
}

/* ---------------------------------------------------------
   2. LESSON CONTENT
   --------------------------------------------------------- */

const LESSONS = [
  {
    id: 1,
    title: 'Introduction to Python',
    description: 'What Python is, why it is popular, and how to run your first program.',
    duration: '8 min',
    objectives: [
      'Explain what Python is and where it is used',
      'Understand what makes Python beginner-friendly',
      'Run a first Python script using print()',
      'Recognise comments in Python code'
    ],
    sections: [
      {
        heading: 'What is Python?',
        paragraphs: [
          'Python is a high-level, general-purpose programming language created by Guido van Rossum and first released in 1991. It is known for its clean, readable syntax that reads almost like plain English, which makes it a popular first language for beginners.',
          'Python is used across many fields, including web development, data science, artificial intelligence, automation, and scientific computing. Because it is interpreted rather than compiled, you can write a line of code and see the result immediately, which makes learning and experimenting fast.'
        ]
      },
      {
        heading: 'Running your first program',
        paragraphs: [
          'Every Python program is simply a text file containing instructions, saved with a .py extension. The program is executed line by line by the Python interpreter, from top to bottom.',
          'The print() function is the most basic way to display output. Comments, written after a # symbol, are ignored by the interpreter and exist purely to explain the code to human readers.'
        ]
      }
    ],
    code:
`# This is a comment - Python ignores this line
print("Hello, World!")

# You can print multiple values separated by commas
print("Python version:", 3.12)`,
    summary: 'Python is a readable, beginner-friendly language used in many industries. Programs run top to bottom, print() displays output, and # marks a comment.'
  },
  {
    id: 2,
    title: 'Variables and Data Types',
    description: 'Store data in variables and learn Python\'s core built-in types.',
    duration: '10 min',
    objectives: [
      'Create and name variables correctly',
      'Identify the core built-in data types',
      'Use the type() function to inspect a value',
      'Convert between data types'
    ],
    sections: [
      {
        heading: 'Creating variables',
        paragraphs: [
          'A variable is a name that refers to a value stored in memory. In Python, you create a variable simply by assigning a value to a name with the = operator - there is no need to declare a type in advance.',
          'Variable names should be descriptive, start with a letter or underscore, and cannot contain spaces. By convention, Python variable names use lower_case_with_underscores.'
        ]
      },
      {
        heading: 'Built-in data types',
        paragraphs: [
          'Python has several core built-in types: int for whole numbers, float for decimal numbers, str for text, and bool for True/False values. Python is dynamically typed, meaning the interpreter figures out the type automatically from the value assigned.',
          'You can check the type of any value with the type() function, and convert between types using functions such as int(), float(), and str().'
        ]
      }
    ],
    code:
`name = "Amaka"        # str
age = 21               # int
gpa = 4.85              # float
is_student = True       # bool

print(type(name))
print(type(age))

# Converting between types
age_text = str(age)
score = int("95")`,
    summary: 'Variables are created with =, and Python automatically determines the type. The core types are int, float, str, and bool. type() reveals a value\'s type, and functions like int() and str() convert between them.'
  },
  {
    id: 3,
    title: 'Operators',
    description: 'Arithmetic, comparison, and logical operators for building expressions.',
    duration: '9 min',
    objectives: [
      'Use arithmetic operators to perform calculations',
      'Compare values with comparison operators',
      'Combine conditions with logical operators',
      'Understand operator precedence'
    ],
    sections: [
      {
        heading: 'Arithmetic operators',
        paragraphs: [
          'Python supports the standard arithmetic operators: + (addition), - (subtraction), * (multiplication), / (division), // (floor division), % (modulus, the remainder of a division), and ** (exponentiation).',
          'Division with / always returns a float, while // discards the decimal part and returns a whole number, which is useful when you only care about full units.'
        ]
      },
      {
        heading: 'Comparison and logical operators',
        paragraphs: [
          'Comparison operators such as ==, !=, >, <, >=, and <= compare two values and produce a bool result (True or False). These are the building blocks of decision-making in code.',
          'Logical operators - and, or, and not - combine multiple boolean expressions. and requires both sides to be True, or requires at least one side to be True, and not reverses a boolean value.'
        ]
      }
    ],
    code:
`a = 10
b = 3

print(a + b)    # 13
print(a % b)    # 1  (remainder)
print(a ** 2)   # 100

age = 20
has_id = True
print(age >= 18 and has_id)   # True`,
    summary: 'Arithmetic operators perform calculations, comparison operators produce True/False results, and logical operators (and, or, not) combine conditions.'
  },
  {
    id: 4,
    title: 'Conditional Statements',
    description: 'Make decisions in your code using if, elif, and else.',
    duration: '9 min',
    objectives: [
      'Write if statements to control program flow',
      'Chain multiple conditions with elif',
      'Provide a fallback with else',
      'Understand how indentation defines code blocks'
    ],
    sections: [
      {
        heading: 'The if statement',
        paragraphs: [
          'Conditional statements let a program choose which code to run based on whether a condition is True or False. The if keyword is followed by a condition and a colon, and the indented block underneath only runs when that condition is True.',
          'Unlike many other languages, Python uses indentation (not curly braces) to define which lines belong to a block. Consistent indentation is required, or the program will raise an error.'
        ]
      },
      {
        heading: 'elif and else',
        paragraphs: [
          'elif ("else if") lets you check additional conditions if the first one was False, and you can chain as many as you need. else provides a final fallback block that runs only if none of the previous conditions were True.',
          'Python checks conditions from top to bottom and stops at the first one that is True, skipping the rest.'
        ]
      }
    ],
    code:
`score = 72

if score >= 70:
    grade = "A"
elif score >= 60:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"

print("Grade:", grade)`,
    summary: 'if, elif, and else let a program branch based on conditions. Python uses indentation, not braces, to mark which statements belong to each block.'
  },
  {
    id: 5,
    title: 'Loops',
    description: 'Repeat actions efficiently with for and while loops.',
    duration: '10 min',
    objectives: [
      'Iterate over sequences using a for loop',
      'Repeat code conditionally using a while loop',
      'Use break to exit a loop early',
      'Use continue to skip to the next iteration'
    ],
    sections: [
      {
        heading: 'The for loop',
        paragraphs: [
          'A for loop iterates over the items of a sequence, such as a list, string, or a range of numbers, executing the loop body once for each item. The built-in range() function generates a sequence of numbers, commonly used to repeat an action a fixed number of times.',
          'For loops are the most common way to process collections of data in Python.'
        ]
      },
      {
        heading: 'The while loop and loop control',
        paragraphs: [
          'A while loop repeats its body as long as a condition remains True. It is useful when the number of repetitions is not known in advance and depends on something changing during the loop.',
          'The break keyword immediately exits a loop, while continue skips the rest of the current iteration and moves to the next one. Both give you finer control over how a loop behaves.'
        ]
      }
    ],
    code:
`# for loop with range
for i in range(5):
    print("Iteration:", i)

# while loop
count = 0
while count < 3:
    print("Count is", count)
    count += 1

# break and continue
for n in range(10):
    if n == 5:
        break
    if n % 2 == 0:
        continue
    print(n)`,
    summary: 'for loops iterate over sequences, while loops repeat while a condition holds, and break/continue give extra control over the flow of a loop.'
  },
  {
    id: 6,
    title: 'Functions',
    description: 'Package reusable logic into functions with parameters and return values.',
    duration: '11 min',
    objectives: [
      'Define a function using def',
      'Pass arguments and use parameters',
      'Return values from a function',
      'Use default parameter values'
    ],
    sections: [
      {
        heading: 'Defining and calling functions',
        paragraphs: [
          'A function is a reusable, named block of code that performs a task. Functions are defined with the def keyword, followed by a name, parentheses containing any parameters, and a colon. The function body is indented underneath.',
          'Once defined, a function can be called (executed) as many times as needed simply by writing its name followed by parentheses containing any required arguments.'
        ]
      },
      {
        heading: 'Return values and defaults',
        paragraphs: [
          'The return keyword sends a value back to wherever the function was called, allowing that result to be stored or used further. A function without a return statement implicitly returns None.',
          'Parameters can be given default values, making them optional when the function is called. This makes functions more flexible without requiring every argument every time.'
        ]
      }
    ],
    code:
`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

message = greet("Chidi")
print(message)                 # Hello, Chidi!
print(greet("Amaka", "Hi"))    # Hi, Amaka!

def add(a, b):
    return a + b

print(add(4, 7))   # 11`,
    summary: 'Functions are defined with def and reused by calling their name. return sends a result back to the caller, and default parameter values make arguments optional.'
  },
  {
    id: 7,
    title: 'Lists and Tuples',
    description: 'Store ordered collections of data with lists and tuples.',
    duration: '10 min',
    objectives: [
      'Create, access, and modify lists',
      'Use common list methods',
      'Understand how tuples differ from lists',
      'Choose between a list and a tuple appropriately'
    ],
    sections: [
      {
        heading: 'Working with lists',
        paragraphs: [
          'A list is an ordered, changeable collection of items, written with square brackets. Items are accessed by their position (index), starting at 0. Lists can hold mixed data types and can grow or shrink using methods like append(), remove(), and pop().',
          'Because lists are mutable, you can change an item in place, sort the list, or reverse its order without creating a new list.'
        ]
      },
      {
        heading: 'Tuples: an immutable alternative',
        paragraphs: [
          'A tuple is similar to a list but is written with parentheses and is immutable - once created, its contents cannot be changed. Tuples are useful for fixed collections of related values, such as coordinates, where accidental modification should be prevented.',
          'Because they are immutable, tuples are also slightly faster than lists and can be used as dictionary keys, which lists cannot.'
        ]
      }
    ],
    code:
`fruits = ["apple", "banana", "cherry"]
fruits.append("mango")
print(fruits[0])        # apple
print(len(fruits))      # 4

fruits.remove("banana")
print(fruits)

# A tuple - cannot be changed after creation
point = (4, 7)
print(point[0], point[1])`,
    summary: 'Lists are ordered, mutable collections written with []. Tuples are similar but immutable, written with (), and are ideal for fixed groups of values.'
  },
  {
    id: 8,
    title: 'Dictionaries',
    description: 'Store and retrieve data using flexible key-value pairs.',
    duration: '10 min',
    objectives: [
      'Create dictionaries with key-value pairs',
      'Access, add, and update values by key',
      'Loop through keys, values, and items',
      'Use common dictionary methods safely'
    ],
    sections: [
      {
        heading: 'Key-value pairs',
        paragraphs: [
          'A dictionary stores data as pairs of keys and values, written with curly braces. Instead of accessing items by position like a list, you access them by their unique key, which makes lookups fast and the data self-describing.',
          'Keys must be unique and immutable (commonly strings or numbers), while values can be of any type, including lists or other dictionaries.'
        ]
      },
      {
        heading: 'Working with dictionaries',
        paragraphs: [
          'You can add a new key-value pair or update an existing one using square-bracket assignment. The get() method safely retrieves a value without raising an error if the key does not exist, optionally returning a default value instead.',
          'The .keys(), .values(), and .items() methods let you loop through a dictionary\'s keys, values, or key-value pairs respectively.'
        ]
      }
    ],
    code:
`student = {
    "name": "Ifeoma",
    "age": 22,
    "department": "Computer Science"
}

print(student["name"])          # Ifeoma
student["age"] = 23              # update a value
student["cgpa"] = 4.6            # add a new key

for key, value in student.items():
    print(key, "->", value)

print(student.get("email", "Not provided"))`,
    summary: 'Dictionaries store data as unique key-value pairs written with {}. Values are accessed and updated by key, and get(), .keys(), .values(), and .items() are common tools for working with them safely.'
  },
  {
    id: 9,
    title: 'File Handling',
    description: 'Read from and write to files so data can outlive the program.',
    duration: '9 min',
    objectives: [
      'Open a file in read, write, and append modes',
      'Read the contents of a text file',
      'Write and append text to a file',
      'Use the with statement to handle files safely'
    ],
    sections: [
      {
        heading: 'Opening and reading files',
        paragraphs: [
          'The open() function opens a file and returns a file object that can be read from or written to. It takes a filename and a mode: "r" for reading, "w" for writing (which overwrites existing content), and "a" for appending to the end of a file.',
          'Once open, .read() returns the entire contents as a single string, while looping over the file object directly reads it line by line, which is more memory-efficient for large files.'
        ]
      },
      {
        heading: 'The with statement',
        paragraphs: [
          'Using the with statement to open a file automatically closes it once the indented block finishes, even if an error occurs. This is safer and more concise than manually calling .close(), and is the recommended approach in modern Python.',
          'Forgetting to close a file can lead to data not being saved properly or the file being locked from other programs.'
        ]
      }
    ],
    code:
`# Writing to a file
with open("notes.txt", "w") as file:
    file.write("Python is fun to learn!\\n")

# Appending more text
with open("notes.txt", "a") as file:
    file.write("File handling is straightforward.\\n")

# Reading the file back
with open("notes.txt", "r") as file:
    contents = file.read()
    print(contents)`,
    summary: 'open() gives access to a file in read, write, or append mode. Using with automatically closes the file when done, which is the safest way to handle files in Python.'
  },
  {
    id: 10,
    title: 'Object-Oriented Programming Basics',
    description: 'Model real-world things using classes, objects, and methods.',
    duration: '12 min',
    objectives: [
      'Explain the difference between a class and an object',
      'Define a class with attributes and methods',
      'Use __init__ to initialise an object\'s data',
      'Create and use multiple objects from one class'
    ],
    sections: [
      {
        heading: 'Classes and objects',
        paragraphs: [
          'Object-oriented programming (OOP) organises code around objects that bundle data (attributes) and behaviour (methods) together. A class is a blueprint that defines what attributes and methods its objects will have, and an object is a specific instance created from that class.',
          'For example, a Car class might describe that every car has a brand and a speed, and can accelerate - while an individual object represents one particular car with its own values for those attributes.'
        ]
      },
      {
        heading: 'The __init__ method and self',
        paragraphs: [
          '__init__ is a special method that runs automatically whenever a new object is created from a class, and is typically used to set up its initial attribute values. The first parameter of every method, conventionally named self, refers to the specific object the method is being called on.',
          'Once a class is defined, you can create as many independent objects from it as you like, each with its own copy of the attributes.'
        ]
      }
    ],
    code:
`class Car:
    def __init__(self, brand, speed=0):
        self.brand = brand
        self.speed = speed

    def accelerate(self, amount):
        self.speed += amount
        print(f"{self.brand} is now going {self.speed} km/h")

car1 = Car("Toyota")
car2 = Car("Honda", 20)

car1.accelerate(30)   # Toyota is now going 30 km/h
car2.accelerate(15)   # Honda is now going 35 km/h`,
    summary: 'A class is a blueprint and an object is an instance built from it. __init__ sets up an object\'s initial attributes, and self refers to the specific object a method acts on.'
  }
];

/* ---------------------------------------------------------
   3. QUIZ CONTENT
   --------------------------------------------------------- */

const QUIZZES = {
  1: [
    {
      question: 'What type of language is Python, in terms of execution?',
      options: ['Compiled only', 'Interpreted', 'Markup language', 'Assembly language'],
      correct: 1,
      explanation: 'Python code is run by an interpreter line by line, rather than being compiled entirely into machine code beforehand.'
    },
    {
      question: 'Which function is used to display output in Python?',
      options: ['output()', 'display()', 'print()', 'echo()'],
      correct: 2,
      explanation: 'print() is the built-in function used to display text and values to the screen.'
    },
    {
      question: 'How does Python know a line is a comment?',
      options: ['It starts with //', 'It starts with #', 'It is wrapped in <!-- -->', 'It starts with **'],
      correct: 1,
      explanation: 'In Python, anything after a # symbol on a line is treated as a comment and ignored by the interpreter.'
    },
    {
      question: 'What file extension is used for Python scripts?',
      options: ['.py', '.pt', '.pyt', '.pyth'],
      correct: 0,
      explanation: 'Python source files conventionally use the .py extension.'
    }
  ],
  2: [
    {
      question: 'Which symbol is used to assign a value to a variable?',
      options: [':', '==', '=', '=>'],
      correct: 2,
      explanation: 'A single = assigns a value to a variable name in Python.'
    },
    {
      question: 'Which data type represents True/False values?',
      options: ['int', 'bool', 'str', 'float'],
      correct: 1,
      explanation: 'bool is the data type that holds either True or False.'
    },
    {
      question: 'Which function reveals the data type of a value?',
      options: ['typeof()', 'kind()', 'type()', 'datatype()'],
      correct: 2,
      explanation: 'type() returns the data type of whatever value is passed to it.'
    },
    {
      question: 'What is the result of str(25)?',
      options: ["The integer 25", "The string '25'", 'An error', 'The float 25.0'],
      correct: 1,
      explanation: 'str() converts its argument into a string, so str(25) produces the text "25".'
    }
  ],
  3: [
    {
      question: 'What does the % operator return?',
      options: ['The result of division', 'The remainder of a division', 'A percentage', 'The square of a number'],
      correct: 1,
      explanation: 'The modulus operator % returns the remainder left over after dividing one number by another.'
    },
    {
      question: 'Which operator checks whether two values are equal?',
      options: ['=', '==', '!=', '==='],
      correct: 1,
      explanation: '== compares two values for equality and produces a boolean result, unlike = which assigns a value.'
    },
    {
      question: 'What does the and operator require to return True?',
      options: ['At least one side is True', 'Both sides must be True', 'Neither side is True', 'Exactly one side is True'],
      correct: 1,
      explanation: 'and only evaluates to True when both of the expressions on either side of it are True.'
    },
    {
      question: 'What does // do differently from /?',
      options: ['It multiplies instead of divides', 'It returns a whole number, discarding the decimal', 'It only works on strings', 'It raises an error on integers'],
      correct: 1,
      explanation: 'Floor division (//) divides and rounds down to the nearest whole number, discarding any remainder.'
    }
  ],
  4: [
    {
      question: 'What keyword provides a final fallback when no other condition is True?',
      options: ['elif', 'else', 'otherwise', 'default'],
      correct: 1,
      explanation: 'else defines the block that runs only when none of the preceding if/elif conditions were True.'
    },
    {
      question: 'How does Python define which lines belong to an if block?',
      options: ['Curly braces {}', 'Indentation', 'Semicolons', 'Parentheses'],
      correct: 1,
      explanation: 'Python uses consistent indentation, rather than braces, to group statements into a block.'
    },
    {
      question: 'What does elif mean?',
      options: ['"else loop if"', '"else if"', '"end loop if"', 'It has no special meaning'],
      correct: 1,
      explanation: 'elif is short for "else if" and lets you check another condition if the previous one was False.'
    },
    {
      question: 'In a chain of if/elif/else, how many blocks can execute?',
      options: ['All of them', 'None of them', 'At most one', 'Exactly two'],
      correct: 2,
      explanation: 'Python checks each condition in order and runs only the first block whose condition is True, skipping the rest.'
    }
  ],
  5: [
    {
      question: 'Which loop is best suited when the exact number of iterations is unknown in advance?',
      options: ['for loop', 'while loop', 'do loop', 'range loop'],
      correct: 1,
      explanation: 'A while loop continues as long as its condition remains True, which suits situations where the number of repeats depends on changing data.'
    },
    {
      question: 'What does the break keyword do inside a loop?',
      options: ['Skips to the next iteration', 'Pauses the loop temporarily', 'Exits the loop immediately', 'Restarts the loop from zero'],
      correct: 2,
      explanation: 'break immediately stops the loop and continues execution after it.'
    },
    {
      question: 'What does range(5) generate?',
      options: ['Numbers 1 to 5', 'Numbers 0 to 4', 'Numbers 0 to 5', 'Numbers 5 to 0'],
      correct: 1,
      explanation: 'range(5) produces the sequence 0, 1, 2, 3, 4 - five numbers starting at zero.'
    },
    {
      question: 'What does continue do inside a loop?',
      options: ['Ends the loop completely', 'Skips the rest of the current iteration', 'Repeats the current iteration', 'Does nothing'],
      correct: 1,
      explanation: 'continue skips any remaining code in the current pass and moves on to the next iteration.'
    }
  ],
  6: [
    {
      question: 'Which keyword is used to define a function?',
      options: ['function', 'def', 'func', 'define'],
      correct: 1,
      explanation: 'Functions in Python are defined using the def keyword.'
    },
    {
      question: 'What does the return keyword do?',
      options: ['Prints a value to the screen', 'Sends a value back to the caller', 'Stops the entire program', 'Declares a variable'],
      correct: 1,
      explanation: 'return passes a value back out of the function to wherever it was called from.'
    },
    {
      question: 'What happens if a function has no return statement?',
      options: ['It raises an error', 'It returns None', 'It returns 0', 'It returns an empty string'],
      correct: 1,
      explanation: 'A function without an explicit return statement automatically returns the special value None.'
    },
    {
      question: 'What is a default parameter value used for?',
      options: ['To make an argument optional', 'To make a function private', 'To prevent a function from running', 'To convert a parameter to a string'],
      correct: 0,
      explanation: 'A default value is used automatically if the caller does not supply that argument, making it optional.'
    }
  ],
  7: [
    {
      question: 'What index does the first item in a list have?',
      options: ['1', '0', '-1', 'It depends on the list'],
      correct: 1,
      explanation: 'Python lists are zero-indexed, so the first element is at index 0.'
    },
    {
      question: 'Which method adds an item to the end of a list?',
      options: ['add()', 'insert()', 'append()', 'push()'],
      correct: 2,
      explanation: 'append() adds a single item to the end of an existing list.'
    },
    {
      question: 'What is the key difference between a list and a tuple?',
      options: ['Tuples cannot store numbers', 'Lists are immutable, tuples are mutable', 'Tuples are immutable, lists are mutable', 'There is no difference'],
      correct: 2,
      explanation: 'Tuples cannot be changed after creation, while lists can be modified freely - that immutability is their defining difference.'
    },
    {
      question: 'Which brackets are used to create a tuple?',
      options: ['[]', '{}', '()', '<>'],
      correct: 2,
      explanation: 'Tuples are written using parentheses, for example (4, 7).'
    }
  ],
  8: [
    {
      question: 'What are the two parts of every entry in a dictionary?',
      options: ['Index and value', 'Key and value', 'Name and type', 'Head and tail'],
      correct: 1,
      explanation: 'A dictionary stores data as key-value pairs, where each unique key maps to a value.'
    },
    {
      question: 'Which method safely retrieves a value without raising an error if the key is missing?',
      options: ['.fetch()', '.find()', '.get()', '.read()'],
      correct: 2,
      explanation: '.get() returns None (or a supplied default) if the key does not exist, instead of raising an error.'
    },
    {
      question: 'Which brackets are used to create a dictionary?',
      options: ['[]', '{}', '()', '<>'],
      correct: 1,
      explanation: 'Dictionaries are created using curly braces {}, containing key-value pairs.'
    },
    {
      question: 'Which method loops through both keys and values together?',
      options: ['.pairs()', '.items()', '.entries()', '.both()'],
      correct: 1,
      explanation: '.items() returns each key-value pair together, commonly used in a for loop.'
    }
  ],
  9: [
    {
      question: 'Which mode opens a file for reading?',
      options: ['"w"', '"a"', '"r"', '"x"'],
      correct: 2,
      explanation: '"r" opens a file in read mode, the default mode for open().'
    },
    {
      question: 'What happens when a file is opened in "w" mode and already has content?',
      options: ['The new content is appended', 'The existing content is overwritten', 'An error is raised', 'Nothing happens'],
      correct: 1,
      explanation: '"w" mode overwrites the file\'s existing content, so any prior data is lost.'
    },
    {
      question: 'Why is the with statement recommended when working with files?',
      options: ['It makes the file read-only', 'It automatically closes the file afterwards', 'It compresses the file', 'It is required to open any file'],
      correct: 1,
      explanation: 'with automatically closes the file once the block finishes, even if an error occurs, which is safer than closing manually.'
    },
    {
      question: 'Which mode adds new text to the end of an existing file without erasing it?',
      options: ['"r"', '"w"', '"a"', '"n"'],
      correct: 2,
      explanation: '"a" (append mode) writes new content after whatever is already in the file.'
    }
  ],
  10: [
    {
      question: 'What is a class in object-oriented programming?',
      options: ['A single value', 'A blueprint for creating objects', 'A type of loop', 'A built-in function'],
      correct: 1,
      explanation: 'A class defines the attributes and methods that its objects will have - it is a template, not the object itself.'
    },
    {
      question: 'What is an object, in relation to a class?',
      options: ['A copy of Python itself', 'An instance created from a class', 'A synonym for a class', 'A type of variable only'],
      correct: 1,
      explanation: 'An object is a specific instance built from a class, with its own values for the class\'s attributes.'
    },
    {
      question: 'When does the __init__ method run?',
      options: ['Every time any method is called', 'Only when the program ends', 'Automatically when a new object is created', 'Only if called manually'],
      correct: 2,
      explanation: '__init__ runs automatically as soon as a new object is created, typically to set up its starting attribute values.'
    },
    {
      question: 'What does self refer to inside a method?',
      options: ['The class itself', 'The specific object the method is acting on', 'The Python interpreter', 'A global variable'],
      correct: 1,
      explanation: 'self refers to the particular object a method was called on, giving access to that object\'s own attributes.'
    }
  ]
};

/* ---------------------------------------------------------
   4. APPLICATION STATE
   --------------------------------------------------------- */

let currentLessonId = null;
let quizState = null; // { lessonId, index, answers: [], selectedThisQuestion }

/* ---------------------------------------------------------
   5. INITIALISATION
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', init);

function init() {
  const user = getUser();
  if (user) {
    showApp();
  } else {
    showRegistration();
  }
  bindGlobalEvents();
}

function showRegistration() {
  $('#registration-page').classList.remove('hidden');
  $('#app').classList.add('hidden');
}

function showApp() {
  $('#registration-page').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderSidebarUser();
  renderLessonGrid();
  renderDashboard();
  renderAchievements();
  switchView('dashboard');
}

/* ---------------------------------------------------------
   6. REGISTRATION
   --------------------------------------------------------- */

function bindGlobalEvents() {
  $('#registration-form').addEventListener('submit', handleRegistration);

  $('#menuToggle').addEventListener('click', () => toggleSidebar(true));
  $('#sidebarOverlay').addEventListener('click', () => toggleSidebar(false));

  $all('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      switchView(link.dataset.view);
      toggleSidebar(false);
    });
  });

  $('#backToLessons').addEventListener('click', () => switchView('lessons'));
  $('#backToLessonFromQuiz').addEventListener('click', () => {
    if (currentLessonId) {
      renderLessonDetail(currentLessonId);
      switchView('lesson-detail', true);
    } else {
      switchView('lessons');
    }
  });

  $('#runPythonBtn').addEventListener('click', runPythonCode);
  $('#clearOutputBtn').addEventListener('click', () => { $('#pythonOutput').textContent = ''; });
  $('#deleteAccountBtn').addEventListener('click', openDeleteModal);
  $('#cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  $('#confirmDeleteBtn').addEventListener('click', confirmDeleteAccount);
}

function handleRegistration(e) {
  e.preventDefault();

  const nameInput = $('#fullName');
  const ageInput = $('#age');
  const name = nameInput.value.trim();
  const age = ageInput.value.trim();

  let valid = true;
  $('#error-fullName').textContent = '';
  $('#error-age').textContent = '';

  if (name.length < 2) {
    $('#error-fullName').textContent = 'Please enter your full name.';
    valid = false;
  }
  if (!age || Number(age) < 5 || Number(age) > 120) {
    $('#error-age').textContent = 'Please enter a valid age.';
    valid = false;
  }
  if (!valid) return;

  const user = {
    fullName: name,
    age: Number(age),
    registeredAt: new Date().toISOString()
  };
  saveUser(user);
  saveProgress({ completedLessons: [], quizzes: {} });

  showApp();
  showToast(`Welcome, ${name.split(' ')[0]}! Your dashboard is ready.`);
}

/* ---------------------------------------------------------
   7. SIDEBAR / NAVIGATION
   --------------------------------------------------------- */

function renderSidebarUser() {
  const user = getUser();
  if (!user) return;
  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
  $('#sidebarAvatar').textContent = initials || '?';
  $('#sidebarUserName').textContent = user.fullName;
}

function toggleSidebar(open) {
  $('#sidebar').classList.toggle('open', open);
  $('#sidebarOverlay').classList.toggle('show', open);
}

function switchView(viewName, skipNavUpdate) {
  $all('.view').forEach(v => v.classList.add('hidden'));
  const target = $(`#view-${viewName}`);
  if (target) target.classList.remove('hidden');

  if (!skipNavUpdate) {
    $all('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });
  }

  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'lessons') renderLessonGrid();
  if (viewName === 'progress') renderProgressPage();
  if (viewName === 'achievements') renderAchievements();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   8. PROGRESS CALCULATIONS
   --------------------------------------------------------- */

function calculateStats() {
  const progress = getProgress();
  const total = LESSONS.length;
  const completed = progress.completedLessons.length;
  const remaining = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const quizEntries = Object.values(progress.quizzes || {});
  const quizzesTaken = quizEntries.length;
  let avgQuiz = null;
  if (quizzesTaken > 0) {
    const sum = quizEntries.reduce((acc, q) => acc + q.percent, 0);
    avgQuiz = Math.round(sum / quizzesTaken);
  }

  return { total, completed, remaining, percent, quizzesTaken, avgQuiz };
}

/* ---------------------------------------------------------
   9. DASHBOARD
   --------------------------------------------------------- */

function renderDashboard() {
  const user = getUser();
  if (!user) return;
  const stats = calculateStats();
  const progress = getProgress();

  $('#welcomeMessage').textContent = `Welcome back, ${user.fullName.split(' ')[0]}!`;
  $('#statCompleted').textContent = stats.completed;
  $('#statRemaining').textContent = stats.remaining;
  $('#statPercent').textContent = `${stats.percent}%`;
  $('#statAvgQuiz').textContent = stats.avgQuiz === null ? '—' : `${stats.avgQuiz}%`;
  $('#statQuizTaken').textContent = `${stats.quizzesTaken} quiz${stats.quizzesTaken === 1 ? '' : 'zes'} taken`;

  $('#dashboardProgressFill').style.width = `${stats.percent}%`;
  $('#progressBarLabel').textContent = `${stats.percent}% complete`;

  $('#terminalName').textContent = `'${user.fullName}'`;
  $('#terminalProgress').innerHTML = `${stats.percent}% complete<span class="cursor">▌</span>`;

  const nextLesson = LESSONS.find(l => !progress.completedLessons.includes(l.id));
  const card = $('#continueLearningCard');
  if (nextLesson) {
    card.innerHTML = `
      <div>
        <div class="continue-card__title">Lesson ${nextLesson.id}: ${escapeHtml(nextLesson.title)}</div>
        <div class="continue-card__desc">${escapeHtml(nextLesson.description)}</div>
      </div>
      <button class="btn btn--primary" data-open-lesson="${nextLesson.id}">Continue <i class="arrow">→</i></button>
    `;
    card.querySelector('[data-open-lesson]').addEventListener('click', () => openLesson(nextLesson.id));
  } else {
    card.innerHTML = `
      <div>
        <div class="continue-card__title">You've completed every lesson! 🎉</div>
        <div class="continue-card__desc">Revisit any lesson from the Lessons page any time.</div>
      </div>
      <button class="btn btn--ghost" data-view-btn="lessons">Browse lessons</button>
    `;
    card.querySelector('[data-view-btn]').addEventListener('click', () => switchView('lessons'));
  }
}

/* ---------------------------------------------------------
   10. LESSON LIST
   --------------------------------------------------------- */

function renderLessonGrid() {
  const progress = getProgress();
  const grid = $('#lessonGrid');
  grid.innerHTML = '';

  LESSONS.forEach(lesson => {
    const isComplete = progress.completedLessons.includes(lesson.id);
    const quizResult = progress.quizzes[lesson.id];

    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
      <div class="lesson-card__top">
        <span class="lesson-card__number"># ${String(lesson.id).padStart(2, '0')}</span>
        <span class="lesson-card__status ${isComplete ? 'status--complete' : 'status--progress'}">
          ${isComplete ? 'Completed' : 'Not started'}
        </span>
      </div>
      <div class="lesson-card__title">${escapeHtml(lesson.title)}</div>
      <p class="lesson-card__desc">${escapeHtml(lesson.description)}</p>
      <div class="lesson-card__meta">
        <span>${lesson.duration} read</span>
        ${quizResult ? `<span>· Quiz: ${quizResult.score}/${quizResult.total}</span>` : ''}
      </div>
    `;
    card.addEventListener('click', () => openLesson(lesson.id));
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   11. LESSON DETAIL
   --------------------------------------------------------- */

function openLesson(id) {
  currentLessonId = id;
  renderLessonDetail(id);
  switchView('lesson-detail', true);
  $all('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === 'lessons'));
}

function renderLessonDetail(id) {
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return;
  const progress = getProgress();
  const isComplete = progress.completedLessons.includes(id);
  const quizResult = progress.quizzes[id];

  const sectionsHtml = lesson.sections.map(section => `
    <div class="lesson-section">
      <h3>${escapeHtml(section.heading)}</h3>
      ${section.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
    </div>
  `).join('');

  const html = `
    <div class="lesson-detail__header">
      <div class="lesson-detail__eyebrow"># Lesson ${String(lesson.id).padStart(2, '0')} of ${LESSONS.length}</div>
      <h1 class="lesson-detail__title">${escapeHtml(lesson.title)}</h1>
      <p class="lesson-detail__desc">${escapeHtml(lesson.description)}</p>
    </div>

    <div class="objectives-box">
      <h3>Learning objectives</h3>
      <ul>
        ${lesson.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
      </ul>
    </div>

    ${sectionsHtml}

    <div class="lesson-section">
      <h3>Code example</h3>
      <div class="code-block">${escapeHtml(lesson.code)}</div>
    </div>

    <div class="summary-box">
      <h3>Summary</h3>
      <p>${escapeHtml(lesson.summary)}</p>
    </div>

    <div class="lesson-actions">
      <button class="btn ${isComplete ? 'btn--ghost' : 'btn--primary'}" id="markCompleteBtn">
        ${isComplete ? '✓ Lesson completed' : 'Mark lesson as complete'}
      </button>
      <button class="btn btn--ghost" id="takeQuizBtn">
        ${quizResult ? `Retake quiz (last score ${quizResult.score}/${quizResult.total})` : 'Take the quiz'}
      </button>
    </div>
  `;

  $('#lessonDetailContent').innerHTML = html;

  $('#markCompleteBtn').addEventListener('click', () => toggleLessonComplete(id));
  $('#takeQuizBtn').addEventListener('click', () => startQuiz(id));
}

function toggleLessonComplete(id) {
  const progress = getProgress();
  if (!progress.completedLessons.includes(id)) {
    progress.completedLessons.push(id);
    saveProgress(progress);
    renderLessonDetail(id);
    showToast('Lesson marked as complete.');
  }
}

/* ---------------------------------------------------------
   12. QUIZ
   --------------------------------------------------------- */

function startQuiz(lessonId) {
  currentLessonId = lessonId;
  quizState = { lessonId, index: 0, answers: [] };
  renderQuizQuestion();
  switchView('quiz', true);
}

function renderQuizQuestion() {
  const lesson = LESSONS.find(l => l.id === quizState.lessonId);
  const questions = QUIZZES[quizState.lessonId] || [];
  const q = questions[quizState.index];

  if (!q) {
    renderQuizResult();
    return;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const html = `
    <div class="quiz-header">
      <h1>${escapeHtml(lesson.title)} — Quiz</h1>
      <div class="quiz-progress">Question ${quizState.index + 1} of ${questions.length}</div>
    </div>
    <div class="quiz-question">
      <div class="quiz-question__text">${escapeHtml(q.question)}</div>
      <div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">
            <span class="quiz-option__letter">${letters[i]}</span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
      <div class="quiz-footer">
        <button class="btn btn--primary hidden" id="quizNextBtn">
          ${quizState.index === questions.length - 1 ? 'See results' : 'Next question'} <i class="arrow">→</i>
        </button>
      </div>
    </div>
  `;
  $('#quizContent').innerHTML = html;

  $all('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(Number(btn.dataset.index)));
  });
  $('#quizNextBtn').addEventListener('click', () => {
    quizState.index += 1;
    renderQuizQuestion();
  });
}

function selectAnswer(selectedIndex) {
  const questions = QUIZZES[quizState.lessonId] || [];
  const q = questions[quizState.index];
  const isCorrect = selectedIndex === q.correct;

  quizState.answers.push({ selectedIndex, isCorrect });

  $all('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === selectedIndex && !isCorrect) btn.classList.add('incorrect');
  });

  const feedback = $('#quizFeedback');
  feedback.classList.add('show', isCorrect ? 'is-correct' : 'is-incorrect');
  feedback.textContent = isCorrect
    ? `Correct! ${q.explanation}`
    : `Not quite. The correct answer is "${q.options[q.correct]}". ${q.explanation}`;

  $('#quizNextBtn').classList.remove('hidden');
}

function renderQuizResult() {
  const lesson = LESSONS.find(l => l.id === quizState.lessonId);
  const questions = QUIZZES[quizState.lessonId] || [];
  const score = quizState.answers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);

  const progress = getProgress();
  progress.quizzes[quizState.lessonId] = {
    score,
    total,
    percent,
    completedAt: new Date().toISOString()
  };
  if (!progress.completedLessons.includes(quizState.lessonId) && percent >= 70) {
    progress.completedLessons.push(quizState.lessonId);
  }
  saveProgress(progress);

  let message = 'Keep practising — you\'ll get there.';
  if (percent === 100) message = 'Perfect score! You\'ve mastered this lesson.';
  else if (percent >= 70) message = 'Great work! You\'ve got a solid grasp of this topic.';
  else if (percent >= 40) message = 'Good effort. Consider reviewing the lesson before retaking the quiz.';

  const html = `
    <div class="quiz-result">
      <div class="quiz-header" style="display:flex; justify-content:center;">
        <h1>Quiz complete: ${escapeHtml(lesson.title)}</h1>
      </div>
      <div class="quiz-result__score">${score}/${total}</div>
      <p class="quiz-result__msg">${message} You scored ${percent}%.</p>
      <div class="lesson-actions" style="justify-content:center;">
        <button class="btn btn--primary" id="backToDashFromResult">Go to dashboard</button>
        <button class="btn btn--ghost" id="retakeQuizBtn">Retake quiz</button>
        <button class="btn btn--ghost" id="backToLessonsFromResult">Back to lessons</button>
      </div>
    </div>
  `;
  $('#quizContent').innerHTML = html;

  $('#backToDashFromResult').addEventListener('click', () => switchView('dashboard'));
  $('#retakeQuizBtn').addEventListener('click', () => startQuiz(quizState.lessonId));
  $('#backToLessonsFromResult').addEventListener('click', () => switchView('lessons'));

  showToast(`Quiz saved: ${score}/${total} (${percent}%).`);
}

/* ---------------------------------------------------------
   13. PROGRESS PAGE
   --------------------------------------------------------- */

function renderProgressPage() {
  const stats = calculateStats();
  const progress = getProgress();

  $('#progressPageFill').style.width = `${stats.percent}%`;
  $('#progressPageLabel').textContent = `${stats.percent}% of the course complete (${stats.completed}/${stats.total} lessons)`;

  const tbody = $('#progressTableBody');
  tbody.innerHTML = LESSONS.map(lesson => {
    const isComplete = progress.completedLessons.includes(lesson.id);
    const quiz = progress.quizzes[lesson.id];
    return `
      <tr>
        <td>${String(lesson.id).padStart(2, '0')}. ${escapeHtml(lesson.title)}</td>
        <td><span class="badge ${isComplete ? 'badge--complete' : 'badge--pending'}">${isComplete ? 'Completed' : 'Pending'}</span></td>
        <td>${quiz ? `${quiz.score}/${quiz.total} (${quiz.percent}%)` : '—'}</td>
      </tr>
    `;
  }).join('');
}

/* ---------------------------------------------------------
   14. DELETE ACCOUNT
   --------------------------------------------------------- */

function openDeleteModal() {
  $('#deleteModal').classList.remove('hidden');
}
function closeDeleteModal() {
  $('#deleteModal').classList.add('hidden');
}
function confirmDeleteAccount() {
  clearAllData();
  closeDeleteModal();
  currentLessonId = null;
  quizState = null;
  $('#registration-form').reset();
  showRegistration();
  showToast('Your account and progress have been deleted.');
}

/* ---------------------------------------------------------
   15. TOAST NOTIFICATIONS
   --------------------------------------------------------- */

let toastTimer = null;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 220);
  }, 3200);
}

/* ---------------------------------------------------------
   16. UTILITIES
   --------------------------------------------------------- */

/** Escape HTML to avoid injection when inserting user or lesson text */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


/* Python playground: Pyodide executes Python in a browser WebAssembly runtime. */
let pyodideRuntimePromise = null;
async function runPythonCode() {
  const button = $('#runPythonBtn');
  const output = $('#pythonOutput');
  button.disabled = true;
  output.textContent = 'Loading Python runtime…';
  try {
    if (!pyodideRuntimePromise) {
      pyodideRuntimePromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
        script.onload = async () => { try { resolve(await loadPyodide()); } catch (e) { reject(e); } };
        script.onerror = () => reject(new Error('Could not load Python runtime. Check your internet connection.'));
        document.head.appendChild(script);
      });
    }
    const pyodide = await pyodideRuntimePromise;
    let captured = '';
    pyodide.setStdout({ batched: text => { captured += text + '\n'; } });
    pyodide.setStderr({ batched: text => { captured += text + '\n'; } });
    await pyodide.runPythonAsync($('#pythonCode').value);
    output.textContent = captured.trimEnd() || 'Code ran successfully (no output).';
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  } finally { button.disabled = false; }
}

function renderAchievements() {
  const progress = getProgress();
  const completed = progress.completedLessons.length;
  const quizScores = Object.values(progress.quizzes || {});
  const best = quizScores.length ? Math.max(...quizScores.map(q => Number(q.percent) || 0)) : 0;
  const items = [
    ['🌱','First Steps','Complete your first lesson',completed >= 1],
    ['📚','Getting Curious','Complete 3 lessons',completed >= 3],
    ['🔥','Halfway There','Complete 5 lessons',completed >= 5],
    ['🎓','Python Graduate','Complete all 10 lessons',completed >= LESSONS.length],
    ['🧠','Quiz Explorer','Take your first quiz',quizScores.length >= 1],
    ['⭐','Perfect Score','Earn 100% on a quiz',best === 100],
    ['🏅','Quiz Regular','Complete 5 quizzes',quizScores.length >= 5]
  ];
  $('#achievementGrid').innerHTML = items.map(([icon,title,desc,earned]) => `<article class="stat-card" style="opacity:${earned ? 1 : .55};"><div style="font-size:2rem">${icon}</div><h3>${title} ${earned ? '✓' : '🔒'}</h3><p>${desc}</p><strong>${earned ? 'Unlocked' : 'Not yet earned'}</strong></article>`).join('');
}
