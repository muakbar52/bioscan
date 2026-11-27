const state={page:"home",score:0,answered:0,scanDone:false};

const pages={home:"BioScan AI",scanner:"BioScanner",bioai:"Tanya BioAI",quiz:"Kuis Visual HOTS",dashboard:"Dashboard Hasil Murid",gallery:"Galeri Preparat Sel Digital"};

function go(page){
  state.page=page;
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.querySelector("#page-"+page).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  document.querySelector("#pageTitle").textContent=pages[page];
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-go]");
  if(btn) go(btn.dataset.go);
  const nav=e.target.closest(".nav-item");
  if(nav) go(nav.dataset.page);
});

const input=document.querySelector("#imageInput"), preview=document.querySelector("#preview"), analyze=document.querySelector("#analyzeBtn");
document.querySelector("#chooseImage").onclick=()=>input.click();
input.onchange=()=>{
  const file=input.files[0]; if(!file)return;
  preview.src=URL.createObjectURL(file); preview.hidden=false;
  analyze.disabled=false;
  document.querySelector("#scanBadge").textContent="Citra siap dianalisis";
  document.querySelector("#scanBadge").style.background="#e8fff5";
  document.querySelector("#scanBadge").style.color="#0b8a60";
};
analyze.onclick=()=>{
  analyze.disabled=true;
  document.querySelector("#scanBadge").textContent="Menganalisis...";
  setTimeout(()=>{
    const organels=[
      ["Mitokondria",92,"Pusat respirasi seluler dan produksi ATP."],
      ["Kloroplas",88,"Organel tempat berlangsungnya fotosintesis pada sel tumbuhan."],
      ["Inti Sel",94,"Pusat pengendalian aktivitas sel dan penyimpanan materi genetik."],
      ["Dinding Sel",86,"Struktur pelindung dan pemberi bentuk pada sel tumbuhan."],
      ["Vakuola",90,"Ruang penyimpanan air, ion, pigmen, dan berbagai zat terlarut."]
    ];
    const r=organels[Math.floor(Math.random()*organels.length)];
    document.querySelector("#scanResult").innerHTML=`
      <div class="result-box">
        <h4>Prediksi organel: ${r[0]}</h4>
        <p>Confidence score simulasi: <b>${r[1]}%</b></p>
        <div class="confidence"><i style="width:${r[1]}%"></i></div>
        <p>${r[2]}</p>
        <small>Catatan: ini adalah simulasi prototype lokal. Model Teachable Machine/OpenCV asli memerlukan model dan backend yang terhubung.</small>
      </div>`;
    document.querySelector("#scanBadge").textContent="Analisis selesai";
    analyze.disabled=false; state.scanDone=true;
    document.querySelector("#dashScan").textContent="✓";
  },900);
};

const knowledge={
  "mitokondria":"Mitokondria berperan penting dalam respirasi seluler dan menghasilkan ATP sebagai sumber energi yang digunakan untuk berbagai aktivitas sel.",
  "kloroplas":"Kloroplas merupakan organel khas sel tumbuhan dan alga yang menjadi tempat berlangsungnya fotosintesis. Klorofil menangkap energi cahaya untuk membantu pembentukan senyawa organik.",
  "perbedaan":"Sel tumbuhan umumnya memiliki dinding sel, kloroplas, dan vakuola besar. Sel hewan tidak memiliki dinding sel dan kloroplas serta biasanya memiliki vakuola yang lebih kecil.",
  "vakuola":"Vakuola membantu penyimpanan air dan zat terlarut serta berperan dalam menjaga tekanan turgor pada sel tumbuhan.",
  "inti":"Inti sel menyimpan sebagian besar materi genetik dan berperan mengatur berbagai aktivitas sel."
};
function aiAnswer(q){
  const s=q.toLowerCase();
  for(const k in knowledge) if(s.includes(k)) return knowledge[k];
  if(s.includes("fungsi")) return "Sebutkan nama organelnya agar saya dapat menjelaskan fungsi, struktur, dan kaitannya dengan proses kehidupan sel.";
  return "Pertanyaan menarik. Untuk prototype ini, saya dapat membantu topik struktur dan fungsi organel sel. Coba tanyakan fungsi mitokondria, kloroplas, inti sel, vakuola, atau perbedaan sel tumbuhan dan sel hewan.";
}
function addMsg(text,type){
  const box=document.querySelector("#chatMessages");
  const d=document.createElement("div"); d.className="msg "+type;
  d.innerHTML=`<b>${type==="ai"?"BioAI":"Anda"}</b><p>${text}</p>`;
  box.appendChild(d); box.scrollTop=box.scrollHeight;
}
document.querySelector("#chatForm").onsubmit=e=>{
  e.preventDefault(); const inp=document.querySelector("#chatInput"); const q=inp.value.trim(); if(!q)return;
  addMsg(q,"user"); inp.value="";
  setTimeout(()=>addMsg(aiAnswer(q),"ai"),450);
};
document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>{
  const q=b.dataset.q; addMsg(q,"user"); setTimeout(()=>addMsg(aiAnswer(q),"ai"),350);
});

