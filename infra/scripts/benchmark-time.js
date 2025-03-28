const { exec } = require("node:child_process");
const { promisify } = require("node:util");

const run = promisify(exec);
const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Benchmark CLI Tool
==================

Usage:
  node benchmark-time.js [options]

Options:
  -b, --before-all "<command>"     Command executed before each attempt (optional)
  -t, --target-command "<command>" Command to be benchmarked (required)
  -a, --attempts <number>          Number of attempts to run (default: 1)
  -h, --help                       Show this help message

Examples:
  node benchmark-time.js -t "node my-script.js" -a 3
  node benchmark-time.js -b "npm run build" -t "npm start" -a 5

Output:
  A table with the result of each attempt and average time
`);
  process.exit(0);
}

function parseArgs(args) {
  const flags = {
    beforeAll: "",
    targetCommand: "",
    attempts: 1,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case "--before-all":
      case "-b":
        flags.beforeAll = next;
        i++;
        break;
      case "--target-command":
      case "-t":
        flags.targetCommand = next;
        i++;
        break;
      case "--attempts":
      case "-a":
        flags.attempts = parseInt(next, 10);
        i++;
        break;
      case "--help":
      case "-h":
        printHelp();
        break;
      default:
        console.warn(`Unknown flag: ${arg}`);
    }
  }

  return flags;
}

async function runCommand(command) {
  const start = process.hrtime.bigint();
  await run(command);
  const end = process.hrtime.bigint();
  const diff = Number(end - start);
  return diff / 1e9;
}

async function benchmark({ beforeAll, targetCommand, attempts }) {
  const TABLE_HEADER = `
.--------------------------.
| Attempt | Time (seconds) |
|---------|----------------|`;
  const TABLE_FOOTER = `'--------------------------'`;

  const formatSuccessRow = (attempt, duration) => {
    const attemptColumn = String(attempt).padEnd(7);
    const timeColumn = duration.toFixed(2).padStart(14);
    return `| ${attemptColumn} |${timeColumn}s |`;
  };

  const formatErrorRow = (attempt) => {
    const attemptColumn = String(attempt).padEnd(7);
    const errorColumn = "FAILED".padStart(14);
    return `| ${attemptColumn} | ${errorColumn} |`;
  };

  console.log("# Benchmark Time Log\n");
  console.log(TABLE_HEADER);

  const durations = [];

  const attemptsArray = Array.from({ length: attempts }, (_, i) => i + 1);

  for (const currentAttempt of attemptsArray) {
    const logResult = await runCommandSet({ beforeAll, targetCommand });
    console.log(
      logResult.success
        ? formatSuccessRow(currentAttempt, logResult.time)
        : formatErrorRow(currentAttempt),
    );
    logResult.success && durations.push(logResult.time);
  }

  console.log(TABLE_FOOTER);

  const total = durations.reduce((sum, time) => sum + time, 0);
  const average = durations.length
    ? (total / durations.length).toFixed(2)
    : null;

  average
    ? console.log(
        `\n📊 Average time (${durations.length} successful attempts): ${average}s`,
      )
    : console.log(`\n⚠️ No successful attempts.`);

  console.log(`\n✅ Benchmark complete.`);
}

async function runCommandSet({ beforeAll, targetCommand }) {
  try {
    beforeAll && (await run(beforeAll));
    const time = await runCommand(targetCommand);
    return { success: true, time };
  } catch (error) {
    console.error("⚠️", error.stderr || error.message);
    return { success: false };
  }
}

const flags = parseArgs(args);

const isInvalid = !flags.targetCommand || isNaN(flags.attempts);

isInvalid &&
  console.error(
    'Usage: node benchmark-time.js --before-all "<setup_command>" --target-command "<target_command>" --attempts <attempts>"\n\nOr: node benchmark-time.js --help to see all available flags."',
  ) &&
  process.exit(1);

benchmark(flags);
