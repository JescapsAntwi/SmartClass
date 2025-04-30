# SuguruAI: Feature Specification Document

This document provides detailed technical specifications for implementing the core features of SuguruAI, focusing on the technical components, implementation approaches, and integration points.

## 1. LLM Integration & Optimization

### 1.1 Model Selection and Preparation

#### 1.1.1 Base Model
- **Model**: Llama 2 7B parameter variant
- **Format**: GGUF quantized format (4-bit quantization recommended for balance of performance and quality)
- **License**: Meta's Llama 2 license (ensure compliance with terms for educational use)
- **Disk Footprint**: Target size after quantization ~4GB
- **Memory Requirements**: Target 8GB RAM minimum during operation

#### 1.1.2 Model Adaptation
- **Fine-tuning Method**: Parameter-Efficient Fine-Tuning (PEFT) with LoRA
- **Training Dataset**: Curated GES syllabus content converted to instruction format
- **Evaluation Metrics**: ROUGE, BLEU, educational content accuracy, hallucination rate
- **Hyperparameters**:
  - Learning rate: 2e-4
  - Batch size: 8
  - Epochs: 3-5
  - LoRA rank: 8
  - LoRA alpha: 16

### 1.2 Runtime Integration

#### 1.2.1 Inference Engine
- **Framework**: llama.cpp for optimized inference
- **Python Binding**: llama-cpp-python for integration with Streamlit
- **Context Window**: 4096 tokens (adjust based on hardware constraints)
- **Inference Parameters**:
  - Temperature: 0.7 for general content, 0.3 for factual responses
  - Top-p: 0.9
  - Top-k: 40
  - Max tokens: Adaptive based on content type (150-500)

#### 1.2.2 Prompt Engineering
- **System Prompt**: Fixed educational assistant identity with GES alignment
- **Content Templates**: Subject-specific templates for consistent output formatting
- **Instruction Format**: "Create a lesson on [topic] for [grade level] including [specific requirements]"
- **Context Injection**: Dynamic syllabus content injection limited to 1500 tokens

### 1.3 Offline Optimization

- **Model Compression**: Mixed-precision quantization
- **Checkpoint Management**: Save intermediate states for quick resume
- **Resource Monitoring**: Dynamic memory usage adjustment
- **Performance Profiling**: Continuous monitoring of inference times

## 2. Syllabus Integration System

### 2.1 Syllabus Database Structure

#### 2.1.1 Schema Design
- **Education Levels Table**:
  ```sql
  CREATE TABLE education_levels (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    abbreviation TEXT,
    age_range TEXT,
    description TEXT
  );
  ```

- **Subjects Table**:
  ```sql
  CREATE TABLE subjects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    level_id INTEGER,
    description TEXT,
    FOREIGN KEY (level_id) REFERENCES education_levels(id)
  );
  ```

- **Topics Table**:
  ```sql
  CREATE TABLE topics (
    id INTEGER PRIMARY KEY,
    subject_id INTEGER,
    name TEXT NOT NULL,
    order_index INTEGER,
    learning_objectives TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  );
  ```

- **Content Table**:
  ```sql
  CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER,
    content_type TEXT,
    content_text TEXT,
    metadata JSON,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  );
  ```

#### 2.1.2 Content Organization
- **Content Types**: Definitions, Explanations, Examples, Exercises, Assessments
- **Metadata Fields**: Difficulty level, prerequisites, learning outcomes, time estimate
- **Indexing**: Full-text search index on content_text
- **Caching**: Pre-compiled content bundles by subject

### 2.2 GES Syllabus Processing

#### 2.2.1 Data Acquisition
- **Sources**: Official GES curriculum documents, approved textbooks
- **Formats**: PDF extraction, manual curation, web scraping of approved resources
- **Preprocessing**: Text cleaning, formatting normalization, duplicate removal

#### 2.2.2 Content Transformation
- **Chunking Strategy**: Topic-based content segmentation (300-500 words per chunk)
- **Formatting**: Markdown-based standardization
- **QA Process**: Expert verification of processed content
- **Versioning**: Content versioning tied to GES curriculum updates

## 3. Interactive Learning Interface

### 3.1 UI Architecture

#### 3.1.1 Framework Implementation
- **Primary Framework**: Streamlit 1.22+ 
- **Supporting Libraries**:
  - `streamlit-extras` for extended components
  - `st-annotated-text` for highlighting
  - `streamlit-option-menu` for navigation
  - Custom CSS for styling

#### 3.1.2 Layout System
- **Pages**: Home, Subject Browser, Learning Session, Assessment, Progress Tracker
- **Navigation**: Sidebar-based primary navigation, in-content sequential navigation
- **Responsiveness**: CSS media queries for different device sizes
- **Themes**: Light and dark mode support with high-contrast option

### 3.2 Content Presentation

#### 3.2.1 Sequencing Engine
- **Progression Controls**: "Next" and "Previous" navigation with keyboard shortcuts
- **Section Types**: Introduction, Concept, Example, Practice, Summary
- **Progress Indicators**: Visual progress bar, completion markers
- **Session Management**: Auto-save at section boundaries

#### 3.2.2 Interactive Elements
- **Input Types**: Multiple choice, short answer, matching exercises
- **Feedback Mechanisms**: Immediate correctness feedback
- **Helper Features**: Hint system, explanations for incorrect answers
- **Engagement**: Gamification elements (points, streaks, badges)

### 3.3 Offline Persistence

