const projectsData = [
  {
    id: 1,
    title: "Student Management System",
    description: "This system manages student academic records.",
    features: [
      "Add new students with name and ID",
      "Store marks for multiple subjects",
      "Calculate total and average marks",
      "Assign grades based on performance",
      "Display all student records",
      "Search for a student by name or ID",
      "Update student information if needed"
    ],
    icon: "fa-user-graduate"
  },
  {
    id: 2,
    title: "Banking System",
    description: "A simulation of basic banking operations.",
    features: [
      "Create a new bank account with user details",
      "Assign an initial balance",
      "Deposit money into the account",
      "Withdraw money with balance validation",
      "Display current balance",
      "Maintain a transaction history",
      "Prevent overdrawing from account"
    ],
    icon: "fa-university"
  },
  {
    id: 3,
    title: "Library Management System",
    description: "Manages book borrowing and return processes.",
    features: [
      "Add books with title, author, and ID",
      "Display available and borrowed books",
      "Borrow a book if available",
      "Return a borrowed book",
      "Search for a book by title or author",
      "Track book availability status"
    ],
    icon: "fa-book"
  },
  {
    id: 4,
    title: "Inventory Management System",
    description: "Tracks product stock in a store.",
    features: [
      "Add new products with price and quantity",
      "Update product quantity",
      "Remove products from inventory",
      "Display all products",
      "Calculate total inventory value",
      "Alert when stock is low"
    ],
    icon: "fa-boxes"
  },
  {
    id: 5,
    title: "Expense Tracker",
    description: "Tracks daily and monthly expenses.",
    features: [
      "Add expenses with category and amount",
      "Store expense history",
      "Display all recorded expenses",
      "Calculate total expenses",
      "Filter expenses by category",
      "Generate monthly spending report"
    ],
    icon: "fa-wallet"
  },
  {
    id: 6,
    title: "Quiz Application",
    description: "A multiple-choice quiz system.",
    features: [
      "Load questions and options",
      "Display one question at a time",
      "Accept user answers",
      "Check correctness of answers",
      "Keep track of score",
      "Display final result with performance"
    ],
    icon: "fa-question-circle"
  },
  {
    id: 7,
    title: "To-Do List Manager",
    description: "Manages daily tasks efficiently.",
    features: [
      "Add new tasks",
      "Edit existing tasks",
      "Delete tasks",
      "Mark tasks as completed",
      "Display all tasks with status",
      "Store tasks for future use"
    ],
    icon: "fa-tasks"
  },
  {
    id: 8,
    title: "Attendance System",
    description: "Tracks student attendance records.",
    features: [
      "Mark students as present or absent",
      "Store attendance for each day",
      "Display attendance records",
      "Calculate attendance percentage",
      "Generate student attendance report"
    ],
    icon: "fa-clipboard-user"
  },
  {
    id: 9,
    title: "Login & Registration System",
    description: "Handles user authentication.",
    features: [
      "Register new users with username and password",
      "Validate password strength",
      "Allow user login",
      "Limit login attempts for security",
      "Check if username already exists",
      "Display login success or failure messages"
    ],
    icon: "fa-sign-in-alt"
  },
  {
    id: 10,
    title: "Password Strength Checker",
    description: "Evaluates password security.",
    features: [
      "Check password length",
      "Verify presence of numbers",
      "Check for uppercase letters",
      "Check for special characters",
      "Classify password as weak, medium, or strong",
      "Provide feedback for improvement"
    ],
    icon: "fa-key"
  },
  {
    id: 11,
    title: "Text Analyzer Tool",
    description: "Analyzes input text data.",
    features: [
      "Count total words",
      "Count total characters",
      "Count sentences",
      "Identify most frequently used word",
      "Convert text to lowercase/uppercase",
      "Display summary report"
    ],
    icon: "fa-file-alt"
  },
  {
    id: 12,
    title: "ATM Simulation System",
    description: "Simulates ATM operations.",
    features: [
      "User login using PIN",
      "Check account balance",
      "Deposit money",
      "Withdraw money with validation",
      "Show transaction history",
      "Prevent incorrect PIN access"
    ],
    icon: "fa-credit-card"
  },
  {
    id: 13,
    title: "Number System Converter",
    description: "Converts between number systems.",
    features: [
      "Convert decimal to binary",
      "Convert binary to decimal",
      "Convert decimal to hexadecimal",
      "Convert hexadecimal to decimal",
      "Validate input values",
      "Display conversion results clearly"
    ],
    icon: "fa-calculator"
  },
  {
    id: 14,
    title: "Sorting & Searching Tool",
    description: "Performs basic data operations.",
    features: [
      "Accept list of numbers from user",
      "Sort numbers in ascending order",
      "Search for a specific number",
      "Display sorted list",
      "Show search results (found/not found)"
    ],
    icon: "fa-sort-numeric-up"
  },
  {
    id: 15,
    title: "Multiplication Table Generator",
    description: "Generates multiplication tables.",
    features: [
      "Generate table for a single number",
      "Generate tables for a range of numbers",
      "Display formatted output",
      "Validate user input",
      "Allow repeated generation"
    ],
    icon: "fa-table"
  },
  {
    id: 16,
    title: "Calendar Generator",
    description: "Displays monthly calendar.",
    features: [
      "Input month and year",
      "Calculate correct starting day",
      "Display formatted calendar layout",
      "Show number of days in month",
      "Handle leap years correctly"
    ],
    icon: "fa-calendar-alt"
  },
  {
    id: 17,
    title: "File-Based Chat Simulation",
    description: "Simulates messaging system using files.",
    features: [
      "Send messages from user A to user B",
      "Store messages in a file",
      "Read and display chat history",
      "Clear chat history if needed",
      "Simulate conversation flow"
    ],
    icon: "fa-comments"
  },
  {
    id: 18,
    title: "Mini CRM System",
    description: "Manages customer leads and follow-ups.",
    features: [
      "Add new customer leads",
      "Store contact details",
      "Assign lead status (hot/warm/cold)",
      "Update lead status",
      "Search for leads",
      "Generate follow-up reports"
    ],
    icon: "fa-users"
  },
  {
    id: 19,
    title: "Grade Calculator System",
    description: "Calculates academic performance.",
    features: [
      "Input marks for multiple subjects",
      "Calculate total and average",
      "Assign grades based on range",
      "Display GPA or percentage",
      "Show final result report"
    ],
    icon: "fa-graduation-cap"
  },
  {
    id: 20,
    title: "Text-Based Adventure Game",
    description: "Interactive story game with choices.",
    features: [
      "Start game with introduction story",
      "Present choices to user",
      "Change story based on decisions",
      "Manage player inventory",
      "Handle multiple endings",
      "Restart or exit game option"
    ],
    icon: "fa-gamepad"
  }
];
