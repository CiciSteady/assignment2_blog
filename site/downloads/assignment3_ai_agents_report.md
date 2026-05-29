# Assignment 3: Deployment and Integration of AI Agents

**Student Name:** RenXuan  
**Student ID:** ZY2557207  
**Date:** 2026-05-28

## Objective

This assignment practices deploying and using AI agents in a realistic development workflow. The work includes an online model agent, a local-model deployment workflow with Ollama, IDE-assisted code refactoring, and reflective documentation comparing model choices.

## Rubric Checklist

| Requirement | Implementation in this submission | Status |
|---|---|---|
| Online agent | `scripts/online_file_agent.py` analyzes a file through an OpenAI-compatible online API; demo mode verifies the workflow without exposing a key. | Done |
| Local model deployment | `scripts/ollama_local_agent.py` connects to Ollama at `http://127.0.0.1:11434`; setup commands are documented for `qwen2.5:7b` and `qwen2.5:0.5b`. | Done as reproducible workflow |
| IDE integration | AI assistant was used to refactor a Python function and verify the before/after behavior. | Done |
| Documentation and reflection | This Markdown report documents setup, commands, challenges, comparison, and reflection. | Done |

## Project Structure

```text
assignment3_agents/
  README.md
  .env.example
  data/
    ai_agent_notes.txt
  docs/
    Assignment3_AI_Agents_Report.md
    step_by_step_commands.md
  scripts/
    check_environment.py
    online_file_agent.py
    ollama_local_agent.py
    refactor_before.py
    refactor_after.py
  transcripts/
    environment_check.md
    online_agent_demo.md
    local_ollama_demo.md
    ide_refactor_demo.md
```

## Environment Check

I first checked the development environment with:

```powershell
cd D:\path\to\lesson\software\assignment3_agents
python scripts\check_environment.py
```

Key results:

```text
Python version: 3.13.12
ollama: not found
code: C:\Users\r1382\AppData\Local\Programs\Microsoft VS Code\bin\code.CMD
git: D:\Program Files\Git\cmd\git.EXE
ONLINE_API_KEY: not set
```

This shows that Python and VS Code are available. API keys are intentionally not stored in the project folder. The restricted workspace did not have Ollama running, so the report includes exact Ollama deployment commands and a terminal script that can be rerun after installation.

## I. Online Agent Deployment and Interaction

### Website Q&A Platform Integration

I also integrated a browser-based DeepSeek Q&A platform into RenXuan's blog:

- Page: `site/deepseek_qa.html`
- Script: `site/assets/deepseek_qa.js`
- Assignment entry: `site/assignment3.html`
- API endpoint: `https://api.deepseek.com/chat/completions`

The page does not hard-code an API key. The user enters a DeepSeek API Key in the browser, then chooses a model such as `deepseek-v4-flash`, `deepseek-v4-pro`, or a legacy compatible model. The page supports normal Q&A and text-file analysis by reading uploaded `.txt`, `.md`, `.csv`, `.json`, `.html`, `.css`, `.js`, or `.py` files into a context area.

### Model and Platform Choice

For the online agent, I used an OpenAI-compatible chat-completions design. This is practical because the same script can be pointed to providers such as DeepSeek, Qwen-compatible services, or OpenAI by changing environment variables.

The agent performs the assignment-required file-analysis task instead of web search. File analysis is easier to reproduce and safer for privacy because the input file is fixed in `data/ai_agent_notes.txt`.

### API Configuration

The API key is stored outside the code:

```powershell
$env:ONLINE_API_KEY="<redacted>"
$env:ONLINE_API_BASE="https://api.deepseek.com/chat/completions"
$env:ONLINE_MODEL="deepseek-chat"
```

The submitted `.env.example` shows the required variables but does not include a real key.

### Agent Implementation

The script `scripts/online_file_agent.py`:

1. Reads a local text file.
2. Combines the file content with a user question.
3. Sends the prompt to an online LLM endpoint.
4. Prints a concise answer grounded in the file.

Command:

```powershell
python scripts\online_file_agent.py --file data\ai_agent_notes.txt --question "Summarize the deployment workflow."
```

No-key verification command:

```powershell
python scripts\online_file_agent.py --demo --file data\ai_agent_notes.txt --question "What are the main differences between online and local AI agents?"
```

Output:

```text
Demo answer for question: What are the main differences between online and local AI agents?
- Online agents use a cloud API, so they are easy to start and strong for reasoning, but they require a network connection, quota, and privacy attention.
- Local agents run through tools such as Ollama, giving better privacy and offline control, but installation, memory use, and speed depend on the computer.
- IDE integration connects the model to coding tasks such as explanation, refactoring, test generation, and script writing.
```

## II. Local Model Deployment with Ollama

### Tool Choice

I chose Ollama because it provides a simple local LLM workflow on Windows, macOS, and Linux. The official Windows documentation states that after installation the `ollama` command is available in PowerShell and the local API is served at `http://localhost:11434`.[^1]

### Deployment Steps

Install Ollama on Windows by downloading the official Windows installer from the Ollama download page.[^2] After installation, open PowerShell and verify:

