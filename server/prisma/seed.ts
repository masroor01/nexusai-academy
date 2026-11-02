import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NexusAI Academy database with multi-track courses...');

  // 1. Clean existing records
  await prisma.certificate.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.note.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password@123', salt);

  const student = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'student@nexusai.academy',
      passwordHash,
      role: 'STUDENT'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Dr. Sophia Vance',
      email: 'instructor@nexusai.academy',
      passwordHash,
      role: 'INSTRUCTOR'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Nexus Admin',
      email: 'admin@nexusai.academy',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Created users: student, instructor, admin (Password: Password@123)');

  // -------------------------------------------------------------
  // COURSE 1: LEVEL 1 - BEGINNER PYTHON FOR DATA SCIENCE
  // -------------------------------------------------------------
  const course1 = await prisma.course.create({
    data: {
      title: 'Level 1: Python for Data Science & Scientific Computing',
      slug: 'python-data-science-fundamentals',
      description: 'Master core Python data structures, list comprehensions, vectorized mathematical array manipulation with NumPy, and exploratory data analysis with Pandas.',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    }
  });

  const c1m1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Python Syntax & Algorithmic Foundations',
      orderIndex: 1
    }
  });

  const c1l1 = await prisma.lesson.create({
    data: {
      moduleId: c1m1.id,
      title: 'Data Structures & List Comprehensions',
      orderIndex: 1,
      videoUrl: 'https://www.youtube-nocookie.com/embed/3dt4xGsJb04',
      contentMarkdown: `# Python Data Structures for Data Science

In modern data science, manipulating collections with concise, memory-efficient syntax is fundamental. **List comprehensions** offer an elegant way to transform and filter data in a single readable line.

\`\`\`python
# Example: Transforming numeric lists
numbers = [1, 2, 3, 4, 5, 6]
squared_evens = [x ** 2 for x in numbers if x % 2 == 0]
# Result: [4, 16, 36]
\`\`\`

### Key Principles
1. **Prefer comprehensions** over explicit loops when mapping tabular transformations.
2. **CPython optimization**: List comprehensions run at optimized C-level speed.
`
    }
  });

  await prisma.exercise.create({
    data: {
      lessonId: c1l1.id,
      prompt: 'Write a function `filter_even_squares(numbers)` that takes a list of integers and returns a new list containing the squares of all even numbers.',
      starterCode: `def filter_even_squares(numbers):
    # TODO: Return squares of even numbers using list comprehension
    pass

# Test your code
sample = [1, 2, 3, 4, 5, 6]
print(filter_even_squares(sample))
`,
      testCasesJson: JSON.stringify([
        {
          name: 'Even numbers list',
          testCode: 'assert filter_even_squares([1, 2, 3, 4, 5, 6]) == [4, 16, 36]'
        },
        {
          name: 'Only odd numbers',
          testCode: 'assert filter_even_squares([1, 3, 5]) == []'
        },
        {
          name: 'Hidden negative values test',
          testCode: 'assert filter_even_squares([0, -2, -4, 10]) == [0, 4, 16, 100]',
          hidden: true
        }
      ])
    }
  });

  const c1m2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Module 2: High-Performance Vectorization with NumPy',
      orderIndex: 2
    }
  });

  const c1l2 = await prisma.lesson.create({
    data: {
      moduleId: c1m2.id,
      title: 'Feature Scaling: Min-Max Normalization',
      orderIndex: 1,
      videoUrl: 'https://www.youtube-nocookie.com/embed/mnKm3YP56PY',
      contentMarkdown: `# Feature Scaling & Min-Max Normalization

Machine learning algorithms such as Gradient Descent, KNN, and Neural Networks are sensitive to feature scales. **Min-Max Normalization** rescales features into a standard range $[0, 1]$:

$$x_{norm} = \\frac{x - x_{min}}{x_{max} - x_{min}}$$
`
    }
  });

  await prisma.exercise.create({
    data: {
      lessonId: c1l2.id,
      prompt: 'Implement `min_max_scale(values)` that rescales a list of numbers into [0.0, 1.0]. If all numbers are identical, return all 0.0s. Round scaled values to 2 decimal places.',
      starterCode: `def min_max_scale(values):
    # TODO: Implement min-max normalization
    if not values:
        return []
    min_v, max_v = min(values), max(values)
    if min_v == max_v:
        return [0.0 for _ in values]
    return [round((x - min_v) / (max_v - min_v), 2) for x in values]

print(min_max_scale([10, 20, 30, 40, 50]))
`,
      testCasesJson: JSON.stringify([
        {
          name: 'Ascending values test',
          testCode: 'assert min_max_scale([10, 20, 30, 40, 50]) == [0.0, 0.25, 0.5, 0.75, 1.0]'
        },
        {
          name: 'Zero variance test',
          testCode: 'assert min_max_scale([5, 5, 5]) == [0.0, 0.0, 0.0]'
        },
        {
          name: 'Hidden negative numbers test',
          testCode: 'assert min_max_scale([-10, 0, 10]) == [0.0, 0.5, 1.0]',
          hidden: true
        }
      ])
    }
  });

  // -------------------------------------------------------------
  // COURSE 2: LEVEL 2 - INTERMEDIATE MACHINE LEARNING
  // -------------------------------------------------------------
  const course2 = await prisma.course.create({
    data: {
      title: 'Level 2: Intermediate Machine Learning Engineering',
      slug: 'intermediate-machine-learning-scikit',
      description: 'Understand convex loss optimization, linear & logistic regression, evaluation metrics (ROC-AUC, Precision/Recall, F1-Score), and cross-validated modeling with Scikit-Learn.',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    }
  });

  const c2m1 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Module 1: Optimization & Loss Formulations',
      orderIndex: 1
    }
  });

  const c2l1 = await prisma.lesson.create({
    data: {
      moduleId: c2m1.id,
      title: 'Loss Functions: Mean Squared Error (MSE)',
      orderIndex: 1,
      videoUrl: 'https://www.youtube-nocookie.com/embed/sDv4f4s2SB8',
      contentMarkdown: `# Mean Squared Error (MSE) Optimization

The **Mean Squared Error (MSE)** is the quintessential convex objective function in regression modeling.

$$MSE = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$
`
    }
  });

  await prisma.exercise.create({
    data: {
      lessonId: c2l1.id,
      prompt: 'Implement a function `calculate_mse(y_true, y_pred)` that calculates the Mean Squared Error rounded to 4 decimal places.',
      starterCode: `def calculate_mse(y_true, y_pred):
    # TODO: Calculate MSE: sum((y - y_hat)**2) / N
    if len(y_true) != len(y_pred) or len(y_true) == 0:
        return 0.0
    pass

y_true = [3.0, -0.5, 2.0, 7.0]
y_pred = [2.5, 0.0, 2.0, 8.0]
print(calculate_mse(y_true, y_pred))
`,
      testCasesJson: JSON.stringify([
        {
          name: 'Standard vectors test',
          testCode: 'assert calculate_mse([3.0, -0.5, 2.0, 7.0], [2.5, 0.0, 2.0, 8.0]) == 0.375'
        },
        {
          name: 'Zero residual test',
          testCode: 'assert calculate_mse([1.0, 2.0], [1.0, 2.0]) == 0.0'
        },
        {
          name: 'Hidden floats test',
          testCode: 'assert calculate_mse([10.5, 20.2], [11.5, 19.2]) == 1.0',
          hidden: true
        }
      ])
    }
  });

  // -------------------------------------------------------------
  // COURSE 3: LEVEL 3 - ADVANCED DEEP LEARNING & AI
  // -------------------------------------------------------------
  const course3 = await prisma.course.create({
    data: {
      title: 'Level 3: Advanced Deep Learning & Transformers',
      slug: 'deep-learning-neural-transformers',
      description: 'Build neural network architectures from scratch, implement backpropagation, understand convolutional filters (CNNs), sequence memory (LSTMs), and Transformer self-attention.',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'
    }
  });

  const c3m1 = await prisma.module.create({
    data: {
      courseId: course3.id,
      title: 'Module 1: Activation Functions & Forward Propagation',
      orderIndex: 1
    }
  });

  const c3l1 = await prisma.lesson.create({
    data: {
      moduleId: c3m1.id,
      title: 'Neural Activations: ReLU & Stable Softmax',
      orderIndex: 1,
      videoUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk',
      contentMarkdown: `# Non-Linear Activations & Softmax

Deep neural networks require non-linear activation functions to approximate complex continuous manifolds (Universal Approximation Theorem).

### Rectified Linear Unit (ReLU)
$$f(x) = \\max(0, x)$$
`
    }
  });

  await prisma.exercise.create({
    data: {
      lessonId: c3l1.id,
      prompt: 'Implement a function `relu(logits)` that returns a list with ReLU applied (replace negatives with 0.0).',
      starterCode: `def relu(logits):
    # TODO: Return [max(0.0, float(x)) for x in logits]
    return [max(0.0, float(x)) for x in logits]

print(relu([-3.5, 0.0, 1.2, -0.4, 5.0]))
`,
      testCasesJson: JSON.stringify([
        {
          name: 'Mixed signs test',
          testCode: 'assert relu([-3.5, 0.0, 1.2, -0.4, 5.0]) == [0.0, 0.0, 1.2, 0.0, 5.0]'
        },
        {
          name: 'All negatives test',
          testCode: 'assert relu([-10, -20, -5]) == [0.0, 0.0, 0.0]'
        },
        {
          name: 'Hidden floats test',
          testCode: 'assert relu([10.5, -0.01, 4.2]) == [10.5, 0.0, 4.2]',
          hidden: true
        }
      ])
    }
  });

  // Seed sample progress for student on Level 1 Lesson 1
  await prisma.userProgress.create({
    data: {
      userId: student.id,
      lessonId: c1l1.id,
      completed: true,
      codeSubmission: `def filter_even_squares(numbers):\n    return [x**2 for x in numbers if x % 2 == 0]\n`
    }
  });

  console.log('Successfully seeded 3 dedicated leveled courses (Beginner, Intermediate, Advanced)!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
