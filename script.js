// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbwpieVXbsqP7-z0D8SR9DXU9oBSqchUM-zVeyT6kcA7QDcMiSRuKE_xiVXNkU_uZjVVag/exec";

let username = "";
let current = 0;
let answers = [];

// ★ クイズデータ
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

  current = 0;
  answers = [];

  showPage("page-quiz");
  showQuestion();
}

function showQuestion() {
  const q = quiz[current];
  document.getElementById("question-title").innerText = `Q${current + 1}. ${q.q}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (q.img) {
    const img = document.createElement("img");
    img.src = q.img;
    img.classList.add("question-img");
    choicesDiv.appendChild(img);
  }
  
  // ★ 選択肢ボタン生成（色変更対応）
  q.c.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.classList.add("choice-btn");

    // 過去に選択していたら色を戻す
    if (answers[current] === index) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(index, btn);
    choicesDiv.appendChild(btn);
  });

  // ★ 前へ・次へボタンを追加
  const navDiv = document.createElement("div");
  navDiv.classList.add("nav-container");
  
  // 前へボタン（1問目は非表示）
  if (current > 0) {
    const prevBtn = document.createElement("button");
    prevBtn.innerText = "前へ";
    prevBtn.classList.add("nav-btn");
    prevBtn.onclick = prevQuestion;
    navDiv.appendChild(prevBtn);
  }
  
  // 次へボタン（常に右側）
  const nextBtn = document.createElement("button");
  nextBtn.innerText = current === quiz.length - 1 ? "回答を送信" : "次へ";
  nextBtn.classList.add("nav-btn");
  nextBtn.onclick = nextQuestion;
  navDiv.appendChild(nextBtn);
  
  choicesDiv.appendChild(navDiv);
}

function selectAnswer(index, btn) {
  answers[current] = index;

  // ★ 他のボタンの selected を外す
  document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));

  // ★ 選択したボタンだけ色を付ける
  btn.classList.add("selected");
}

function nextQuestion() {
  if (current >= quiz.length - 1) {
    finishQuiz();
    return;
  }
  current++;
  showQuestion();
}

function prevQuestion() {
  current--;
  showQuestion();
}

function finishQuiz() {
  showPage("page-finish");

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: username,
      answers: answers
    })
  });
}