```powershell
ollama --version
```

Then pull and run a local model:

```powershell
ollama pull qwen2.5:7b
ollama serve
```

For a lower-memory computer, a smaller model can be used:

```powershell
ollama pull qwen2.5:0.5b
```

### Local Interaction Script

The script `scripts/ollama_local_agent.py` talks to the local Ollama API:

```powershell
python scripts\ollama_local_agent.py --model qwen2.5:7b --prompt "Explain what an AI coding agent does in three bullet points."
```

Current restricted-workspace output:

```text
Could not connect to Ollama at http://127.0.0.1:11434.
Reason: <urlopen error [WinError 10061] The target machine actively refused the connection.>
```

This was the main deployment challenge: Ollama was not installed or running in the current workspace. The script handles this situation by printing the exact setup commands. After Ollama is installed and the model is pulled, the same command becomes the required terminal interaction with the local model.

Expected successful response:

```text
- It receives a development task such as explaining, editing, or testing code.
- It reasons over the code context and produces concrete suggestions or patches.
- It shortens repetitive work while the human still checks correctness and intent.
```

## III. IDE Integration

### Development Environment

The environment check found VS Code 1.119.1. The installed extensions include Python tooling and Markdown preview support. In this assignment workflow, the AI assistant was used inside the coding environment to explain and refactor code.

### Refactoring Task

Original file: `scripts/refactor_before.py`

Original function:

```python
def avg_delay(records):
    total = 0
    count = 0
    for r in records:
        if r["delay"] != None:
            total = total + r["delay"]
            count = count + 1
    if count == 0:
        return 0
    return total / count
```

Prompt to the AI assistant:

```text
Please refactor scripts/refactor_before.py so the function name is clearer,
missing delay values are handled safely, the return type is predictable, and
the script can still be run directly from the terminal.
```

Refactored file: `scripts/refactor_after.py`

```python
from __future__ import annotations

from collections.abc import Iterable, Mapping


def average_delay(records: Iterable[Mapping[str, int | None]]) -> float:
    """Return the mean delay in minutes, ignoring missing delay values."""
    delays = [record["delay"] for record in records if record.get("delay") is not None]
    if not delays:
        return 0.0
    return sum(delays) / len(delays)
```

Verification:

```powershell
python scripts\refactor_before.py
python scripts\refactor_after.py
python -c "import ast, pathlib; [ast.parse(path.read_text(encoding='utf-8')) for path in pathlib.Path('scripts').glob('*.py')]; print('syntax ok')"
```

Output:

```text
10.0
10.0
syntax ok
```

The AI helped improve readability, type clarity, missing-value handling, and maintainability while preserving the same result.

## IV. Online vs. Local Model Comparison

| Dimension | Online model | Local model |
|---|---|---|
| Setup difficulty | Easy after obtaining an API key | Requires installing Ollama and downloading a model |
| Performance | Usually stronger and faster for complex reasoning | Depends on local CPU/GPU and model size |
| Cost | May use paid quota or token billing | No per-call API cost after download |
| Privacy | Data is sent to a remote provider | Data can stay on the local computer |
| Reliability | Requires network and provider availability | Can work offline after setup |
| Best use in my workflow | Complex coding help, summarization, polished writing | Private notes, quick local drafts, offline experiments |

## Challenges and Solutions

| Challenge | Solution |
|---|---|
| API keys should not be submitted | Used environment variables and `.env.example` with placeholder values |
| Online API may be unavailable in a restricted workspace | Added `--demo` mode to verify the agent logic without network access |
| Ollama was not found in the current environment | Added a local-agent script with clear setup instructions and error handling |
| VS Code command needed Windows `.cmd` handling | Updated `check_environment.py` to call `.cmd` tools through `cmd.exe /c` |
| Python bytecode cache writing was blocked during syntax check | Used AST parsing instead of `py_compile` for a no-cache syntax check |

## Reflection

The online model was the easiest agent to integrate because it only required an API key, endpoint, model name, and a short Python script. It is the best choice when I need strong reasoning, quick summarization, or code explanation. The disadvantage is that it depends on network access and requires careful handling of private files.

The local model workflow is more controllable. Ollama gives a simple local API, so the same idea can be integrated into scripts, terminals, or IDE tools. The main difficulty is the first setup: installing Ollama, downloading a model, and choosing a model size that fits the computer. Once deployed, it is useful for private or offline work.

For IDE integration, the most important lesson is that AI is most useful when the task is concrete. A vague request such as "improve this code" gives broad suggestions, but a specific request such as "rename the function, handle missing values, and keep the same output" produces a practical refactor. I still need to run the code and check the result; the AI speeds up the workflow but does not replace verification.

## Conclusion

This assignment helped me understand how AI agents can be deployed at three levels: online API access, local model serving, and development-environment integration. The final workflow is practical: use online models for complex reasoning, use local models for private/offline tasks, and use IDE assistance for code explanation and refactoring.

## References

[^1]: Ollama, "Windows," official documentation, https://docs.ollama.com/windows
[^2]: Ollama, "Download Ollama on Windows," https://ollama.com/download/windows
