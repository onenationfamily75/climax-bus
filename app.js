
const WA="254107524689";
const D={Kisii:1500,Kisumu:1500,Kitale:1500,Busia:1500,Kakamega:1500,Malaba:1500,Mumias:1500,Siaya:1500,Butere:1500,Bungoma:1500,Bondo:1500,Eldoret:1500,Webuye:1500,Kapsabet:1500,Kericho:1500,Nakuru:1000,Mbale:2000,"Port Victoria":1500,Vihiga:1500,Chavakali:1500,"Mois Bridge":1500,Matunda:1500,Majengo:1500,Shamakhokho:1500};
const TIMES=["08:00 AM","12:00 PM","04:00 PM","08:00 PM","09:00 PM"];
const P=["Nairobi",...Object.keys(D).sort()];
const $=id=>document.getElementById(id);
const IMG=["images/climax-coach-1.jpg", "images/climax-coach-2.jpg", "images/climax-coach-3.jpg", "images/climax-coach-4.jpg", "images/climax-coach-5.jpg", "images/climax-coach-6.jpg", "images/climax-coach-7.jpg", "images/climax-coach-8.jpg"];
$("hslides").innerHTML=IMG.map((s,i)=>`<div class="hs ${i?"":"on"}" style="background-image:url(${s})"></div>`).join("");
{let k=0;const hs=document.querySelectorAll(".hs");setInterval(()=>{hs[k].classList.remove("on");k=(k+1)%hs.length;hs[k].classList.add("on")},4500)}

const fare=(a,b)=>D[a==="Nairobi"?b:a];
let S={};

$("from").innerHTML=P.map(p=>`<option>${p}</option>`).join("");
$("to").innerHTML=P.map(p=>`<option>${p}</option>`).join("");
$("to").value="Kisumu";
$("pax").innerHTML=[1,2,3,4,5,6,7,8].map(n=>`<option>${n}</option>`).join("");
const today=new Date().toISOString().slice(0,10);$("date").min=today;$("date").value=today;

if($("rgrid"))$("rgrid").innerHTML=Object.keys(D).map((d,i)=>`<div class="card" onclick="pick('Nairobi','${d}')"><img src="${IMG[i%IMG.length]}" alt="Climax Coaches bus to ${d}" loading="lazy"><b>Nairobi &rarr; ${d}</b><small>and ${d} &rarr; Nairobi</small><div class="f">KES ${D[d].toLocaleString()}</div></div>`).join("");

function pick(a,b){$("from").value=a;$("to").value=b;search();}
function search(){
 const a=$("from").value,b=$("to").value,e=$("serr");e.textContent="";
 if(a===b){e.textContent="Choose different origin and destination.";return}
 if(a!=="Nairobi"&&b!=="Nairobi"){e.textContent="Every Climax route starts or ends in Nairobi. Please pick Nairobi as origin or destination.";return}
 if(!$("date").value){e.textContent="Select a travel date.";return}
 const f=fare(a,b),n=$("pax").value;
 $("results").innerHTML=`<h2>${a} &rarr; ${b} &middot; ${fmt($("date").value)}</h2>`+TIMES.map(t=>`<div class="res"><div><div class="tm">${t}</div><span class="tag">${t.includes("PM")&&+t.slice(0,2)>=8?"Night":"Day"}</span><span class="tag">48 seats</span></div>
 <div><b>KES ${f.toLocaleString()}</b> <small>per person</small></div><button class="pri" onclick="openM('${a}','${b}','${t}')">Book now</button></div>`).join("");
 $("results").scrollIntoView({behavior:"smooth"});
}
const fmt=d=>new Date(d+"T00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"});

function openM(a,b,t){
 S={a,b,date:$("date").value,time:t,n:+$("pax").value,seats:[],pass:[],step:0,f:fare(a,b)};
 $("mo").classList.add("on");render();
}
function closeM(){$("mo").classList.remove("on")}
function taken(){return new Set()}

