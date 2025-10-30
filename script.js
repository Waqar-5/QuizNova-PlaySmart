const questions = [
  { num:1, question:"What does HTML stand for?", options:{a:"Hyper Text Markup Language", b:"Hyper Tool Multi Language", c:"Hyperlink and Text Markup Language", d:"Home Tool Markup Language"}, answer:"a"},
  { num:2, question:"Which tag is used to create a hyperlink in HTML?", options:{a:"<link>", b:"<a>", c:"<href>", d:"<url>"}, answer:"b"},
  { num:3, question:"Which property controls text size in CSS?", options:{a:"font-style", b:"text-size", c:"font-size", d:"text-font"}, answer:"c"},
  { num:4, question:"Which of the following is NOT a JavaScript data type?", options:{a:"Undefined", b:"Boolean", c:"Float", d:"String"}, answer:"c"},
  { num:5, question:"Which symbol is used for single-line comments in JavaScript?", options:{a:"//", b:"#", c:"<!-- -->", d:"/* */"}, answer:"a"},
  { num:6, question:"What does CSS stand for?", options:{a:"Creative Style Sheets", b:"Cascading Style Sheets", c:"Computer Style System", d:"Colorful Style Syntax"}, answer:"b"},
  { num:7, question:"Which HTML attribute specifies alternate text for an image?", options:{a:"title", b:"alt", c:"src", d:"caption"}, answer:"b"},
  { num:8, question:"Which method is used to print something on the console in JavaScript?", options:{a:"document.print()", b:"console.print()", c:"console.log()", d:"alert()"}, answer:"c"},
  { num:9, question:"Which of the following is a Python keyword?", options:{a:"val", b:"def", c:"function", d:"create"}, answer:"b"},
  { num:10, question:"Which company developed JavaScript?", options:{a:"Microsoft", b:"Netscape", c:"Google", d:"Oracle"}, answer:"b"}
];

const formSection=document.querySelector(".form-wrapper"),
  quizSection=document.querySelector(".quiz-section"),
  resultSection=document.querySelector(".result-section"),
  inpName=document.getElementById("inp_name"),
  inpEmail=document.getElementById("inp_email"),
  inpRoll=document.getElementById("inp_roll"),
  inpInst=document.getElementById("inp_inst"),
  startBtn=document.getElementById("start-btn"),
  nextBtn=document.getElementById("next-btn"),
  restartBtn=document.getElementById("restart-btn"),
  qNumber=document.querySelector(".q-number"),
  totalQ=document.querySelector(".total-questions"),
  questionText=document.getElementById("question-text"),
  optionsList=document.querySelectorAll("#options li"),
  timeLeftElem=document.getElementById("time-left"),
  totalTimeLeftElem=document.getElementById("total-time-left"),
  resName=document.getElementById("res_name"),
  resEmail=document.getElementById("res_email"),
  resRoll=document.getElementById("res_roll"),
  resInst=document.getElementById("res_inst"),
  totalElem=document.getElementById("total"),
  correctElem=document.getElementById("correct"),
  wrongElem=document.getElementById("wrong"),
  missedElem=document.getElementById("missed"),
  percElem=document.getElementById("percentage"),
  passFail=document.getElementById("pass-fail"),
  progressValue=document.querySelector(".progress-value");

let currentIndex=0, correctCount=0, wrongCount=0, missedCount=0;
let timer,totalTimer;
const timePerQuestion=30;
let currentTime=timePerQuestion;
let totalTimeLeft=questions.length*timePerQuestion;
let totalElapsedTime=0;

// === FORM VALIDATION ===
function validateForm() {
  if (!inpName.value || !inpEmail.value || !inpRoll.value || !inpInst.value) {
    Swal.fire({icon:"warning", title:"Please fill all fields!", background:"#243b55", color:"#fff"});
    return false;
  }
  if (!inpEmail.value.includes("@")) {
    Swal.fire({icon:"error", title:"Invalid Email Address!", background:"#243b55", color:"#fff"});
    return false;
  }
  return true;
}

