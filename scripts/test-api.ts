// FormData, Blob are globally available in Node.js 18+

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('==================================================');
  console.log('Project Zenith - API Endpoint Validation Test');
  console.log('==================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    status: 'PASSED',
    steps: [] as Array<{
      name: string;
      status: 'PASSED' | 'FAILED';
      details: string;
      durationMs: number;
    }>,
    errors: [] as string[],
  };

  let cookieHeader = '';
  let binderId = '';

  // Helper function to measure execution time
  async function runStep(
    name: string,
    fn: () => Promise<{ success: boolean; details: string }>
  ) {
    const startTime = Date.now();
    console.log(`[START] ${name}...`);
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      if (result.success) {
        console.log(`[PASS]  ${name} (${duration}ms)`);
        report.steps.push({
          name,
          status: 'PASSED',
          details: result.details,
          durationMs: duration,
        });
      } else {
        console.error(`[FAIL]  ${name} (${duration}ms): ${result.details}`);
        report.status = 'FAILED';
        report.steps.push({
          name,
          status: 'FAILED',
          details: result.details,
          durationMs: duration,
        });
        report.errors.push(`${name}: ${result.details}`);
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[ERROR] ${name} (${duration}ms): ${error.message}`);
      report.status = 'FAILED';
      report.steps.push({
        name,
        status: 'FAILED',
        details: error.stack || error.message,
        durationMs: duration,
      });
      report.errors.push(`${name} threw error: ${error.message}`);
    }
    console.log('');
  }

  // 1. Guest Login
  await runStep('1. Guest Login (POST /api/auth/guest)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      return {
        success: false,
        details: `HTTP error ${res.status}: ${await res.text()}`,
      };
    }

    const data = await res.json() as any;
    
    // Extract cookie
    const setCookie = res.headers.getSetCookie();
    if (setCookie && setCookie.length > 0) {
      const tokenCookie = setCookie.find((c) => c.startsWith('session_token='));
      if (tokenCookie) {
        cookieHeader = tokenCookie.split(';')[0];
      }
    }

    if (!cookieHeader) {
      return {
        success: false,
        details: 'Failed to extract session_token from Set-Cookie header',
      };
    }

    return {
      success: true,
      details: `Logged in as guest: ${data.user.email} (ID: ${data.user.userId}). Cookie captured.`,
    };
  });

  if (report.status === 'FAILED') {
    printFinalReport(report);
    process.exit(1);
  }

  // 2. Fetch Binders
  await runStep('2. Fetch Binders (GET /api/study/binders)', async () => {
    const res = await fetch(`${BASE_URL}/api/study/binders`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      return {
        success: false,
        details: `HTTP error ${res.status}: ${await res.text()}`,
      };
    }

    const data = await res.json() as any;
    return {
      success: true,
      details: `Fetched ${data.binders.length} binders.`,
    };
  });

  // 3. Create Binder
  await runStep('3. Create Binder (POST /api/study/binders)', async () => {
    const res = await fetch(`${BASE_URL}/api/study/binders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: 'JS & TS API Test Binder',
        description: 'Temporary binder created by API integration test script.',
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        details: `HTTP error ${res.status}: ${await res.text()}`,
      };
    }

    const binder = await res.json() as any;
    binderId = binder.id;

    if (!binderId) {
      return {
        success: false,
        details: 'Binder created but no ID returned.',
      };
    }

    return {
      success: true,
      details: `Created binder "${binder.name}" with ID: ${binderId}`,
    };
  });

  if (!binderId) {
    printFinalReport(report);
    process.exit(1);
  }

  // 4. Generate Flashcards - Expected Error (Empty Docs)
  await runStep(
    '4. Generate Flashcards (POST /api/study/binders/:id/flashcards/generate) - Empty Docs Check',
    async () => {
      const res = await fetch(
        `${BASE_URL}/api/study/binders/${binderId}/flashcards/generate`,
        {
          method: 'POST',
          headers: { Cookie: cookieHeader },
        }
      );

      // We expect a 400 Bad Request
      if (res.status !== 400) {
        return {
          success: false,
          details: `Expected status code 400 for empty binder, got ${res.status}: ${await res.text()}`,
        };
      }

      const errorData = await res.json() as any;
      const expectedError = 'No documents in this binder. Please upload files first.';
      if (errorData.error !== expectedError) {
        return {
          success: false,
          details: `Expected error message "${expectedError}", got "${errorData.error}"`,
        };
      }

      return {
        success: true,
        details: `Correctly rejected flashcard generation with expected 400 error: "${errorData.error}"`,
      };
    }
  );

  // 5. Upload Mock Document to Binder
  await runStep('5. Upload Document (POST /api/study/binders/:id/documents)', async () => {
    const notesText = `
Study Notes: JavaScript and TypeScript Fundamentals

1. Event Loop:
JavaScript has a runtime model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.
The call stack is LIFO (Last In, First Out). The heap is where objects are allocated. The queue is a list of messages to be processed. When the stack is empty, a message is taken out of the queue and processed.

2. Prototypal Inheritance:
Every JavaScript object has an internal property called [[Prototype]]. When you try to access a property that does not exist on an object, JavaScript will search the object's [[Prototype]], and then the [[Prototype]] of that prototype, and so on, until it finds the property or reaches the end of the prototype chain (null).

3. TypeScript Interfaces vs Types:
Types can define primitives, union types, intersection types, and tuples. Interfaces are better suited for defining object structures, support declaration merging (multiple interface definitions with the same name are merged), and can be extended.

4. Closures:
A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned.
    `.trim();

    const formData = new FormData();
    const blob = new Blob([notesText], { type: 'text/plain' });
    formData.append('files', blob, 'js_ts_notes.txt');

    const res = await fetch(`${BASE_URL}/api/study/binders/${binderId}/documents`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
    });

    if (!res.ok) {
      return {
        success: false,
        details: `HTTP error ${res.status}: ${await res.text()}`,
      };
    }

    const data = await res.json() as any;
    return {
      success: true,
      details: `Successfully uploaded ${data.length} document: ${JSON.stringify(data)}`,
    };
  });

  // 6. Generate Flashcards - Expected Success
  await runStep(
    '6. Generate Flashcards (POST /api/study/binders/:id/flashcards/generate) - Success Check',
    async () => {
      const res = await fetch(
        `${BASE_URL}/api/study/binders/${binderId}/flashcards/generate`,
        {
          method: 'POST',
          headers: { Cookie: cookieHeader },
        }
      );

      if (!res.ok) {
        return {
          success: false,
          details: `HTTP error ${res.status}: ${await res.text()}`,
        };
      }

      const data = await res.json() as any;
      if (!data.flashcards || !Array.isArray(data.flashcards) || data.flashcards.length === 0) {
        return {
          success: false,
          details: `Unexpected response format: ${JSON.stringify(data)}`,
        };
      }

      const cardDetails = data.flashcards
        .map((c: any, index: number) => `\n   Card ${index + 1}: Q: "${c.front}" / A: "${c.back}"`)
        .join('');

      return {
        success: true,
        details: `Successfully generated ${data.flashcards.length} flashcards via Gemini model.${cardDetails}`,
      };
    }
  );

  // 7. Cleanup (DELETE /api/study/binders/:id)
  await runStep('7. Cleanup (DELETE /api/study/binders/:id)', async () => {
    const res = await fetch(`${BASE_URL}/api/study/binders/${binderId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      return {
        success: false,
        details: `HTTP error ${res.status}: ${await res.text()}`,
      };
    }

    const data = await res.json() as any;
    return {
      success: true,
      details: `Successfully deleted binder. Response: ${JSON.stringify(data)}`,
    };
  });

  printFinalReport(report);

  if (report.status === 'FAILED') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function printFinalReport(report: any) {
  console.log('==================================================');
  console.log('Final Validation Report');
  console.log('==================================================');
  console.log(`Overall Status: ${report.status}`);
  console.log(`Timestamp:      ${report.timestamp}`);
  console.log('--------------------------------------------------');
  report.steps.forEach((step: any, index: number) => {
    console.log(`${index + 1}. [${step.status}] ${step.name}`);
    console.log(`   Details: ${step.details}`);
    console.log(`   Duration: ${step.durationMs}ms`);
    console.log('--------------------------------------------------');
  });

  if (report.errors.length > 0) {
    console.log('Errors encountered:');
    report.errors.forEach((err: string) => console.error(` - ${err}`));
  }
  console.log('==================================================');
}

runTests().catch((err) => {
  console.error('Test suite failed critically:', err);
  process.exit(1);
});
