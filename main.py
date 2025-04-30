import streamlit as st
import json
import os
from pathlib import Path

# Set page configuration
st.set_page_config(
    page_title="SuguruAI - Ghana Educational System",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Constants and configuration
MODELS_DIR = Path("models")
DATA_DIR = Path("data")

# Create directories if they don't exist
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Custom CSS for better UI
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.5rem;
        color: #1E88E5;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.8rem;
        color: #333;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }
    .content-box {
        background-color: #f0f2f6;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 1rem;
    }
    .example-box {
        background-color: #e3f2fd;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 0.5rem;
    }
    .exercise-box {
        background-color: #fff8e1;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    .feedback-box {
        background-color: #e8f5e9;
        padding: 10px;
        border-radius: 5px;
        margin-top: 0.5rem;
    }
    .next-button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
    }
    .prev-button {
        background-color: #f44336;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Mock LLM model class (placeholder for actual Llama 2 implementation)
class MockLLMModel:
    def __init__(self):
        self.name = "Llama 2 Mock"
        print(f"Initialized {self.name}")
    
    def generate_response(self, prompt, max_tokens=100):
        """Simulate generating a response from the model"""
        # This is a mock response - in the actual implementation, 
        # this would connect to the Llama 2 model
        return f"This is a simulated response to: '{prompt[:50]}...'"

# Initialize model
@st.cache_resource
def load_model():
    # In the actual implementation, this would load the Llama 2 model
    # For now, return a mock model
    try:
        return MockLLMModel()
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

# Load sample syllabus data
def get_sample_syllabus():
    """Return sample syllabus data structure for demonstration"""
    return {
        "primary": {
            "mathematics": {
                "grade1": [
                    {
                        "topic": "Number and Operations",
                        "subtopics": [
                            {
                                "title": "Counting Numbers",
                                "content": "In this lesson, we will learn how to count numbers from 1 to 100. Counting is the foundation of mathematics and helps us understand quantity and order.",
                                "examples": [
                                    "Counting from 1 to 10: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
                                    "Counting by tens: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100"
                                ],
                                "exercises": [
                                    "Count from 15 to 25.",
                                    "What comes after 39?",
                                    "Count by tens starting from 5."
                                ]
                            },
                            {
                                "title": "Addition of Numbers",
                                "content": "Addition is the process of combining two or more numbers to find their sum. The plus sign (+) indicates addition.",
                                "examples": [
                                    "2 + 3 = 5",
                                    "7 + 8 = 15"
                                ],
                                "exercises": [
                                    "Calculate 4 + 9.",
                                    "What is the sum of 12 and 8?",
                                    "If you have 5 apples and get 7 more, how many do you have in total?"
                                ]
                            }
                        ]
                    },
                    {
                        "topic": "Shapes and Space",
                        "subtopics": [
                            {
                                "title": "Basic Shapes",
                                "content": "Shapes are all around us. In this lesson, we'll learn about basic shapes like circles, squares, triangles, and rectangles.",
                                "examples": [
                                    "A circle is round like a ball or the sun.",
                                    "A square has 4 equal sides and 4 corners."
                                ],
                                "exercises": [
                                    "Name three objects that are shaped like a circle.",
                                    "How many sides does a triangle have?",
                                    "Draw a rectangle and label its sides."
                                ]
                            }
                        ]
                    }
                ],
                "grade2": [
                    {
                        "topic": "Advanced Numbers",
                        "subtopics": [
                            {
                                "title": "Multiplication Basics",
                                "content": "Multiplication is a way to add the same number multiple times. For example, 3 × 4 means add 3 four times: 3 + 3 + 3 + 3 = 12.",
                                "examples": [
                                    "2 × 5 = 10",
                                    "3 × 6 = 18"
                                ],
                                "exercises": [
                                    "Calculate 4 × 3.",
                                    "What is 7 × 2?",
                                    "If one box has 5 pencils, how many pencils are in 6 boxes?"
                                ]
                            }
                        ]
                    }
                ]
            },
            "science": {
                "grade1": [
                    {
                        "topic": "Living Things",
                        "subtopics": [
                            {
                                "title": "Plants and Animals",
                                "content": "Living things include plants and animals. They need food, water, and air to survive. Plants make their own food using sunlight, while animals eat plants or other animals.",
                                "examples": [
                                    "Plants: trees, flowers, grass",
                                    "Animals: dogs, birds, fish"
                                ],
                                "exercises": [
                                    "Name three plants you can find in your environment.",
                                    "How do plants make their food?",
                                    "List three things all living things need to survive."
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "junior_high": {
            "social_studies": {
                "jhs1": [
                    {
                        "topic": "Ghana's History",
                        "subtopics": [
                            {
                                "title": "Pre-Colonial Ghana",
                                "content": "Before European colonization, the area now known as Ghana was home to various kingdoms and ethnic groups. The most famous was the Ghana Empire, which was actually located in present-day Mali and Mauritania.",
                                "examples": [
                                    "The Ashanti Kingdom was one of the most powerful states in sub-Saharan Africa.",
                                    "The Fante Confederation formed along the coast as a response to European presence."
                                ],
                                "exercises": [
                                    "Name three major ethnic groups in pre-colonial Ghana.",
                                    "What was the capital of the Ashanti Kingdom?",
                                    "Describe the political structure of one pre-colonial Ghanaian society."
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }

# Load syllabus data
@st.cache_data
def load_syllabus():
    # In a real implementation, this would load from a file
    # For now, return the sample data
    return get_sample_syllabus()

model = load_model()
syllabus = load_syllabus()

# Main application layout
def main():
    # Header
    st.markdown("<h1 class='main-header'>SuguruAI - Ghana Educational System</h1>", unsafe_allow_html=True)
    
    # Sidebar for navigation
    st.sidebar.title("Navigation")
    
    # Education level selection
    education_level = st.sidebar.selectbox(
        "Select Education Level", 
        options=list(syllabus.keys())
    )
    
    # Subject selection based on education level
    subject = st.sidebar.selectbox(
        "Select Subject", 
        options=list(syllabus[education_level].keys())
    )
    
    # Grade selection based on subject
    grade = st.sidebar.selectbox(
        "Select Grade", 
        options=list(syllabus[education_level][subject].keys())
    )
    
    # Main content area
    st.markdown(f"<h2 class='sub-header'>{subject.capitalize()} - {grade.capitalize()}</h2>", unsafe_allow_html=True)
    
    # Get topics for selected grade and subject
    topics = syllabus[education_level][subject][grade]
    
    # Initialize session state for tracking current topic and subtopic
    if 'current_topic_idx' not in st.session_state:
        st.session_state.current_topic_idx = 0
        
    if 'current_subtopic_idx' not in st.session_state:
        st.session_state.current_subtopic_idx = 0
        
    if 'show_exercise' not in st.session_state:
        st.session_state.show_exercise = False
    
    if 'user_answers' not in st.session_state:
        st.session_state.user_answers = {}
    
    # Get current topic and subtopic
    current_topic = topics[st.session_state.current_topic_idx]
    current_subtopic = current_topic["subtopics"][st.session_state.current_subtopic_idx]
    
    # Display current topic and subtopic
    st.markdown(f"<h3 class='sub-header'>{current_topic['topic']}</h3>", unsafe_allow_html=True)
    st.markdown(f"<h4>{current_subtopic['title']}</h4>", unsafe_allow_html=True)
    
    # Content container with styled box
    st.markdown(f"<div class='content-box'>{current_subtopic['content']}</div>", unsafe_allow_html=True)
    
    # Navigation progress indicator
    topic_progress = f"Topic {st.session_state.current_topic_idx + 1}/{len(topics)}"
    subtopic_progress = f"Subtopic {st.session_state.current_subtopic_idx + 1}/{len(current_topic['subtopics'])}"
    st.info(f"{topic_progress} • {subtopic_progress}")
    
    # Examples and Exercises
    if not st.session_state.show_exercise:
        st.markdown("<h4>Examples:</h4>", unsafe_allow_html=True)
        for i, example in enumerate(current_subtopic['examples']):
            st.markdown(f"<div class='example-box'><strong>Example {i+1}:</strong> {example}</div>", unsafe_allow_html=True)
    else:
        st.markdown("<h4>Exercises:</h4>", unsafe_allow_html=True)
        for i, exercise in enumerate(current_subtopic['exercises']):
            exercise_key = f"{education_level}_{subject}_{grade}_{st.session_state.current_topic_idx}_{st.session_state.current_subtopic_idx}_{i}"
            
            st.markdown(f"<div class='exercise-box'><strong>Exercise {i+1}:</strong> {exercise}</div>", unsafe_allow_html=True)
            
            # Get previous answer if available
            previous_answer = st.session_state.user_answers.get(exercise_key, "")
            
            # Input field for user's answer
            user_answer = st.text_area(
                f"Your answer for Exercise {i+1}:", 
                value=previous_answer,
                key=f"ex_{exercise_key}"
            )
            
            # Save answer to session state
            if user_answer:
                st.session_state.user_answers[exercise_key] = user_answer
                
                # Generate feedback if answer changed
                if user_answer != previous_answer or f"feedback_{exercise_key}" not in st.session_state:
                    prompt = f"Student response to exercise: '{exercise}'\nStudent answer: '{user_answer}'\nProvide feedback:"
                    feedback = model.generate_response(prompt)
                    st.session_state[f"feedback_{exercise_key}"] = feedback
                
                # Display feedback
                st.markdown(
                    f"<div class='feedback-box'><strong>Feedback:</strong> {st.session_state[f'feedback_{exercise_key}']}</div>",
                    unsafe_allow_html=True
                )
    
    # Navigation buttons
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col1:
        if st.button("← Previous"):
            if st.session_state.show_exercise:
                # Go back to content
                st.session_state.show_exercise = False
            elif st.session_state.current_subtopic_idx > 0:
                # Go to previous subtopic
                st.session_state.current_subtopic_idx -= 1
                st.session_state.show_exercise = False
            elif st.session_state.current_topic_idx > 0:
                # Go to previous topic, last subtopic
                st.session_state.current_topic_idx -= 1
                st.session_state.current_subtopic_idx = len(topics[st.session_state.current_topic_idx]["subtopics"]) - 1
                st.session_state.show_exercise = False
            st.rerun()
    
    with col3:
        if st.button("Next →"):
            if not st.session_state.show_exercise:
                # Show exercises for current subtopic
                st.session_state.show_exercise = True
            elif st.session_state.current_subtopic_idx < len(current_topic["subtopics"]) - 1:
                # Go to next subtopic
                st.session_state.current_subtopic_idx += 1
                st.session_state.show_exercise = False
            elif st.session_state.current_topic_idx < len(topics) - 1:
                # Go to next topic, first subtopic
                st.session_state.current_topic_idx += 1
                st.session_state.current_subtopic_idx = 0
                st.session_state.show_exercise = False
            st.rerun()
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style="text-align: center;">
        <p>SuguruAI - Educational Platform powered by Llama 2</p>
        <p>Using the Ghana Educational System Syllabus</p>
        </div>
        """, 
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main() 