// === START QUIZ ===
startBtn.addEventListener("click", () => {
  if (!validateForm()) return;
  Swal.fire({
    title:"Confirm Your Details",
    html:`<b>Name:</b> ${inpName.value}<br><b>Email:</b> ${inpEmail.value}<br><b>Roll:</b> ${inpRoll.value}<br><b>Institute:</b> ${inpInst.value}`,
    icon:"info",
    background:"#243b55",
    color:"#fff",
    showCancelButton:true,
    confirmButtonColor:"#43a047",
    cancelButtonColor:"#fdd835",
    confirmButtonText:"✅ Start Now",
    cancelButtonText:"✏️ Edit"
  }).then((r)=>{
    if(r.isConfirmed){
      Swal.fire({title:"🎯 Get Ready!", text:"Your quiz starts now!", timer:1500, showConfirmButton:false, background:"#243b55", color:"#fff"});
      setTimeout(()=>{
        formSection.classList.remove("active");
        quizSection.classList.add("active");
        totalQ.textContent=questions.length;
        totalTimeLeftElem.textContent=totalTimeLeft+"s";
        loadQuestion();
        startTotalTimer();
      },1600);
    }
  });
});

function loadQuestion() {
  const q=questions[currentIndex];
  qNumber.textContent=currentIndex+1;
  questionText.textContent=q.question;
  optionsList.forEach((li,i)=>{
    li.textContent=`${String.fromCharCode(65+i)}. ${Object.values(q.options)[i]}`;
    li.dataset.key=Object.keys(q.options)[i];
    li.className="";
  });
  nextBtn.style.display="none";
  startQuestionTimer();
}

function startQuestionTimer() {
  currentTime=timePerQuestion;
  clearInterval(timer);
  timer=setInterval(()=>{
    currentTime--;
    totalTimeLeft--;
    totalElapsedTime++;
    timeLeftElem.textContent=currentTime;
    totalTimeLeftElem.textContent=totalTimeLeft+"s";
    if(currentTime<=0){
      clearInterval(timer);
      missedCount++;
      markCorrectAnswer();
      disableOptions();
      nextBtn.style.display="block";
    }
  },1000);
}

function startTotalTimer() {
  totalTimer=setInterval(()=>{
    if(totalTimeLeft<=0){
      clearInterval(totalTimer);
      showResult();
    }
  },1000);
}

optionsList.forEach((li)=>{
  li.addEventListener("click",(e)=>{
    clearInterval(timer);
    const selectedKey=e.target.dataset.key;
    const correctKey=questions[currentIndex].answer;
    disableOptions();
    if(selectedKey===correctKey){e.target.classList.add("correct"); correctCount++;}
    else {e.target.classList.add("wrong"); wrongCount++; markCorrectAnswer();}
    nextBtn.style.display="block";
  });
});

function markCorrectAnswer(){
  const correctKey=questions[currentIndex].answer;
  optionsList.forEach((li)=>{if(li.dataset.key===correctKey) li.classList.add("correct");});
}

function disableOptions(){optionsList.forEach((li)=>li.classList.add("disabled"));}

nextBtn.addEventListener("click",()=>{
  currentIndex++;
  if(currentIndex<questions.length) loadQuestion(); else showResult();
});

function showResult(){
  clearInterval(timer);
  clearInterval(totalTimer);
  quizSection.classList.remove("active");
  resultSection.classList.add("active");

  resName.textContent=inpName.value;
  resEmail.textContent=inpEmail.value;
  resRoll.textContent=inpRoll.value;
  resInst.textContent=inpInst.value;
  totalElem.textContent=questions.length;
  correctElem.textContent=correctCount;
  wrongElem.textContent=wrongCount;
  missedElem.textContent=missedCount;
  const percentage=Math.round((correctCount/questions.length)*100);
  percElem.textContent=percentage+"%";
  passFail.textContent=percentage>=60?"🎉 You Passed!":"❌ You Failed!";
  passFail.className=percentage>=60?"pass":"fail";
  progressValue.style.width=percentage+"%";
  progressValue.textContent=percentage+"%";
  document.getElementById("time-taken").textContent=totalElapsedTime+"s";
  document.getElementById("time-remaining").textContent=totalTimeLeft+"s";

  Swal.fire({
    title: percentage>=60?"🎉 Congratulations!":"❌ Try Again!",
    html:`<p><b>Score:</b> ${percentage}%</p><p><b>Correct:</b> ${correctCount}</p><p><b>Wrong:</b> ${wrongCount}</p><p><b>Missed:</b> ${missedCount}</p>`,
    icon: percentage>=60?"success":"error",
    background:"#243b55",
    color:"#fff",
    confirmButtonColor:"#43a047"
  });
}

restartBtn.addEventListener("click",()=>{
  currentIndex=0; correctCount=0; wrongCount=0; missedCount=0;
  totalTimeLeft=questions.length*timePerQuestion; totalElapsedTime=0;
  resultSection.classList.remove("active");
  formSection.classList.add("active");
  inpName.value=""; inpEmail.value=""; inpRoll.value=""; inpInst.value="";
});