function render(){
 $("err").textContent="";
 $("st").innerHTML=[0,1,2,3].map(i=>`<i class="${i<=S.step?"a":""}"></i>`).join("");
 const b=$("body");
 if(S.step===0){
  b.innerHTML=`<div class="sm"><b>${S.a} &rarr; ${S.b}</b><br>Fare: KES ${S.f.toLocaleString()} per passenger</div><br>
  <div class="row"><div><label>Date</label><input type="date" id="md" min="${today}" value="${S.date}"></div>
  <div><label>Departure time</label><select id="mtm">${TIMES.map(t=>`<option ${t===S.time?"selected":""}>${t}</option>`).join("")}</select></div></div>
  <label>Number of passengers</label><select id="mn">${[1,2,3,4,5,6,7,8].map(n=>`<option ${n===S.n?"selected":""}>${n}</option>`).join("")}</select>
  <div class="ft"><span></span><button class="pri" onclick="s0()">Choose seats</button></div>`;
 }else if(S.step===1){
  const tk=taken();let h="";
  for(let r=0;r<12;r++)for(let c=0;c<5;c++){
   if(c===2){h+="<span></span>";continue}
   const n=r*4+(c>2?c-1:c)+1,x=tk.has(n),sel=S.seats.includes(n);
   h+=`<button class="s ${x?"x":""} ${sel?"sel":""}" ${x?"disabled":""} onclick="tog(${n})">${n}</button>`}
  b.innerHTML=`<p>Select <b>${S.n}</b> seat${S.n>1?"s":""}. Selected: <b>${S.seats.sort((a,b)=>a-b).join(", ")||"none"}</b></p>
  <div class="lg"><span>&#9633; Available</span><span style="color:var(--b)">&#9632; Selected</span><span>&#9632; Taken</span></div>
  <div style="text-align:center;font-size:.75rem;color:var(--m)">Driver / Front</div><div class="seats">${h}</div>
  <div class="ft"><button class="sec" onclick="go(0)">Back</button><button class="pri" onclick="s1()">Passenger details</button></div>`;
 }else if(S.step===2){
  b.innerHTML=S.seats.map((s,i)=>`<div class="pp"><b>Passenger ${i+1} &middot; Seat ${s}</b>
  <div class="row" style="margin-top:8px"><div><label>Full name</label><input id="pn${i}" value="${S.pass[i]?.name||""}"></div>
  <div><label>ID / Passport no.</label><input id="pi${i}" value="${S.pass[i]?.id||""}"></div></div>
  <label>Phone number</label><input id="pp${i}" type="tel" placeholder="07XX XXX XXX" value="${S.pass[i]?.phone||""}"></div>`).join("")+
  `<div class="ft"><button class="sec" onclick="go(1)">Back</button><button class="pri" onclick="s2()">Review booking</button></div>`;
 }else{
  const tot=S.f*S.n;
  b.innerHTML=`<div class="sm"><b>${S.a} &rarr; ${S.b}</b><br>${fmt(S.date)} at ${S.time}<br>Seats: ${S.seats.join(", ")}<br>
  ${S.pass.map((p,i)=>`${i+1}. ${p.name} (${p.id}) ${p.phone}`).join("<br>")}<br><b>Total: KES ${tot.toLocaleString()}</b></div>
  <p style="font-size:.85rem;color:var(--m);margin-top:10px">Your booking opens in WhatsApp, where your ticket and M-Pesa payment instructions are sent.</p>
  <div class="ft"><button class="sec" onclick="go(2)">Back</button><button class="wa" onclick="send()">Confirm on WhatsApp</button></div>`;
 }
}
const go=n=>{S.step=n;render()};
function s0(){S.date=$("md").value;S.time=$("mtm").value;S.n=+$("mn").value;
 if(!S.date)return $("err").textContent="Select a date.";S.seats=[];S.pass=[];go(1)}
function tog(n){const i=S.seats.indexOf(n);if(i>-1)S.seats.splice(i,1);else if(S.seats.length<S.n)S.seats.push(n);else $("err").textContent="You can select "+S.n+" seat(s) only.";render()}
function s1(){if(S.seats.length!==S.n)return $("err").textContent="Please select exactly "+S.n+" seat(s).";go(2)}
function s2(){const p=[];
 for(let i=0;i<S.n;i++){const name=$("pn"+i).value.trim(),id=$("pi"+i).value.trim(),phone=$("pp"+i).value.trim();
  if(!name||!id||phone.replace(/\D/g,"").length<9)return $("err").textContent="Complete name, ID and a valid phone for passenger "+(i+1)+".";
  p.push({name,id,phone})}
 S.pass=p;go(3)}
function send(){
 const ref="CLX"+Date.now().toString().slice(-6);
 const m=`CLIMAX COACHES BOOKING REQUEST\nRef: ${ref}\nRoute: ${S.a} to ${S.b}\nDate: ${fmt(S.date)}\nDeparture: ${S.time}\nPassengers: ${S.n}\nSeats: ${S.seats.join(", ")}\n\n`+
 S.pass.map((p,i)=>`Passenger ${i+1}: ${p.name}\nID: ${p.id}\nPhone: ${p.phone}\nSeat: ${S.seats[i]}`).join("\n\n")+
 `\n\nFare: KES ${S.f.toLocaleString()} x ${S.n}\nTotal: KES ${(S.f*S.n).toLocaleString()}\n\nPlease confirm my booking.`;
 window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`,"_blank");
}

if($("rt"))$("rt").innerHTML=Object.keys(D).sort().map(d=>`<tr><td>Nairobi to ${d}</td><td>${d} to Nairobi</td><td>KES ${D[d].toLocaleString()}</td><td><button class="pri" onclick="pick('Nairobi','${d}')">Book</button></td></tr>`).join("");
if(document.body.dataset.to)$("to").value=document.body.dataset.to;
