import{A as e,E as t,H as n,M as r,N as i,T as ee,W as a,at as o,c as s,et as c,h as l,l as u,m as d,o as f,r as p,s as m,u as h,w as g,wt as _,xt as v}from"./runtime-core.esm-bundler-rMHY4zYK.js";import{D as y,N as b,Wt as x,p as S,x as C}from"./index-BheSSWyS.js";import{t as w}from"./tag-C9oD1A0B.js";import{a as T,i as E,n as D,r as O,t as k}from"./card-F3p0Z_VO.js";import{t as A}from"./image-Cun9jzGU.js";import{t as j}from"./message-COYrKviF.js";import{t as M}from"./progressspinner-D2lFPCze.js";import{a as N,c as P,i as F,o as I,s as L,t as R}from"./development-7cQAq1PR.js";var z=x(T()),B=y.extend({name:`divider`,style:`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`,classes:{root:function(e){var t=e.props;return[`p-divider p-component`,`p-divider-`+t.layout,`p-divider-`+t.type,{"p-divider-left":t.layout===`horizontal`&&(!t.align||t.align===`left`)},{"p-divider-center":t.layout===`horizontal`&&t.align===`center`},{"p-divider-right":t.layout===`horizontal`&&t.align===`right`},{"p-divider-top":t.layout===`vertical`&&t.align===`top`},{"p-divider-center":t.layout===`vertical`&&(!t.align||t.align===`center`)},{"p-divider-bottom":t.layout===`vertical`&&t.align===`bottom`}]},content:`p-divider-content`},inlineStyles:{root:function(e){var t=e.props;return{justifyContent:t.layout===`horizontal`?t.align===`center`||t.align===null?`center`:t.align===`left`?`flex-start`:t.align===`right`?`flex-end`:null:null,alignItems:t.layout===`vertical`?t.align===`center`||t.align===null?`center`:t.align===`top`?`flex-start`:t.align===`bottom`?`flex-end`:null:null}}}}),V={name:`BaseDivider`,extends:C,props:{align:{type:String,default:null},layout:{type:String,default:`horizontal`},type:{type:String,default:`solid`}},style:B,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function H(e){"@babel/helpers - typeof";return H=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},H(e)}function U(e,t,n){return(t=W(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function W(e){var t=G(e,`string`);return H(t)==`symbol`?t:t+``}function G(e,t){if(H(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(H(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var K={name:`Divider`,extends:V,inheritAttrs:!1,computed:{dataP:function(){return b(U(U(U({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},q=[`aria-orientation`,`data-p`],J=[`data-p`];function Y(t,n,r,ee,a,o){return e(),h(`div`,g({class:t.cx(`root`),style:t.sx(`root`),role:`separator`,"aria-orientation":t.layout,"data-p":o.dataP},t.ptmi(`root`)),[t.$slots.default?(e(),h(`div`,g({key:0,class:t.cx(`content`),"data-p":o.dataP},t.ptm(`content`)),[i(t.$slots,`default`)],16,J)):u(``,!0)],16,q)}K.render=Y;var X={class:`flex flex-col gap-8 py-6 lg:py-8`},Z={key:0,class:`flex justify-center py-20`},Q={key:1,class:`flex flex-col items-start gap-4 py-10`},te={class:`flex flex-col gap-3`},ne={class:`flex flex-wrap items-center gap-2`},re={class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl`},ie={class:`flex items-center gap-1.5 text-sm font-medium text-muted`},ae={class:`text-sm leading-relaxed text-default md:text-[15px]`},oe={class:`grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8`},se={class:`flex flex-col gap-4`},ce={class:`grid grid-cols-3 gap-3`},le={class:`flex flex-col gap-6`},ue={class:`flex items-start gap-3`},de={class:`min-w-0`},fe={class:`text-xs font-medium text-muted`},pe={class:`mt-0.5 text-sm font-semibold text-heading`},me={key:0,class:`flex flex-col gap-5`},he={class:`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`},ge={class:`line-clamp-2 text-base font-bold leading-snug text-heading`},_e={class:`flex items-center gap-1.5 text-xs text-muted`},ve={class:`truncate`},ye={class:`mt-3 line-clamp-2 text-sm leading-relaxed text-muted`},$={__name:`DevelopmentDetailView`,props:{slug:{type:String,required:!0}},setup(i){let g=i;delete z.default.Icon.Default.prototype._getIconUrl,z.default.Icon.Default.mergeOptions({iconRetinaUrl:E,iconUrl:O,shadowUrl:D});let y=c(null),b=c([]),x=c(!0),C=[{cardTop:`border-t-4 border-sky-400`,imageGradient:`from-sky-100 via-cyan-100 to-sky-200`,badge:`bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30`,accentText:`text-sky-600`},{cardTop:`border-t-4 border-rose-400`,imageGradient:`from-rose-100 via-pink-100 to-rose-200`,badge:`bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30`,accentText:`text-rose-600`},{cardTop:`border-t-4 border-amber-400`,imageGradient:`from-amber-100 via-orange-100 to-amber-200`,badge:`bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30`,accentText:`text-amber-600`},{cardTop:`border-t-4 border-violet-400`,imageGradient:`from-violet-100 via-purple-100 to-violet-200`,badge:`bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30`,accentText:`text-violet-600`},{cardTop:`border-t-4 border-emerald-400`,imageGradient:`from-emerald-100 via-teal-100 to-emerald-200`,badge:`bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30`,accentText:`text-emerald-600`}];function T(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return t}function B(e){return e?C[T(e)%C.length]:C[0]}let V=f(()=>B(y.value?.category)),H=[`text-sky-500`,`text-rose-500`,`text-amber-500`,`text-violet-500`,`text-emerald-500`],U={0:`secondary`,50:`info`,100:`success`},W=c(null),G=null;function q(){G?.remove(),G=null}function J(){q();let e=y.value;if(!W.value||!e?.latitude||!e?.longitude)return;let t=[e.latitude,e.longitude];G=z.default.map(W.value,{scrollWheelZoom:!1,zoomControl:!0}).setView(t,16),G.getPane(`tilePane`).style.zIndex=1,G.getPane(`overlayPane`).style.zIndex=4,G.getPane(`markerPane`).style.zIndex=5,G.getPane(`popupPane`).style.zIndex=6,z.default.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{maxZoom:19,attribution:`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`}).addTo(G),G.on(`click`,()=>G?.scrollWheelZoom.enable()),W.value.addEventListener(`mouseleave`,()=>G?.scrollWheelZoom.disable());let n=document.createElement(`div`),r=document.createElement(`b`);r.textContent=e.title,n.append(r,document.createElement(`br`),document.createTextNode(e.location)),z.default.marker(t).addTo(G).bindPopup(n)}t(q);let Y=f(()=>y.value?.latitude?`https://www.google.com/maps?q=${y.value.latitude},${y.value.longitude}`:``);n(()=>g.slug,async e=>{x.value=!0,q();try{y.value=await I(e),b.value=await L(y.value)}catch(e){console.error(`Gagal memuat detail pembangunan:`,e),y.value=null,b.value=[]}finally{x.value=!1}await ee(),J()},{immediate:!0});let $=f(()=>y.value?.photos?.length?y.value.photos:[0,50,100].map(e=>({percent:e,image:``}))),be=f(()=>y.value?[{label:`Nama Kegiatan`,value:y.value.title,icon:`pi pi-tag`},{label:`Alamat`,value:y.value.location,icon:`pi pi-map-marker`},{label:`Volume`,value:y.value.volume,icon:`pi pi-box`},{label:`Anggaran`,value:F(y.value.budget),icon:`pi pi-wallet`},{label:`Sumber Dana`,value:y.value.fundingSource,icon:`pi pi-briefcase`},{label:`Pelaksana`,value:y.value.contractor,icon:`pi pi-users`},{label:`Tahun Anggaran`,value:String(y.value.year),icon:`pi pi-calendar`},{label:`Mulai`,value:N(y.value.startDate),icon:`pi pi-play`},{label:`Target Selesai`,value:N(y.value.endDate),icon:`pi pi-flag`}]:[]);return(t,n)=>(e(),h(`div`,X,[x.value?(e(),h(`div`,Z,[l(o(M),{strokeWidth:4,class:`!h-10 !w-10`})])):y.value?(e(),h(p,{key:2},[l(o(S),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`,text:``,class:`w-fit`}),m(`div`,te,[m(`div`,ne,[l(o(w),{value:o(P)[y.value.status].label,severity:o(P)[y.value.status].severity,icon:o(P)[y.value.status].icon},null,8,[`value`,`severity`,`icon`]),l(o(w),{value:y.value.category,icon:o(R)(y.value.category),unstyled:``,class:v([`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold`,V.value.badge])},null,8,[`value`,`icon`,`class`])]),m(`h1`,re,_(y.value.title),1),m(`div`,ie,[m(`i`,{class:v([`pi pi-map-marker`,V.value.accentText])},null,2),d(` `+_(y.value.location),1)]),m(`p`,ae,_(y.value.longDesc),1)]),m(`div`,oe,[m(`div`,se,[m(`div`,{class:v([`flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br lg:aspect-auto lg:h-[760px]`,y.value.documentationImage?`bg-surface`:V.value.imageGradient])},[y.value.documentationImage?(e(),s(o(A),{key:0,src:y.value.documentationImage,alt:`Dokumentasi ${y.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-contain`},null,8,[`src`,`alt`])):(e(),h(`div`,{key:1,class:v([`flex flex-col items-center gap-2`,V.value.accentText])},[...n[1]||=[m(`i`,{class:`pi pi-image text-5xl`},null,-1),m(`span`,{class:`text-sm`},`Foto dokumentasi belum diunggah`,-1)]],2))],2),m(`div`,ce,[(e(!0),h(p,null,r($.value,t=>(e(),h(`div`,{key:t.percent,class:v([`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border-default bg-gradient-to-br`,t.image?`bg-surface-hover`:V.value.imageGradient])},[t.image?(e(),s(o(A),{key:0,src:t.image,alt:`Foto progres ${t.percent}% - ${y.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-cover`},null,8,[`src`,`alt`])):(e(),h(`i`,{key:1,class:v([`pi pi-image text-2xl`,V.value.accentText])},null,2)),l(o(w),{value:`${t.percent}%`,severity:U[t.percent],class:`absolute left-2 top-2`},null,8,[`value`,`severity`])],2))),128))])]),m(`div`,le,[l(o(k),{class:v(V.value.cardTop)},{title:a(()=>[m(`span`,{class:v([`text-xs font-semibold uppercase tracking-wide`,V.value.accentText])},` Informasi Kegiatan `,2)]),content:a(()=>[(e(!0),h(p,null,r(be.value,(t,n)=>(e(),h(`div`,{key:t.label},[n>0?(e(),s(o(K),{key:0,class:`!my-3`})):u(``,!0),m(`div`,ue,[m(`i`,{class:v([[t.icon,H[n%H.length]],`mt-0.5 text-sm`])},null,2),m(`div`,de,[m(`p`,fe,_(t.label),1),m(`p`,pe,_(t.value),1)])])]))),128))]),_:1},8,[`class`]),y.value.latitude&&y.value.longitude?(e(),s(o(k),{key:0,class:`border-t-4 border-violet-400`},{title:a(()=>[...n[2]||=[m(`span`,{class:`text-xs font-semibold uppercase tracking-wide text-violet-600`},`Lokasi Pembangunan`,-1)]]),content:a(()=>[m(`div`,{ref_key:`mapEl`,ref:W,class:`relative isolate z-0 h-60 w-full overflow-hidden rounded-xl`},null,512),l(o(S),{as:`a`,href:Y.value,target:`_blank`,rel:`noopener`,label:`Buka di Google Maps`,icon:`pi pi-external-link`,outlined:``,class:`mt-4 w-full`},null,8,[`href`])]),_:1})):u(``,!0)])]),b.value.length?(e(),h(`div`,me,[n[3]||=m(`h2`,{class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-lg font-bold text-transparent`},` Pembangunan Lainnya `,-1),m(`div`,he,[(e(!0),h(p,null,r(b.value,t=>(e(),s(o(k),{key:t.slug,class:v(B(t.category).cardTop)},{title:a(()=>[m(`span`,ge,_(t.title),1)]),subtitle:a(()=>[m(`span`,_e,[m(`i`,{class:v([`pi pi-map-marker`,B(t.category).accentText])},null,2),m(`span`,ve,_(t.location),1)])]),content:a(()=>[l(o(w),{value:o(P)[t.status].label,severity:o(P)[t.status].severity,icon:o(P)[t.status].icon},null,8,[`value`,`severity`,`icon`]),m(`p`,ye,_(t.shortDesc),1)]),footer:a(()=>[l(o(S),{as:`router-link`,to:{name:`development-detail`,params:{slug:t.slug}},label:`Lihat Detail`,icon:`pi pi-arrow-right`,iconPos:`right`,outlined:``,class:`w-full`},null,8,[`to`])]),_:2},1032,[`class`]))),128))])])):u(``,!0)],64)):(e(),h(`div`,Q,[l(o(j),{severity:`warn`,icon:`pi pi-exclamation-triangle`,class:`w-full`},{default:a(()=>[...n[0]||=[d(` Data pembangunan yang kamu cari tidak ditemukan atau sudah dipindahkan. `,-1)]]),_:1}),l(o(S),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`})]))]))}};export{$ as default};