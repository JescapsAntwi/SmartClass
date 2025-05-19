export const pythonLessons = [
  {
    id: "intro",
    title: "Your First Python Program",
    instructions: `<p>Welcome to your first Python lesson! Let's start with the classic "Hello, World!" program.</p>
                   <p>In programming, we often begin by making the computer display a simple message. This helps us verify that everything is working correctly.</p>
                   <p>In Python, we use the <code>print()</code> function to display text on the screen. The text must be enclosed in quotes (either single ' or double ").</p>`,
    example: `# This is a comment - it's ignored by Python
print("Hello, World!")

# The output will be:
# Hello, World!`,
    challenge: 'Try modifying the code to display your name instead of "World".',
    startingCode: 'print("Hello, World!")',
  },
  {
    id: "variables",
    title: "Variables and Data Types",
    instructions: `<p>Variables are like containers that store data. You can name a variable almost anything, and you can change what's stored in it.</p>
                   <p>In Python, you create a variable by giving it a name, then using the equals sign (=) to assign a value to it.</p>
                   <p>Python has several basic data types:</p>
                   <ul>
                     <li><strong>Strings</strong>: Text enclosed in quotes, like <code>"Hello"</code> or <code>'Python'</code></li>
                     <li><strong>Integers</strong>: Whole numbers, like <code>5</code> or <code>-10</code></li>
                     <li><strong>Floats</strong>: Decimal numbers, like <code>3.14</code> or <code>-0.5</code></li>
                     <li><strong>Booleans</strong>: <code>True</code> or <code>False</code> values</li>
                   </ul>`,
    example: `# Creating variables of different types
name = "Alex"
age = 12
height = 1.5
is_student = True

# Using variables in print statements
print("My name is", name)
print("I am", age, "years old")
print("My height is", height, "meters")
print("Am I a student?", is_student)`,
    challenge:
      "Create variables for your name, age, and favorite color. Then print a sentence using all three variables.",
    startingCode: `# Create your variables here
name = ""
age = 0
favorite_color = ""

# Print a sentence using your variables
print("")`,
  },
  {
    id: "operators",
    title: "Operators and Expressions",
    instructions: `<p>Operators are symbols that perform operations on variables and values. Python has several types of operators:</p>
                   <ul>
                     <li><strong>Arithmetic operators</strong>: +, -, *, /, % (remainder), ** (exponent)</li>
                     <li><strong>Comparison operators</strong>: ==, !=, >, <, >=, <=</li>
                     <li><strong>Logical operators</strong>: and, or, not</li>
                   </ul>
                   <p>An expression is a combination of values, variables, and operators that evaluates to a single value.</p>`,
    example: `# Arithmetic operators
a = 10
b = 3
print("a + b =", a + b)  # Addition
print("a - b =", a - b)  # Subtraction
print("a * b =", a * b)  # Multiplication
print("a / b =", a / b)  # Division
print("a % b =", a % b)  # Remainder
print("a ** b =", a ** b)  # Exponentiation

# Comparison operators
print("a == b?", a == b)  # Equal to
print("a != b?", a != b)  # Not equal to
print("a > b?", a > b)    # Greater than`,
    challenge: "Calculate and print the area and perimeter of a rectangle with length 5 and width 3.",
    startingCode: `# Define the length and width
length = 5
width = 3

# Calculate the area and perimeter
area = 0  # Replace with the correct formula
perimeter = 0  # Replace with the correct formula

# Print the results
print("The area of the rectangle is:", area)
print("The perimeter of the rectangle is:", perimeter)`,
  },
  {
    id: "conditionals",
    title: "Conditional Statements",
    instructions: `<p>Conditional statements allow your program to make decisions based on certain conditions.</p>
                   <p>In Python, we use <code>if</code>, <code>elif</code> (else if), and <code>else</code> statements to create decision-making code.</p>
                   <p>The basic structure is:</p>
                   <pre>
if condition1:
    # code to run if condition1 is True
elif condition2:
    # code to run if condition1 is False and condition2 is True
else:
    # code to run if all conditions are False
                   </pre>
                   <p>Note that Python uses indentation (spaces or tabs) to define blocks of code, not curly braces like some other languages.</p>`,
    example: `# Check if a number is positive, negative, or zero
number = 7

if number > 0:
    print("The number is positive")
elif number < 0:
    print("The number is negative")
else:
    print("The number is zero")

# Check if a person can vote
age = 16
if age >= 18:
    print("You can vote!")
else:
    print("You cannot vote yet.")
    print("You need to wait", 18 - age, "more years.")`,
    challenge:
      "Write a program that checks if a student passed or failed based on their score. A score of 60 or higher is a pass.",
    startingCode: `# Define the student's score
score = 75

# Check if the student passed or failed
# Your code here`,
  },
  {
    id: "loops",
    title: "Loops",
    instructions: `<p>Loops allow you to repeat a block of code multiple times. Python has two main types of loops:</p>
                   <ul>
                     <li><strong>for loops</strong>: Used to iterate over a sequence (like a list, string, or range)</li>
                     <li><strong>while loops</strong>: Used to execute code as long as a condition is true</li>
                   </ul>
                   <p>The <code>range()</code> function is often used with for loops to repeat code a specific number of times.</p>`,
    example: `# For loop with range
print("Counting from 1 to 5:")
for i in range(1, 6):  # range(1, 6) generates numbers 1, 2, 3, 4, 5
    print(i)

# For loop with a string
name = "Python"
print("\\nLetters in Python:")
for letter in name:
    print(letter)

# While loop
print("\\nCounting down:")
count = 3
while count > 0:
    print(count)
    count = count - 1  # You can also write this as count -= 1
print("Blast off!")`,
    challenge: "Write a program that prints the first 10 even numbers (2, 4, 6, ..., 20).",
    startingCode: `# Print the first 10 even numbers
# Your code here`,
  },
  {
    id: "input",
    title: "User Input",
    instructions: `<p>Python allows you to get input from the user with the <code>input()</code> function.</p>
                   <p>The <code>input()</code> function displays a prompt to the user and waits for them to type something and press Enter.</p>
                   <p>The function returns what the user typed as a string. If you need a number, you'll need to convert the string to an integer or float.</p>`,
    example: `# Getting a string input
name = input("What is your name? ")
print("Hello,", name + "!")

# Getting a number input
age_str = input("How old are you? ")
age = int(age_str)  # Convert string to integer
print("Next year, you will be", age + 1, "years old.")

# You can also convert directly
height = float(input("How tall are you in meters? "))
print("You are", height, "meters tall.")`,
    challenge:
      "Write a program that asks the user for their name and favorite number, then prints a personalized message using both inputs.",
    startingCode: `# Ask for the user's name and favorite number
# Your code here

# Print a personalized message
# Your code here`,
  },
]
