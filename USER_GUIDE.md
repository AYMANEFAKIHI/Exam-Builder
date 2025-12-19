# 🎓 Complete User Guide - Exam Builder Platform

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your First Exam](#creating-your-first-exam)
3. [Using Components](#using-components)
4. [Working with LaTeX](#working-with-latex)
5. [Managing Question Bank](#managing-question-bank)
6. [Using Templates](#using-templates)
7. [Exporting PDFs](#exporting-pdfs)
8. [Tips & Tricks](#tips--tricks)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First-Time Setup
1. **Create an account**
   - Navigate to the registration page
   - Fill in your email, name, and institution
   - Create a secure password (minimum 6 characters)

2. **Login**
   - Enter your credentials
   - You'll be redirected to the dashboard

3. **Dashboard Overview**
   - View all your exams
   - See recently modified exams first
   - Quick access to create new exam

---

## Creating Your First Exam

### Step 1: Start a New Exam
```
1. Click "Create New Exam" button on dashboard
2. You'll see an empty canvas with a component toolbar
3. Enter your exam title at the top
```

### Step 2: Add Components
```
Choose from 5 component types:
- 📋 Header: Exam information and student fields
- 📝 Text: Questions, instructions, or explanations
- 📊 Table: Data tables or matching exercises
- ✅ QCM: Multiple choice questions
- 🖼️ Image: Diagrams, graphs, or illustrations
```

### Step 3: Build Your Exam
```
1. Click component buttons in left sidebar to add
2. Drag the grip handle to reorder components
3. Edit each component by filling in its fields
4. Set points for each gradeable component
5. Watch total points update automatically
```

### Step 4: Save Your Work
```
1. Click "Save" button (top right)
2. Your exam is auto-saved to the database
3. You can close and return anytime
```

---

## Using Components

### Header Component
**Purpose**: Exam identification and student information

**Fields**:
- **Logo**: Upload your school/institution logo
  - Click upload area
  - Select image file (JPG, PNG)
  - Adjust if needed
  
- **Exam Title**: e.g., "Mathematics Final Exam"
- **Academic Year**: e.g., "2024-2025"
- **Semester**: e.g., "Fall 2024"
- **Duration**: e.g., "2 hours"

**Student Fields** (checkboxes):
- ☑ Name
- ☑ First Name  
- ☑ Class/Group

**Best Practice**: Add header as first component

---

### Text Component
**Purpose**: Questions, instructions, explanations

**Features**:
- **Rich text input**: Multi-line text area
- **LaTeX support**: Math equations (checkbox to enable)
- **Points assignment**: Set question value

**Example Uses**:
```
1. Essay questions:
   "Explain the process of photosynthesis..."

2. Short answer:
   "Define Newton's First Law of Motion."

3. Instructions:
   "Answer ALL questions in this section."

4. Math problems (with LaTeX):
   "Solve for x: $2x^2 + 5x - 3 = 0$"
```

**Tips**:
- Enable LaTeX for math/science
- Set points for each question
- Use clear, concise language

---

### Table Component
**Purpose**: Data tables, matching exercises, charts

**Features**:
- **Dynamic sizing**: Add/remove rows and columns
- **Editable headers**: Name your columns
- **Cell editing**: Fill in table content
- **Points assignment**: For graded tables

**Controls**:
- **Rows**: ➖ Remove | Current count | ➕ Add
- **Columns**: ➖ Remove | Current count | ➕ Add

**Example Uses**:
```
1. Matching Exercise:
   | Term          | Definition |
   |---------------|-----------|
   | Photosynthesis| ...       |
   | Respiration   | ...       |

2. Data Analysis:
   | Temperature | Pressure | Volume |
   |-------------|----------|--------|
   | 20°C        | 1 atm    | 22.4 L |

3. Comparison Table:
   | Feature  | Option A | Option B |
   |----------|----------|----------|
```

**Tips**:
- Start with 3x3, adjust as needed
- Use clear column headers
- Leave cells empty for student completion

---

### QCM (Multiple Choice) Component
**Purpose**: Multiple choice questions

**Features**:
- **Question field**: Main question text
- **Multiple options**: 2-10 answer choices
- **Answer types**: 
  - Single answer (radio buttons)
  - Multiple answers (checkboxes)
- **LaTeX support**: In question and options
- **Points assignment**: Question value
- **Correct answers**: Mark during creation (not visible in PDF)

**Creating Options**:
```
1. Each option has a text field
2. Check "Multiple correct answers" if needed
3. Click radio/checkbox to mark correct (for your records)
4. Add more options with ➕ button
5. Remove options with 🗑️ button (minimum 2)
```

**Example**:
```
Question: "What is the capital of France?"

Options:
○ A. London
○ B. Paris ✓
○ C. Berlin
○ D. Madrid

Points: 2
```

**Tips**:
- 4 options is standard
- Randomize answer position
- Avoid "All of the above" when possible
- Use clear, distinct options

---

### Image Component
**Purpose**: Visual content (diagrams, graphs, photos)

**Features**:
- **Image upload**: From your computer
- **Size control**: Set width and height (pixels)
- **Caption**: Add descriptive text
- **Preview**: See how it will appear

**Steps**:
```
1. Click upload area or select file
2. Image appears in component
3. Adjust width/height if needed
4. Add caption (optional but recommended)
5. Image included in PDF export
```

**Example Uses**:
```
1. Geometry diagrams
2. Scientific apparatus
3. Historical photos
4. Graph/chart analysis
5. Anatomical illustrations
```

**Tips**:
- Use high-resolution images
- Keep file sizes reasonable (<2MB)
- Add descriptive captions
- Test PDF export to verify appearance

---

## Working with LaTeX

### What is LaTeX?
LaTeX is a typesetting system for mathematical equations and scientific notation.

### When to Use LaTeX
- Mathematical formulas
- Scientific notation
- Chemical equations
- Physics problems
- Advanced formatting

### LaTeX Syntax

**Inline Math** (within text):
```
Use single dollar signs: $equation$

Examples:
- $x = 5$
- $E = mc^2$
- $\pi \approx 3.14$
```

**Display Math** (centered, larger):
```
Use double dollar signs: $$equation$$

Examples:
- $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
- $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
- $$\int_{0}^{\infty} e^{-x} dx = 1$$
```

### Common LaTeX Commands

**Fractions**:
```
$\frac{numerator}{denominator}$
Example: $\frac{3}{4}$
```

**Exponents**:
```
$x^2$ or $e^{-x}$
```

**Subscripts**:
```
$H_2O$ or $x_1$
```

**Square Root**:
```
$\sqrt{x}$ or $\sqrt[3]{x}$
```

**Greek Letters**:
```
$\alpha, \beta, \gamma, \delta$
$\pi, \theta, \omega$
```

**Summation**:
```
$\sum_{i=1}^{n} x_i$
```

**Integration**:
```
$\int_{a}^{b} f(x) dx$
```

**Limits**:
```
$\lim_{x \to \infty} f(x)$
```

### LaTeX in Components

**Text Component**:
```
1. Check "Enable LaTeX" checkbox
2. Write your content with LaTeX
3. Preview shows rendered math
```

**QCM Options**:
```
1. Each option has LaTeX checkbox
2. Enable for math in answers
3. Example: $x = \pm \sqrt{5}$
```

### LaTeX Resources
- [LaTeX Math Symbols](https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols)
- [LaTeX Cheat Sheet](http://tug.ctan.org/info/undergradmath/undergradmath.pdf)

---

## Managing Question Bank

### Why Use Question Bank?
- Reuse questions across exams
- Build a library over time
- Organize by topic/difficulty
- Track question usage

### Adding Questions

**From Exam Builder**:
```
(Feature to be added: "Save to Question Bank" button)
```

**Manual Entry**:
```
1. Go to Question Bank page
2. Create question components
3. Add tags, difficulty, subject
4. Save to bank
```

### Browsing Questions

**Search**:
```
Type in search box:
- Question content
- Tags
- Subject names
```

**Filters**:
```
Difficulty:
- All
- Easy
- Medium
- Hard

Subject:
- All
- (Your subjects)
```

### Using Questions

**Copy to Exam**:
```
1. Find question in bank
2. Click copy icon 📋
3. Go to exam builder
4. Question copied to clipboard
```

### Organizing Questions

**Best Practices**:
```
Tags:
- "algebra", "geometry", "calculus"
- "thermodynamics", "kinematics"
- "essay", "short-answer", "calculation"

Difficulty:
- Easy: Basic concepts
- Medium: Application
- Hard: Analysis/synthesis

Subject:
- Course name or topic
- "Mathematics", "Physics", "Chemistry"
```

---

## Using Templates

### What Are Templates?
Templates save exam headers (logos, info, student fields) for reuse across multiple exams.

### Creating Templates

**From Exam Builder**:
```
1. Create a header component
2. Fill in all fields
3. Click "Save as Template"
4. Name your template
5. Add description (optional)
6. Choose public/private
```

### Using Templates

**Apply to New Exam**:
```
1. Go to Templates page
2. Find your template
3. Click "Use" button 📋
4. Start new exam
5. Template header auto-populates
```

### Template Best Practices

**Create Standard Templates For**:
```
1. Each course/subject
2. Different exam types (midterm, final)
3. Different academic years
4. Different institutions (if multi-school)
```

**Public vs Private**:
```
Private: Only you can use
Public: Other users can see and use
```

---

## Exporting PDFs

### Exam PDF

**Steps**:
```
1. Complete your exam in builder
2. Click "Export PDF" button
3. Wait for generation (2-5 seconds)
4. PDF downloads automatically
5. Open and review
6. Print or share
```

**PDF Includes**:
- All components in order
- LaTeX rendered correctly
- Images included
- Tables formatted
- Professional layout

**PDF Features**:
- A4 format (standard)
- Print-ready
- Multi-page if needed
- High quality

### Correction Grid PDF

**Purpose**: Grading sheet for teachers

**Steps**:
```
1. Click "Correction Grid" button
2. PDF generates with scoring table
3. Download automatically
```

**Grid Includes**:
- Question numbers
- Maximum points per question
- Space for awarded points
- Comments section
- Total score calculation

**Using the Grid**:
```
1. Print one per student
2. Attach to student's exam
3. Fill in scores as you grade
4. Add comments
5. Calculate total
```

---

## Tips & Tricks

### Efficient Exam Creation

**Speed Tips**:
```
1. Use templates for headers
2. Build question bank gradually
3. Copy-paste similar questions
4. Use drag-and-drop for ordering
5. Save frequently (auto-saves)
```

**Organization**:
```
1. Name exams clearly: "Math_Final_2024_Fall"
2. Use tags consistently
3. Group similar exams
4. Archive old exams
```

### Best Practices

**For Multiple Choice**:
```
✅ DO:
- Use 4 options (A, B, C, D)
- Make options similar length
- Randomize correct answer position
- Avoid "None of the above"

❌ DON'T:
- Use "All of the above" (confusing)
- Make one option obviously wrong
- Use double negatives
```

**For Open Questions**:
```
✅ DO:
- Be specific and clear
- Provide enough context
- Indicate expected length
- Assign appropriate points

❌ DON'T:
- Use ambiguous wording
- Ask multiple questions in one
- Forget to set points
```

**For Tables**:
```
✅ DO:
- Label columns clearly
- Provide example if complex
- Ensure adequate cell space

❌ DON'T:
- Make tables too large
- Use unclear abbreviations
```

### Keyboard Shortcuts

```
Ctrl/Cmd + S: Save exam
Ctrl/Cmd + P: Export PDF (browser print)
Drag handle: Reorder components
Delete button: Remove component
```

---

## Troubleshooting

### Common Issues

**PDF Not Generating**:
```
Cause: Browser popup blocker
Fix: Allow popups for this site

Cause: Large images
Fix: Reduce image sizes (<2MB)

Cause: No components
Fix: Add at least one component
```

**LaTeX Not Rendering**:
```
Cause: Syntax error
Fix: Check $ and $$ pairs

Cause: MathJax not loaded
Fix: Refresh page

Cause: Complex equation
Fix: Simplify or break into parts
```

**Can't Save Exam**:
```
Cause: Not logged in
Fix: Log in again

Cause: Network error
Fix: Check internet connection

Cause: Server issue
Fix: Try again in a moment
```

**Images Not Displaying**:
```
Cause: File too large
Fix: Use smaller images

Cause: Unsupported format
Fix: Use JPG or PNG

Cause: Corrupt file
Fix: Try different image
```

**Drag and Drop Not Working**:
```
Cause: Browser compatibility
Fix: Use modern browser (Chrome, Firefox, Edge)

Cause: JavaScript disabled
Fix: Enable JavaScript

Cause: Component not loaded
Fix: Refresh page
```

### Getting Help

**Resources**:
1. Check QUICKSTART.md for setup
2. Review DEVELOPMENT.md for technical details
3. Search error messages online
4. Contact support team

**Before Reporting Issues**:
```
✓ Try refreshing page
✓ Clear browser cache
✓ Try different browser
✓ Check console for errors (F12)
✓ Note exact steps to reproduce
```

---

## Advanced Features (Coming Soon)

- Question randomization
- Automatic answer keys
- Student version vs teacher version
- Bulk question import
- Exam analytics
- Collaboration features

---

**Happy Exam Building! 📝✨**

*For technical support, refer to DEVELOPMENT.md*
*For quick setup, see QUICKSTART.md*
