# SuguruAI: Detailed Technical Specification

This document provides comprehensive technical details for the development and implementation of SuguruAI, an offline educational platform powered by large language models for the Ghana Educational System.

## Table of Contents

1. [Model Preparation and Training](#1-model-preparation-and-training)
2. [Syllabus Data Processing](#2-syllabus-data-processing)
3. [System Architecture Implementation](#3-system-architecture-implementation)
4. [UI Development](#4-ui-development)
5. [Content Generation Pipeline](#5-content-generation-pipeline)
6. [Assessment System](#6-assessment-system)
7. [Offline Deployment](#7-offline-deployment)
8. [Testing and Validation](#8-testing-and-validation)
9. [Performance Optimization](#9-performance-optimization)
10. [Appendices](#10-appendices)

## 1. Model Preparation and Training

### 1.1 Model Selection

#### 1.1.1 Base Model Requirements

- **Model Family**: Llama 2
- **Parameter Size**: 7B parameter variant (optimal balance of performance and resource requirements)
- **Licensing**: Confirm compliance with Meta's Llama 2 license for educational applications
- **Download Source**: Official Meta AI repository or Hugging Face (meta-llama/Llama-2-7b-hf)
- **Validation Method**: Calculate SHA256 hash of downloaded model to verify integrity

#### 1.1.2 Model Architecture Specifications

- **Transformer Blocks**: 32 layers
- **Hidden Size**: 4096
- **Attention Heads**: 32
- **Context Window**: 4096 tokens (base)
- **Vocabulary Size**: 32K tokens
- **Embedding Size**: 4096 dimensions
- **Total Parameters**: 6.74 billion

### 1.2 Model Quantization Process

#### 1.2.1 Quantization Libraries and Tools

- **Quantization Framework**: GGUF format via llama.cpp
- **Required Libraries**:
  ```bash
  git clone https://github.com/ggerganov/llama.cpp
  cd llama.cpp && make clean && LLAMA_CUBLAS=1 make
  pip install -r requirements.txt
  ```

#### 1.2.2 Quantization Commands and Parameters

1. **Convert to FP16 Format**:
   ```bash
   python convert.py /path/to/llama-2-7b --outtype f16 --outfile llama-2-7b.fp16.bin
   ```

2. **Create 4-bit Quantized Model (Q4_K_M)**:
   ```bash
   ./quantize llama-2-7b.fp16.bin llama-2-7b.q4_k_m.gguf q4_k_m
   ```

3. **Create 5-bit Quantized Model (Q5_K_M) - Recommended**:
   ```bash
   ./quantize llama-2-7b.fp16.bin llama-2-7b.q5_k_m.gguf q5_k_m
   ```

#### 1.2.3 Quantization Performance Metrics

| Quantization | Size | Memory Usage | Quality Loss | Inference Speed | Recommendation |
|--------------|------|--------------|--------------|-----------------|----------------|
| FP16 (base)  | 13GB | 14GB | None | 1.0x | For training only |
| Q8_0         | 7.16GB | 9.66GB | Very Low | 1.3x | High accuracy, high resource |
| Q6_K         | 5.53GB | 8.03GB | Very Low | 1.5x | Very good balance |
| Q5_K_M       | 4.78GB | 7.28GB | Low | 1.7x | **Recommended** |
| Q4_K_M       | 4.08GB | 6.58GB | Medium | 2.0x | Alternative for lower memory |
| Q3_K_M       | 3.30GB | 5.80GB | High | 2.3x | Not recommended |
| Q2_K         | 2.83GB | 5.33GB | Very High | 2.5x | Not recommended |

### 1.3 Fine-tuning Process

#### 1.3.1 Fine-tuning Infrastructure

- **GPU Requirements**: Minimum NVIDIA A100 (40GB) or equivalent
- **Storage Requirements**: 50GB SSD
- **Framework**: PyTorch with Hugging Face Transformers
- **Specialized Libraries**: PEFT, bitsandbytes, accelerate

#### 1.3.2 Data Preparation for Fine-tuning

1. **GES Syllabus to Training Format Conversion**:
   - Implement data pipeline to convert GES syllabus content to instruction format
   - Format structure:
     ```json
     {
       "instruction": "Explain the concept of photosynthesis for Grade 8 biology",
       "input": "",
       "output": "Photosynthesis is the process by which green plants...[detailed explanation]"
     }
     ```

2. **Dataset Characteristics**:
   - Minimum 10,000 instruction-output pairs
   - Coverage across all key subjects
   - Balance between age groups/educational levels
   - Quality control: Expert review of 10% samples

3. **Dataset Splitting**:
   - Training split: 80%
   - Validation split: 10%
   - Test split: 10%

#### 1.3.3 LoRA Fine-tuning Configuration

```python
from peft import LoraConfig

lora_config = LoraConfig(
    r=8,                      # Rank dimension
    lora_alpha=16,            # Alpha parameter for LoRA scaling
    lora_dropout=0.05,        # Dropout probability for LoRA layers
    bias="none",              # Bias type
    task_type="CAUSAL_LM",    # Task type
    target_modules=[          # Modules to apply LoRA to
        "q_proj", 
        "k_proj", 
        "v_proj", 
        "o_proj",
        "gate_proj", 
        "up_proj", 
        "down_proj"
    ]
)
```

#### 1.3.4 Training Hyperparameters

```python
training_arguments = TrainingArguments(
    output_dir="./lora-alpaca",
    num_train_epochs=3,
    per_device_train_batch_size=4,      # Adjust based on GPU memory
    gradient_accumulation_steps=8,      # Effective batch size = 32
    learning_rate=2e-4,
    weight_decay=0.001,
    warmup_ratio=0.03,
    max_grad_norm=0.3,
    logging_steps=10,
    save_strategy="steps",
    save_steps=100,
    evaluation_strategy="steps",
    eval_steps=100,
    fp16=True,                          # Mixed precision training
    bf16=False,                         # If using A100, set to True
    optim="paged_adamw_32bit",
    lr_scheduler_type="cosine",
    max_steps=-1,                       # -1 means train for full num_epochs
    group_by_length=True,               # More efficient training
)
```

#### 1.3.5 Fine-tuning Script

```python
def prepare_fine_tuning():
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf", use_fast=True)
    model = AutoModelForCausalLM.from_pretrained(
        "meta-llama/Llama-2-7b-hf",
        load_in_8bit=True,
        torch_dtype=torch.float16,
        device_map="auto",
    )
    
    # Add padding token
    tokenizer.pad_token = tokenizer.eos_token
    
    # Prepare model for LoRA training
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, lora_config)
    
    # Load dataset
    dataset = load_dataset("json", data_files="ges_training_data.json")
    
    # Format dataset
    formatted_dataset = format_instruction_dataset(dataset, tokenizer)
    
    # Create trainer
    trainer = Trainer(
        model=model,
        train_dataset=formatted_dataset["train"],
        eval_dataset=formatted_dataset["validation"],
        args=training_arguments,
        data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
    )
    
    # Train the model
    trainer.train()
    
    # Save the model
    model.save_pretrained("./ges-llama-lora")
    tokenizer.save_pretrained("./ges-llama-lora")
```

### 1.4 Model Merging and Export

#### 1.4.1 Merging LoRA Weights

```python
def merge_lora_weights():
    # Load base model
    base_model = AutoModelForCausalLM.from_pretrained(
        "meta-llama/Llama-2-7b-hf",
        torch_dtype=torch.float16,
        device_map="auto",
    )
    
    # Load LoRA model
    lora_model = PeftModel.from_pretrained(
        base_model, 
        "./ges-llama-lora",
        device_map="auto",
    )
    
    # Merge weights
    merged_model = lora_model.merge_and_unload()
    
    # Save merged model
    merged_model.save_pretrained("./ges-llama-merged")
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")
    tokenizer.save_pretrained("./ges-llama-merged")
    
    return "./ges-llama-merged"
```

#### 1.4.2 Creating GGUF Model from Merged Weights

```bash
# Convert merged model to GGUF format
python ./llama.cpp/convert.py ges-llama-merged/ --outtype f16 --outfile ges-llama.fp16.bin

# Quantize to Q5_K_M format
./llama.cpp/quantize ges-llama.fp16.bin ges-llama.q5_k_m.gguf q5_k_m
```

### 1.5 Model Performance Validation

#### 1.5.1 Evaluation Metrics

- **Perplexity**: Target < 4.0 on GES content
- **ROUGE-L**: > 0.6 for content generation
- **BLEU**: > 0.4 for content generation
- **Domain-Specific Accuracy**: > 85% on educational content evaluation
- **Hallucination Rate**: < 5% factual error rate on GES content

#### 1.5.2 Performance Evaluation Script

```python
def evaluate_model_performance(model_path, test_data_path):
    # Load model
    model = AutoModelForCausalLM.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    
    # Load test data
    with open(test_data_path, 'r') as f:
        test_data = json.load(f)
    
    # Evaluation results
    results = {
        'perplexity': 0,
        'rouge_l': 0,
        'bleu': 0,
        'accuracy': 0,
        'hallucination_rate': 0
    }
    
    # Implement evaluation logic
    # ...
    
    return results
```

#### 1.5.3 Automated Testing

- Script to run inference on 100 test prompts
- Compare against reference answers
- Generate confusion matrix for factual accuracy
- Log detailed performance metrics

## 2. Syllabus Data Processing

### 2.1 Data Acquisition

#### 2.1.1 GES Syllabus Sources

- **Primary Sources**:
  - Ghana Education Service official curriculum documents
  - Ministry of Education approved textbooks
  - National Council for Curriculum and Assessment (NaCCA) materials
  - West African Examinations Council (WAEC) syllabi

- **Secondary Sources**:
  - Recommended teaching guides
  - Educational institution curriculum adaptations
  - Subject-specific workbooks and student guides

#### 2.1.2 Collection Methodology

1. **Digital Document Acquisition**:
   - Official website scraping with permission
   - Direct request to education authorities
   - Purchase of digital versions where available
   - Scanning of physical documents with OCR processing

2. **Document Format Standardization**:
   - Convert all materials to text-based PDF
   - Apply OCR for image-based documents
   - Manual correction of OCR errors
   - Verification against original source

3. **Legal Compliance**:
   - Document source attribution
   - Copyright clearance for educational use
   - Obtain written permission for curriculum adaptation
   - Compliance with Ghana copyright laws for educational content

### 2.2 Data Extraction and Preprocessing

#### 2.2.1 Text Extraction Pipeline

```python
def extract_syllabus_content(document_path, document_type):
    """Extract text content from syllabus documents of various formats."""
    
    if document_type == 'pdf':
        # Extract text from PDF using PyPDF2
        text = extract_from_pdf(document_path)
    elif document_type == 'docx':
        # Extract text from DOCX using python-docx
        text = extract_from_docx(document_path)
    elif document_type == 'html':
        # Extract text from HTML using BeautifulSoup
        text = extract_from_html(document_path)
    elif document_type == 'image':
        # Extract text from images using Tesseract OCR
        text = extract_from_image(document_path)
    
    # Preprocessing steps
    text = remove_headers_footers(text)
    text = standardize_whitespace(text)
    text = fix_common_ocr_errors(text)
    
    return text
```

#### 2.2.2 Document Structure Parsing

```python
def parse_document_structure(extracted_text):
    """Parse the structure of a syllabus document to identify sections."""
    
    # Identify education level and subject
    education_level = identify_education_level(extracted_text)
    subject = identify_subject(extracted_text)
    
    # Extract topics and subtopics using regex patterns
    topics = extract_topics(extracted_text)
    
    structured_content = {
        'education_level': education_level,
        'subject': subject,
        'topics': topics
    }
    
    return structured_content
```

#### 2.2.3 Content Classification and Tagging

1. **Automatic Classification**:
   - **Education Level**: Primary, Junior High, Senior High
   - **Subject Category**: Science, Mathematics, Languages, Social Studies, etc.
   - **Topic Type**: Concept, Procedure, Historical fact, Formula, etc.
   - **Difficulty Level**: Basic, Intermediate, Advanced

2. **Metadata Tagging Schema**:
   ```json
   {
     "meta": {
       "education_level": "junior_high",
       "grade": "JHS2",
       "subject": "mathematics",
       "topic_id": "math_jhs2_7",
       "difficulty": 2,
       "prerequisites": ["math_jhs2_3", "math_jhs2_5"],
       "learning_outcomes": ["Calculate area of triangles", "Apply Pythagoras theorem"],
       "estimated_time_minutes": 45
     }
   }
   ```

3. **Content Types and Tags**:
   - `#definition` - Conceptual definitions
   - `#example` - Illustrative examples
   - `#procedure` - Step-by-step processes
   - `#assessment` - Questions and exercises
   - `#context` - Real-world applications
   - `#visual` - Content requiring visualization

### 2.3 Syllabus Database Schema

#### 2.3.1 Database Architecture

- **Database Engine**: SQLite 3.36+
- **Storage Format**: Single file database for portability
- **Indexing**: B-tree indexes on frequently queried fields
- **Backup Strategy**: Auto-backup on each modification with version history

#### 2.3.2 Schema Design

```sql
-- Education Levels
CREATE TABLE education_levels (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    age_range TEXT,
    description TEXT
);

-- Subjects
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    level_id INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (level_id) REFERENCES education_levels(id)
);

-- Topics
CREATE TABLE topics (
    id INTEGER PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    learning_objectives TEXT,
    prerequisites TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Subtopics
CREATE TABLE subtopics (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content_summary TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Content
CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    subtopic_id INTEGER NOT NULL,
    content_type TEXT NOT NULL,
    content_text TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    metadata JSON,
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id)
);

-- Content Types: definitions, explanations, examples, exercises, assessments
```

#### 2.3.3 Data Access Patterns

```python
def get_topic_content(db_path, subject_code, topic_code):
    """Retrieve complete topic content with all related subtopics and content elements."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    query = """
    SELECT 
        t.id as topic_id, 
        t.name as topic_name,
        t.learning_objectives,
        st.id as subtopic_id,
        st.name as subtopic_name,
        st.order_index,
        c.content_type,
        c.content_text,
        c.metadata
    FROM topics t
    JOIN subjects s ON t.subject_id = s.id
    JOIN subtopics st ON st.topic_id = t.id
    JOIN content c ON c.subtopic_id = st.id
    WHERE s.code = ? AND t.code = ?
    ORDER BY st.order_index, c.content_type
    """
    
    results = conn.execute(query, (subject_code, topic_code)).fetchall()
    conn.close()
    
    # Format results into a structured response
    # ...
    
    return structured_content
```

### 2.4 Data Quality and Validation

#### 2.4.1 Automated Data Validation

```python
def validate_syllabus_data(db_path):
    """Run automated validation checks on syllabus database."""
    
    validation_results = {
        'missing_data': [],
        'inconsistencies': [],
        'relationship_errors': [],
        'content_issues': []
    }
    
    conn = sqlite3.connect(db_path)
    
    # Check for missing required data
    missing_checks = [
        "SELECT id FROM topics WHERE learning_objectives IS NULL OR learning_objectives = ''",
        "SELECT id FROM content WHERE content_text IS NULL OR content_text = ''"
    ]
    
    # Check for inconsistencies
    consistency_checks = [
        "SELECT t1.id FROM topics t1 JOIN topics t2 ON t1.subject_id = t2.subject_id AND t1.order_index = t2.order_index WHERE t1.id != t2.id"
    ]
    
    # Check referential integrity
    relationship_checks = [
        "SELECT id FROM subtopics WHERE topic_id NOT IN (SELECT id FROM topics)"
    ]
    
    # Run checks and populate validation_results
    # ...
    
    conn.close()
    return validation_results
```

#### 2.4.2 Expert Review Process

1. **Review Panel Composition**:
   - Subject matter experts for each discipline
   - Educational curriculum specialists
   - Ghanaian education system representatives
   - Pedagogical experts

2. **Review Workflow**:
   - Initial automated validation
   - Individual expert review with annotation
   - Group consensus evaluation
   - Revision implementation
   - Final verification

3. **Quality Criteria**:
   - Content accuracy rating (1-5 scale)
   - Alignment with official curriculum (1-5 scale)
   - Age-appropriateness assessment
   - Cultural relevance verification
   - Pedagogical effectiveness evaluation

#### 2.4.3 Content Enhancement

1. **Contextual Enrichment**:
   - Add Ghana-specific examples and contexts
   - Include culturally relevant references
   - Update content with modern applications

2. **Pedagogical Adaptation**:
   - Convert text-heavy content to dialogic format
   - Add scaffolded learning elements
   - Create spaced repetition opportunities
   - Implement formative assessment points

3. **Content Gap Analysis**:
   ```python
   def identify_content_gaps(db_path):
       """Identify topics with insufficient content coverage."""
       conn = sqlite3.connect(db_path)
       
       queries = [
           "SELECT t.id, t.name FROM topics t LEFT JOIN subtopics s ON t.id = s.topic_id GROUP BY t.id HAVING COUNT(s.id) < 3",
           "SELECT st.id, st.name FROM subtopics st LEFT JOIN content c ON st.id = c.subtopic_id WHERE c.content_type = 'example' GROUP BY st.id HAVING COUNT(c.id) < 2"
       ]
       
       # Execute queries and process results
       # ...
       
       conn.close()
       return gap_analysis
   ```

### 2.5 Data Versioning and Management

#### 2.5.1 Versioning Schema

- **Syllabus Version Format**: `YYYY.TERM.REVISION` (e.g., 2023.1.3)
- **Change Tracking Fields**:
  - `created_at`: Timestamp of initial creation
  - `updated_at`: Timestamp of last modification
  - `created_by`: User identifier of creator
  - `updated_by`: User identifier of last modifier
  - `version`: Version string following schema
  - `change_log`: JSON array of changes

#### 2.5.2 Dataset Export and Backup

```python
def export_syllabus_snapshot(db_path, export_format='json'):
    """Export the complete syllabus database to various formats."""
    
    if export_format == 'json':
        export_to_json(db_path, "syllabus_export_" + datetime.now().strftime("%Y%m%d") + ".json")
    elif export_format == 'csv':
        export_to_csv(db_path, "syllabus_export_" + datetime.now().strftime("%Y%m%d"))
    elif export_format == 'sql':
        export_to_sql(db_path, "syllabus_export_" + datetime.now().strftime("%Y%m%d") + ".sql")
    
    # Create backup copy of SQLite database
    shutil.copy2(db_path, db_path + "." + datetime.now().strftime("%Y%m%d"))
```

#### 2.5.3 Update Mechanism

1. **Incremental Update Process**:
   - Identify changes from official curriculum
   - Generate differential update package
   - Apply changes with transaction safety
   - Maintain content relationship integrity
   - Version control all modifications

2. **Update Package Format**:
   ```json
   {
     "version": "2023.2.1",
     "base_version": "2023.1.0",
     "changes": [
       {
         "operation": "UPDATE",
         "table": "topics",
         "identifier": {"code": "math_jhs2_7"},
         "fields": {
           "learning_objectives": "Updated objectives with additional standards"
         }
       },
       {
         "operation": "INSERT",
         "table": "content",
         "fields": {
           "subtopic_id": 156,
           "content_type": "example",
           "content_text": "New example content..."
         }
       }
     ]
   }
   ```

## 3. System Architecture Implementation

### 3.1 Component Architecture

#### 3.1.1 Core Components Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SuguruAI Application                           │
├───────────┬───────────────────────────────────┬───────────────────┬─┤
│           │                                   │                   │ │
│  ┌────────▼──────────┐     ┌─────────────────▼─────┐  ┌──────────▼─▼────────┐
│  │                   │     │                       │  │                      │
│  │  UI Layer         │     │  Application Layer    │  │  Data Layer          │
│  │  (Streamlit)      │     │  (Python)            │  │  (SQLite)             │
│  │                   │     │                       │  │                      │
│  └────────┬──────────┘     └─────────────────┬─────┘  └──────────┬──────────┘
│           │                                   │                   │           │
│           └───────────────┬───────────────────┘                   │           │
│                           │                                       │           │
│                   ┌───────▼───────┐                               │           │
│                   │               │                               │           │
│                   │  LLM Engine   ◄───────────────────────────────┘           │
│                   │  (llama.cpp)  │                                           │
│                   │               │                                           │
│                   └───────────────┘                                           │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

#### 3.1.2 Component Responsibilities

| Component | Responsibility | Key Technologies |
|-----------|----------------|------------------|
| UI Layer | User interaction, content presentation, navigation | Streamlit, HTML/CSS, JavaScript |
| Application Layer | Business logic, session management, content orchestration | Python, FastAPI, asyncio |
| Data Layer | Data storage, query processing, caching | SQLite, JSON, Python ORM |
| LLM Engine | Model inference, content generation, answer evaluation | llama.cpp, GGUF, Python bindings |

#### 3.1.3 Inter-Component Communication

```python
# High-level communication flow between components
class SuguruAI:
    def __init__(self, config_path):
        # Initialize all components
        self.config = self._load_config(config_path)
        self.data_layer = DataLayer(self.config["database"])
        self.llm_engine = LLMEngine(self.config["model"])
        self.application_layer = ApplicationLayer(self.data_layer, self.llm_engine)
        self.ui_layer = UILayer(self.application_layer)
        
    def start(self):
        # Start the application
        self.ui_layer.run()
        
    def _load_config(self, config_path):
        with open(config_path, 'r') as f:
            return json.load(f)
```

### 3.2 Application Layer Implementation

#### 3.2.1 Core Services

```python
class ApplicationLayer:
    def __init__(self, data_layer, llm_engine):
        self.data_layer = data_layer
        self.llm_engine = llm_engine
        self.session_manager = SessionManager()
        self.content_service = ContentService(data_layer, llm_engine)
        self.assessment_service = AssessmentService(data_layer, llm_engine)
        self.progress_tracker = ProgressTracker(data_layer)
        
    def get_subject_list(self, education_level):
        """Get all subjects for a specific education level."""
        return self.data_layer.get_subjects(education_level)
    
    def get_topic_content(self, subject_id, topic_id, user_id=None):
        """Get content for a specific topic, with optional personalization."""
        # Fetch base content
        content = self.content_service.get_topic_content(subject_id, topic_id)
        
        # Track progress if user is identified
        if user_id:
            self.progress_tracker.record_topic_access(user_id, topic_id)
            
        return content
    
    def generate_content(self, topic_id, content_type, difficulty=1):
        """Generate additional content for a topic."""
        topic_data = self.data_layer.get_topic_metadata(topic_id)
        return self.content_service.generate_content(topic_data, content_type, difficulty)
    
    def evaluate_answer(self, question, user_answer, reference_answer=None):
        """Evaluate a user's answer to a question."""
        return self.assessment_service.evaluate_answer(question, user_answer, reference_answer)
```

#### 3.2.2 Session Management

```python
class SessionManager:
    def __init__(self):
        self.sessions = {}
        
    def create_session(self, user_id=None):
        """Create a new session for a user or anonymous user."""
        session_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        session = {
            "session_id": session_id,
            "user_id": user_id,
            "created_at": timestamp,
            "last_active": timestamp,
            "state": {
                "current_subject": None,
                "current_topic": None,
                "current_section": 0,
                "history": []
            }
        }
        
        self.sessions[session_id] = session
        return session_id
    
    def get_session(self, session_id):
        """Get session data for a specific session ID."""
        return self.sessions.get(session_id)
    
    def update_session(self, session_id, state_updates):
        """Update the state of a session."""
        if session_id in self.sessions:
            self.sessions[session_id]["last_active"] = datetime.now().isoformat()
            self.sessions[session_id]["state"].update(state_updates)
            return True
        return False
    
    def end_session(self, session_id):
        """End and archive a session."""
        if session_id in self.sessions:
            session = self.sessions.pop(session_id)
            # Archive session data if needed
            return session
        return None
```

#### 3.2.3 Content Service

```python
class ContentService:
    def __init__(self, data_layer, llm_engine):
        self.data_layer = data_layer
        self.llm_engine = llm_engine
        self.cache = ContentCache()
        
    def get_topic_content(self, subject_id, topic_id):
        """Get complete content for a topic."""
        # Check cache first
        cache_key = f"topic_{subject_id}_{topic_id}"
        cached_content = self.cache.get(cache_key)
        if cached_content:
            return cached_content
        
        # Fetch from database
        content = self.data_layer.get_topic_content(subject_id, topic_id)
        
        # Cache for future use
        self.cache.set(cache_key, content)
        
        return content
    
    def generate_content(self, topic_data, content_type, difficulty=1):
        """Generate new content for a topic using LLM."""
        # Create prompt based on topic data and content type
        prompt = self._create_generation_prompt(topic_data, content_type, difficulty)
        
        # Generate content using LLM
        generated_content = self.llm_engine.generate_content(prompt)
        
        # Post-process and format the generated content
        formatted_content = self._format_generated_content(generated_content, content_type)
        
        return formatted_content
    
    def _create_generation_prompt(self, topic_data, content_type, difficulty):
        """Create a prompt for content generation."""
        # Implementation depends on content type
        # ...
        
    def _format_generated_content(self, content, content_type):
        """Format and structure generated content."""
        # Implementation depends on content type
        # ...
```

#### 3.2.4 Assessment Service

```python
class AssessmentService:
    def __init__(self, data_layer, llm_engine):
        self.data_layer = data_layer
        self.llm_engine = llm_engine
        
    def generate_assessment(self, topic_id, difficulty=1, num_questions=5):
        """Generate an assessment for a topic."""
        # Get topic data
        topic_data = self.data_layer.get_topic_metadata(topic_id)
        
        # Generate questions
        questions = []
        for i in range(num_questions):
            question = self.generate_question(topic_data, difficulty)
            questions.append(question)
            
        return {
            "topic_id": topic_id,
            "difficulty": difficulty,
            "questions": questions
        }
    
    def generate_question(self, topic_data, difficulty):
        """Generate a single question based on topic data."""
        # Create prompt for question generation
        prompt = self._create_question_prompt(topic_data, difficulty)
        
        # Generate question using LLM
        response = self.llm_engine.generate_content(prompt)
        
        # Parse the response to extract question, options, and answer
        parsed_question = self._parse_question_response(response)
        
        return parsed_question
    
    def evaluate_answer(self, question, student_answer, reference_answer=None):
        """Evaluate a user's answer to a question."""
        if reference_answer:
            # Use reference answer for evaluation
            prompt = self._create_evaluation_prompt(question, student_answer, reference_answer)
        else:
            # Generate evaluation without reference answer
            prompt = self._create_evaluation_prompt(question, student_answer)
            
        # Generate evaluation using LLM
        evaluation = self.llm_engine.generate_content(prompt)
        
        # Parse evaluation response
        parsed_evaluation = self._parse_evaluation_response(evaluation)
        
        return parsed_evaluation
    
    def _create_question_prompt(self, topic_data, difficulty):
        """Create a prompt for question generation."""
        # Implementation details
        # ...
        
    def _parse_question_response(self, response):
        """Parse the LLM response to extract structured question data."""
        # Implementation details
        # ...
        
    def _create_evaluation_prompt(self, question, student_answer, reference_answer=None):
        """Create a prompt for answer evaluation."""
        # Implementation details
        # ...
        
    def _parse_evaluation_response(self, response):
        """Parse the LLM evaluation response."""
        # Implementation details
        # ...
```

### 3.3 LLM Engine Implementation

#### 3.3.1 Model Integration

```python
class LLMEngine:
    def __init__(self, config):
        """Initialize the LLM engine with configuration."""
        self.config = config
        self.model_path = config.get("model_path")
        self.model_type = config.get("model_type", "llama")
        self.context_length = config.get("context_length", 4096)
        self.temperature = config.get("temperature", 0.7)
        self.top_p = config.get("top_p", 0.9)
        self.model = None
        
        # Load the model
        self._load_model()
        
    def _load_model(self):
        """Load the Llama model using llama.cpp Python bindings."""
        from llama_cpp import Llama
        
        try:
            self.model = Llama(
                model_path=self.model_path,
                n_ctx=self.context_length,
                n_batch=self.config.get("batch_size", 512),
                n_gpu_layers=self.config.get("gpu_layers", 0),
                seed=self.config.get("seed", -1)
            )
            print(f"Model loaded: {self.model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def generate_content(self, prompt, max_tokens=512, temp=None, top_p=None):
        """Generate content based on a prompt."""
        if not self.model:
            raise RuntimeError("Model not loaded")
            
        # Use provided parameters or defaults
        temperature = temp if temp is not None else self.temperature
        top_p_value = top_p if top_p is not None else self.top_p
        
        # Generate response
        response = self.model(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p_value,
            stop=self.config.get("stop_tokens", [])
        )
        
        # Extract and return generated text
        if isinstance(response, dict) and "choices" in response:
            return response["choices"][0]["text"]
        
        return response
        
    def tokenize(self, text):
        """Tokenize text using the model's tokenizer."""
        if not self.model:
            raise RuntimeError("Model not loaded")
        
        return self.model.tokenize(text.encode())
        
    def get_model_info(self):
        """Get information about the loaded model."""
        if not self.model:
            return {"status": "not_loaded"}
            
        return {
            "status": "loaded",
            "model_path": self.model_path,
            "model_type": self.model_type,
            "context_length": self.context_length
        }
```

#### 3.3.2 Prompt Engineering System

```python
class PromptLibrary:
    """Library of prompt templates for various educational tasks."""
    
    def __init__(self):
        self.templates = self._load_templates()
        
    def _load_templates(self):
        """Load prompt templates from configuration."""
        # Default templates
        templates = {
            "explanation": self._explanation_template,
            "example": self._example_template,
            "assessment": self._assessment_template,
            "evaluation": self._evaluation_template,
            "summary": self._summary_template
        }
        
        # Load custom templates if available
        # ...
        
        return templates
        
    def get_prompt(self, template_name, **kwargs):
        """Get a formatted prompt by template name with variable substitution."""
        if template_name not in self.templates:
            raise ValueError(f"Unknown template: {template_name}")
            
        template_func = self.templates[template_name]
        return template_func(**kwargs)
        
    def _explanation_template(self, topic, grade_level, complexity="medium"):
        """Template for generating educational explanations."""
        return f"""You are a highly qualified teacher explaining a concept to a student in {grade_level}.
        
Topic: {topic}

Provide a clear and engaging explanation of this topic appropriate for students in {grade_level}. 
The explanation should be at a {complexity} complexity level.
Use simple language and relate to everyday examples where possible.
Structure your explanation with a clear introduction, main points, and conclusion.
"""
        
    def _example_template(self, topic, grade_level, num_examples=2):
        """Template for generating educational examples."""
        return f"""You are a highly qualified teacher providing examples for students in {grade_level}.
        
Topic: {topic}

Provide {num_examples} clear and illustrative examples related to this topic, appropriate for students in {grade_level}.
Each example should:
1. Be realistic and relevant to students' lives in Ghana
2. Clearly demonstrate the concept in action
3. Include step-by-step explanations where appropriate
4. Be culturally relevant to Ghanaian students
"""
        
    def _assessment_template(self, topic, grade_level, difficulty="medium", question_type="multiple_choice"):
        """Template for generating assessment questions."""
        # Template implementation
        # ...
        
    def _evaluation_template(self, question, student_answer, reference_answer=None):
        """Template for evaluating student answers."""
        # Template implementation
        # ...
        
    def _summary_template(self, topic, grade_level):
        """Template for generating topic summaries."""
        # Template implementation
        # ...
```

#### 3.3.3 Context Window Management

```python
class ContextManager:
    """Manages the context window for LLM interactions."""
    
    def __init__(self, max_tokens=4096, reserved_tokens=256):
        self.max_tokens = max_tokens
        self.reserved_tokens = reserved_tokens  # Reserved for response
        self.available_tokens = max_tokens - reserved_tokens
        
    def fit_to_context(self, system_prompt, user_prompt, relevant_context):
        """Fit all components into the available context window."""
        # Estimate token counts (simple approximation)
        system_tokens = self._estimate_tokens(system_prompt)
        user_tokens = self._estimate_tokens(user_prompt)
        
        # Calculate remaining space for context
        remaining_tokens = self.available_tokens - system_tokens - user_tokens
        
        if remaining_tokens <= 0:
            # Not enough space, need to trim user prompt
            user_prompt = self._trim_text(user_prompt, self.available_tokens - system_tokens)
            trimmed_context = ""
        else:
            # Trim context to fit remaining tokens
            trimmed_context = self._trim_text(relevant_context, remaining_tokens)
            
        # Assemble final prompt
        final_prompt = f"{system_prompt}\n\nRelevant Information:\n{trimmed_context}\n\nUser Query: {user_prompt}"
        
        return final_prompt
        
    def _estimate_tokens(self, text):
        """Estimate the number of tokens in a text (simple approximation)."""
        # Using a simple approximation of 4 chars per token for English text
        return len(text) // 4
        
    def _trim_text(self, text, max_tokens):
        """Trim text to fit within max_tokens (simple approximation)."""
        # Simple approximation
        approx_chars = max_tokens * 4
        if len(text) <= approx_chars:
            return text
        
        # Trim to the nearest sentence boundary
        trimmed = text[:approx_chars]
        last_period = trimmed.rfind('.')
        if last_period > 0:
            return trimmed[:last_period + 1]
        
        return trimmed
```

### 3.4 Data Layer Implementation

#### 3.4.1 Database Access

```python
class DataLayer:
    """Data access layer for SuguruAI."""
    
    def __init__(self, config):
        """Initialize the data layer with configuration."""
        self.db_path = config.get("database_path", "data/suguruai.db")
        self.connection = None
        self.connect()
        
    def connect(self):
        """Establish database connection."""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row
            print(f"Connected to database: {self.db_path}")
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            raise
            
    def close(self):
        """Close database connection."""
        if self.connection:
            self.connection.close()
            
    def get_education_levels(self):
        """Get all education levels."""
        query = "SELECT id, name, code, age_range FROM education_levels ORDER BY id"
        return self._execute_query(query)
        
    def get_subjects(self, education_level_id):
        """Get all subjects for a specific education level."""
        query = """
        SELECT id, name, code, description 
        FROM subjects 
        WHERE level_id = ? 
        ORDER BY name
        """
        return self._execute_query(query, (education_level_id,))
        
    def get_topics(self, subject_id):
        """Get all topics for a specific subject."""
        query = """
        SELECT id, name, code, order_index, learning_objectives 
        FROM topics 
        WHERE subject_id = ? 
        ORDER BY order_index
        """
        return self._execute_query(query, (subject_id,))
        
    def get_topic_content(self, subject_id, topic_id):
        """Get complete content for a topic."""
        # Implementation from earlier section
        # ...
        
    def get_topic_metadata(self, topic_id):
        """Get metadata for a specific topic."""
        query = """
        SELECT t.id, t.name, t.learning_objectives, 
               s.name as subject_name, s.code as subject_code,
               el.name as level_name, el.code as level_code
        FROM topics t
        JOIN subjects s ON t.subject_id = s.id
        JOIN education_levels el ON s.level_id = el.id
        WHERE t.id = ?
        """
        result = self._execute_query(query, (topic_id,), fetchone=True)
        return dict(result) if result else None
        
    def _execute_query(self, query, params=None, fetchone=False):
        """Execute a database query with optional parameters."""
        if not self.connection:
            self.connect()
            
        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            if fetchone:
                return cursor.fetchone()
            else:
                return cursor.fetchall()
        except sqlite3.Error as e:
            print(f"Database query error: {e}")
            print(f"Query: {query}")
            print(f"Params: {params}")
            return None
```

#### 3.4.2 Caching System

```python
class ContentCache:
    """Cache for frequently accessed content."""
    
    def __init__(self, max_size=100, ttl=3600):
        """Initialize the cache with maximum size and TTL (time to live)."""
        self.max_size = max_size
        self.ttl = ttl  # Seconds
        self.cache = {}
        self.timestamps = {}
        self.access_counts = {}
        
    def get(self, key):
        """Get a value from the cache if it exists and is not expired."""
        if key not in self.cache:
            return None
            
        # Check if the entry has expired
        if time.time() - self.timestamps[key] > self.ttl:
            self._remove(key)
            return None
            
        # Update access count and timestamp
        self.access_counts[key] += 1
        
        return self.cache[key]
        
    def set(self, key, value):
        """Set a value in the cache."""
        # Evict least recently used item if cache is full
        if len(self.cache) >= self.max_size and key not in self.cache:
            self._evict_lru()
            
        self.cache[key] = value
        self.timestamps[key] = time.time()
        self.access_counts[key] = 1
        
    def clear(self):
        """Clear the entire cache."""
        self.cache.clear()
        self.timestamps.clear()
        self.access_counts.clear()
        
    def _remove(self, key):
        """Remove an item from the cache."""
        if key in self.cache:
            del self.cache[key]
            del self.timestamps[key]
            del self.access_counts[key]
            
    def _evict_lru(self):
        """Evict the least recently used item from the cache."""
        if not self.cache:
            return
            
        # Find the least accessed item
        min_key = min(self.access_counts.items(), key=lambda x: x[1])[0]
        self._remove(min_key)
```

### 3.5 Integration Testing

#### 3.5.1 Component Integration Tests

```python
def test_component_integration():
    """Test the integration between major components."""
    # Configuration for testing
    test_config = {
        "database": {
            "database_path": "test_data/test.db"
        },
        "model": {
            "model_path": "test_data/test_model.gguf",
            "model_type": "llama"
        }
    }
    
    # Initialize components
    data_layer = DataLayer(test_config["database"])
    llm_engine = MockLLMEngine(test_config["model"])  # Use mock for testing
    app_layer = ApplicationLayer(data_layer, llm_engine)
    
    # Test subject retrieval
    subjects = app_layer.get_subject_list(1)  # Education level 1
    assert len(subjects) > 0, "Should retrieve at least one subject"
    
    # Test topic content retrieval
    topic_content = app_layer.get_topic_content(subjects[0]["id"], 1)
    assert topic_content, "Should retrieve topic content"
    
    # Test content generation
    generated_content = app_layer.generate_content(1, "explanation")
    assert generated_content, "Should generate content"
    
    # Test answer evaluation
    evaluation = app_layer.evaluate_answer(
        "What is photosynthesis?",
        "It's the process where plants make food using sunlight."
    )
    assert "score" in evaluation, "Evaluation should contain a score"
    
    print("Component integration tests passed!")
```

#### 3.5.2 End-to-End Workflow Tests

```python
def test_learning_workflow():
    """Test the complete learning workflow."""
    # Configure test environment
    # ...
    
    # 1. User selects education level
    education_levels = data_layer.get_education_levels()
    selected_level = education_levels[0]
    
    # 2. User selects subject
    subjects = data_layer.get_subjects(selected_level["id"])
    selected_subject = subjects[0]
    
    # 3. User selects topic
    topics = data_layer.get_topics(selected_subject["id"])
    selected_topic = topics[0]
    
    # 4. System displays topic content
    content = app_layer.get_topic_content(selected_subject["id"], selected_topic["id"])
    assert "subtopics" in content, "Content should contain subtopics"
    
    # 5. User navigates through content sections
    for subtopic in content["subtopics"]:
        # Check each subtopic has required elements
        assert "content" in subtopic, "Subtopic should have content"
        assert "examples" in subtopic, "Subtopic should have examples"
        assert "exercises" in subtopic, "Subtopic should have exercises"
    
    # 6. User takes assessment
    assessment = app_layer.assessment_service.generate_assessment(selected_topic["id"])
    assert "questions" in assessment, "Assessment should contain questions"
    
    # 7. User submits answers and gets evaluation
    for question in assessment["questions"]:
        # Simulate user answer
        user_answer = "Test answer for simulation"
        
        # Evaluate answer
        evaluation = app_layer.assessment_service.evaluate_answer(
            question["text"], user_answer
        )
        
        # Verify evaluation structure
        assert "score" in evaluation, "Evaluation should contain a score"
        assert "feedback" in evaluation, "Evaluation should contain feedback"
    
    # 8. System records progress
    progress = app_layer.progress_tracker.get_user_progress("test_user")
    assert selected_topic["id"] in [p["topic_id"] for p in progress], "Progress should be recorded"
    
    print("End-to-end learning workflow test passed!")
```

## 4. UI Development

### 4.1 Streamlit Application Structure

#### 4.1.1 Application Organization

```
app/
├── main.py                 # Main application entry point
├── pages/                  # Streamlit multipage app structure
│   ├── 01_Home.py          # Home/landing page
│   ├── 02_Learning.py      # Main learning interface
│   ├── 03_Assessment.py    # Assessment interface
│   └── 04_Progress.py      # Progress tracking page
├── components/             # Reusable UI components
│   ├── navigation.py       # Navigation components
│   ├── content_viewer.py   # Content display components
│   ├── interactive.py      # Interactive elements
│   └── progress.py         # Progress visualization
├── utils/                  # Utility functions
│   ├── session.py          # Session state management
│   ├── formatting.py       # Content formatting
│   └── theming.py          # UI theming
└── static/                 # Static assets
    ├── css/                # Custom CSS styles
    └── images/             # Images and icons
```

#### 4.1.2 Main Application Entry Point

```python
# main.py
import streamlit as st
from utils.session import initialize_session
from utils.theming import apply_theme
import os
import sqlite3
import json

# Initialize configuration
def load_config():
    """Load application configuration."""
    config_path = os.path.join(os.path.dirname(__file__), "../config/app_config.json")
    with open(config_path, "r") as f:
        return json.load(f)

# Set page configuration and theme
def configure_page():
    """Configure Streamlit page settings."""
    st.set_page_config(
        page_title="SuguruAI - Educational Assistant",
        page_icon="📚",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    apply_theme()

# Initialize application
def main():
    # Load configuration
    config = load_config()
    
    # Configure page
    configure_page()
    
    # Initialize session state
    initialize_session()
    
    # Display application header
    st.title("SuguruAI - Ghana Educational System")
    st.markdown("*AI-powered educational assistant for the Ghana Educational System*")
    
    # Display welcome message on the main page
    st.markdown("""
    ## Welcome to SuguruAI
    
    SuguruAI is your personal educational assistant, designed to help you learn and understand concepts
    from the Ghana Educational System curriculum.
    
    ### Getting Started
    
    1. Select a subject from the sidebar
    2. Choose a topic to learn about
    3. Navigate through the content using the "Next" button
    4. Test your knowledge with assessments
    5. Track your progress
    
    Use the navigation menu on the left to explore different sections of the application.
    """)
    
    # Display footer
    st.markdown("---")
    st.markdown("SuguruAI - Powered by Llama 2")

if __name__ == "__main__":
    main()
```

### 4.2 Key UI Components

#### 4.2.1 Session State Management

```python
# utils/session.py
import streamlit as st
import uuid

def initialize_session():
    """Initialize session state variables."""
    if "initialized" not in st.session_state:
        st.session_state.initialized = True
        st.session_state.user_id = str(uuid.uuid4())
        st.session_state.current_education_level = None
        st.session_state.current_subject = None
        st.session_state.current_topic = None
        st.session_state.current_subtopic_index = 0
        st.session_state.show_exercises = False
        st.session_state.progress = {}
        st.session_state.assessment_results = {}
        st.session_state.dark_mode = False

def get_current_navigation_state():
    """Get the current navigation state as a dictionary."""
    return {
        "education_level": st.session_state.current_education_level,
        "subject": st.session_state.current_subject,
        "topic": st.session_state.current_topic,
        "subtopic_index": st.session_state.current_subtopic_index,
        "show_exercises": st.session_state.show_exercises
    }

def update_navigation_state(education_level=None, subject=None, topic=None, 
                           subtopic_index=None, show_exercises=None):
    """Update the navigation state with new values."""
    if education_level is not None:
        st.session_state.current_education_level = education_level
    if subject is not None:
        st.session_state.current_subject = subject
    if topic is not None:
        st.session_state.current_topic = topic
    if subtopic_index is not None:
        st.session_state.current_subtopic_index = subtopic_index
    if show_exercises is not None:
        st.session_state.show_exercises = show_exercises
```

#### 4.2.2 Content Display Component

```python
# components/content_viewer.py
import streamlit as st
from utils.formatting import format_content, format_examples, format_exercises

def display_content_section(content, show_exercises=False):
    """Display a content section with formatted text, examples, and exercises."""
    if not content:
        st.warning("No content available for this topic")
        return
    
    # Display main content
    st.markdown(f"## {content['title']}")
    
    # Format and display the main content text
    formatted_content = format_content(content['content_text'])
    st.markdown(
        f"""
        <div class="content-box">
            {formatted_content}
        </div>
        """,
        unsafe_allow_html=True
    )
    
    # Display examples or exercises based on the mode
    if not show_exercises:
        # Display examples
        st.markdown("### Examples")
        examples = format_examples(content['examples'])
        for i, example in enumerate(examples):
            st.markdown(
                f"""
                <div class="example-box">
                    <strong>Example {i+1}:</strong> {example}
                </div>
                """,
                unsafe_allow_html=True
            )
    else:
        # Display exercises
        st.markdown("### Exercises")
        exercises = format_exercises(content['exercises'])
        for i, exercise in enumerate(exercises):
            st.markdown(
                f"""
                <div class="exercise-box">
                    <strong>Exercise {i+1}:</strong> {exercise['question']}
                </div>
                """,
                unsafe_allow_html=True
            )
            
            # Create unique key for this exercise
            exercise_key = f"exercise_{content['id']}_{i}"
            
            # Input field for user's answer
            user_answer = st.text_area(
                f"Your answer for Exercise {i+1}:",
                key=exercise_key
            )
            
            # Submit button
            if st.button(f"Submit Answer {i+1}", key=f"submit_{exercise_key}"):
                feedback = evaluate_answer(exercise['question'], user_answer)
                
                st.markdown(
                    f"""
                    <div class="feedback-box">
                        <strong>Feedback:</strong> {feedback}
                    </div>
                    """,
                    unsafe_allow_html=True
                )

def display_navigation_controls(topic, current_index, show_exercises):
    """Display navigation controls for moving between content sections."""
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col1:
        # Previous button
        if current_index > 0 or show_exercises:
            if st.button("← Previous"):
                if show_exercises:
                    # Go back to content view
                    st.session_state.show_exercises = False
                else:
                    # Go to previous subtopic
                    st.session_state.current_subtopic_index = max(0, current_index - 1)
                    st.session_state.show_exercises = False
                st.rerun()
    
    with col3:
        # Next button
        if st.button("Next →"):
            if not show_exercises:
                # Show exercises for current subtopic
                st.session_state.show_exercises = True
            elif current_index < len(topic['subtopics']) - 1:
                # Go to next subtopic
                st.session_state.current_subtopic_index = current_index + 1
                st.session_state.show_exercises = False
            else:
                # Completed the topic
                st.session_state.topic_completed = True
            st.rerun()
    
    # Progress indicator
    progress_text = f"Subtopic {current_index + 1} of {len(topic['subtopics'])}"
    if show_exercises:
        progress_text += " (Exercises)"
    
    with col2:
        st.progress((current_index + (0.5 if show_exercises else 0)) / len(topic['subtopics']))
        st.text(progress_text)
```

### 4.3 Learning Interface Implementation

```python
# pages/02_Learning.py
import streamlit as st
from components.navigation import sidebar_navigation
from components.content_viewer import display_content_section, display_navigation_controls
from utils.session import get_current_navigation_state, update_navigation_state
import time

def load_topic_content(subject_id, topic_id):
    """Load content for a specific topic from the application layer."""
    # In a real implementation, this would call the application layer
    # For demonstration, we'll use mock data
    # ...
    return topic_content

def main():
    # Display sidebar navigation
    sidebar_navigation()
    
    # Get current navigation state
    nav_state = get_current_navigation_state()
    
    # Show content only if a topic is selected
    if nav_state["topic"]:
        # Load topic content
        topic_content = load_topic_content(
            nav_state["subject"]["id"], 
            nav_state["topic"]["id"]
        )
        
        # Display topic header
        st.title(topic_content["name"])
        st.markdown(f"*{topic_content['subject_name']} - {topic_content['level_name']}*")
        
        # Display learning objectives
        if "learning_objectives" in topic_content and topic_content["learning_objectives"]:
            with st.expander("Learning Objectives", expanded=False):
                for i, objective in enumerate(topic_content["learning_objectives"]):
                    st.markdown(f"- {objective}")
        
        # Get current subtopic
        current_index = nav_state["subtopic_index"]
        show_exercises = nav_state["show_exercises"]
        
        if current_index < len(topic_content["subtopics"]):
            current_subtopic = topic_content["subtopics"][current_index]
            
            # Display content section
            display_content_section(current_subtopic, show_exercises)
            
            # Display navigation controls
            display_navigation_controls(topic_content, current_index, show_exercises)
            
            # Record progress
            if not show_exercises:
                # Record that the user viewed this subtopic
                # This would update progress in the application layer
                pass
        else:
            st.success("🎉 Congratulations! You have completed this topic.")
            st.button("Start Assessment", on_click=lambda: st.switch_page("pages/03_Assessment.py"))
    else:
        # No topic selected
        st.info("👈 Please select a subject and topic from the sidebar")

if __name__ == "__main__":
    main()
```

### 4.4 UI Theming and Styling

#### 4.4.1 Custom CSS

```python
# utils/theming.py
import streamlit as st

def apply_theme():
    """Apply custom theming to the Streamlit application."""
    
    # Custom CSS for styling
    st.markdown("""
    <style>
    /* Main content styling */
    .main-header {
        font-size: 2.5rem;
        color: #1E88E5;
        text-align: center;
        margin-bottom: 1rem;
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
    
    /* Navigation styling */
    .stButton>button {
        width: 100%;
        border-radius: 5px;
        height: 3em;
        font-weight: bold;
    }
    
    /* Dark mode adjustments */
    .dark-mode .content-box {
        background-color: #2c3e50;
        color: #ecf0f1;
    }
    
    .dark-mode .example-box {
        background-color: #273746;
        color: #ecf0f1;
    }
    
    .dark-mode .exercise-box {
        background-color: #34495e;
        color: #ecf0f1;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Apply dark mode if enabled
    if st.session_state.get("dark_mode", False):
        st.markdown("""
        <style>
        .dark-mode-enabled {
            visibility: visible;
        }
        </style>
        """, unsafe_allow_html=True)
```

### 4.5 UI Performance Considerations

#### 4.5.1 Performance Optimization Techniques

1. **Lazy Loading**:
   - Load content only when needed
   - Implement pagination for large content sections
   - Use st.cache decorator for expensive operations

2. **Image Optimization**:
   - Compress all images
   - Use appropriate image formats
   - Lazy load images

3. **Component Reuse**:
   - Create reusable components to minimize code duplication
   - Use session state to maintain component state between reruns

4. **UI Responsiveness**:
   - Implement loading indicators for long-running operations
   - Use placeholders to show UI elements before data is available
   - Add feedback for user interactions

#### 4.5.2 Responsiveness Optimization Example

```python
def load_topic_content_with_loading(subject_id, topic_id):
    """Load topic content with a loading indicator."""
    with st.spinner("Loading content..."):
        # Placeholder for loading
        placeholder = st.empty()
        placeholder.text("Preparing your learning content...")
        
        # Actual content loading (potentially slow operation)
        content = load_topic_content(subject_id, topic_id)
        
        # Clear placeholder
        placeholder.empty()
        
        return content
```

### 4.6 UI Testing Plan

#### 4.6.1 Component-Level Testing

- **Test Individual Components**:
  - Verify content display with various content types
  - Test navigation controls through all possible paths
  - Validate form submission and feedback

#### 4.6.2 Integration Testing

- **Test Component Interactions**:
  - Verify state management between components
  - Test navigation flow between pages
  - Validate data flow from backend to UI

#### 4.6.3 User Experience Testing

- **Usability Testing**:
  - Conduct usability sessions with target users
  - Measure time on task for key operations
  - Gather feedback on UI intuitiveness

- **Compatibility Testing**:
  - Test on various screen sizes
  - Verify functionality across supported browsers
  - Test with screen readers for accessibility

#### 4.6.4 Automated UI Tests

```python
def test_ui_components():
    """Test UI components using Streamlit's testing utilities."""
    from streamlit.testing.v1 import AppTest
    
    # Test content display component
    at = AppTest.from_file("components/content_viewer.py")
    at.run()
    
    # Test with example content
    test_content = {
        "title": "Test Topic",
        "content_text": "This is test content",
        "examples": ["Example 1", "Example 2"],
        "exercises": [{"question": "Test question?", "answer": "Test answer"}]
    }
    
    # Verify content is displayed correctly
    assert "Test Topic" in at.get("title")
    assert "This is test content" in at.get("content")
    assert "Example 1" in at.get("examples")
    
    print("UI component tests passed!")
```

## 5. Content Generation Pipeline

### 5.1 Content Generation Strategy

#### 5.1.1 Generation Approaches

The content generation system uses three complementary approaches:

1. **Pre-generated Content**: 
   - Static content created during system development
   - Quality-controlled by education experts
   - Covers core curriculum material exactly as in GES syllabus
   - Stored directly in the database

2. **Runtime-Generated Content**: 
   - Created dynamically during user interaction
   - Uses LLM with syllabus context
   - Provides supplementary explanations and examples
   - Tailored to individual learning progress and needs

3. **Hybrid Approach**:
   - Pre-generated content as primary source
   - LLM-generated content for enrichment
   - Fallbacks to ensure content availability even with model issues

#### 5.1.2 Content Type Taxonomy

| Content Type | Description | Generation Approach |
|--------------|-------------|---------------------|
| Core Explanations | Primary educational concepts | Pre-generated (90%), Runtime (10%) |
| Examples | Illustrative examples of concepts | Pre-generated (60%), Runtime (40%) |
| Practice Exercises | Basic application questions | Pre-generated (80%), Runtime (20%) |
| Assessment Questions | Knowledge evaluation questions | Pre-generated (70%), Runtime (30%) |
| Feedback | Responses to student answers | Runtime-generated (100%) |
| Summaries | Concept and topic summaries | Runtime-generated (100%) |
| Enrichment | Additional context and applications | Runtime-generated (100%) |

### 5.2 Prompt Engineering

#### 5.2.1 Syllabus Context Injection

```python
def create_syllabus_context(topic_id, subtopic_id=None):
    """Create a context string from syllabus data for a specific topic/subtopic."""
    
    # Get topic data
    topic_data = database.get_topic_data(topic_id)
    
    # Start with topic metadata
    context = f"""
    Subject: {topic_data['subject_name']}
    Grade Level: {topic_data['grade_level']}
    Topic: {topic_data['name']}
    Learning Objectives: {', '.join(topic_data['learning_objectives'])}
    """
    
    # Add subtopic specifics if requested
    if subtopic_id:
        subtopic = database.get_subtopic_data(subtopic_id)
        context += f"""
        Subtopic: {subtopic['name']}
        Key Points: {', '.join(subtopic['key_points'])}
        """
    
    # Add related topics for context
    prerequisites = database.get_prerequisite_topics(topic_id)
    if prerequisites:
        context += "\nPrerequisite Topics:\n"
        for prereq in prerequisites:
            context += f"- {prereq['name']}: {prereq['summary']}\n"
    
    return context
```

#### 5.2.2 System Prompts by Content Type

1. **Explanation Generation**:
```
You are an expert educational content creator for the Ghana Educational System.
Your task is to create a clear, engaging explanation about "{topic}" for students in {grade_level}.

Use the following guidelines:
- Write at a level appropriate for {grade_level} students
- Use clear, simple language while maintaining accuracy
- Include real-world examples relevant to Ghanaian students
- Structure your explanation with a clear introduction, main points, and conclusion
- Keep your explanation focused on the learning objectives provided
- Use a friendly, encouraging tone

Learning Objectives: {learning_objectives}

Key Points to Cover:
{key_points}

Additional Context:
{syllabus_context}
```

2. **Example Generation**:
```
You are an expert educational content creator for the Ghana Educational System.
Your task is to create {num_examples} clear, engaging examples about "{topic}" for students in {grade_level}.

Guidelines for each example:
- Make examples concrete and specific
- Use contexts familiar to Ghanaian students
- Ensure examples clearly demonstrate the concept in action
- Progress from simpler to more complex examples
- Include step-by-step explanations where appropriate
- Use culturally relevant scenarios and names

Topic: {topic}
Key Concept: {key_concept}
```

3. **Exercise Generation**:
```
You are an expert educational content creator for the Ghana Educational System.
Your task is to create {num_exercises} practice exercises on "{topic}" for students in {grade_level}.

Guidelines for exercises:
- Create exercises that test understanding, not just recall
- Make exercises gradually increase in difficulty
- Ensure exercises align with learning objectives
- Include a mix of question types (application, analysis, etc.)
- Make questions clear and unambiguous
- Provide model answers for each exercise

Topic: {topic}
Learning Objectives: {learning_objectives}
```

### 5.3 Content Generation Implementation

#### 5.3.1 Generation Pipeline

```python
class ContentGenerator:
    """Content generation service for educational material."""
    
    def __init__(self, llm_engine, database, prompt_library):
        self.llm_engine = llm_engine
        self.database = database
        self.prompt_library = prompt_library
        self.cache = ContentCache()
        
    def generate_explanation(self, topic_id, subtopic_id=None, difficulty="medium"):
        """Generate an explanation for a topic or subtopic."""
        # Create a cache key
        cache_key = f"explanation_{topic_id}_{subtopic_id}_{difficulty}"
        
        # Check cache first
        cached_content = self.cache.get(cache_key)
        if cached_content:
            return cached_content
            
        # Get topic and syllabus data
        topic_data = self.database.get_topic_data(topic_id)
        syllabus_context = self.create_syllabus_context(topic_id, subtopic_id)
        
        # Create prompt
        prompt = self.prompt_library.get_prompt(
            "explanation",
            topic=topic_data["name"],
            grade_level=topic_data["grade_level"],
            learning_objectives=topic_data["learning_objectives"],
            key_points=topic_data.get("key_points", []),
            syllabus_context=syllabus_context,
            complexity=difficulty
        )
        
        # Generate content
        generated_text = self.llm_engine.generate_content(
            prompt=prompt,
            max_tokens=1024,
            temperature=0.7
        )
        
        # Post-process content
        processed_content = self.post_process_content(generated_text)
        
        # Cache the result
        self.cache.set(cache_key, processed_content)
        
        return processed_content
        
    def generate_examples(self, topic_id, subtopic_id=None, num_examples=2):
        """Generate examples for a topic or subtopic."""
        # Implementation similar to generate_explanation
        # ...
        
    def generate_exercises(self, topic_id, subtopic_id=None, num_exercises=3, difficulty="medium"):
        """Generate practice exercises for a topic or subtopic."""
        # Implementation similar to generate_explanation
        # ...
        
    def generate_assessment(self, topic_id, num_questions=5, difficulty="medium"):
        """Generate assessment questions for a topic."""
        # Implementation similar to generate_explanation
        # ...
        
    def create_syllabus_context(self, topic_id, subtopic_id=None):
        """Create a context string from syllabus data."""
        # Implementation from earlier section
        # ...
        
    def post_process_content(self, generated_text):
        """Post-process generated content for formatting and quality."""
        # Clean up line breaks and spacing
        text = self._normalize_whitespace(generated_text)
        
        # Extract and format sections (if present)
        text = self._format_sections(text)
        
        # Add appropriate markdown formatting
        text = self._add_markdown_formatting(text)
        
        # Check for and correct common issues
        text = self._quality_check(text)
        
        return text
        
    def _normalize_whitespace(self, text):
        """Normalize whitespace in generated text."""
        # Implementation details
        # ...
        
    def _format_sections(self, text):
        """Format sections in generated text."""
        # Implementation details
        # ...
        
    def _add_markdown_formatting(self, text):
        """Add markdown formatting to generated text."""
        # Implementation details
        # ...
        
    def _quality_check(self, text):
        """Check for and correct quality issues."""
        # Implementation details
        # ...
```

#### 5.3.2 Fallback Mechanism

```python
def generate_content_with_fallback(topic_id, content_type, difficulty="medium"):
    """Generate content with fallback mechanisms in case of failure."""
    
    # Try to retrieve pre-generated content first
    pre_generated = database.get_pre_generated_content(topic_id, content_type, difficulty)
    if pre_generated and not config.ALWAYS_USE_LLM:
        return pre_generated
        
    try:
        # Try to generate content using LLM
        if content_type == "explanation":
            content = content_generator.generate_explanation(topic_id, difficulty=difficulty)
        elif content_type == "examples":
            content = content_generator.generate_examples(topic_id, num_examples=3)
        elif content_type == "exercises":
            content = content_generator.generate_exercises(topic_id, difficulty=difficulty)
        else:
            raise ValueError(f"Unknown content type: {content_type}")
            
        # Validate generated content
        validation_result = validate_generated_content(content, content_type)
        if validation_result["quality_score"] >= config.QUALITY_THRESHOLD:
            return content
        else:
            # Log validation issues
            log.warning(f"Generated content below quality threshold: {validation_result['issues']}")
            # Fall back to pre-generated content if available
            if pre_generated:
                return pre_generated
                
    except Exception as e:
        # Log the error
        log.error(f"Error generating content: {str(e)}")
        # Fall back to pre-generated content if available
        if pre_generated:
            return pre_generated
            
    # If all else fails, use backup static content
    return get_backup_static_content(topic_id, content_type)
```

### 5.4 Content Quality Assurance

#### 5.4.1 Automated Content Validation

```python
def validate_generated_content(content, content_type):
    """Validate generated content for quality issues."""
    
    validation_result = {
        "quality_score": 0.0,
        "issues": [],
        "warnings": [],
        "passes": []
    }
    
    # Check content length
    min_length, max_length = get_length_constraints(content_type)
    content_length = len(content)
    if content_length < min_length:
        validation_result["issues"].append(f"Content too short: {content_length} chars (min {min_length})")
    elif content_length > max_length:
        validation_result["warnings"].append(f"Content may be too long: {content_length} chars (max {max_length})")
    else:
        validation_result["passes"].append("Content length appropriate")
        
    # Check formatting
    if has_proper_formatting(content, content_type):
        validation_result["passes"].append("Proper formatting detected")
    else:
        validation_result["issues"].append("Improper formatting detected")
        
    # Check for educational quality markers
    edu_quality = check_educational_quality(content, content_type)
    validation_result["quality_score"] += edu_quality["score"]
    validation_result["passes"].extend(edu_quality["passes"])
    validation_result["issues"].extend(edu_quality["issues"])
    
    # Check for factual accuracy (if applicable)
    if content_type in ["explanation", "examples"]:
        accuracy = check_factual_accuracy(content)
        validation_result["quality_score"] += accuracy["score"]
        validation_result["passes"].extend(accuracy["passes"])
        validation_result["issues"].extend(accuracy["issues"])
        
    # Normalize quality score
    num_checks = len(validation_result["passes"]) + len(validation_result["issues"])
    validation_result["quality_score"] /= max(1, num_checks / 2)
    
    return validation_result
```

#### 5.4.2 Educational Quality Checks

```python
def check_educational_quality(content, content_type):
    """Check content for educational quality markers."""
    
    result = {
        "score": 0.0,
        "passes": [],
        "issues": []
    }
    
    # Check readability level
    readability = calculate_readability(content)
    if readability["is_appropriate"]:
        result["passes"].append(f"Appropriate readability level: {readability['grade_level']}")
        result["score"] += 0.2
    else:
        result["issues"].append(f"Inappropriate readability level: {readability['grade_level']}")
        
    # Check for clear structure
    if has_clear_structure(content):
        result["passes"].append("Clear structure detected")
        result["score"] += 0.2
    else:
        result["issues"].append("Lacks clear structure")
        
    # Check for educational elements appropriate to content type
    elements = check_educational_elements(content, content_type)
    result["score"] += elements["score"]
    result["passes"].extend(elements["passes"])
    result["issues"].extend(elements["issues"])
    
    return result
```

### 5.5 Content Generation Performance Metrics

#### 5.5.1 Metrics Definitions

| Metric | Definition | Target | Measurement Method |
|--------|------------|--------|-------------------|
| Response Time | Time to generate content | < 3 seconds | Runtime measurement |
| Quality Score | Automated quality assessment | > 0.8 | Validation system |
| Success Rate | Percentage of successful generations | > 99% | Error tracking |
| Token Efficiency | Tokens used / content length | < 1.5 | Token counter |
| Cache Hit Rate | Percentage of cache hits | > 50% | Cache metrics |
| Expert Rating | Manual quality assessment | > 4/5 | Expert review |

#### 5.5.2 Performance Benchmarking

```python
def benchmark_content_generation(topic_ids, content_types, num_iterations=10):
    """Run benchmark tests on content generation performance."""
    
    results = {
        "response_time": [],
        "quality_score": [],
        "success_rate": 0,
        "token_efficiency": [],
        "errors": []
    }
    
    total_attempts = len(topic_ids) * len(content_types) * num_iterations
    successful_attempts = 0
    
    for topic_id in topic_ids:
        for content_type in content_types:
            for i in range(num_iterations):
                try:
                    # Measure generation time
                    start_time = time.time()
                    content = generate_content_with_fallback(topic_id, content_type)
                    end_time = time.time()
                    
                    # Record successful generation
                    successful_attempts += 1
                    
                    # Calculate metrics
                    response_time = end_time - start_time
                    validation = validate_generated_content(content, content_type)
                    token_count = count_tokens(content)
                    token_efficiency = token_count / max(1, len(content))
                    
                    # Store results
                    results["response_time"].append(response_time)
                    results["quality_score"].append(validation["quality_score"])
                    results["token_efficiency"].append(token_efficiency)
                    
                except Exception as e:
                    results["errors"].append({
                        "topic_id": topic_id,
                        "content_type": content_type,
                        "iteration": i,
                        "error": str(e)
                    })
    
    # Calculate success rate
    results["success_rate"] = successful_attempts / total_attempts
    
    # Calculate averages
    results["avg_response_time"] = sum(results["response_time"]) / max(1, len(results["response_time"]))
    results["avg_quality_score"] = sum(results["quality_score"]) / max(1, len(results["quality_score"]))
    results["avg_token_efficiency"] = sum(results["token_efficiency"]) / max(1, len(results["token_efficiency"]))
    
    return results
``` 