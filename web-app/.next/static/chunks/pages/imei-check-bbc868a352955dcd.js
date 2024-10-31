(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[397],{6521:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/imei-check",function(){return t(2346)}])},2346:function(e,r,t){"use strict";t.r(r);var i=t(5893),n=t(7294);r.default=()=>{let[e,r]=(0,n.useState)(""),[t,o]=(0,n.useState)("3"),[s,a]=(0,n.useState)(null),[c,l]=(0,n.useState)(!1),d=async r=>{if(r.preventDefault(),!e){alert("Please enter a valid IMEI number.");return}try{l(!0);let r=await fetch("/api/check-imei?imei=".concat(e,"&service=").concat(t));if(!r.ok)throw Error("Failed to fetch IMEI information");let i=await r.json();a(i),l(!1)}catch(e){console.error("Error fetching IMEI information:",e),l(!1),alert("There was an error processing your request. Please try again.")}};return(0,i.jsxs)("div",{style:{padding:"20px",fontFamily:"Arial, sans-serif",maxWidth:"600px",margin:"0 auto",backgroundColor:"#1c1c1c",color:"#ffffff",borderRadius:"8px"},children:[(0,i.jsx)("h1",{children:"IMEI Check Service"}),(0,i.jsxs)("form",{onSubmit:d,style:{marginBottom:"20px"},children:[(0,i.jsxs)("label",{style:{display:"block",marginBottom:"10px"},children:["IMEI Number:",(0,i.jsx)("input",{type:"text",value:e,onChange:e=>r(e.target.value),style:{marginLeft:"10px",padding:"8px",borderRadius:"4px",border:"1px solid #ccc"}})]}),(0,i.jsxs)("label",{style:{display:"block",marginBottom:"10px"},children:["Select Service:",(0,i.jsxs)("select",{value:t,onChange:e=>o(e.target.value),style:{marginLeft:"10px",padding:"8px",borderRadius:"4px",border:"1px solid #ccc"},children:[(0,i.jsx)("option",{value:"3",children:"Find My iPhone Status"}),(0,i.jsx)("option",{value:"8",children:"SIM Lock Info"})]})]}),(0,i.jsx)("button",{type:"submit",style:{padding:"10px 20px",backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Check IMEI"})]}),c&&(0,i.jsx)("p",{children:"Processing and fetching report..."}),s&&(0,i.jsxs)("div",{style:{padding:"15px",borderRadius:"8px",backgroundColor:"#2d2d2d",marginTop:"20px"},children:[(0,i.jsx)("h3",{children:"IMEI Information:"}),"success"===s.status?(0,i.jsx)("div",{children:Object.entries((e=>{let r=e.split("<br>"),t={};return r.forEach(e=>{if(e){let[r,i]=e.split(":");r&&i&&("SIM-Lock"===r.trim()?t[r.trim()]=i.includes("Unlocked")?"Unlocked":"Locked":t[r.trim()]=i.replace(/<.*?>/g,"").trim())}}),t})(s.result)).map(e=>{let[r,t]=e;return(0,i.jsxs)("p",{style:{margin:"8px 0"},children:[(0,i.jsxs)("strong",{children:[r,":"]})," ",t]},r)})}):(0,i.jsxs)("p",{style:{color:"red"},children:["Error fetching information: ",s.error]})]})]})}}},function(e){e.O(0,[888,774,179],function(){return e(e.s=6521)}),_N_E=e.O()}]);