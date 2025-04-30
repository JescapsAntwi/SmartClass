# SuguruAI: Offline Educational System for Ghana

## Project Overview

SuguruAI is an offline educational platform leveraging large language models (specifically Llama 2) to provide personalized learning experiences for students in Ghana. The system uses the Ghana Educational System syllabus as context for the model, enabling it to teach various educational topics even without internet connectivity.

## Key Features

1. **Offline LLM Integration**: Run Llama 2 locally without requiring internet connectivity
2. **GES Syllabus Integration**: Full Ghana Educational System syllabus integrated as context
3. **Interactive Learning Interface**: Video-like text progression with sectioned content
4. **Beautiful Educational UI**: Clean, intuitive interface designed for learning
5. **Fine-tuned Model**: Customized model to enhance educational outputs
6. **Sequential Learning Flow**: Content divided into sections with next/previous navigation
7. **Multi-subject Support**: Coverage across various educational subjects
8. **Minimal Hardware Requirements**: Optimized to run on standard computers 

## Technical Architecture

### High-Level Components

1. **Data Layer**: Ghana Educational System syllabus content in structured format
2. **Model Layer**: Fine-tuned Llama 2 model for educational content generation
3. **Application Layer**: Streamlit-based user interface for interactive learning
4. **Storage Layer**: Local storage for syllabus data and model weights

### Component Interaction

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  GES Syllabus    │────▶│  Fine-tuned      │────▶│  Streamlit UI    │
│  (Context Data)  │     │  Llama 2 Model   │     │  (User Interface)│
│                  │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Implementation Guidelines

### 1. Data Collection and Preparation

1. **Acquire GES Syllabus**: 
   - Collect comprehensive Ghana Educational System syllabus materials
   - Structure content by educational level, subject, and topic
   - Convert to format suitable for model integration

2. **Data Preprocessing**:
   - Clean and normalize text data
   - Structure content for easy retrieval by topic/subject
   - Create question-answer pairs for fine-tuning

### 2. Model Setup and Fine-tuning

1. **Base Model Selection**:
   - Use Llama 2 (7B parameter version for better performance on standard hardware)
   - Convert to GGML format for efficient inference on CPU

2. **Model Fine-tuning**:
   - Prepare training dataset using GES syllabus content
   - Fine-tune model using techniques like LoRA or QLoRA for efficiency
   - Evaluate model performance on educational content generation
   - Optimize for offline usage with minimal computational requirements

3. **Model Deployment**:
   - Package model for local deployment
   - Implement inference optimization for better performance
   - Create model loading and interaction utilities

### 3. Application Development with Streamlit

1. **UI Framework**:
   - Implement core UI using Streamlit
   - Create custom components for video-like text progression
   - Design theme optimized for educational content

2. **Content Flow**:
   - Implement sectioned content navigation
   - Create "Next" button functionality for sequential learning
   - Add progress tracking across learning modules

3. **Interactive Elements**:
   - Add quizzes and assessment components
   - Implement feedback mechanism on student responses
   - Create topic selection and navigation interface

4. **User Experience**:
   - Optimize for educational engagement
   - Implement responsive design for different screen sizes
   - Create intuitive navigation between subjects and topics

### 4. Offline Deployment Strategy

1. **Packaging**:
   - Bundle application with model and data
   - Create simple installation process
   - Ensure minimal dependencies for broad compatibility

2. **Local Storage**:
   - Implement efficient data storage for syllabus content
   - Create caching mechanism for frequently accessed content
   - Optimize model storage for quick loading

3. **Performance Optimization**:
   - Implement model quantization for faster inference
   - Optimize memory usage for resource-constrained environments
   - Add progressive loading for larger content sections

## Implementation Steps in Detail

### Step 1: Environment Setup

```python
# Required packages
# pip install -r requirements.txt
```

Create a requirements.txt file with:
```
streamlit>=1.24.0
llama-cpp-python>=0.1.77
torch>=2.0.0
transformers>=4.30.0
accelerate>=0.20.3
peft>=0.4.0
sentencepiece>=0.1.99
```

### Step 2: GES Syllabus Data Collection

Organize the syllabus data in JSON format for easy processing:

```json
{
  "primary": {
    "mathematics": {
      "grade1": [
        {
          "topic": "Number and Operations",
          "subtopics": [
            {
              "title": "Counting Numbers",
              "content": "Learning to count from 1 to 100...",
              "examples": ["Example 1...", "Example 2..."],
              "exercises": ["Exercise 1...", "Exercise 2..."]
            }
          ]
        }
      ]
    }
  }
}
```

### Step 3: Model Setup

```python
# model.py
import torch
from llama_cpp import Llama

class SuguruAIModel:
    def __init__(self, model_path="models/llama-2-7b-educational.gguf"):
        self.model = Llama(
            model_path=model_path,
            n_ctx=2048,  # Context window size
            n_batch=8    # Batch size for prompt processing
        )
    
    def generate_response(self, prompt, max_tokens=512):
        """Generate educational content based on prompt"""
        response = self.model(
            prompt,
            max_tokens=max_tokens,
            temperature=0.7,
            top_p=0.95,
            stop=["Student:", "\n\n"]
        )
        return response["choices"][0]["text"]
```

### Step 4: Streamlit UI Development

