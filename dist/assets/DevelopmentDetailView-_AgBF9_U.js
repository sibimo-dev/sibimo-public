import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{$ as t,Ct as n,E as r,M as i,T as a,U as o,V as s,bt as c,c as l,h as u,it as d,j as f,k as p,l as m,m as h,o as g,r as _,s as v,u as y,w as b}from"./runtime-core.esm-bundler-Bp0EuTbW.js";import{f as x,r as S,s as C}from"./ripple-5D0YgQqF.js";import{d as w}from"./index-RMA-GG_M.js";import{t as T}from"./tag-DY1tTuvr.js";import{a as E,i as ee,n as D,r as O,t as k}from"./card-CYFMwqfk.js";import{t as A}from"./image-BGphVCyW.js";import{t as j}from"./message-BAT89XL8.js";import{t as M}from"./progressspinner-BudE5jZX.js";import{a as N,c as P,i as te,o as F,s as I,t as L}from"./development-CkhyjaMq.js";var R=e(E()),z=C.extend({name:`divider`,style:`
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
`,classes:{root:function(e){var t=e.props;return[`p-divider p-component`,`p-divider-`+t.layout,`p-divider-`+t.type,{"p-divider-left":t.layout===`horizontal`&&(!t.align||t.align===`left`)},{"p-divider-center":t.layout===`horizontal`&&t.align===`center`},{"p-divider-right":t.layout===`horizontal`&&t.align===`right`},{"p-divider-top":t.layout===`vertical`&&t.align===`top`},{"p-divider-center":t.layout===`vertical`&&(!t.align||t.align===`center`)},{"p-divider-bottom":t.layout===`vertical`&&t.align===`bottom`}]},content:`p-divider-content`},inlineStyles:{root:function(e){var t=e.props;return{justifyContent:t.layout===`horizontal`?t.align===`center`||t.align===null?`center`:t.align===`left`?`flex-start`:t.align===`right`?`flex-end`:null:null,alignItems:t.layout===`vertical`?t.align===`center`||t.align===null?`center`:t.align===`top`?`flex-start`:t.align===`bottom`?`flex-end`:null:null}}}}),B={name:`BaseDivider`,extends:S,props:{align:{type:String,default:null},layout:{type:String,default:`horizontal`},type:{type:String,default:`solid`}},style:z,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function V(e){"@babel/helpers - typeof";return V=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},V(e)}function H(e,t,n){return(t=U(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function U(e){var t=W(e,`string`);return V(t)==`symbol`?t:t+``}function W(e,t){if(V(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(V(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var G={name:`Divider`,extends:B,inheritAttrs:!1,computed:{dataP:function(){return x(H(H(H({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},K=[`aria-orientation`,`data-p`],q=[`data-p`];function J(e,t,n,r,a,o){return p(),y(`div`,b({class:e.cx(`root`),style:e.sx(`root`),role:`separator`,"aria-orientation":e.layout,"data-p":o.dataP},e.ptmi(`root`)),[e.$slots.default?(p(),y(`div`,b({key:0,class:e.cx(`content`),"data-p":o.dataP},e.ptm(`content`)),[i(e.$slots,`default`)],16,q)):m(``,!0)],16,K)}G.render=J;var Y={class:`flex flex-col gap-8 py-6 lg:py-8`},X={key:0,class:`flex justify-center py-20`},Z={key:1,class:`flex flex-col items-start gap-4 py-10`},Q={class:`flex flex-col gap-3`},ne={class:`flex flex-wrap items-center gap-2`},re={class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl`},ie={class:`flex items-center gap-1.5 text-sm font-medium text-muted`},ae={class:`text-sm leading-relaxed text-default md:text-[15px]`},oe={class:`grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8`},se={class:`flex flex-col gap-4`},ce={class:`grid grid-cols-3 gap-3`},le={class:`flex flex-col gap-6`},ue={class:`flex items-start gap-3`},de={class:`min-w-0`},fe={class:`text-xs font-medium text-muted`},pe={class:`mt-0.5 text-sm font-semibold text-heading`},me={key:0,class:`flex flex-col gap-5`},he={class:`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`},ge={class:`line-clamp-2 text-base font-bold leading-snug text-heading`},_e={class:`flex items-center gap-1.5 text-xs text-muted`},ve={class:`truncate`},ye={class:`mt-3 line-clamp-2 text-sm leading-relaxed text-muted`},$={__name:`DevelopmentDetailView`,props:{slug:{type:String,required:!0}},setup(e){let i=e;delete R.default.Icon.Default.prototype._getIconUrl,R.default.Icon.Default.mergeOptions({iconRetinaUrl:ee,iconUrl:O,shadowUrl:D});let b=t(null),x=t([]),S=t(!0),C=[{cardTop:`border-t-4 border-sky-400`,imageGradient:`from-sky-100 via-cyan-100 to-sky-200`,badge:`bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30`,accentText:`text-sky-600`},{cardTop:`border-t-4 border-rose-400`,imageGradient:`from-rose-100 via-pink-100 to-rose-200`,badge:`bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30`,accentText:`text-rose-600`},{cardTop:`border-t-4 border-amber-400`,imageGradient:`from-amber-100 via-orange-100 to-amber-200`,badge:`bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30`,accentText:`text-amber-600`},{cardTop:`border-t-4 border-violet-400`,imageGradient:`from-violet-100 via-purple-100 to-violet-200`,badge:`bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30`,accentText:`text-violet-600`},{cardTop:`border-t-4 border-emerald-400`,imageGradient:`from-emerald-100 via-teal-100 to-emerald-200`,badge:`bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30`,accentText:`text-emerald-600`}];function E(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return t}function z(e){return e?C[E(e)%C.length]:C[0]}let B=g(()=>z(b.value?.category)),V=[`text-sky-500`,`text-rose-500`,`text-amber-500`,`text-violet-500`,`text-emerald-500`],H={0:`secondary`,50:`info`,100:`success`},U=t(null),W=null;function K(){W?.remove(),W=null}function q(){K();let e=b.value;if(!U.value||!e?.latitude||!e?.longitude)return;let t=[e.latitude,e.longitude];W=R.default.map(U.value,{scrollWheelZoom:!1,zoomControl:!0}).setView(t,16),W.getPane(`tilePane`).style.zIndex=1,W.getPane(`overlayPane`).style.zIndex=4,W.getPane(`markerPane`).style.zIndex=5,W.getPane(`popupPane`).style.zIndex=6,R.default.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{maxZoom:19,attribution:`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`}).addTo(W),W.on(`click`,()=>W?.scrollWheelZoom.enable()),U.value.addEventListener(`mouseleave`,()=>W?.scrollWheelZoom.disable());let n=document.createElement(`div`),r=document.createElement(`b`);r.textContent=e.title,n.append(r,document.createElement(`br`),document.createTextNode(e.location)),R.default.marker(t).addTo(W).bindPopup(n)}r(K);let J=g(()=>b.value?.latitude?`https://www.google.com/maps?q=${b.value.latitude},${b.value.longitude}`:``);s(()=>i.slug,async e=>{S.value=!0,K();try{b.value=await F(e),x.value=await I(b.value)}catch(e){console.error(`Gagal memuat detail pembangunan:`,e),b.value=null,x.value=[]}finally{S.value=!1}await a(),q()},{immediate:!0});let $=g(()=>b.value?.photos?.length?b.value.photos:[0,50,100].map(e=>({percent:e,image:``}))),be=g(()=>b.value?[{label:`Nama Kegiatan`,value:b.value.title,icon:`pi pi-tag`},{label:`Alamat`,value:b.value.location,icon:`pi pi-map-marker`},{label:`Volume`,value:b.value.volume,icon:`pi pi-box`},{label:`Anggaran`,value:te(b.value.budget),icon:`pi pi-wallet`},{label:`Sumber Dana`,value:b.value.fundingSource,icon:`pi pi-briefcase`},{label:`Pelaksana`,value:b.value.contractor,icon:`pi pi-users`},{label:`Tahun Anggaran`,value:String(b.value.year),icon:`pi pi-calendar`},{label:`Mulai`,value:N(b.value.startDate),icon:`pi pi-play`},{label:`Target Selesai`,value:N(b.value.endDate),icon:`pi pi-flag`}]:[]);return(e,t)=>(p(),y(`div`,Y,[S.value?(p(),y(`div`,X,[u(d(M),{strokeWidth:4,class:`!h-10 !w-10`})])):b.value?(p(),y(_,{key:2},[u(d(w),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`,text:``,class:`w-fit`}),v(`div`,Q,[v(`div`,ne,[u(d(T),{value:d(P)[b.value.status].label,severity:d(P)[b.value.status].severity,icon:d(P)[b.value.status].icon},null,8,[`value`,`severity`,`icon`]),u(d(T),{value:b.value.category,icon:d(L)(b.value.category),unstyled:``,class:c([`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold`,B.value.badge])},null,8,[`value`,`icon`,`class`])]),v(`h1`,re,n(b.value.title),1),v(`div`,ie,[v(`i`,{class:c([`pi pi-map-marker`,B.value.accentText])},null,2),h(` `+n(b.value.location),1)]),v(`p`,ae,n(b.value.longDesc),1)]),v(`div`,oe,[v(`div`,se,[v(`div`,{class:c([`flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br lg:aspect-auto lg:h-[760px]`,b.value.documentationImage?`bg-surface`:B.value.imageGradient])},[b.value.documentationImage?(p(),l(d(A),{key:0,src:b.value.documentationImage,alt:`Dokumentasi ${b.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-contain`},null,8,[`src`,`alt`])):(p(),y(`div`,{key:1,class:c([`flex flex-col items-center gap-2`,B.value.accentText])},[...t[1]||=[v(`i`,{class:`pi pi-image text-5xl`},null,-1),v(`span`,{class:`text-sm`},`Foto dokumentasi belum diunggah`,-1)]],2))],2),v(`div`,ce,[(p(!0),y(_,null,f($.value,e=>(p(),y(`div`,{key:e.percent,class:c([`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border-default bg-gradient-to-br`,e.image?`bg-surface-hover`:B.value.imageGradient])},[e.image?(p(),l(d(A),{key:0,src:e.image,alt:`Foto progres ${e.percent}% - ${b.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-cover`},null,8,[`src`,`alt`])):(p(),y(`i`,{key:1,class:c([`pi pi-image text-2xl`,B.value.accentText])},null,2)),u(d(T),{value:`${e.percent}%`,severity:H[e.percent],class:`absolute left-2 top-2`},null,8,[`value`,`severity`])],2))),128))])]),v(`div`,le,[u(d(k),{class:c(B.value.cardTop)},{title:o(()=>[v(`span`,{class:c([`text-xs font-semibold uppercase tracking-wide`,B.value.accentText])},` Informasi Kegiatan `,2)]),content:o(()=>[(p(!0),y(_,null,f(be.value,(e,t)=>(p(),y(`div`,{key:e.label},[t>0?(p(),l(d(G),{key:0,class:`!my-3`})):m(``,!0),v(`div`,ue,[v(`i`,{class:c([[e.icon,V[t%V.length]],`mt-0.5 text-sm`])},null,2),v(`div`,de,[v(`p`,fe,n(e.label),1),v(`p`,pe,n(e.value),1)])])]))),128))]),_:1},8,[`class`]),b.value.latitude&&b.value.longitude?(p(),l(d(k),{key:0,class:`border-t-4 border-violet-400`},{title:o(()=>[...t[2]||=[v(`span`,{class:`text-xs font-semibold uppercase tracking-wide text-violet-600`},`Lokasi Pembangunan`,-1)]]),content:o(()=>[v(`div`,{ref_key:`mapEl`,ref:U,class:`relative isolate z-0 h-60 w-full overflow-hidden rounded-xl`},null,512),u(d(w),{as:`a`,href:J.value,target:`_blank`,rel:`noopener`,label:`Buka di Google Maps`,icon:`pi pi-external-link`,outlined:``,class:`mt-4 w-full`},null,8,[`href`])]),_:1})):m(``,!0)])]),x.value.length?(p(),y(`div`,me,[t[3]||=v(`h2`,{class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-lg font-bold text-transparent`},` Pembangunan Lainnya `,-1),v(`div`,he,[(p(!0),y(_,null,f(x.value,e=>(p(),l(d(k),{key:e.slug,class:c(z(e.category).cardTop)},{title:o(()=>[v(`span`,ge,n(e.title),1)]),subtitle:o(()=>[v(`span`,_e,[v(`i`,{class:c([`pi pi-map-marker`,z(e.category).accentText])},null,2),v(`span`,ve,n(e.location),1)])]),content:o(()=>[u(d(T),{value:d(P)[e.status].label,severity:d(P)[e.status].severity,icon:d(P)[e.status].icon},null,8,[`value`,`severity`,`icon`]),v(`p`,ye,n(e.shortDesc),1)]),footer:o(()=>[u(d(w),{as:`router-link`,to:{name:`development-detail`,params:{slug:e.slug}},label:`Lihat Detail`,icon:`pi pi-arrow-right`,iconPos:`right`,outlined:``,class:`w-full`},null,8,[`to`])]),_:2},1032,[`class`]))),128))])])):m(``,!0)],64)):(p(),y(`div`,Z,[u(d(j),{severity:`warn`,icon:`pi pi-exclamation-triangle`,class:`w-full`},{default:o(()=>[...t[0]||=[h(` Data pembangunan yang kamu cari tidak ditemukan atau sudah dipindahkan. `,-1)]]),_:1}),u(d(w),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`})]))]))}};export{$ as default};