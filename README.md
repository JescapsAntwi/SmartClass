# SuguruAI - Ghanaian Educational Assistant

SuguruAI is an educational tool leveraging large language models to support Ghanaian students with personalized learning experiences aligned with the Ghana Educational System (GES) syllabus.

## Features

- **Syllabus-Aligned Learning**: Content directly mapped to the GES curriculum
- **Interactive Learning Interface**: Streamlit-powered UI with intuitive navigation
- **Offline Capability**: Works without internet connection
- **Customized Knowledge**: Fine-tuned model that understands Ghana's educational context
- **Personalized Learning Paths**: Adapts to individual student progress
- **Multi-Subject Support**: Covers various subjects and educational levels

## Getting Started

### Prerequisites

- Python 3.8 or higher
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- Windows, macOS, or Linux

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/suguruai.git
   cd suguruai
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Download the model (if not included):
   ```bash
   python scripts/download_model.py
   ```

### Usage

## Features

- **Loading Screen**: Initial application startup with progress indicator
- **Grade Selection**: Choose from Primary 1-6 and JHS 1-3
- **Subject Selection**: Standard subjects (Mathematics, English, Science, Social Studies) and special modules (Coding, Maps)
- **Topic Navigation**: Main topics with subtopics for detailed learning
- **Interactive Content**: Learn through cards with educational material
- **Assessment**: Mid-topic quizzes, main quizzes, and exam practice
- **Progress Tracking**: Track completion across topics
- **Special Modules**:
  - Coding: Learn Python basics with in-built IDE
  - Maps: Explore offline maps focused on Africa

3. Select your educational level, subject, and grade

4. Navigate through topics and subtopics using the interactive interface

## Project Structure

```
suguruai/
├── data/               # Educational content and syllabus data
├── models/             # LLM models and weights
├── scripts/            # Utility scripts
├── src/                # Source code
│   ├── components/     # UI components
│   ├── llm/            # LLM integration code
│   ├── utils/          # Helper functions
├── tests/              # Test files
├── main.py             # Main Streamlit application
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

#

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ghana Education Service for curriculum content
- Meta AI for Llama 2 model
- Streamlit for the web framework 