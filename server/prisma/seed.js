"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding NexusAI Academy database...');
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
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash('Password@123', salt);
    const student = await prisma.user.create({
        data: {
            name: 'Alex Chen',
            email: 'student@nexusai.academy',
            passwordHash,
            role: 'STUDENT'
        }
    });
    const instructor = await prisma.user.create({
        data: {
            name: 'Dr. Sophia Vance',
            email: 'instructor@nexusai.academy',
            passwordHash,
            role: 'INSTRUCTOR'
        }
    });
    const admin = await prisma.user.create({
        data: {
            name: 'Nexus Admin',
            email: 'admin@nexusai.academy',
            passwordHash,
            role: 'ADMIN'
        }
    });
    console.log('Created users: student, instructor, admin (Password: Password@123)');
    // 3. Create Master Flagship Course spanning Beginner, Intermediate, and Advanced Deep Learning
    const masterCourse = await prisma.course.create({
        data: {
            title: 'Full-Stack Data Science & AI: From Python to Transformers',
            slug: 'full-stack-data-science-ai-mastery',
            description: 'The definitive end-to-end curriculum. Master Python programming, vectorized mathematics with NumPy & Pandas, machine learning modeling with Scikit-Learn, and deep learning architectures including CNNs and Transformers.',
            level: 'All Levels (Beginner to Advanced)',
            thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
        }
    });
    // Level 1: Module 1 - Python Foundations
    const mod1 = await prisma.module.create({
        data: {
            courseId: masterCourse.id,
            title: 'Level 1: Python Fundamentals for Scientific Computing',
            orderIndex: 1
        }
    });
    const lesson1 = await prisma.lesson.create({
        data: {
            moduleId: mod1.id,
            title: 'Data Structures & List Comprehensions',
            orderIndex: 1,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            contentMarkdown: `# Python Data Structures for Data Science

In modern data science, manipulating collections with concise, memory-efficient syntax is fundamental. **List comprehensions** offer an elegant way to transform and filter data in a single readable line.

\`\`\`python
# Example: Transforming numeric lists
numbers = [1, 2, 3, 4, 5, 6]
squared_evens = [x ** 2 for x in numbers if x % 2 == 0]
# Result: [4, 16, 36]
\`\`\`

### Key Data Science Conventions
1. **Prefer comprehensions** over explicit for-loops when creating mapped transformations.
2. **Type Preservation**: Maintain consistent types inside numerical lists.
3. **Time Complexity**: List comprehensions execute in optimized C-loops under CPython.
`
        }
    });
    await prisma.exercise.create({
        data: {
            lessonId: lesson1.id,
            prompt: 'Write a function `filter_even_squares(numbers)` that takes a list of integers and returns a new list containing the squares of all even numbers.',
            starterCode: `def filter_even_squares(numbers):
    # TODO: Use list comprehension to return squares of even numbers
    pass

# Test your code
sample = [1, 2, 3, 4, 5, 6, 7, 8]
print(filter_even_squares(sample))
`,
            testCasesJson: JSON.stringify([
                {
                    name: 'Even numbers list',
                    testCode: 'assert filter_even_squares([1, 2, 3, 4, 5, 6]) == [4, 16, 36]',
                    expectedOutput: ''
                },
                {
                    name: 'Only odd numbers',
                    testCode: 'assert filter_even_squares([1, 3, 5, 7]) == []',
                    expectedOutput: ''
                },
                {
                    name: 'Hidden boundary test',
                    testCode: 'assert filter_even_squares([0, -2, -4, 10]) == [0, 4, 16, 100]',
                    expectedOutput: '',
                    hidden: true
                }
            ])
        }
    });
    // Level 1: Module 2 - NumPy
    const mod2 = await prisma.module.create({
        data: {
            courseId: masterCourse.id,
            title: 'Level 1: Vectorized Computing with NumPy',
            orderIndex: 2
        }
    });
    const lesson2 = await prisma.lesson.create({
        data: {
            moduleId: mod2.id,
            title: 'Feature Scaling: Min-Max Normalization',
            orderIndex: 1,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            contentMarkdown: `# Feature Scaling & Min-Max Normalization

Machine learning algorithms such as Gradient Descent, KNN, and Neural Networks are sensitive to feature scales. **Min-Max Normalization** rescales features into a standard range $[0, 1]$:

$$x_{norm} = \\frac{x - x_{min}}{x_{max} - x_{min}}$$

### Why Vectorization Matters
Vectorized implementations execute in continuous C-memory blocks (SIMD instructions), achieving $10\\times$ to $100\\times$ speedups over standard Python iterations.
`
        }
    });
    await prisma.exercise.create({
        data: {
            lessonId: lesson2.id,
            prompt: 'Implement a function `min_max_scale(values)` that takes a list of numbers and returns a list where each number is scaled to the range [0.0, 1.0]. If all elements are identical, return all 0.0s. Round scaled values to 2 decimal places.',
            starterCode: `def min_max_scale(values):
    # TODO: Implement min-max normalization
    # Formula: (x - min) / (max - min)
    if not values:
        return []
    min_v = min(values)
    max_v = max(values)
    if max_v == min_v:
        return [0.0 for _ in values]
    return [round((x - min_v) / (max_v - min_v), 2) for x in values]

# Test
print(min_max_scale([10, 20, 30, 40, 50]))
`,
            testCasesJson: JSON.stringify([
                {
                    name: 'Standard positive range',
                    testCode: 'assert min_max_scale([10, 20, 30, 40, 50]) == [0.0, 0.25, 0.5, 0.75, 1.0]',
                    expectedOutput: ''
                },
                {
                    name: 'Zero variance list',
                    testCode: 'assert min_max_scale([5, 5, 5]) == [0.0, 0.0, 0.0]',
                    expectedOutput: ''
                },
                {
                    name: 'Hidden negative values test',
                    testCode: 'assert min_max_scale([-10, 0, 10]) == [0.0, 0.5, 1.0]',
                    expectedOutput: '',
                    hidden: true
                }
            ])
        }
    });
    // Level 2: Module 3 - Machine Learning Algorithms
    const mod3 = await prisma.module.create({
        data: {
            courseId: masterCourse.id,
            title: 'Level 2: Supervised Machine Learning & Optimization',
            orderIndex: 3
        }
    });
    const lesson3 = await prisma.lesson.create({
        data: {
            moduleId: mod3.id,
            title: 'Loss Functions: Mean Squared Error (MSE)',
            orderIndex: 1,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            contentMarkdown: `# Mean Squared Error (MSE) Optimization

The **Mean Squared Error (MSE)** is the quintessential convex objective function in regression modeling.

$$MSE = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$

### Properties
- Strongly penalizes large residuals due to the quadratic exponent.
- Differentiable everywhere, yielding smooth gradients: $\\nabla_w MSE = -\\frac{2}{N} X^T (y - \\hat{y})$.
`
        }
    });
    await prisma.exercise.create({
        data: {
            lessonId: lesson3.id,
            prompt: 'Implement a function `calculate_mse(y_true, y_pred)` that computes the Mean Squared Error between true and predicted arrays, rounded to 4 decimal places.',
            starterCode: `def calculate_mse(y_true, y_pred):
    # TODO: Calculate MSE: sum((y - y_hat)^2) / N
    if len(y_true) != len(y_pred) or len(y_true) == 0:
        return 0.0
    pass

# Test
y_true = [3.0, -0.5, 2.0, 7.0]
y_pred = [2.5, 0.0, 2.0, 8.0]
print(calculate_mse(y_true, y_pred))
`,
            testCasesJson: JSON.stringify([
                {
                    name: 'Standard vectors test',
                    testCode: 'assert calculate_mse([3.0, -0.5, 2.0, 7.0], [2.5, 0.0, 2.0, 8.0]) == 0.375',
                    expectedOutput: ''
                },
                {
                    name: 'Perfect prediction test',
                    testCode: 'assert calculate_mse([1.0, 2.0], [1.0, 2.0]) == 0.0',
                    expectedOutput: ''
                },
                {
                    name: 'Hidden floating point test',
                    testCode: 'assert calculate_mse([10.5, 20.2], [11.5, 19.2]) == 1.0',
                    expectedOutput: '',
                    hidden: true
                }
            ])
        }
    });
    // Level 3: Module 4 - Deep Learning & Attention
    const mod4 = await prisma.module.create({
        data: {
            courseId: masterCourse.id,
            title: 'Level 3: Deep Learning Architectures & Self-Attention',
            orderIndex: 4
        }
    });
    const lesson4 = await prisma.lesson.create({
        data: {
            moduleId: mod4.id,
            title: 'Neural Activations: ReLU & Numerically Stable Softmax',
            orderIndex: 1,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            contentMarkdown: `# Non-Linear Activations & Softmax

Deep neural networks require non-linear activation functions to approximate complex continuous manifolds (Universal Approximation Theorem).

### 1. Rectified Linear Unit (ReLU)
$$f(x) = \\max(0, x)$$
- Solves vanishing gradients for $x > 0$.
- Computationally ultra-efficient.

### 2. Numerically Stable Softmax
To avoid catastrophic floating-point overflow ($e^{1000} \\to \\infty$), we subtract the maximum logit before exponentiation:
$$\\sigma(z)_i = \\frac{e^{z_i - \\max(z)}}{\\sum_j e^{z_j - \\max(z)}}$$
`
        }
    });
    await prisma.exercise.create({
        data: {
            lessonId: lesson4.id,
            prompt: 'Implement a function `relu(logits)` that takes a list of real numbers and returns a list with ReLU applied (replace negatives with 0.0).',
            starterCode: `def relu(logits):
    # TODO: Return [max(0.0, x) for x in logits]
    return [max(0.0, float(x)) for x in logits]

# Test
print(relu([-3.5, 0.0, 1.2, -0.4, 5.0]))
`,
            testCasesJson: JSON.stringify([
                {
                    name: 'Mixed signs array',
                    testCode: 'assert relu([-3.5, 0.0, 1.2, -0.4, 5.0]) == [0.0, 0.0, 1.2, 0.0, 5.0]',
                    expectedOutput: ''
                },
                {
                    name: 'All negatives',
                    testCode: 'assert relu([-10, -20, -5]) == [0.0, 0.0, 0.0]',
                    expectedOutput: ''
                },
                {
                    name: 'Hidden mixed inputs',
                    testCode: 'assert relu([10.5, -0.01, 4.2]) == [10.5, 0.0, 4.2]',
                    expectedOutput: '',
                    hidden: true
                }
            ])
        }
    });
    // Give sample completed progress for student on lesson 1 so dashboard shows initial streak & metrics
    await prisma.userProgress.create({
        data: {
            userId: student.id,
            lessonId: lesson1.id,
            completed: true,
            codeSubmission: `def filter_even_squares(numbers):\n    return [x**2 for x in numbers if x % 2 == 0]\n`
        }
    });
    console.log('Seeding finished successfully with complete 4-tier course, modules, lessons, and exercises!');
}
main()
    .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
