import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ENV } from '../config/env';

export interface TestCase {
  name: string;
  input?: string;
  expectedOutput?: string;
  testCode?: string; // Additional assert code to append
  hidden?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput?: string;
  error?: string;
  durationMs: number;
  hidden: boolean;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  securityViolation?: string;
  testResults?: TestResult[];
  allPassed?: boolean;
}

// Blocked patterns for security in local execution mode
const FORBIDDEN_PATTERNS = [
  /import\s+os(\.|\s|$)/i,
  /from\s+os\s+import/i,
  /import\s+subprocess(\.|\s|$)/i,
  /from\s+subprocess\s+import/i,
  /import\s+shutil(\.|\s|$)/i,
  /from\s+shutil\s+import/i,
  /__import__\s*\(\s*['"](os|subprocess|shutil|socket|sys)['"]\s*\)/i,
  /open\s*\(\s*['"][^'"]*(\/|\\|\.\.)/i // Prevent traversal writes
];

export class SandboxService {
  /**
   * Run raw python code locally in an isolated process with timeout & memory safeguards
   */
  public static async executePython(code: string, stdinInput: string = '', timeoutMs: number = 6000): Promise<ExecutionResult> {
    // 1. Static security check
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(code)) {
        return {
          stdout: '',
          stderr: 'Security Policy Violation: Restricted module or call detected.',
          exitCode: 1,
          durationMs: 0,
          timedOut: false,
          securityViolation: 'Execution denied: restricted system module or function invocation is blocked.'
        };
      }
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexusai-py-'));
    const tempFile = path.join(tempDir, 'solution.py');

    try {
      fs.writeFileSync(tempFile, code, 'utf-8');

      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      return await new Promise<ExecutionResult>((resolve) => {
        const pythonProc = spawn(ENV.LOCAL_PYTHON_CMD, [tempFile], {
          timeout: timeoutMs,
          env: {
            ...process.env,
            PYTHONDONTWRITEBYTECODE: '1',
            PYTHONUNBUFFERED: '1'
          }
        });

        const timer = setTimeout(() => {
          timedOut = true;
          try {
            pythonProc.kill('SIGKILL');
          } catch {
            // ignore
          }
        }, timeoutMs);

        if (stdinInput) {
          pythonProc.stdin.write(stdinInput);
          pythonProc.stdin.end();
        } else {
          pythonProc.stdin.end();
        }

        pythonProc.stdout.on('data', (data) => {
          if (stdout.length < 50000) {
            stdout += data.toString();
          }
        });

        pythonProc.stderr.on('data', (data) => {
          if (stderr.length < 50000) {
            stderr += data.toString();
          }
        });

        pythonProc.on('close', (code) => {
          clearTimeout(timer);
          const durationMs = Date.now() - startTime;
          resolve({
            stdout: stdout.trim(),
            stderr: timedOut ? 'Execution Error: Time Limit Exceeded (6s)' : stderr.trim(),
            exitCode: timedOut ? 124 : code,
            durationMs,
            timedOut
          });
        });

        pythonProc.on('error', (err) => {
          clearTimeout(timer);
          resolve({
            stdout: '',
            stderr: `Process launch failed: ${err.message}`,
            exitCode: 1,
            durationMs: Date.now() - startTime,
            timedOut: false
          });
        });
      });
    } finally {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
      } catch {
        // cleanup ignore
      }
    }
  }

  /**
   * Run student code against multiple test cases
   */
  public static async evaluateExercise(studentCode: string, testCases: TestCase[]): Promise<ExecutionResult> {
    const results: TestResult[] = [];
    let allPassed = true;
    let totalDuration = 0;
    let finalStdout = '';
    let finalStderr = '';

    for (const tc of testCases) {
      let codeToRun = studentCode;
      if (tc.testCode) {
        codeToRun = `${studentCode}\n\n# --- AUTO-GRADER TEST HARNESS ---\n${tc.testCode}`;
      }

      const res = await this.executePython(codeToRun, tc.input || '', 5000);
      totalDuration += res.durationMs;

      if (res.securityViolation) {
        return {
          stdout: '',
          stderr: res.stderr,
          exitCode: 1,
          durationMs: totalDuration,
          timedOut: false,
          securityViolation: res.securityViolation,
          testResults: testCases.map(t => ({
            name: t.name,
            passed: false,
            actualOutput: '',
            expectedOutput: t.hidden ? '[Hidden]' : t.expectedOutput,
            error: res.securityViolation,
            durationMs: 0,
            hidden: !!t.hidden
          })),
          allPassed: false
        };
      }

      let passed = false;
      const actual = res.stdout.trim();
      const expected = (tc.expectedOutput || '').trim();

      if (tc.testCode) {
        // If testCode was appended and executed with exitCode 0 and no stderr
        passed = res.exitCode === 0 && !res.stderr;
      } else if (tc.expectedOutput !== undefined) {
        // Compare trimmed outputs
        passed = actual === expected;
      } else {
        passed = res.exitCode === 0;
      }

      if (!passed) {
        allPassed = false;
      }

      results.push({
        name: tc.name,
        passed,
        actualOutput: tc.hidden && !passed ? 'Hidden Test Failed' : actual,
        expectedOutput: tc.hidden ? '[Hidden Test Case]' : expected,
        error: res.stderr || (res.timedOut ? 'Time limit exceeded' : undefined),
        durationMs: res.durationMs,
        hidden: !!tc.hidden
      });

      if (!finalStdout && actual) finalStdout = actual;
      if (res.stderr && !finalStderr) finalStderr = res.stderr;
    }

    return {
      stdout: finalStdout,
      stderr: finalStderr,
      exitCode: allPassed ? 0 : 1,
      durationMs: totalDuration,
      timedOut: false,
      testResults: results,
      allPassed
    };
  }
}
