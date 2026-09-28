// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbwybZM4_qtRJ3-SI34UbJh632fF_9D9HrwrFDfGRtKD1QsVZMs0wf3R-jYNKwmQ4it50A/exec";

let username = "";
let current = 0;
let answers = [];

// ★ 20問のクイズ（例）
const quiz = [
  { q: "青く光る小さな海の生物「ウミホタル」は、海ほたるパーキングエリアの名称の由来にもなっています。このウミホタルは別名で何と呼ばれているでしょう？", c: ["海の電気屋さん", "海のお掃除屋さん", "海の宝石屋さん", "海の便利屋さん"], correct: 1},
  { q: "元メンバーが社労士になったことで話題となったバンドはどれでしょう？", c: ["サザンオールスターズ", "Mrs.GREEN APPLE", "GLAY", "Mr.Children"], correct: 1},  
  { q: "植松支部長は船橋支部で歴代、何代目の支部長でしょうか？", c: ["第21代", "第22代", "第23代", "第24代"], correct: 3},
  {
    q: "AIで男性を絶世の美女に加工しています。写真の中から植松支部長を選んでください。",
    type: "image-single",   // ← 画像問題であることを示す
    images: [
      "images/LINE_ALBUM_写真クイズ①_260912_1.jpg",
      "images/LINE_ALBUM_写真クイズ①_260912_2.jpg",
      "images/LINE_ALBUM_写真クイズ①_260912_3.jpg",
      "images/LINE_ALBUM_写真クイズ①_260912_4.jpg",
      "images/LINE_ALBUM_写真クイズ①_260912_5.jpg",
      "images/LINE_ALBUM_写真クイズ①_260916_6.jpg",
      "images/LINE_ALBUM_写真クイズ①_260912_7.jpg",
    ],
    correct: 5        // ← 正解画像のインデックス（複数）
  },
  { q: "船橋支部で、これまで女性の支部長を務めた人数は何名でしょう？", c: ["1人", "2人", "3人", "4人"], correct: 2},
  { q: "船橋支部管内の労基署である東金労基署の管轄の市は次のうちどこでしょう？", c: ["佐倉市", "印西市", "富里市", "白井市"], correct: 0},
  { q: "出光興産の創業者である出光佐三の経営哲学や会社の歴史は、ある映画のモデルとなりました。その映画は次のうちどれでしょう？", c: ["沈まぬ太陽", "不毛地帯", "華麗なる一族", "海賊と呼ばれた男"], correct: 3},  
  { q: "出光興産千葉事業所は、出光グループ内でどのような位置付けの事業所でしょうか？", c: ["グループ内で最大規模の事業所", "グループ内で最小規模の事業所", "グループ内で最初に作られた最古の事業所", "グループ内で最も新しい最新の事業所"], correct: 0},  
  { q: "出光興産はゼネコンや運送会社と連携し、既存のディーゼルエンジンをそのまま動かせる次世代バイオ燃料「出光リニューアルディーゼル（IRD）」の実証・導入を進めています。この燃料の主な原料は何でしょうか？", c: ["トウモロコシ", "藻類（ミドリムシなど）", "廃食用油", "木材チップ"], correct: 2},
  { q: "障がいや難病のある方が利用する「就労継続支援Ｂ型事業所」の最大の特徴はどれでしょうか？", c: ["事業所と雇用契約を結び、最低賃金以上の給与が支払われる", "事業所と雇用契約を結ばず、作業に応じた「工賃」が支払われる", "原則として２年しか利用することができない", "原則として「６５歳未満」の年齢制限があり、高齢者は利用できない"], correct: 1},
  { q: "AolnAolnオーキッドガーデンでは仕事を一つの大きな工程ではなく、細かな作業に分けています。その目的は？", c: ["作業時間をできるだけ長くするため", "できるだけ機械化するため", "一人一人に合った仕事を見つけやすくするため", "栽培する花の種類を増やしていくため"], correct: 2},
  { q: "令和8年10月1日から適用される千葉県の地域別最低賃金（時間額）はいくらでしょう？", c: ["1,140円", "1,165円", "1,195円", "1,210円"], correct: 2},
  { q: "令和8年度の最低賃金周知キャンペーンポスターに起用された有名人は誰でしょうか。？", c: ["長州力さん", "竹中直人さん", "藤原紀香さん", "近藤春奈さん"], correct: 1},  
  { q: "社会保険労務士法が施行されたのはいつでしょう？", c: ["昭和42年(1967年)", " 昭和43年（1968年）", "昭和44年（1969年）", "昭和45年（1970年）"], correct: 1},
  { q: "第1回社会保険労務士試験が実施されたのはいつでしょう？", c: ["昭和43年（1968年）", "昭和44年（1969年）", "昭和45年（1970年）", "昭和46年（1971年）"], correct: 1},
  { q: "社会保険労務士法で「信用失墜行為の禁止」が定められているのは何条でしょう？", c: ["第10条", "第15条", "第16条", "第18条"], correct: 0}, 
  { q: "第58回社会保険労務士試験(8月23日実施)選択式雇用保険法より<br>雇用保険法第4条第3項において、「失業」とは、被保険者が離職し、（　　　　　　）を有するにもかかわらず、職業に就くことができない状態にあること」と規定している", c: ["求職の意思", "求職の意思及び能力", "労働の意思", "労働の意思及び能力"], correct: 3},
  { q: "第58回社会保険労務士試験(8月23日実施)選択式労務管理その他労働に関する一般常識より<br>令和7年6月1日現在の民間企業に雇用されている障害者の数は704,610人で、実雇用率は14年連続で過去最高の（　　　　）％、法定雇用率達成企業の割合は46％であった。", c: ["1.82％", "2.41％", "3.07％", "3.69％"], correct: 1},
  { q: "第58回社会保険労務士試験(8月23日実施)選択式社会保険に関する一般常識より<br>令和6年末の、国民年金保険料の全額免除•猶予者数は592万人であり、全額免除•猶予者数が国民年金の第1号被保険者数（任意加入被保険者を除く）に占める割合は（　　　　）％となっている", c: ["4.0％", "24.0％", "44.0％", "64.0％"], correct: 2}, 
  { q: "？", c: ["選択肢なし", "選択肢なし", "選択肢なし", "選択肢なし"], correct: 0},   
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

  document.getElementById("question-title").innerHTML = `Q${current + 1}. ${q.q}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  // ★ 画像複数選択問題（image-multi）
  if (q.type === "image-multi") {
    const grid = document.createElement("div");
    grid.classList.add("image-grid");

    const labels = ["A","B","C","D","E","F","G","H","I"];

    q.images.forEach((src, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("image-wrapper");

      const label = document.createElement("div");
      label.classList.add("image-label");
      label.textContent = labels[index];

      const img = document.createElement("img");
      img.src = src;
      img.classList.add("image-choice");

      // object-position の設定
      if (src.includes("_1.jpg")) img.style.objectPosition = "center";
      if (src.includes("_2.jpg")) img.style.objectPosition = "center";
      if (src.includes("_3.jpg")) img.style.objectPosition = "top";
      if (src.includes("_4.jpg")) img.style.objectPosition = "center";
      if (src.includes("_5.jpg")) img.style.objectPosition = "center";
      if (src.includes("_6.jpg")) img.style.objectPosition = "center";

      if (src.includes("_1.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_2.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_3.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_4.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_5.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_6.jpeg")) img.style.objectPosition = "top";
      if (src.includes("_7.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_8.jpeg")) img.style.objectPosition = "center";
      if (src.includes("_9.jpeg")) img.style.objectPosition = "center";

      if (answers[current] && answers[current].includes(index)) {
        img.classList.add("selected");
      }

      img.onclick = () => toggleImageSelect(index, img);

      wrapper.appendChild(label);
      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    });

    choicesDiv.appendChild(grid);
  }

  // ★ 画像単一選択問題（image-single）
  else if (q.type === "image-single") {
    const grid = document.createElement("div");
    grid.classList.add("image-grid");

    const labels = ["A","B","C","D","E","F","G","H","I"];

    q.images.forEach((src, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("image-wrapper");

      const label = document.createElement("div");
      label.classList.add("image-label");
      label.textContent = labels[index];

      const img = document.createElement("img");
      img.src = src;
      img.classList.add("image-choice");

      if (answers[current] === index) {
        img.classList.add("selected");
      }

      img.onclick = () => {
        answers[current] = index;
        document.querySelectorAll(".image-choice").forEach(i => i.classList.remove("selected"));
        img.classList.add("selected");
      };

      wrapper.appendChild(label);
      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    });

    choicesDiv.appendChild(grid);
  }

  // ★ 通常の4択問題
  else {
    const labels = ["A", "B", "C", "D"];

    q.c.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.classList.add("choice-btn");
      btn.textContent = `${labels[index]}. ${choice}`;

      if (answers[current] === index) {
        btn.classList.add("selected");
      }

      btn.onclick = () => selectAnswer(index, btn);
      choicesDiv.appendChild(btn);
    });
  }

  // ★ 次へボタン
  const navDiv = document.createElement("div");
  navDiv.classList.add("nav-container");

  const nextBtn = document.createElement("button");
  nextBtn.innerText = current === quiz.length - 1 ? "回答を送信" : "次へ";
  nextBtn.classList.add("nav-btn");
  nextBtn.onclick = nextQuestion;
  navDiv.appendChild(nextBtn);

  choicesDiv.appendChild(navDiv);
}

function selectAnswer(index, btn) {
  answers[current] = index;
  document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function toggleImageSelect(index, imgElement) {
  if (!answers[current]) answers[current] = [];

  const selected = answers[current];

  if (selected.includes(index)) {
    answers[current] = selected.filter(i => i !== index);
    imgElement.classList.remove("selected");
  } else {
    if (selected.length < 2) {
      selected.push(index);
      imgElement.classList.add("selected");
    }
  }
}

// ★ 未回答チェック
function nextQuestion() {
  const q = quiz[current];

  if (q.type === "image-multi") {
    if (!answers[current] || answers[current].length < 2) {
      alert("画像を2枚選択してください");
      return;
    }
  }

  else if (q.type === "image-single") {
    if (answers[current] === undefined) {
      alert("画像を1枚選択してください");
      return;
    }
  }

  else {
    if (answers[current] === undefined) {
      alert("回答を選択してください");
      return;
    }
  }

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

  let score = 0;

  quiz.forEach((q, index) => {
    if (q.type === "image-multi") {
      const correctSet = new Set(q.correct);
      const userSet = new Set(answers[index] || []);
      if (correctSet.size === userSet.size && [...correctSet].every(v => userSet.has(v))) {
        score++;
      }
    }

    else if (q.type === "image-single") {
      if (answers[index] === q.correct) score++;
    }

    else {
      if (answers[index] === q.correct) score++;
    }
  });

  document.getElementById("result-score").innerText =
    `${username}さんの正解数は ${score} / ${quiz.length} です`;

  const summaryDiv = document.getElementById("answer-summary");
  summaryDiv.innerHTML = "";

  const labels = ["A","B","C","D"];

  quiz.forEach((q, index) => {
    let userAnswerText = "未回答";

    if (q.type === "image-multi") {
      const selected = answers[index] || [];
      userAnswerText = selected.length > 0
        ? selected.map(i => `画像${i+1}`).join("・")
        : "未回答";
    }

    else if (q.type === "image-single") {
      if (answers[index] !== undefined) {
        userAnswerText = `画像${answers[index] + 1}`;
      }
    }

    else {
      const userAnswerIndex = answers[index];
      if (userAnswerIndex !== undefined) {
        const userLabel = labels[userAnswerIndex];
        userAnswerText = `${userLabel}. ${q.c[userAnswerIndex]}`;
      }
    }

    const p = document.createElement("p");
    p.innerHTML =
      `Q${index + 1}. ${q.q}<br><br>` +
      `<strong>あなたの回答: ${userAnswerText}</strong>`;

    summaryDiv.appendChild(p);
  });

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: username,
      answers: [...answers],
      score: score
    })
  });
}
