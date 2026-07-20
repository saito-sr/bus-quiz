// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbxPcfF58pk3mQuC-u5JoRVLomDM1i0r6lbqGwCJjAuJkEfW0tZtsw4mLVBdQXQQecRwUw/exec";

let username = "";
let current = 0;
let answers = [];

// ★ 10～20問のクイズ（例）
const quiz = [
  { q: "日本で一番高い山は？", c: ["富士山", "北岳", "槍ヶ岳"] },
  { q: "寿司ネタで使われる「マグロ」の英語は？", c: ["Tuna", "Salmon", "Mackerel"] },
  { q: "千葉県の県庁所在地は？", c: ["千葉市", "船橋市", "柏市"] },
  { q: "サッカーは1チーム何人？", c: ["11人", "9人", "7人"] },
  { q: "地球は何番目の惑星？", c: ["3番目", "2番目", "4番目"] },
];

// ページ切り替え
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("名前を入力してください");
    return;
  }
  showPage("page-quiz");
  showQuestion();
}

function showQuestion() {
  const q = quiz[current];
  document.getElementById("question-title").innerText = `Q${current + 1}. ${q.q}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  q.c.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => selectAnswer(index);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("next-btn").disabled = true;
}

function selectAnswer(index) {
  answers[current] = index;
  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  current++;

  if (current >= quiz.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function finishQuiz() {
  showPage("page-finish");

  // ★ Google Apps Script に送信
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: username,
      answers: answers
    })
  });
}