```python
# app.py
import streamlit as st
import json
from model import SuguruAIModel

# Initialize model
@st.cache_resource
def load_model():
    return SuguruAIModel()

model = load_model()

# Load syllabus data
@st.cache_data
def load_syllabus():
    with open("data/ges_syllabus.json", "r") as f:
        return json.load(f)

syllabus = load_syllabus()

# App UI
st.title("SuguruAI - Ghana Educational System")

# Sidebar for navigation
st.sidebar.title("Navigation")
education_level = st.sidebar.selectbox(
    "Select Education Level", 
    options=list(syllabus.keys())
)

subject = st.sidebar.selectbox(
    "Select Subject", 
    options=list(syllabus[education_level].keys())
)

grade = st.sidebar.selectbox(
    "Select Grade", 
    options=list(syllabus[education_level][subject].keys())
)

# Main content
st.header(f"{subject.capitalize()} - {grade.capitalize()}")

# Get topics for selected grade and subject
topics = syllabus[education_level][subject][grade]

# Initialize session state for tracking current topic and subtopic
if 'current_topic_idx' not in st.session_state:
    st.session_state.current_topic_idx = 0
    
if 'current_subtopic_idx' not in st.session_state:
    st.session_state.current_subtopic_idx = 0
    
if 'show_exercise' not in st.session_state:
    st.session_state.show_exercise = False

# Display current topic and subtopic
current_topic = topics[st.session_state.current_topic_idx]
current_subtopic = current_topic["subtopics"][st.session_state.current_subtopic_idx]

st.subheader(current_topic["topic"])
st.write(f"**{current_subtopic['title']}**")

# Content container with styled box
content_container = st.container()
with content_container:
    st.markdown(f"""
    <div style="background-color:#f0f2f6;padding:20px;border-radius:10px;">
    {current_subtopic['content']}
    </div>
    """, unsafe_allow_html=True)

    # Examples
    if not st.session_state.show_exercise:
        st.write("**Examples:**")
        for i, example in enumerate(current_subtopic['examples']):
            st.markdown(f"**Example {i+1}:** {example}")
    
    # Exercises (shown when Next is clicked after content)
    else:
        st.write("**Exercises:**")
        for i, exercise in enumerate(current_subtopic['exercises']):
            st.markdown(f"**Exercise {i+1}:** {exercise}")
            user_answer = st.text_area(f"Your answer for Exercise {i+1}", key=f"ex_{i}")
            
            if user_answer:
                # Generate feedback from model
                prompt = f"Student response to exercise: '{exercise}'\nStudent answer: '{user_answer}'\nProvide feedback:"
                feedback = model.generate_response(prompt)
                st.markdown(f"**Feedback:** {feedback}")

# Navigation buttons
col1, col2, col3 = st.columns(3)

with col1:
    if st.button("Previous"):
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
    if st.button("Next"):
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
```

### Step 5: Model Fine-tuning (Optional but Recommended)

Create a fine-tuning script:

```python
# finetune.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import json

# Load data
with open("data/training_data.json", "r") as f:
    training_data = json.load(f)

# Load base model
model_id = "meta-llama/Llama-2-7b"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    load_in_8bit=True,
    device_map="auto",
)

# Configure LoRA
peft_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=["q_proj", "v_proj"]
)

# Prepare model for training
model = prepare_model_for_kbit_training(model)
model = get_peft_model(model, peft_config)

# Setup training data
# ... (Implementation specific to your training framework)

# Save the fine-tuned model
model.save_pretrained("models/llama-2-7b-educational-finetuned")
```

### Step 6: Offline Deployment

Create a deployment script:

```python
# deploy.py
import os
import shutil
import subprocess

# Create deployment directory
os.makedirs("suguru_ai_deploy", exist_ok=True)

# Copy necessary files
shutil.copy("app.py", "suguru_ai_deploy/")
shutil.copy("model.py", "suguru_ai_deploy/")
shutil.copy("requirements.txt", "suguru_ai_deploy/")

# Create data and models directories
os.makedirs("suguru_ai_deploy/data", exist_ok=True)
os.makedirs("suguru_ai_deploy/models", exist_ok=True)

# Copy data and models
shutil.copy("data/ges_syllabus.json", "suguru_ai_deploy/data/")
shutil.copy("models/llama-2-7b-educational.gguf", "suguru_ai_deploy/models/")

# Create run script
with open("suguru_ai_deploy/run_suguru_ai.bat", "w") as f:
    f.write("pip install -r requirements.txt\n")
    f.write("streamlit run app.py\n")

print("Deployment package created successfully in 'suguru_ai_deploy' directory")
```

## Testing Strategy

1. **Model Accuracy Testing**:
   - Test model responses against expected educational content
   - Verify alignment with GES syllabus objectives
   - Assess pedagogical effectiveness of responses

2. **UI Testing**:
   - Test navigation flow between topics and subtopics
   - Verify progression through "Next" button functionality
   - Test responsiveness on different screen sizes

3. **Integrated Testing**:
   - Test end-to-end learning experiences
   - Verify proper content sequencing
   - Test model-UI integration

4. **Offline Capability Testing**:
   - Test application functionality without internet connectivity
   - Verify all resources are properly bundled
   - Measure performance on target hardware

## Maintenance and Updates

1. **Syllabus Updates**:
   - Process for updating syllabus content
   - Version management for content changes
   - Update distribution mechanism

2. **Model Improvements**:
   - Process for model fine-tuning with new data
   - Model performance monitoring
   - Model version control

3. **Application Updates**:
   - UI refinement based on user feedback
   - Feature additions and improvements
   - Bug fixes and performance optimizations

## Conclusion

The SuguruAI system provides an innovative approach to education in Ghana by combining the Ghana Educational System syllabus with advanced AI technology in an offline environment. The implementation leverages Llama 2 as the core LLM and Streamlit for creating an interactive, educational user interface. This solution addresses challenges related to internet connectivity while providing high-quality educational content aligned with the national curriculum.

By following the implementation guidelines provided in this documentation, developers can create a functional educational platform that brings AI-powered learning to students across Ghana, regardless of their internet connectivity status. 