(()=>{var e={};e.id=888,e.ids=[888],e.modules={8864:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return i},noSSR:function(){return u}});let s=r(167),l=r(997);r(6689);let o=s._(r(4830));function a(e){return{default:(null==e?void 0:e.default)||e}}function u(e,t){delete t.webpack,delete t.modules;let r=t.loading;return()=>(0,l.jsx)(r,{error:null,isLoading:!0,pastDelay:!1,timedOut:!1})}function i(e,t){let r=o.default,s={loading:e=>{let{error:t,isLoading:r,pastDelay:s}=e;return null}};e instanceof Promise?s.loader=()=>e:"function"==typeof e?s.loader=e:"object"==typeof e&&(s={...s,...e});let l=(s={...s,...t}).loader;return(s.loadableGenerated&&(s={...s,...s.loadableGenerated},delete s.loadableGenerated),"boolean"!=typeof s.ssr||s.ssr)?r({...s,loader:()=>null!=l?l().then(a):Promise.resolve(a(()=>null))}):(delete s.webpack,delete s.modules,u(r,s))}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6814:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(997);r(6764),r(2121);var l=r(5152);let o=r.n(l)()(()=>Promise.all([r.e(780),r.e(150),r.e(13)]).then(r.bind(r,6013)).then(e=>e.WalletProvider),{loadableGenerated:{modules:["pages\\_app.tsx -> ../src/Components/WalletProvider"]},ssr:!1}),a=function({Component:e,pageProps:t}){return s.jsx(o,{children:s.jsx(e,{...t})})}},2121:()=>{},6764:()=>{},7093:(e,t,r)=>{"use strict";e.exports=r(2785)},4830:(e,t,r)=>{"use strict";e.exports=r(7093).vendored.contexts.Loadable},5152:(e,t,r)=>{e.exports=r(8864)},7831:e=>{"use strict";e.exports=require("@solana/web3.js")},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},6405:e=>{"use strict";e.exports=require("react-dom")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},3991:e=>{"use strict";e.exports=import("@mysten/wallet-kit")},1247:e=>{"use strict";e.exports=import("@solana/wallet-adapter-react")},8847:e=>{"use strict";e.exports=import("@solana/wallet-adapter-react-ui")},7280:e=>{"use strict";e.exports=import("@solana/wallet-adapter-wallets")},7606:e=>{"use strict";e.exports=import("@tiplink/wallet-adapter")},4865:e=>{"use strict";e.exports=import("@tiplink/wallet-adapter-react-ui")},7147:e=>{"use strict";e.exports=require("fs")},2781:e=>{"use strict";e.exports=require("stream")},9796:e=>{"use strict";e.exports=require("zlib")},167:(e,t)=>{"use strict";t._=t._interop_require_default=function(e){return e&&e.__esModule?e:{default:e}}}};var t=require("../webpack-runtime.js");t.C(e);var r=t(t.s=6814);module.exports=r})();