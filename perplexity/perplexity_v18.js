javascript:(function(){
const d=document;
const w=m=>new Promise(r=>setTimeout(r,m));
const md=n=>{
  if(3==n.nodeType)return n.textContent.replace(/\s+/g," ");
  if(1!==n.nodeType)return"";
  let t=n.tagName.toLowerCase(),c="";
  Array.from(n.childNodes).forEach(k=>c+=md(k));
  if(["p","div","h1","h2","h3","h4"].includes(t))c="\n\n"+c+"\n\n";
  if("li"==t)c="\n- "+c.trim();
  if("strong"==t||"b"==t)return" **"+c.trim()+"** ";
  if("em"==t||"i"==t)return" *"+c.trim()+"* ";
  if("a"==t)return" ["+c.trim()+"]("+n.href+") ";
  if("img"==t)return"\n![img]("+n.src+")\n";
  if("code"==t)return" `"+c+"` ";
  if("pre"==t)return"\n```\n"+n.innerText+"\n```\n";
  if(t.startsWith("h"))return"\n"+"#".repeat(parseInt(t[1]))+" "+c.trim()+"\n\n";
  return c;
};
async function x(){
  let o="# Perplexity Report v18\n\n";
  o+="## Metadata\n";
  o+="- **Date**: "+new Date().toISOString()+"\n";
  o+="- **URL**: "+window.location.href+"\n";
  o+="- **Title**: "+document.title+"\n\n---\n\n";
  try{let h=d.querySelector("h1");if(h)o+="## Prompt\n"+h.innerText.trim()+"\n\n---\n\n";}catch(e){}
  try{
    let b=Array.from(d.querySelectorAll("button")).find(x=>/steps|reasoning/i.test(x.innerText));
    if(b){
      b.click();await w(1000);
      let gs=d.querySelectorAll(".group\\/goal");
      if(gs.length){
        o+="## Reasoning\n";
        gs.forEach((g,i)=>{
          let t=g.querySelector(".pr-sm");
          if(t&&t.innerText.trim()!=="Finished"){
            o+="### Step "+(i+1)+"\n"+t.innerText.trim()+"\n\n";
            let sq=Array.from(g.querySelectorAll(".bg-subtler"));
            if(sq.length){
              let qt=sq.map(el=>el.innerText.replace(/search/gi,"").trim()).filter(t=>t.length>0);
              if(qt.length)o+="> **Queries:** "+qt.join(", ")+"\n\n";
            }
            let l=Array.from(g.querySelectorAll("a"));
            if(l.length)o+=l.map(z=>"- ["+z.innerText.replace(/\n/g," ")+"]("+z.href+")").join("\n")+"\n";
            o+="\n";
          }
        });
        o+="---\n\n";
      }
    }
  }catch(e){}
  try{
    let sb=Array.from(d.querySelectorAll("button")).find(x=>/\d+\s+sources/i.test(x.innerText));
    if(sb){
      sb.click();await w(2000);
      let sl=d.querySelectorAll("div.h-full a");
      if(sl.length){
        o+="## Sidebar Sources\n";
        let u=new Set();
        sl.forEach(l=>{
          if(l.href&&!l.href.includes("perplexity")&&!u.has(l.href)){
            u.add(l.href);
            o+="* ["+l.innerText.split("\n")[0]+"]("+l.href+")\n";
          }
        });
        o+="\n---\n\n";
      }
      let cls=d.querySelector('button[data-testid="close-modal"]')||d.querySelector('button[aria-label="Close"]');
      if(cls){cls.click();await w(1000)}else{console.log("Close btn missing")}
    }
  }catch(e){o+="> Error Sidebar\n"}
  try{
    let c=d.querySelectorAll('[id^="markdown-content"]');
    if(c.length){
      o+="## Answer\n";
      const artifacts=["Chart","Code Interpreter Graph","Code Interpreter","Programming, Chart"];
      c.forEach(z=>{
        let text=md(z);
        text=text.split('\n').filter(line=>{const trimmed=line.trim();return!artifacts.some(a=>trimmed===a)}).join('\n');
        text=text.replace(/\n{3,}/g,"\n\n");
        o+=text;
      });
      o+="\n---\n\n";
    }
  }catch(e){}
  try{
    let ti=Array.from(d.querySelectorAll("button[role='tab'], div[role='tab']")).find(t=>/Images|Media/i.test(t.innerText)||t.querySelector('use[xlink\\:href*="icon-image"]'));
    if(ti){
      o+="## Images\n";
      ti.click();await w(2500);
      let attempts=0;let maxAttempts=20;
      while(attempts<maxAttempts){
        let loadedCount=Array.from(d.querySelectorAll("img[src*='http']")).filter(img=>img.complete&&img.naturalWidth>0).length;
        if(loadedCount>0)break;
        await w(500);attempts++;
      }
      let im=d.querySelectorAll("img");
      let us=new Set();
      im.forEach(m=>{
        if(m.src&&!m.src.includes("favicon")&&m.naturalWidth>100&&!us.has(m.src)){
          us.add(m.src);
          o+="![ref]("+m.src+")\n";
        }
      });
    }
  }catch(e){}
  try{
    const relatedSelectors=['[data-testid="related-questions"]','.related-questions','[class*="related"]','[class*="follow-up"]','[class*="followup"]'];
    for(const selector of relatedSelectors){
      const rq=d.querySelector(selector);
      if(rq){
        const questions=rq.querySelectorAll('a, button, [role="button"]');
        if(questions.length>0){
          o+="\n---\n\n## Related Questions\n";
          questions.forEach((q,i)=>{
            const text=q.innerText.trim();
            if(text&&text.length>10){o+=(i+1)+". "+text+"\n"}
          });
          o+="\n---\n\n";
          break;
        }
      }
    }
  }catch(e){}
  let bl=new Blob([o.replace(/\n{3,}/g,"\n\n")],{type:"text/markdown"}),el=d.createElement("a");
  el.href=URL.createObjectURL(bl);
  el.download="perplexity_v18_"+new Date().toISOString().slice(0,10)+".md";
  d.body.appendChild(el);
  el.click();
  d.body.removeChild(el);
}
x();
})();