- **Storage Method**: SQLite with JSON serialization
- **Data Types to Store**:
  - User progress (completed sections)
  - Assessment results
  - Bookmarks and notes
  - Usage statistics
- **Sync Strategy**: No cloud sync in initial version

## 4. Knowledge Assessment System

### 4.1 Assessment Generation

- **Question Types**: Multiple choice, true/false, short answer, completion
- **Difficulty Scaling**: Progressive difficulty based on performance
- **Generation Method**: Template-based with LLM variation
- **Coverage**: Mapped to learning objectives in syllabus

### 4.2 Evaluation Engine

- **Scoring System**: Percentage-based with partial credit
- **Feedback Generation**: LLM-generated explanations for incorrect answers
- **Performance Tracking**: Time-series data of assessment results
- **Weak Point Analysis**: Topic clustering of missed questions

### 4.3 Learning Reinforcement

- **Spaced Repetition**: SM-2 algorithm for scheduling reviews
- **Mastery Criteria**: 85%+ correct responses over 3 assessments
- **Remedial Suggestions**: Content recommendations based on performance
- **Challenge Mode**: Advanced questions for high performers

## 5. Technical Implementation Guidelines

### 5.1 Code Organization

```
suguruai/
├── app/
│   ├── main.py             # Application entry point
│   ├── components/         # UI components
│   ├── pages/              # Streamlit pages
│   └── utils/              # Helper functions
├── data/
│   ├── syllabus/           # Processed syllabus content
│   ├── models/             # LLM model files
│   └── schema/             # Database schema
├── llm/
│   ├── engine.py           # Inference engine
│   ├── prompts.py          # System prompts
│   └── tuning/             # Fine-tuning scripts
├── database/
│   ├── models.py           # Data models
│   ├── queries.py          # Database operations
│   └── migrations/         # Schema migrations
├── tests/                  # Unit and integration tests
└── scripts/                # Utility scripts
```

### 5.2 Performance Optimization

- **Startup Optimization**: Lazy loading of model components
- **Memory Management**: Garbage collection triggers, resource pooling
- **IO Optimization**: Asset bundling, database indexing
- **UI Responsiveness**: Background processing for heavy operations

### 5.3 Packaging and Distribution

- **Bundling**: PyInstaller with UPX compression
- **Dependencies**: Vendored dependencies where possible
- **Platform Support**: Windows 10+ (primary), Linux (secondary)
- **Installation**: Simplified installer with minimal user interaction

## 6. Implementation Priorities

### 6.1 MVP Features (Must-Have)

1. Basic LLM integration with pre-tuned model
2. Core subjects syllabus content (Mathematics, Science, English)
3. Sequential content presentation with navigation
4. Basic assessment with multiple-choice questions
5. Local progress saving

### 6.2 Phase 2 Features (Should-Have)

1. Fine-tuned model with improved educational responses
2. Complete subject coverage for one educational level
3. Enhanced UI with improved navigation
4. More sophisticated assessment types
5. Basic analytics for learning progress

### 6.3 Future Enhancements (Could-Have)

1. Voice narration of content
2. Support for multimedia elements
3. Peer-to-peer content sharing
4. Teacher dashboard for monitoring
5. Mobile application version

## 7. Technical Dependencies

### 7.1 Required Libraries

- **LLM**: llama-cpp-python, torch (for fine-tuning)
- **UI**: streamlit, streamlit-extras, st-annotated-text
- **Data**: pandas, numpy, sqlite3
- **Processing**: nltk, scikit-learn, transformers
- **Packaging**: pyinstaller, setuptools

### 7.2 Development Tools

- **Version Control**: Git
- **Development Environment**: VSCode with Python extensions
- **Testing**: pytest, streamlit-testing
- **Documentation**: MkDocs with Material theme
- **CI/CD**: GitHub Actions for automated testing

## 8. Implementation Challenges and Solutions

| Challenge | Solution Approach |
|-----------|-------------------|
| Model size vs. performance | Aggressive quantization with quality benchmarking |
| Content accuracy | Expert review process, feedback mechanism |
| UI responsiveness with LLM | Background processing, streaming responses |
| Offline data management | SQLite with optimized queries, data caching |
| Cross-platform support | Abstraction layers for OS-specific operations |

## 9. Appendix

### 9.1 API Definitions

#### LLM Service API
```python
def generate_content(
    topic_id: int,
    content_type: str,
    difficulty: int = 1,
    max_length: int = 300
) -> str:
    """
    Generate educational content for a specific topic.
    
    Args:
        topic_id: Database ID of the topic
        content_type: Type of content (explanation, example, exercise)
        difficulty: Difficulty level (1-3)
        max_length: Maximum token length
        
    Returns:
        Formatted educational content
    """
```

#### Content Management API
```python
def get_topic_sequence(
    subject_id: int,
    level_id: int
) -> List[Dict]:
    """
    Get the complete sequence of topics for a subject at a specific level.
    
    Args:
        subject_id: Database ID of the subject
        level_id: Database ID of the educational level
        
    Returns:
        List of topic objects with metadata
    """
```

### 9.2 Sample Data Models

#### User Progress Model
```python
class UserProgress:
    user_id: str
    topic_id: int
    sections_completed: List[int]
    last_position: int
    assessments: Dict[int, float]  # section_id: score
    time_spent: int  # seconds
    last_access: datetime
```

#### Content Section Model
```python
class ContentSection:
    id: int
    topic_id: int
    section_type: str  # intro, concept, example, practice, summary
    content: str
    order_index: int
    metadata: Dict
    assessment_id: Optional[int]
``` 