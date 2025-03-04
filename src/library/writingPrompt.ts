const prompts = [
  "Whats on your mind?",
  "What's for lunch?",
  "Greetings!",
  "How did you get here?",
  "Why is darkmode better than light mode?",
  ""
];

export default function writingPrompt(): string {
  return prompts[Math.floor(Math.random() * prompts.length)];
}