const questions=[
 {q:"Sebuah foto preparat menunjukkan struktur oval dengan banyak lipatan pada bagian dalam. Struktur tersebut paling tepat dikaitkan dengan...",a:["Mitokondria dan respirasi seluler","Kloroplas dan fotosintesis","Vakuola dan penyimpanan","Dinding sel dan perlindungan"],c:0,e:"Lipatan membran dalam merupakan ciri penting mitokondria dan memperluas permukaan untuk proses respirasi seluler."},
 {q:"Jika sel tumbuhan kehilangan kloroplas, proses yang paling langsung terganggu adalah...",a:["Fotosintesis","Replikasi DNA","Pembelahan inti","Pengangkutan air oleh vakuola"],c:0,e:"Kloroplas mengandung sistem fotosintetik sehingga kehilangan kloroplas secara langsung mengganggu fotosintesis."},
 {q:"Mengapa kerusakan inti sel dapat berdampak pada banyak aktivitas sel sekaligus?",a:["Inti menyimpan materi genetik dan mengatur ekspresi gen","Inti menghasilkan semua ATP","Inti merupakan tempat fotosintesis","Inti hanya berfungsi sebagai penyimpan air"],c:0,e:"Informasi genetik menjadi dasar pengaturan sintesis protein dan berbagai aktivitas sel."},
 {q:"Sel tumbuhan tampak tetap kaku ketika air cukup. Struktur yang paling berperan bersama vakuola adalah...",a:["Dinding sel","Mitokondria","Ribosom","Inti sel"],c:0,e:"Vakuola membantu tekanan turgor, sedangkan dinding sel mempertahankan bentuk dan kekuatan sel."},
 {q:"Dua sel memiliki ukuran sama, tetapi salah satunya memiliki jumlah mitokondria lebih banyak. Dugaan yang paling masuk akal adalah sel tersebut...",a:["Memerlukan energi lebih besar","Tidak memiliki DNA","Tidak melakukan metabolisme","Selalu merupakan sel tumbuhan"],c:0,e:"Jumlah mitokondria dapat berkaitan dengan kebutuhan energi yang tinggi pada tipe sel tertentu."}
];
function renderQuiz(){
  const box=document.querySelector("#quizContainer"); box.innerHTML="";
  questions.forEach((x,i)=>{
    const card=document.createElement("article"); card.className="quiz-card";
    card.innerHTML=`<div class="question-no">SOAL ${i+1}</div><h3>${x.q}</h3><div>${x.a.map((o,j)=>`<button class="option" data-i="${i}" data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join("")}</div><div class="feedback" id="fb-${i}"></div>`;
    box.appendChild(card);
  });
  box.querySelectorAll(".option").forEach(btn=>btn.onclick=()=>{
    const i=+btn.dataset.i,j=+btn.dataset.j;
    const all=box.querySelectorAll(`.option[data-i="${i}"]`);
    all.forEach(x=>x.disabled=true);
    if(j===questions[i].c){btn.classList.add("correct");state.score++;}else{btn.classList.add("wrong");all[questions[i].c].classList.add("correct")}
    state.answered++;
    document.querySelector("#score").textContent=state.score;
    document.querySelector("#quizPercent").textContent=Math.round(state.answered/questions.length*100)+"%";
    document.querySelector("#quizBar").style.width=(state.answered/questions.length*100)+"%";
    document.querySelector("#fb-"+i).textContent=(j===questions[i].c?"Benar. ":"Belum tepat. ")+questions[i].e;
    if(state.answered===questions.length) document.querySelector("#dashQuiz").textContent="✓";
  });
}
renderQuiz();

document.querySelector("#resetProgress").onclick=()=>{
  state.score=0;state.answered=0;state.scanDone=false;
  document.querySelector("#score").textContent="0";
  document.querySelector("#quizPercent").textContent="0%";
  document.querySelector("#quizBar").style.width="0%";
  document.querySelector("#dashScan").textContent="○";document.querySelector("#dashQuiz").textContent="○";
  renderQuiz();
  alert("Progres sesi telah direset.");
};
const saved=localStorage.getItem("bioscan_student");
if(saved)document.querySelector("#studentName").value=saved;
document.querySelector("#studentName").addEventListener("input",e=>localStorage.setItem("bioscan_student",e.target.value));
