# SmartClass User Flow

## Overview
This document details the user journey through the SmartClass application, from initial loading to content consumption and assessment completion.

## Detailed User Flow

### 1. Application Launch
- **Loading Screen**
  - Application displays a branded loading screen with SmartClass logo
  - Welcome message appears: "Welcome to SmartClass - Your Offline Learning Companion"
  - A prominent "Start Learning" button appears once loading is complete

### 2. Grade Selection
- **Grade Selection Screen**
  - After clicking "Start Learning", user is presented with cards displaying different grade levels
  - Each card contains:
    - Grade number (e.g., "Primary 1", "Primary 2", etc.)
    - Visual icon representing the grade level
    - Brief description of content available
  - Cards are arranged in a grid layout, allowing for easy scanning
  - User selects their grade level by clicking/tapping on the appropriate card

### 3. Subject Selection
- **Subject Selection Screen**
  - After grade selection, user is presented with subject cards
  - Standard subjects include:
    - Mathematics
    - English
    - Science
    - Social Studies
  - Special subjects include:
    - Coding (Python basics with in-built IDE)
    - Maps (Offline world maps with Africa as the default view)
  - Each subject card contains:
    - Subject name
    - Representative icon
    - Brief description
  - User selects a subject by clicking/tapping on the card

### 4. Main Topics View
- **Topics List Screen**
  - After selecting a subject, user sees a list of main topics from the curriculum
  - Each topic is presented as a card with:
    - Topic title
    - Brief description
    - Progress indicator (if previously started)
    - "+" button on the right side for direct access to subtopics
  - Topics are arranged in recommended learning order
  - User can either:
    - Click directly on a topic card to expand it
    - Click the "+" button to immediately see subtopics

### 5. Topic Expansion Animation
- **Topic Expansion**
  - When a topic is selected, an animation occurs:
    - Selected topic card expands
    - Card moves to the top of the screen
    - Other topic cards smoothly disappear
    - "Start" button appears beside the main topic
  - Subtopics for the selected main topic appear in a vertical list below

### 6. Subtopic Interaction
- **Subtopics List View**
  - Subtopics are displayed as clickable items in a vertical list
  - Each subtopic includes:
    - Subtopic title
    - Brief description
    - Completion status indicator (if applicable)
  - User can:
    - Click "Start" button by the main topic to begin from the first subtopic
    - Click directly on any subtopic to jump to specific content

### 7. Content Consumption
- **Content View**
  - Selected subtopic content is presented as a series of cards
  - Each content card contains:
    - Content title
    - Educational material (text, diagrams, examples)
    - Progress indicator showing position in the sequence
    - "Next" button to advance to the following card
  - User navigates through content by clicking "Next"
  - Interactive elements may be present depending on content type

### 8. Mid-Topic Assessment
- **Mid Quiz**
  - After approximately 50% of the content cards for a main topic:
    - "Mid Quiz Time" screen appears with encouraging message
    - Series of quiz questions related to covered content is presented
    - Questions appear one at a time on individual cards
    - User selects answers and clicks "Submit"
    - After all questions are answered, results are shown
  - Quiz Review:
    - Each question is shown with user's answer
    - Correct answer is highlighted
    - Detailed explanation is provided
    - "Next" button allows navigation through review cards

### 9. Continued Learning
- **Remaining Content**
  - After mid-quiz review, remaining content cards are presented
  - Navigation continues as before with "Next" buttons
  - Content may increase in complexity based on curriculum design

### 10. Main Topic Assessment
- **Main Quiz**
  - After completing all content for the main topic:
    - "Main Quiz" screen appears
    - Comprehensive quiz covering all subtopics is presented
    - Questions are more challenging than mid-quiz
    - Format follows the same pattern as mid-quiz
  - Quiz Review:
    - Detailed review of all answers with explanations
    - Performance summary showing strengths and areas for improvement
    - "Next" button to navigate through review

### 11. Exam Practice
- **Exam Questions**
  - After main quiz completion:
    - "Exam Practice" screen appears
    - Questions from the exam question bank related to the topic are presented
    - These questions mirror the format and difficulty of actual exams
  - Exam Review:
    - Each question is shown with detailed solution
    - Step-by-step explanation of solving process
    - Tips for handling similar questions
    - "Next" button to navigate through review

### 12. Topic Completion
- **Completion Screen**
  - After exam practice review:
    - Congratulatory message appears
    - Summary of learning achievements is displayed
    - Two prominent buttons are shown:
      - "Next Topic" - Advances to the next sequential topic
      - "Home" - Returns to the subject selection screen

### 13. Special Modules

#### Coding Module
- **Python Learning Environment**
  - Interactive Python tutorial with progressive lessons
  - In-built IDE with:
    - Code editor with syntax highlighting
    - Output terminal showing execution results
    - Exercise instructions and examples
  - Step-by-step introduction to Python concepts
  - Practice exercises with automatic validation
  - Projects that build on learned concepts
  - Same quiz and assessment structure as other subjects

#### Maps Module
- **Interactive Offline Maps**
  - Opens to a map centered on Africa
  - Features include:
    - Zoom in/out controls
    - Region selection
    - Country information cards
    - Geographic feature highlighting
  - Educational content about:
    - Countries and capitals
    - Major landforms and water bodies
    - Cultural and economic information
  - Interactive quizzes about geographic knowledge
  - Ability to explore the entire world map while offline

## Navigation Patterns

### Breadcrumb Navigation
- Persistent breadcrumb trail shows current position in learning path
- Format: Grade > Subject > Main Topic > Subtopic
- Each element is clickable for quick navigation

### Progress Tracking
- Visual indicators show completion status throughout the app
- Progress is saved automatically when user completes sections
- Resume functionality returns users to their last position

### Back Navigation
- Standard back button allows returning to previous screens
- Home button provides quick return to subject selection
- Warning appears if trying to exit incomplete assessment

## Accessibility Considerations
- Text scaling supports different reading needs
- High contrast mode available for visibility
- Touch targets sized appropriately for young users
- Audio narration for content available where appropriate
- Simple language appropriate for target age groups 