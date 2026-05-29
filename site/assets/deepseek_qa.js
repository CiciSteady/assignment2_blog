const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const STORAGE_KEY = "renxuan_deepseek_api_key";

const apiKeyInput = document.querySelector("#api-key");
const rememberKeyInput = document.querySelector("#remember-key");
const modelInput = document.querySelector("#model");
const temperatureInput = document.querySelector("#temperature");
const systemPromptInput = document.querySelector("#system-prompt");
const contextFileInput = document.querySelector("#context-file");
const contextTextInput = document.querySelector("#context-text");
const questionInput = document.querySelector("#question");
const chatLog = document.querySelector("#chat-log");
const form = document.querySelector("#qa-form");
const clearButton = document.querySelector("#clear-chat");
const statusLine = document.querySelector("#status-line");

const savedKey = localStorage.getItem(STORAGE_KEY);
if (savedKey) {
  apiKeyInput.value = savedKey;
  rememberKeyInput.checked = true;
}

function setStatus(message) {
  statusLine.textContent = message;
}

function appendMessage(role, content) {
  const article = document.createElement("article");
  article.className = `chat-message ${role === "user" ? "user-message" : "assistant-message"}`;

  const label = document.createElement("strong");
  label.textContent = role === "user" ? "You" : "DeepSeek Assistant";

  const body = document.createElement("p");
  body.textContent = content;

  article.append(label, body);
  chatLog.append(article);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function buildUserContent(question, context) {
  if (!context.trim()) {
    return question;
  }

  return [
    "Use the following uploaded or pasted context to answer the question.",
    "If the context is not enough, explain what is missing.",
    "",
    "Context:",
    context,
    "",
    "Question:",
    question,
  ].join("\n");
}

async function askDeepSeek({ apiKey, model, temperature, systemPrompt, question, context }) {
  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildUserContent(question, context) },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "No answer returned.";
}

contextFileInput.addEventListener("change", async () => {
  const [file] = contextFileInput.files;
  if (!file) {
    return;
  }

  if (file.size > 160000) {
    setStatus("文件较大，已读取前 160KB 内容用于演示。");
  } else {
    setStatus(`已读取文件：${file.name}`);
  }

  const text = await file.text();
  contextTextInput.value = text.slice(0, 160000);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const question = questionInput.value.trim();
  const model = modelInput.value;
  const temperature = Number(temperatureInput.value || 0.3);
  const systemPrompt = systemPromptInput.value.trim();
  const context = contextTextInput.value.trim();

  if (!apiKey) {
    setStatus("请先输入 DeepSeek API Key。");
    return;
  }

  if (!question) {
    setStatus("请输入问题。");
    return;
  }

  if (rememberKeyInput.checked) {
    localStorage.setItem(STORAGE_KEY, apiKey);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  appendMessage("user", question);
  questionInput.value = "";
  setStatus("正在请求 DeepSeek...");

  try {
    const answer = await askDeepSeek({
      apiKey,
      model,
      temperature,
      systemPrompt,
      question,
      context,
    });
    appendMessage("assistant", answer);
    setStatus("回答已生成。");
  } catch (error) {
    appendMessage(
      "assistant",
      `请求失败：${error.message}\n如果页面部署在 GitHub Pages 后被浏览器拦截，通常是 CORS 或 API Key 权限问题，可改用本地代理或 Python 脚本演示。`
    );
    setStatus("请求失败，请检查 API Key、网络和浏览器控制台。");
  }
});

clearButton.addEventListener("click", () => {
  chatLog.innerHTML = "";
  appendMessage("assistant", "对话已清空，可以开始新的问题。");
  setStatus("");
});
