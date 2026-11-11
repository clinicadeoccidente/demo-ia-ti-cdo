/* Utilidades comunes de las réplicas (datos sintéticos) */
(function(){
const QS=new URLSearchParams(location.search);
window.QS=QS; window.AUTO=QS.get('auto')==='1';
window.$=(s,r)=>(r||document).querySelector(s); window.$$=(s,r)=>Array.from((r||document).querySelectorAll(s));
window.sleep=ms=>new Promise(r=>setTimeout(r,ms));
// generador pseudoaleatorio con semilla (datos sintéticos estables)
window.rng=function(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};};
document.addEventListener('DOMContentLoaded',()=>{
  const b=document.createElement('div');b.className='conf-badge';b.innerHTML='🔒 Datos modificados por confidencialidad<small>Réplica del panel · datos sintéticos</small>';document.body.appendChild(b);
  if(window.AUTO){const c=document.createElement('div');c.className='fcur';c.textContent='👆';c.id='fcur';document.body.appendChild(c);}
  if(QS.get('z')){document.body.style.zoom=QS.get('z');}
});
window.tap=async function(sel){const b=typeof sel==='string'?$(sel):sel;if(!b)return;b.scrollIntoView({block:'nearest',behavior:'smooth'});await sleep(350);
  const r=b.getBoundingClientRect(),z=+(QS.get('z')||1),c=$('#fcur');
  if(c){c.style.left=((r.left+r.width/2)*z-10)+'px';c.style.top=((r.top+r.height/2)*z-6)+'px';await sleep(800);}
  b.classList.add('pressfx');setTimeout(()=>b.classList.remove('pressfx'),300);
  if(b.tagName==='SELECT'){}else b.click();};
window.pick=async function(sel,val){const s=$(sel);await tap(s);s.value=val;s.dispatchEvent(new Event('change',{bubbles:true}));};
window.typeInto=async function(sel,text,ms){const e=$(sel);await tap(e);e.focus();for(let i=1;i<=text.length;i++){e.value=text.slice(0,i);e.dispatchEvent(new Event('input',{bubbles:true}));await sleep(ms||60);}};
window.scrollToY=async function(y,ms){const z=+(QS.get('z')||1);window.scrollTo({top:y,behavior:'smooth'});await sleep(ms||900);};
window.scrollToEl=async function(sel,off){const e=$(sel);if(!e)return;const y=e.getBoundingClientRect().top+window.scrollY-(off||10);await scrollToY(y);};
/* SVG */
const NS='http://www.w3.org/2000/svg';
window.svgEl=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
window.lineChart=function(svg,o){ // o:{labels,series:[{name,color,data}],max,labelsOn,suffix}
  svg.innerHTML='';const W=+svg.getAttribute('width')||svg.viewBox.baseVal.width,H=svg.viewBox.baseVal.height,pl=40,pr=14,pt=18,pb=26;
  const n=o.labels.length,max=o.max||Math.max(...o.series.flatMap(s=>s.data))*1.15;
  const X=i=>pl+(W-pl-pr)*i/(n-1),Y=v=>pt+(H-pt-pb)*(1-v/max);
  for(let g=0;g<=2;g++){const v=max*g/2;svgEl('line',{x1:pl,x2:W-pr,y1:Y(v),y2:Y(v),stroke:'#E5E7EB'},svg);svgEl('text',{x:pl-6,y:Y(v)+4,'text-anchor':'end','font-size':11,fill:'#6B7280'},svg).textContent=Math.round(v)+(o.suffix||'');}
  o.labels.forEach((l,i)=>{if(n<=24||i%2===0)svgEl('text',{x:X(i),y:H-8,'text-anchor':'middle','font-size':11,fill:'#6B7280'},svg).textContent=l;});
  o.series.forEach(s=>{const d=s.data.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
    const p=svgEl('path',{d,fill:'none',stroke:s.color,'stroke-width':s.w||3,'stroke-linejoin':'round'},svg);
    const L=p.getTotalLength?p.getTotalLength():2000;p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.transition='stroke-dashoffset 1.4s ease';requestAnimationFrame(()=>requestAnimationFrame(()=>p.style.strokeDashoffset=0));
    if(o.labelsOn)s.data.forEach((v,i)=>svgEl('text',{x:X(i),y:Y(v)-7,'text-anchor':'middle','font-size':o.fs||12,'font-weight':700,fill:s.color},svg).textContent=v+(o.suffix||''));});
};
window.pie=function(svg,parts,donut){svg.innerHTML='';const c=50,r=46;let a=-Math.PI/2;const tot=parts.reduce((x,p)=>x+p.v,0)||1;
  parts.forEach(p=>{const b=a+2*Math.PI*p.v/tot,large=(b-a)>Math.PI?1:0;
    if(p.v/tot>=0.999){svgEl('circle',{cx:c,cy:c,r,fill:p.c},svg);}else svgEl('path',{d:`M${c} ${c} L${c+r*Math.cos(a)} ${c+r*Math.sin(a)} A${r} ${r} 0 ${large} 1 ${c+r*Math.cos(b)} ${c+r*Math.sin(b)} Z`,fill:p.c,stroke:'#fff','stroke-width':1},svg);a=b;});
  if(donut)svgEl('circle',{cx:c,cy:c,r:28,fill:'#fff'},svg);};
})();
