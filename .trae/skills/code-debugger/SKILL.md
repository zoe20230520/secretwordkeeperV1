---
name: "code-debugger"
description: "Helps debug code by analyzing errors, finding bugs, and providing solutions. Invoke when user encounters coding errors, runtime issues, or needs help troubleshooting code."
---

# Code Debugger

This skill helps debug code by analyzing error messages, identifying bugs, and providing solutions to fix issues.

## When to Invoke

Invoke this skill when:
- User encounters coding errors or runtime exceptions
- User needs help troubleshooting code issues
- User asks for debugging assistance
- User provides error messages and needs help understanding them
- User's code is not working as expected

## How It Works

1. **Error Analysis**: Examines error messages and stack traces to identify the root cause
2. **Code Inspection**: Reviews relevant code sections to find bugs
3. **Solution Generation**: Provides step-by-step fixes for identified issues
4. **Best Practices**: Offers recommendations to prevent similar issues in the future

## Common Debugging Scenarios

### Syntax Errors
- Identifies missing brackets, semicolons, or incorrect syntax
- Provides corrected code examples

### Runtime Errors
- Analyzes stack traces to locate error sources
- Explains error causes in plain language
- Offers specific fixes

### Logical Bugs
- Reviews code logic to identify flawed reasoning
- Suggests alternative approaches
- Provides test cases to verify fixes

### Performance Issues
- Identifies bottlenecks and inefficiencies
- Recommends optimization strategies
- Suggests performance testing approaches

## Usage Examples

### Example 1: Debugging Syntax Error

**User Input:**
```
I'm getting a syntax error in my JavaScript code: "Unexpected token }"
```

**Skill Response:**
Analyzes the error, checks the code around the error location, identifies the missing or extra bracket, and provides the corrected code.

### Example 2: Debugging Runtime Exception

**User Input:**
```
My React component is throwing "TypeError: Cannot read property 'map' of undefined"
```

**Skill Response:**
Examines the component code, identifies where the undefined value is being used, suggests adding null checks or proper initialization, and provides the fixed code.

### Example 3: Debugging Logical Bug

**User Input:**
```
My password generator is creating passwords that are too short
```

**Skill Response:**
Reviews the password generation logic, identifies the issue with length calculation, provides a fix, and suggests testing approaches.

## Debugging Process

1. **Gather Information**: Collect error messages, code snippets, and context
2. **Reproduce the Issue**: Understand how to trigger the error
3. **Analyze the Code**: Review relevant code sections
4. **Identify the Root Cause**: Determine what's causing the issue
5. **Develop a Fix**: Create a solution that addresses the problem
6. **Test the Fix**: Verify the solution works correctly
7. **Prevent Recurrence**: Suggest practices to avoid similar issues

## Tools Used

- **Code Analysis**: Examines code structure and logic
- **Error Parsing**: Analyzes error messages and stack traces
- **Best Practices Checker**: Ensures code follows industry standards
- **Solution Generator**: Creates tailored fixes for specific issues

## Supported Languages

- JavaScript/TypeScript
- React/Vue/Angular
- Node.js
- Python
- Java
- C/C++
- And many other programming languages

This skill provides comprehensive debugging assistance across various programming languages and frameworks, helping users resolve code issues efficiently and effectively.