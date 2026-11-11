import{A as e,E as t,H as n,M as r,N as i,T as a,W as o,at as s,c,et as l,h as u,l as d,m as f,o as p,r as m,s as h,u as g,w as _,wt as v,xt as y}from"./runtime-core.esm-bundler-rMHY4zYK.js";import{D as b,N as x,Wt as S,p as C,x as w}from"./index-B-bHyr7Q.js";import{t as T}from"./tag-BKgvgTY5.js";import{a as E,i as ee,n as D,r as te,t as O}from"./card-rYzfAw8d.js";import{t as k}from"./image-SR_js41H.js";import{t as A}from"./message-BwddaV4M.js";import{t as ne}from"./progressspinner-C4aEJbM3.js";import{a as j,c as M,i as N,o as P,s as F,t as I}from"./development-n6PBAsge.js";var L=S(E()),R=b.extend({name:`divider`,style:`
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
`,classes:{root:function(e){var t=e.props;return[`p-divider p-component`,`p-divider-`+t.layout,`p-divider-`+t.type,{"p-divider-left":t.layout===`horizontal`&&(!t.align||t.align===`left`)},{"p-divider-center":t.layout===`horizontal`&&t.align===`center`},{"p-divider-right":t.layout===`horizontal`&&t.align===`right`},{"p-divider-top":t.layout===`vertical`&&t.align===`top`},{"p-divider-center":t.layout===`vertical`&&(!t.align||t.align===`center`)},{"p-divider-bottom":t.layout===`vertical`&&t.align===`bottom`}]},content:`p-divider-content`},inlineStyles:{root:function(e){var t=e.props;return{justifyContent:t.layout===`horizontal`?t.align===`center`||t.align===null?`center`:t.align===`left`?`flex-start`:t.align===`right`?`flex-end`:null:null,alignItems:t.layout===`vertical`?t.align===`center`||t.align===null?`center`:t.align===`top`?`flex-start`:t.align===`bottom`?`flex-end`:null:null}}}}),z={name:`BaseDivider`,extends:w,props:{align:{type:String,default:null},layout:{type:String,default:`horizontal`},type:{type:String,default:`solid`}},style:R,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function B(e){"@babel/helpers - typeof";return B=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},B(e)}function V(e,t,n){return(t=H(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function H(e){var t=U(e,`string`);return B(t)==`symbol`?t:t+``}function U(e,t){if(B(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(B(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var W={name:`Divider`,extends:z,inheritAttrs:!1,computed:{dataP:function(){return x(V(V(V({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},G=[`aria-orientation`,`data-p`],K=[`data-p`];function q(t,n,r,a,o,s){return e(),g(`div`,_({class:t.cx(`root`),style:t.sx(`root`),role:`separator`,"aria-orientation":t.layout,"data-p":s.dataP},t.ptmi(`root`)),[t.$slots.default?(e(),g(`div`,_({key:0,class:t.cx(`content`),"data-p":s.dataP},t.ptm(`content`)),[i(t.$slots,`default`)],16,K)):d(``,!0)],16,G)}W.render=q;var J={class:`flex flex-col gap-8 py-6 lg:py-8`},Y={key:0,class:`flex justify-center py-20`},X={key:1,class:`flex flex-col items-start gap-4 py-10`},Z={class:`flex flex-col gap-3`},re={class:`flex flex-wrap items-center gap-2`},ie={class:`bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl`},ae={class:`flex items-center gap-1.5 text-sm font-medium text-muted`},oe={class:`text-sm leading-relaxed text-default md:text-[15px]`},se={class:`grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8`},ce={class:`flex flex-col gap-4`},le={class:`grid grid-cols-3 gap-3`},ue={class:`flex flex-col gap-6`},de={class:`flex items-start gap-3`},fe={class:`min-w-0`},pe={class:`text-xs font-medium text-muted`},me={class:`mt-0.5 text-sm font-semibold text-heading`},he={key:0,class:`mt-2 text-xs text-muted`},ge={key:0,class:`flex flex-col gap-5`},_e={class:`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`},ve={class:`line-clamp-2 text-base font-bold leading-snug text-heading`},ye={class:`flex items-center gap-1.5 text-xs text-muted`},be={class:`truncate`},Q={class:`mt-3 line-clamp-2 text-sm leading-relaxed text-muted`},$={__name:`DevelopmentDetailView`,props:{slug:{type:String,required:!0}},setup(i){let _=i;delete L.default.Icon.Default.prototype._getIconUrl,L.default.Icon.Default.mergeOptions({iconRetinaUrl:ee,iconUrl:te,shadowUrl:D});let b=l(null),x=l([]),S=l(!0),w=[{cardTop:`border-t-4 border-sky-400`,imageGradient:`from-sky-100 via-cyan-100 to-sky-200`,badge:`bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30`,accentText:`text-sky-600`},{cardTop:`border-t-4 border-rose-400`,imageGradient:`from-rose-100 via-pink-100 to-rose-200`,badge:`bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30`,accentText:`text-rose-600`},{cardTop:`border-t-4 border-amber-400`,imageGradient:`from-amber-100 via-orange-100 to-amber-200`,badge:`bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30`,accentText:`text-amber-600`},{cardTop:`border-t-4 border-violet-400`,imageGradient:`from-violet-100 via-purple-100 to-violet-200`,badge:`bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30`,accentText:`text-violet-600`},{cardTop:`border-t-4 border-emerald-400`,imageGradient:`from-emerald-100 via-teal-100 to-emerald-200`,badge:`bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30`,accentText:`text-emerald-600`}];function E(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return t}function R(e){return e?w[E(e)%w.length]:w[0]}let z=p(()=>R(b.value?.category)),B=[`text-sky-500`,`text-rose-500`,`text-amber-500`,`text-violet-500`,`text-emerald-500`],V={0:`secondary`,50:`info`,100:`success`},H=l(null),U=null,G=p(()=>!!(b.value?.endLatitude&&b.value?.endLongitude));function K(){U?.remove(),U=null}function q(e,t){return L.default.divIcon({className:``,html:`<div style="width:30px;height:30px;border-radius:50%;background:${t};color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">${e}</div>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-15]})}function $(e,t){let n=document.createElement(`div`),r=document.createElement(`b`);return r.textContent=e,n.append(r,document.createElement(`br`),document.createTextNode(t)),n}async function xe(e,t,n,r){try{let i=`https://router.project-osrm.org/route/v1/driving/${n[1]},${n[0]};${r[1]},${r[0]}?overview=full&geometries=geojson`,a=(await(await fetch(i)).json()).routes?.[0]?.geometry?.coordinates;if(!a?.length||e!==U)return;let o=a.map(([e,t])=>[t,e]);t.setLatLngs(o),t.setStyle({dashArray:null}),e.fitBounds(L.default.latLngBounds(o),{padding:[30,30]})}catch{}}function Se(){K();let e=b.value;if(!H.value||!e?.latitude||!e?.longitude)return;let t=[e.latitude,e.longitude];if(U=L.default.map(H.value,{scrollWheelZoom:!1,zoomControl:!0}).setView(t,16),U.getPane(`tilePane`).style.zIndex=1,U.getPane(`overlayPane`).style.zIndex=4,U.getPane(`markerPane`).style.zIndex=5,U.getPane(`popupPane`).style.zIndex=6,L.default.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{maxZoom:19,attribution:`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`}).addTo(U),U.on(`click`,()=>U?.scrollWheelZoom.enable()),H.value.addEventListener(`mouseleave`,()=>U?.scrollWheelZoom.disable()),!G.value){L.default.marker(t).addTo(U).bindPopup($(e.title,e.location));return}let n=[e.endLatitude,e.endLongitude],r=L.default.polyline([t,n],{color:`#7c3aed`,weight:5,opacity:.85,dashArray:`8 8`}).addTo(U);L.default.marker(t,{icon:q(`A`,`#0ea5e9`)}).addTo(U).bindPopup($(`Titik awal`,e.title)),L.default.marker(n,{icon:q(`B`,`#e11d48`)}).addTo(U).bindPopup($(`Titik akhir`,e.title)),U.fitBounds(L.default.latLngBounds([t,n]),{padding:[30,30]}),xe(U,r,t,n)}t(K);let Ce=p(()=>{let e=b.value;return e?.latitude?G.value?`https://www.google.com/maps/dir/?api=1&origin=${e.latitude},${e.longitude}&destination=${e.endLatitude},${e.endLongitude}`:`https://www.google.com/maps?q=${e.latitude},${e.longitude}`:``});n(()=>_.slug,async e=>{S.value=!0,K();try{b.value=await P(e),x.value=await F(b.value)}catch(e){console.error(`Gagal memuat detail pembangunan:`,e),b.value=null,x.value=[]}finally{S.value=!1}await a(),Se()},{immediate:!0});let we=p(()=>b.value?.photos?.length?b.value.photos:[0,50,100].map(e=>({percent:e,image:``}))),Te=p(()=>b.value?[{label:`Nama Kegiatan`,value:b.value.title,icon:`pi pi-tag`},{label:`Alamat`,value:b.value.location,icon:`pi pi-map-marker`},{label:`Volume`,value:b.value.volume,icon:`pi pi-box`},{label:`Anggaran`,value:N(b.value.budget),icon:`pi pi-wallet`},{label:`Sumber Dana`,value:b.value.fundingSource,icon:`pi pi-briefcase`},{label:`Pelaksana`,value:b.value.contractor,icon:`pi pi-users`},{label:`Tahun Anggaran`,value:String(b.value.year),icon:`pi pi-calendar`},{label:`Mulai`,value:j(b.value.startDate),icon:`pi pi-play`},{label:`Target Selesai`,value:j(b.value.endDate),icon:`pi pi-flag`}]:[]);return(t,n)=>(e(),g(`div`,J,[S.value?(e(),g(`div`,Y,[u(s(ne),{strokeWidth:4,class:`!h-10 !w-10`})])):b.value?(e(),g(m,{key:2},[u(s(C),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`,text:``,class:`w-fit`}),h(`div`,Z,[h(`div`,re,[u(s(T),{value:s(M)[b.value.status].label,severity:s(M)[b.value.status].severity,icon:s(M)[b.value.status].icon},null,8,[`value`,`severity`,`icon`]),u(s(T),{value:b.value.category,icon:s(I)(b.value.category),unstyled:``,class:y([`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold`,z.value.badge])},null,8,[`value`,`icon`,`class`])]),h(`h1`,ie,v(b.value.title),1),h(`div`,ae,[h(`i`,{class:y([`pi pi-map-marker`,z.value.accentText])},null,2),f(` `+v(b.value.location),1)]),h(`p`,oe,v(b.value.longDesc),1)]),h(`div`,se,[h(`div`,ce,[h(`div`,{class:y([`flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br lg:aspect-auto lg:h-[760px]`,b.value.documentationImage?`bg-surface`:z.value.imageGradient])},[b.value.documentationImage?(e(),c(s(k),{key:0,src:b.value.documentationImage,alt:`Dokumentasi ${b.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-contain`},null,8,[`src`,`alt`])):(e(),g(`div`,{key:1,class:y([`flex flex-col items-center gap-2`,z.value.accentText])},[...n[1]||=[h(`i`,{class:`pi pi-image text-5xl`},null,-1),h(`span`,{class:`text-sm`},`Foto dokumentasi belum diunggah`,-1)]],2))],2),h(`div`,le,[(e(!0),g(m,null,r(we.value,t=>(e(),g(`div`,{key:t.percent,class:y([`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border-default bg-gradient-to-br`,t.image?`bg-surface-hover`:z.value.imageGradient])},[t.image?(e(),c(s(k),{key:0,src:t.image,alt:`Foto progres ${t.percent}% - ${b.value.title}`,preview:``,class:`!block h-full w-full`,imageClass:`h-full w-full object-cover`},null,8,[`src`,`alt`])):(e(),g(`i`,{key:1,class:y([`pi pi-image text-2xl`,z.value.accentText])},null,2)),u(s(T),{value:`${t.percent}%`,severity:V[t.percent],class:`absolute left-2 top-2`},null,8,[`value`,`severity`])],2))),128))])]),h(`div`,ue,[u(s(O),{class:y(z.value.cardTop)},{title:o(()=>[h(`span`,{class:y([`text-xs font-semibold uppercase tracking-wide`,z.value.accentText])},` Informasi Kegiatan `,2)]),content:o(()=>[(e(!0),g(m,null,r(Te.value,(t,n)=>(e(),g(`div`,{key:t.label},[n>0?(e(),c(s(W),{key:0,class:`!my-3`})):d(``,!0),h(`div`,de,[h(`i`,{class:y([[t.icon,B[n%B.length]],`mt-0.5 text-sm`])},null,2),h(`div`,fe,[h(`p`,pe,v(t.label),1),h(`p`,me,v(t.value),1)])])]))),128))]),_:1},8,[`class`]),b.value.latitude&&b.value.longitude?(e(),c(s(O),{key:0,class:`border-t-4 border-violet-400`},{title:o(()=>[...n[2]||=[h(`span`,{class:`text-xs font-semibold uppercase tracking-wide text-violet-600`},`Lokasi Pembangunan`,-1)]]),content:o(()=>[h(`div`,{ref_key:`mapEl`,ref:H,class:`relative isolate z-0 h-60 w-full overflow-hidden rounded-xl`},null,512),G.value?(e(),g(`p`,he,[...n[3]||=[h(`b`,{class:`text-sky-600`},`A`,-1),f(` titik awal \xA0·\xA0 `,-1),h(`b`,{class:`text-rose-600`},`B`,-1),f(` titik akhir `,-1)]])):d(``,!0),u(s(C),{as:`a`,href:Ce.value,target:`_blank`,rel:`noopener`,label:G.value?`Buka Rute di Google Maps`:`Buka di Google Maps`,icon:`pi pi-external-link`,outlined:``,class:`mt-4 w-full`},null,8,[`href`,`label`])]),_:1})):d(``,!0)])]),x.value.length?(e(),g(`div`,ge,[n[4]||=h(`h2`,{class:`bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-lg font-bold text-transparent`},` Pembangunan Lainnya `,-1),h(`div`,_e,[(e(!0),g(m,null,r(x.value,t=>(e(),c(s(O),{key:t.slug,class:y(R(t.category).cardTop)},{title:o(()=>[h(`span`,ve,v(t.title),1)]),subtitle:o(()=>[h(`span`,ye,[h(`i`,{class:y([`pi pi-map-marker`,R(t.category).accentText])},null,2),h(`span`,be,v(t.location),1)])]),content:o(()=>[u(s(T),{value:s(M)[t.status].label,severity:s(M)[t.status].severity,icon:s(M)[t.status].icon},null,8,[`value`,`severity`,`icon`]),h(`p`,Q,v(t.shortDesc),1)]),footer:o(()=>[u(s(C),{as:`router-link`,to:{name:`development-detail`,params:{slug:t.slug}},label:`Lihat Detail`,icon:`pi pi-arrow-right`,iconPos:`right`,outlined:``,class:`w-full`},null,8,[`to`])]),_:2},1032,[`class`]))),128))])])):d(``,!0)],64)):(e(),g(`div`,X,[u(s(A),{severity:`warn`,icon:`pi pi-exclamation-triangle`,class:`w-full`},{default:o(()=>[...n[0]||=[f(` Data pembangunan yang kamu cari tidak ditemukan atau sudah dipindahkan. `,-1)]]),_:1}),u(s(C),{as:`router-link`,to:{name:`development`},label:`Kembali ke Pembangunan Kalurahan`,icon:`pi pi-arrow-left`})]))]))}};export{$ as default};