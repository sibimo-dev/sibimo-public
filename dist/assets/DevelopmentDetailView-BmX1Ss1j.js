import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{A as t,E as n,H as r,M as i,N as a,T as ee,W as o,at as s,c,et as l,h as u,l as d,m as f,o as p,r as m,s as h,u as g,w as _,wt as v,xt as y}from"./runtime-core.esm-bundler-rMHY4zYK.js";import{f as b,r as x,s as S}from"./ripple-BLETvUc8.js";import{p as C}from"./index-D7GsqZvv.js";import{t as w}from"./tag-Ctn9XLPH.js";import{a as T,i as E,n as D,r as O,t as k}from"./card-DFt9IPFp.js";import{t as A}from"./image-KqLfxKzA.js";import{t as j}from"./message-b-Yd-tf6.js";import{t as te}from"./progressspinner-YFvL1uh_.js";import{a as M,c as N,i as P,o as F,s as I,t as L}from"./development-DMEMtkuE.js";var R=e(T()),z=S.extend({name:`divider`,style:`
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
`,classes:{root:function(e){var t=e.props;return[`p-divider p-component`,`p-divider-`+t.layout,`p-divider-`+t.type,{"p-divider-left":t.layout===`horizontal`&&(!t.align||t.align===`left`)},{"p-divider-center":t.layout===`horizontal`&&t.align===`center`},{"p-divider-right":t.layout===`horizontal`&&t.align===`right`},{"p-divider-top":t.layout===`vertical`&&t.align===`top`},{"p-divider-center":t.layout===`vertical`&&(!t.align||t.align===`center`)},{"p-divider-bottom":t.layout===`vertical`&&t.align===`bottom`}]},content:`p-divider-content`},inlineStyles:{root:function(e){var t=e.props;return{justifyContent:t.layout===`horizontal`?t.align===`center`||t.align===null?`center`:t.align===`left`?`flex-start`:t.align===`right`?`flex-end`:null:null,alignItems:t.layout===`vertical`?t.align===`center`||t.align===null?`center`:t.align===`top`?`flex-start`:t.align===`bottom`?`flex-end`:null:null}}}}),B={name:`BaseDivider`,extends:x,props:{align:{type:String,default:null},layout:{type:String,default:`horizontal`},type:{type:String,default:`solid`}},style:z,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function V(e){"@babel/helpers - typeof";return V=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},V(e)}function H(e,t,n){return(t=U(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function U(e){var t=W(e,`string`);return V(t)==`symbol`?t:t+``}function W(e,t){if(V(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(V(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var G={name:`Divider`,extends:B,inheritAttrs:!1,computed:{dataP:function(){return b(H(H(H({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},K=[`aria-orientation`,`data-p`],q=[`data-p`];function J(e,n,r,i,ee,o){return t(),g(`div`,_({class:e.cx(`root`),style:e.sx(`root`),role:`separator`,"aria-orientation":e.layout,"data-p":o.dataP},e.ptmi(`root`)),[e.$slots.default?(t(),g(`div`,_({key:0,class:e.cx(`content`),"data-p":o.dataP},e.ptm(`content`)),[a(e.$slots,`default`)],16,q)):d(``,!0)],16,K)}G.render=J;var Y={class:`flex flex-col gap-8 py-6 lg:py-8`},X={key:0,class:`flex justify-center py-20`},Z={key:1,class:`flex flex-col items-start gap-4 py-10`},ne={class:`flex flex-col gap-3`},re={class:`flex flex-wrap items-center gap-2`},ie={class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl`},ae={class:`flex items-center gap-1.5 text-sm font-medium text-muted`},oe={class:`text-sm leading-relaxed text-default md:text-[15px]`},se={class:`grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8`},ce={class:`flex flex-col gap-4`},le={class:`grid grid-cols-3 gap-3`},ue={class:`flex flex-col gap-6`},de={class:`flex items-start gap-3`},fe={class:`min-w-0`},Q={class:`text-xs font-medium text-muted`},pe={class:`mt-0.5 text-sm font-semibold text-heading`},me={key:0,class:`flex flex-col gap-5`},he={class:`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`},ge={class:`line-clamp-2 text-base font-bold leading-snug text-heading`},_e={class:`flex items-center gap-1.5 text-xs text-muted`},ve={class:`truncate`},ye={class:`mt-3 line-clamp-2 text-sm leading-relaxed text-muted`},$={__name:`DevelopmentDetailView`,props:{slug:{type:String,required:!0}},setup(e){let a=e;delete R.default.Icon.Default.prototype._getIconUrl,R.default.Icon.Default.mergeOptions({iconRetinaUrl:E,iconUrl:O,shadowUrl:D});let _=l(null),b=l([]),x=l(!0),S=[{cardTop:`border-t-4 border-sky-400`,imageGradient:`from-sky-100 via-cyan-100 to-sky-200`,badge:`bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30`,accentText:`text-sky-600`},{cardTop:`border-t-4 border-rose-400`,imageGradient:`from-rose-100 via-pink-100 to-rose-200`,badge:`bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30`,accentText:`text-rose-600`},{cardTop:`border-t-4 border-amber-400`,imageGradient:`from-amber-100 via-orange-100 to-amber-200`,badge:`bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30`,accentText:`text-amber-600`},{cardTop:`border-t-4 border-violet-400`,imageGradient:`from-violet-100 via-purple-100 to-violet-200`,badge:`bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30`,accentText:`text-violet-600`},{cardTop:`border-t-4 border-emerald-400`,imageGradient:`from-emerald-100 via-teal-100 to-emerald-200`,badge:`bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30`,accentText:`text-emerald-600`}];function T(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return t}function z(e){return e?S[T(e)%S.length]:S[0]}let B=p(()=>z(_.value?.category)),V=[`text-sky-500`,`text-rose-500`,`text-amber-500`,`text-violet-500`,`text-emerald-500`],H={0:`secondary`,50:`info`,100:`success`},U=l(null),W=null;function K(){W?.remove(),W=null}function q(){K();let e=_.value;if(!U.value||!e?.latitude||!e?.longitude)return;let t=[e.latitude,e.longitude];W=R.default.map(U.value,{scrollWheelZoom:!1,zoomControl:!0}).setView(t,16),W.getPane(`tilePane`).style.zIndex=1,W.getPane(`overlayPane`).style.zIndex=4,W.getPane(`markerPane`).style.zIndex=5,W.getPane(`popupPane`).style.zIndex=6,R.default.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{maxZoom:19,attribution:`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`}).addTo(W),W.on(`click`,()=>W?.scrollWheelZoom.enable()),U.value.addEventListener(`mouseleave`,()=>W?.scrollWheelZoom.disable());let n=document.createElement(`div`),r=document.createElement(`b`);r.textContent=e.title,n.append(r,document.createElement(`br`),document.createTextNode(e.location)),R.default.marker(t).addTo(W).bindPopup(n)}n(K);let J=p(()=>_.value?.latitude?`https://www.google.com/maps?q=${_.value.latitude},${_.value.longitude}`:``);r(()=>a.slug,async e=>{x.value=!0,K();try{_.value=await F(e),b.value=await I(_.value)}catch(e){console.error(`Gagal memuat detail pembangunan:`,e),_.value=null,b.value=[]}finally{x.value=!1}await ee(),q()},{immediate:!0});let $=p(()=>_.value?.photos?.length?_.value.photos:[0,50,100].map(e=>({percent:e,image:``}))),be=p(()=>_.value?[{label:`Nama Kegiatan`,value:_.value.title,icon:`pi pi-tag`},{label:`Alamat`,value:_.value.location,icon:`pi pi-map-marker`},{label:`Volume`,value:_.value.volume,icon:`pi pi-box`},{label:`Anggaran`,value:P(_.value.budget),icon:`pi pi-wallet`},{label:`Sumber Dana`,value:_.value.fundingSource,icon:`pi pi-briefcase`},{label:`Pelaksana`,value:_.value.contractor,icon:`pi pi-users`},{label:`Tahun Anggaran`,value:String(_.value.year),icon:`pi pi-calendar`},{label:`Mulai`,value:M(_.value.startDate),icon:`pi pi-play`},{label:`Target Selesai`,value:M(_.value.endDate),icon:`pi pi-flag`}]:[]);return(e,n)=>(t(),g(`div`,Y,[x.value?(t(),g(`div`,X,[u(s(te),{strokeWidth:4,class:`!h-10 !w-10`})])):_.value?(t(),g(m,{key:2},[u(s(C),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`,text:``,class:`w-fit`}),h(`div`,ne,[h(`div`,re,[u(s(w),{value:s(N)[_.value.status].label,severity:s(N)[_.value.status].severity,icon:s(N)[_.value.status].icon},null,8,[`value`,`severity`,`icon`]),u(s(w),{value:_.value.category,icon:s(L)(_.value.category),unstyled:``,class:y([`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold`,B.value.badge])},null,8,[`value`,`icon`,`class`])]),h(`h1`,ie,v(_.value.title),1),h(`div`,ae,[h(`i`,{class:y([`pi pi-map-marker`,B.value.accentText])},null,2),f(` `+v(_.value.location),1)]),h(`p`,oe,v(_.value.longDesc),1)]),h(`div`,se,[h(`div`,ce,[h(`div`,{class:y([`flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br lg:aspect-auto lg:h-[760px]`,_.value.documentationImage?`bg-surface`:B.value.imageGradient])},[_.value.documentationImage?(t(),c(s(A),{key:0,src:_.value.documentationImage,alt:`Dokumentasi ${_.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-contain`},null,8,[`src`,`alt`])):(t(),g(`div`,{key:1,class:y([`flex flex-col items-center gap-2`,B.value.accentText])},[...n[1]||=[h(`i`,{class:`pi pi-image text-5xl`},null,-1),h(`span`,{class:`text-sm`},`Foto dokumentasi belum diunggah`,-1)]],2))],2),h(`div`,le,[(t(!0),g(m,null,i($.value,e=>(t(),g(`div`,{key:e.percent,class:y([`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border-default bg-gradient-to-br`,e.image?`bg-surface-hover`:B.value.imageGradient])},[e.image?(t(),c(s(A),{key:0,src:e.image,alt:`Foto progres ${e.percent}% - ${_.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-cover`},null,8,[`src`,`alt`])):(t(),g(`i`,{key:1,class:y([`pi pi-image text-2xl`,B.value.accentText])},null,2)),u(s(w),{value:`${e.percent}%`,severity:H[e.percent],class:`absolute left-2 top-2`},null,8,[`value`,`severity`])],2))),128))])]),h(`div`,ue,[u(s(k),{class:y(B.value.cardTop)},{title:o(()=>[h(`span`,{class:y([`text-xs font-semibold uppercase tracking-wide`,B.value.accentText])},` Informasi Kegiatan `,2)]),content:o(()=>[(t(!0),g(m,null,i(be.value,(e,n)=>(t(),g(`div`,{key:e.label},[n>0?(t(),c(s(G),{key:0,class:`!my-3`})):d(``,!0),h(`div`,de,[h(`i`,{class:y([[e.icon,V[n%V.length]],`mt-0.5 text-sm`])},null,2),h(`div`,fe,[h(`p`,Q,v(e.label),1),h(`p`,pe,v(e.value),1)])])]))),128))]),_:1},8,[`class`]),_.value.latitude&&_.value.longitude?(t(),c(s(k),{key:0,class:`border-t-4 border-violet-400`},{title:o(()=>[...n[2]||=[h(`span`,{class:`text-xs font-semibold uppercase tracking-wide text-violet-600`},`Lokasi Pembangunan`,-1)]]),content:o(()=>[h(`div`,{ref_key:`mapEl`,ref:U,class:`relative isolate z-0 h-60 w-full overflow-hidden rounded-xl`},null,512),u(s(C),{as:`a`,href:J.value,target:`_blank`,rel:`noopener`,label:`Buka di Google Maps`,icon:`pi pi-external-link`,outlined:``,class:`mt-4 w-full`},null,8,[`href`])]),_:1})):d(``,!0)])]),b.value.length?(t(),g(`div`,me,[n[3]||=h(`h2`,{class:`bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-lg font-bold text-transparent`},` Pembangunan Lainnya `,-1),h(`div`,he,[(t(!0),g(m,null,i(b.value,e=>(t(),c(s(k),{key:e.slug,class:y(z(e.category).cardTop)},{title:o(()=>[h(`span`,ge,v(e.title),1)]),subtitle:o(()=>[h(`span`,_e,[h(`i`,{class:y([`pi pi-map-marker`,z(e.category).accentText])},null,2),h(`span`,ve,v(e.location),1)])]),content:o(()=>[u(s(w),{value:s(N)[e.status].label,severity:s(N)[e.status].severity,icon:s(N)[e.status].icon},null,8,[`value`,`severity`,`icon`]),h(`p`,ye,v(e.shortDesc),1)]),footer:o(()=>[u(s(C),{as:`router-link`,to:{name:`development-detail`,params:{slug:e.slug}},label:`Lihat Detail`,icon:`pi pi-arrow-right`,iconPos:`right`,outlined:``,class:`w-full`},null,8,[`to`])]),_:2},1032,[`class`]))),128))])])):d(``,!0)],64)):(t(),g(`div`,Z,[u(s(j),{severity:`warn`,icon:`pi pi-exclamation-triangle`,class:`w-full`},{default:o(()=>[...n[0]||=[f(` Data pembangunan yang kamu cari tidak ditemukan atau sudah dipindahkan. `,-1)]]),_:1}),u(s(C),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`})]))]))}};export{$ as default};