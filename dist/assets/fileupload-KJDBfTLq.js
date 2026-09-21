import{A as e,C as t,M as n,O as r,P as i,V as a,c as o,g as s,h as c,j as l,l as u,m as d,nt as f,r as p,s as m,u as h,vt as g,xt as _,y as v,yt as y}from"./runtime-core.esm-bundler-B90NJl9l.js";import{i as b,l as x,t as S,w as C,x as w}from"./basecomponent-DkSX2u9k.js";import{r as T,t as E}from"./ripple-PQoHU2qI.js";import{D,c as O,l as ee}from"./index-uOaOJxJj.js";import{n as k}from"./portal-lRocHBYp.js";import{t as A}from"./plus-Ci8VAdhc.js";import{t as j}from"./message-DQ36O-KP.js";var M={name:`upload`,meta:{tags:[`upload`,`send`,`transfer`,`give`,`provide`]},svg:{xmlns:`http://www.w3.org/2000/svg`,width:20,height:20,viewBox:`0 0 20 20`,fill:`none`},nodes:[[`path`,{d:`M18 12.25C18.4142 12.25 18.75 12.5858 18.75 13V16C18.75 17.4294 17.694 18.75 16.2197 18.75H3.78027C2.30602 18.75 1.25 17.4294 1.25 16V13C1.25 12.5858 1.58579 12.25 2 12.25C2.41421 12.25 2.75 12.5858 2.75 13V16C2.75 16.7706 3.29452 17.25 3.78027 17.25H16.2197C16.7055 17.25 17.25 16.7706 17.25 16V13C17.25 12.5858 17.5858 12.25 18 12.25ZM10.0254 1.25098C10.0319 1.2512 10.0384 1.25156 10.0449 1.25195C10.0839 1.25426 10.122 1.25954 10.1592 1.26758C10.1925 1.2748 10.2246 1.28607 10.2568 1.29785C10.2693 1.30242 10.2828 1.30437 10.2949 1.30957C10.314 1.31772 10.3311 1.33004 10.3496 1.33984C10.3734 1.35248 10.3977 1.36387 10.4199 1.37891C10.4588 1.40524 10.4959 1.43532 10.5303 1.46973L14.5303 5.46973C14.8232 5.76262 14.8232 6.23738 14.5303 6.53027C14.2374 6.82317 13.7626 6.82317 13.4697 6.53027L10.75 3.81055V13C10.75 13.4142 10.4142 13.75 10 13.75C9.58579 13.75 9.25 13.4142 9.25 13V3.81055L6.53027 6.53027C6.23738 6.82317 5.76262 6.82317 5.46973 6.53027C5.17683 6.23738 5.17683 5.76262 5.46973 5.46973L9.46973 1.46973L9.52637 1.41797C9.53656 1.40965 9.54807 1.40321 9.55859 1.39551C9.57413 1.38414 9.59003 1.37345 9.60645 1.36328C9.63034 1.34849 9.65462 1.3351 9.67969 1.32324C9.69786 1.31462 9.71641 1.30697 9.73535 1.2998C9.76293 1.28942 9.79094 1.28144 9.81934 1.27441C9.8394 1.26944 9.85922 1.26309 9.87988 1.25977C9.89094 1.25799 9.90198 1.25616 9.91309 1.25488C9.9416 1.25159 9.97061 1.25 10 1.25C10.0085 1.25 10.017 1.2507 10.0254 1.25098Z`,fill:`currentColor`,key:`m0nks9`}]]},N=s({name:`Upload`,inheritAttrs:!1,__name:`upload`,setup(e){let{Icon:t}=T(M);return(e,n)=>(r(),o(f(t),y(v(e.$attrs)),null,16))}}),P=b.extend({name:`progressbar`,style:`
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`,classes:{root:function(e){var t=e.instance;return[`p-progressbar p-component`,{"p-progressbar-determinate":t.determinate,"p-progressbar-indeterminate":t.indeterminate}]},value:`p-progressbar-value`,label:`p-progressbar-label`}}),F={name:`ProgressBar`,extends:{name:`BaseProgressBar`,extends:S,props:{value:{type:Number,default:null},mode:{type:String,default:`determinate`},showValue:{type:Boolean,default:!0}},style:P,provide:function(){return{$pcProgressBar:this,$parentInstance:this}}},inheritAttrs:!1,computed:{progressStyle:function(){return{width:this.value+`%`,display:`flex`}},indeterminate:function(){return this.mode===`indeterminate`},determinate:function(){return this.mode===`determinate`},dataP:function(){return x({determinate:this.determinate,indeterminate:this.indeterminate})}}},I=[`aria-valuenow`,`data-p`],L=[`data-p`],R=[`data-p`],z=[`data-p`];function B(e,n,i,a,o,s){return r(),h(`div`,t({role:`progressbar`,class:e.cx(`root`),"aria-valuemin":`0`,"aria-valuenow":e.value,"aria-valuemax":`100`,"data-p":s.dataP},e.ptmi(`root`)),[s.determinate?(r(),h(`div`,t({key:0,class:e.cx(`value`),style:s.progressStyle,"data-p":s.dataP},e.ptm(`value`)),[e.value!=null&&e.value!==0&&e.showValue?(r(),h(`div`,t({key:0,class:e.cx(`label`),"data-p":s.dataP},e.ptm(`label`)),[l(e.$slots,`default`,{},function(){return[d(_(e.value+`%`),1)]})],16,R)):u(``,!0)],16,L)):s.indeterminate?(r(),h(`div`,t({key:1,class:e.cx(`value`),"data-p":s.dataP},e.ptm(`value`)),null,16,z)):u(``,!0)],16,I)}F.render=B;var V=b.extend({name:`fileupload`,style:`
    .p-fileupload input[type='file'] {
        display: none;
    }

    .p-fileupload-advanced {
        border: 1px solid dt('fileupload.border.color');
        border-radius: dt('fileupload.border.radius');
        background: dt('fileupload.background');
        color: dt('fileupload.color');
    }

    .p-fileupload-header {
        display: flex;
        align-items: center;
        padding: dt('fileupload.header.padding');
        background: dt('fileupload.header.background');
        color: dt('fileupload.header.color');
        border-style: solid;
        border-width: dt('fileupload.header.border.width');
        border-color: dt('fileupload.header.border.color');
        border-radius: dt('fileupload.header.border.radius');
        gap: dt('fileupload.header.gap');
    }

    .p-fileupload-content {
        border: 1px solid transparent;
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.content.gap');
        transition: border-color dt('fileupload.transition.duration');
        padding: dt('fileupload.content.padding');
    }

    .p-fileupload-content .p-progressbar {
        width: 100%;
        height: dt('fileupload.progressbar.height');
    }

    .p-fileupload-file-list {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.file.list.gap');
    }

    .p-fileupload-file {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: dt('fileupload.file.padding');
        border-block-end: 1px solid dt('fileupload.file.border.color');
        gap: dt('fileupload.file.gap');
    }

    .p-fileupload-file:last-child {
        border-block-end: 0;
    }

    .p-fileupload-file-info {
        display: flex;
        flex-direction: column;
        gap: dt('fileupload.file.info.gap');
    }

    .p-fileupload-file-name {
        color: dt('fileupload.file.name.color');
        font-weight: dt('fileupload.file.name.font.weight');
        font-size: dt('fileupload.file.name.font.size');
    }

    .p-fileupload-file-size {
        color: dt('fileupload.file.size.color');
        font-weight: dt('fileupload.file.size.font.weight');
        font-size: dt('fileupload.file.size.font.size');
    }

    .p-fileupload-file-thumbnail {
        flex-shrink: 0;
    }

    .p-fileupload-file-actions {
        margin-inline-start: auto;
    }

    .p-fileupload-highlight {
        border: 1px dashed dt('fileupload.content.highlight.border.color');
    }

    .p-fileupload-basic .p-message {
        margin-block-end: dt('fileupload.basic.gap');
    }

    .p-fileupload-basic-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: dt('fileupload.basic.gap');
    }
`,classes:{root:function(e){return[`p-fileupload p-fileupload-${e.props.mode} p-component`]},header:`p-fileupload-header`,pcChooseButton:`p-fileupload-choose-button`,pcUploadButton:`p-fileupload-upload-button`,pcCancelButton:`p-fileupload-cancel-button`,content:`p-fileupload-content`,fileList:`p-fileupload-file-list`,file:`p-fileupload-file`,fileThumbnail:`p-fileupload-file-thumbnail`,fileInfo:`p-fileupload-file-info`,fileName:`p-fileupload-file-name`,fileSize:`p-fileupload-file-size`,pcFileBadge:`p-fileupload-file-badge`,fileActions:`p-fileupload-file-actions`,pcFileRemoveButton:`p-fileupload-file-remove-button`,basicContent:`p-fileupload-basic-content`}}),H={name:`BaseFileUpload`,extends:S,props:{name:{type:String,default:null},url:{type:String,default:null},mode:{type:String,default:`advanced`},multiple:{type:Boolean,default:!1},accept:{type:String,default:null},disabled:{type:Boolean,default:!1},auto:{type:Boolean,default:!1},maxFileSize:{type:Number,default:null},invalidFileSizeMessage:{type:String,default:`{0}: Invalid file size, file size should be smaller than {1}.`},invalidFileTypeMessage:{type:String,default:`{0}: Invalid file type, allowed file types: {1}.`},fileLimit:{type:Number,default:null},invalidFileLimitMessage:{type:String,default:`Maximum number of files exceeded, limit is {0} at most.`},withCredentials:{type:Boolean,default:!1},previewWidth:{type:Number,default:50},chooseLabel:{type:String,default:null},uploadLabel:{type:String,default:null},cancelLabel:{type:String,default:null},customUpload:{type:Boolean,default:!1},showUploadButton:{type:Boolean,default:!0},showCancelButton:{type:Boolean,default:!0},chooseIcon:{type:String,default:void 0},uploadIcon:{type:String,default:void 0},cancelIcon:{type:String,default:void 0},style:null,class:null,chooseButtonProps:{type:null,default:null},uploadButtonProps:{type:Object,default:function(){return{severity:`secondary`}}},cancelButtonProps:{type:Object,default:function(){return{severity:`secondary`}}}},style:V,provide:function(){return{$pcFileUpload:this,$parentInstance:this}}},U={name:`FileContent`,hostName:`FileUpload`,extends:S,emits:[`remove`],props:{files:{type:Array,default:function(){return[]}},badgeSeverity:{type:String,default:`warn`},badgeValue:{type:String,default:null},previewWidth:{type:Number,default:50},templates:{type:null,default:null}},methods:{formatSize:function(e){var t=1024,n=3,r=this.$primevue.config.locale?.fileSizeTypes||[`B`,`KB`,`MB`,`GB`,`TB`,`PB`,`EB`,`ZB`,`YB`];if(e===0)return`0 ${r[0]}`;var i=Math.floor(Math.log(e)/Math.log(t));return`${parseFloat((e/t**+i).toFixed(n))} ${r[i]}`}},components:{Button:O,Badge:ee,Times:k}},W=[`alt`,`src`,`width`];function G(s,l,u,d,f,v){var y=n(`Badge`),b=n(`Times`),x=n(`Button`);return r(!0),h(p,null,e(u.files,function(e,n){return r(),h(`div`,t({key:e.name+e.type+e.size,class:s.cx(`file`)},{ref_for:!0},s.ptm(`file`)),[m(`img`,t({role:`presentation`,class:s.cx(`fileThumbnail`),alt:e.name,src:e.objectURL,width:u.previewWidth},{ref_for:!0},s.ptm(`fileThumbnail`)),null,16,W),m(`div`,t({class:s.cx(`fileInfo`)},{ref_for:!0},s.ptm(`fileInfo`)),[m(`div`,t({class:s.cx(`fileName`)},{ref_for:!0},s.ptm(`fileName`)),_(e.name),17),m(`span`,t({class:s.cx(`fileSize`)},{ref_for:!0},s.ptm(`fileSize`)),_(v.formatSize(e.size)),17)],16),c(y,{value:u.badgeValue,class:g(s.cx(`pcFileBadge`)),severity:u.badgeSeverity,unstyled:s.unstyled,pt:s.ptm(`pcFileBadge`)},null,8,[`value`,`class`,`severity`,`unstyled`,`pt`]),m(`div`,t({class:s.cx(`fileActions`)},{ref_for:!0},s.ptm(`fileActions`)),[c(x,{iconOnly:``,text:``,rounded:``,severity:`danger`,onClick:function(e){return s.$emit(`remove`,n)},class:g(s.cx(`pcFileRemoveButton`)),unstyled:s.unstyled,pt:s.ptm(`pcFileRemoveButton`)},{default:a(function(){return[u.templates.fileremoveicon?(r(),o(i(u.templates.fileremoveicon),{key:0,file:e,index:n},null,8,[`file`,`index`])):(r(),o(b,t({key:1,"aria-hidden":`true`},{ref_for:!0},s.ptm(`pcFileRemoveButton`).icon),null,16))]}),_:2},1032,[`onClick`,`class`,`unstyled`,`pt`])],16)],16)}),128)}U.render=G;function K(e){return Y(e)||J(e)||Z(e)||q()}function q(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function J(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Y(e){if(Array.isArray(e))return Q(e)}function X(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=Z(e))||t){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function Z(e,t){if(e){if(typeof e==`string`)return Q(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Q(e,t):void 0}}function Q(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var $={name:`FileUpload`,extends:H,inheritAttrs:!1,emits:[`select`,`uploader`,`before-upload`,`progress`,`upload`,`error`,`before-send`,`clear`,`remove`,`remove-uploaded-file`],duplicateIEEvent:!1,data:function(){return{uploadedFileCount:0,files:[],messages:[],focused:!1,progress:null,uploadedFiles:[]}},methods:{upload:function(){this.hasFiles&&this.uploader()},onBasicUploaderClick:function(e){e.button===0&&this.$refs.fileInput.click()},onFileSelect:function(e){if(e.type!==`drop`&&this.isIE11()&&this.duplicateIEEvent){this.duplicateIEEvent=!1;return}this.isBasic&&this.hasFiles&&(this.files=[]),this.messages=[],this.files=this.files||[];var t=X(e.dataTransfer?e.dataTransfer.files:e.target.files),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;!this.isFileSelected(r)&&!this.isFileLimitExceeded()&&this.validate(r)&&(this.isImage(r)&&(r.objectURL=window.URL.createObjectURL(r)),this.files.push(r))}}catch(e){t.e(e)}finally{t.f()}this.$emit(`select`,{originalEvent:e,files:this.files}),this.fileLimit&&this.checkFileLimit(),this.auto&&this.hasFiles&&!this.isFileLimitExceeded()&&this.uploader(),e.type!==`drop`&&this.isIE11()?this.clearIEInput():this.clearInputElement()},choose:function(){this.$refs.fileInput.click()},uploader:function(){var e=this;if(this.customUpload)this.fileLimit&&(this.uploadedFileCount+=this.files.length),this.$emit(`uploader`,{files:this.files});else{var t=new XMLHttpRequest,n=new FormData;this.$emit(`before-upload`,{xhr:t,formData:n});var r=X(this.files),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;n.append(this.name,a,a.name)}}catch(e){r.e(e)}finally{r.f()}t.upload.addEventListener(`progress`,function(t){t.lengthComputable&&(e.progress=Math.round(t.loaded*100/t.total)),e.$emit(`progress`,{originalEvent:t,progress:e.progress})}),t.onreadystatechange=function(){if(t.readyState===4){if(e.progress=0,t.status>=200&&t.status<300){var n;e.fileLimit&&(e.uploadedFileCount+=e.files.length),e.$emit(`upload`,{xhr:t,files:e.files}),(n=e.uploadedFiles).push.apply(n,K(e.files))}else e.$emit(`error`,{xhr:t,files:e.files});e.clear()}},this.url&&(t.open(`POST`,this.url,!0),this.$emit(`before-send`,{xhr:t,formData:n}),t.withCredentials=this.withCredentials,t.send(n))}},clear:function(){this.files=[],this.messages=null,this.$emit(`clear`),this.isAdvanced&&this.clearInputElement()},onFocus:function(){this.focused=!0},onBlur:function(){this.focused=!1},isFileSelected:function(e){if(this.files&&this.files.length){var t=X(this.files),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;if(r.name+r.type+r.size===e.name+e.type+e.size)return!0}}catch(e){t.e(e)}finally{t.f()}}return!1},isIE11:function(){return!!window.MSInputMethodContext&&!!document.documentMode},validate:function(e){return this.accept&&!this.isFileTypeValid(e)?(this.messages.push(this.invalidFileTypeMessage.replace(`{0}`,e.name).replace(`{1}`,this.accept)),!1):this.maxFileSize&&e.size>this.maxFileSize?(this.messages.push(this.invalidFileSizeMessage.replace(`{0}`,e.name).replace(`{1}`,this.formatSize(this.maxFileSize))),!1):!0},isFileTypeValid:function(e){var t=X(this.accept.split(`,`).map(function(e){return e.trim()})),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;if(this.isWildcard(r)?this.getTypeClass(e.type)===this.getTypeClass(r):e.type==r||this.getFileExtension(e).toLowerCase()===r.toLowerCase())return!0}}catch(e){t.e(e)}finally{t.f()}return!1},getTypeClass:function(e){return e.substring(0,e.indexOf(`/`))},isWildcard:function(e){return e.indexOf(`*`)!==-1},getFileExtension:function(e){return`.`+e.name.split(`.`).pop()},isImage:function(e){return/^image\//.test(e.type)},onDragEnter:function(e){!this.disabled&&(!this.hasFiles||this.multiple)&&(e.stopPropagation(),e.preventDefault())},onDragOver:function(e){!this.disabled&&(!this.hasFiles||this.multiple)&&(!this.isUnstyled&&w(this.$refs.content,`p-fileupload-highlight`),this.$refs.content&&this.$refs.content.setAttribute(`data-p-highlight`,!0),e.stopPropagation(),e.preventDefault())},onDragLeave:function(){this.disabled||(!this.isUnstyled&&C(this.$refs.content,`p-fileupload-highlight`),this.$refs.content&&this.$refs.content.setAttribute(`data-p-highlight`,!1))},onDrop:function(e){if(!this.disabled){!this.isUnstyled&&C(this.$refs.content,`p-fileupload-highlight`),this.$refs.content&&this.$refs.content.setAttribute(`data-p-highlight`,!1),e.stopPropagation(),e.preventDefault();var t=e.dataTransfer?e.dataTransfer.files:e.target.files;(this.multiple||t&&t.length===1)&&this.onFileSelect(e)}},remove:function(e){this.clearInputElement();var t=this.files.splice(e,1)[0];this.files=K(this.files),this.$emit(`remove`,{file:t,files:this.files})},removeUploadedFile:function(e){var t=this.uploadedFiles.splice(e,1)[0];this.uploadedFiles=K(this.uploadedFiles),this.$emit(`remove-uploaded-file`,{file:t,files:this.uploadedFiles})},clearInputElement:function(){this.$refs.fileInput.value=``},clearIEInput:function(){this.$refs.fileInput&&(this.duplicateIEEvent=!0,this.$refs.fileInput.value=``)},formatSize:function(e){var t=1024,n=3,r=this.$primevue.config.locale?.fileSizeTypes||[`B`,`KB`,`MB`,`GB`,`TB`,`PB`,`EB`,`ZB`,`YB`];if(e===0)return`0 ${r[0]}`;var i=Math.floor(Math.log(e)/Math.log(t));return`${parseFloat((e/t**+i).toFixed(n))} ${r[i]}`},isFileLimitExceeded:function(){return this.fileLimit&&this.fileLimit<=this.files.length+this.uploadedFileCount&&this.focused&&(this.focused=!1),this.fileLimit&&this.fileLimit<this.files.length+this.uploadedFileCount},checkFileLimit:function(){this.isFileLimitExceeded()&&this.messages.push(this.invalidFileLimitMessage.replace(`{0}`,this.fileLimit.toString()))},onMessageClose:function(){this.messages=null}},computed:{isAdvanced:function(){return this.mode===`advanced`},isBasic:function(){return this.mode===`basic`},chooseButtonClass:function(){return[this.cx(`pcChooseButton`),this.class]},basicFileChosenLabel:function(){if(this.auto)return this.chooseButtonLabel;if(this.hasFiles){var e;return this.files&&this.files.length===1?this.files[0].name:(e=this.$primevue.config.locale)==null||(e=e.fileChosenMessage)==null?void 0:e.replace(`{0}`,this.files.length)}return this.$primevue.config.locale?.noFileChosenMessage||``},hasFiles:function(){return this.files&&this.files.length>0},hasUploadedFiles:function(){return this.uploadedFiles&&this.uploadedFiles.length>0},chooseDisabled:function(){return this.disabled||this.fileLimit&&this.fileLimit<=this.files.length+this.uploadedFileCount},uploadDisabled:function(){return this.disabled||!this.hasFiles||this.fileLimit&&this.fileLimit<this.files.length},cancelDisabled:function(){return this.disabled||!this.hasFiles},chooseButtonLabel:function(){return this.chooseLabel||this.$primevue.config.locale.choose},uploadButtonLabel:function(){return this.uploadLabel||this.$primevue.config.locale.upload},cancelButtonLabel:function(){return this.cancelLabel||this.$primevue.config.locale.cancel},completedLabel:function(){return this.$primevue.config.locale.completed},pendingLabel:function(){return this.$primevue.config.locale.pending}},components:{Button:O,ProgressBar:F,Message:j,FileContent:U,Plus:A,Upload:N,Times:k},directives:{ripple:E}},te=[`multiple`,`accept`,`disabled`],ne=[`accept`,`disabled`,`multiple`];function re(s,f,v,b,x,S){var C=n(`Button`),w=n(`ProgressBar`),T=n(`Message`),E=n(`FileContent`);return S.isAdvanced?(r(),h(`div`,t({key:0,class:s.cx(`root`)},s.ptmi(`root`)),[m(`input`,t({ref:`fileInput`,type:`file`,onChange:f[0]||=function(){return S.onFileSelect&&S.onFileSelect.apply(S,arguments)},multiple:s.multiple,accept:s.accept,disabled:S.chooseDisabled},s.ptm(`input`)),null,16,te),m(`div`,t({class:s.cx(`header`)},s.ptm(`header`)),[l(s.$slots,`header`,{files:x.files,uploadedFiles:x.uploadedFiles,chooseCallback:S.choose,uploadCallback:S.uploader,clearCallback:S.clear},function(){return[c(C,t({class:S.chooseButtonClass,style:s.style,disabled:s.disabled,unstyled:s.unstyled,onClick:S.choose,onKeydown:D(S.choose,[`enter`]),onFocus:S.onFocus,onBlur:S.onBlur},s.chooseButtonProps,{pt:s.ptm(`pcChooseButton`)}),{default:a(function(){return[l(s.$slots,`chooseicon`,{},function(){return[(r(),o(i(s.chooseIcon?`span`:`Plus`),t({class:s.chooseIcon,"aria-hidden":`true`},s.ptm(`pcChooseButton`).icon),null,16,[`class`]))]}),d(` `+_(S.chooseButtonLabel),1)]}),_:3},16,[`class`,`style`,`disabled`,`unstyled`,`onClick`,`onKeydown`,`onFocus`,`onBlur`,`pt`]),s.showUploadButton?(r(),o(C,t({key:0,class:s.cx(`pcUploadButton`),onClick:S.uploader,disabled:S.uploadDisabled,unstyled:s.unstyled},s.uploadButtonProps,{pt:s.ptm(`pcUploadButton`)}),{default:a(function(){return[l(s.$slots,`uploadicon`,{},function(){return[(r(),o(i(s.uploadIcon?`span`:`Upload`),t({class:s.uploadIcon,"aria-hidden":`true`},s.ptm(`pcUploadButton`).icon,{"data-pc-section":`uploadbuttonicon`}),null,16,[`class`]))]}),d(` `+_(S.uploadButtonLabel),1)]}),_:3},16,[`class`,`onClick`,`disabled`,`unstyled`,`pt`])):u(``,!0),s.showCancelButton?(r(),o(C,t({key:1,class:s.cx(`pcCancelButton`),onClick:S.clear,disabled:S.cancelDisabled,unstyled:s.unstyled},s.cancelButtonProps,{pt:s.ptm(`pcCancelButton`)}),{default:a(function(){return[l(s.$slots,`cancelicon`,{},function(){return[(r(),o(i(s.cancelIcon?`span`:`Times`),t({class:s.cancelIcon,"aria-hidden":`true`},s.ptm(`pcCancelButton`).icon,{"data-pc-section":`cancelbuttonicon`}),null,16,[`class`]))]}),d(` `+_(S.cancelButtonLabel),1)]}),_:3},16,[`class`,`onClick`,`disabled`,`unstyled`,`pt`])):u(``,!0)]})],16),m(`div`,t({ref:`content`,class:s.cx(`content`),onDragenter:f[1]||=function(){return S.onDragEnter&&S.onDragEnter.apply(S,arguments)},onDragover:f[2]||=function(){return S.onDragOver&&S.onDragOver.apply(S,arguments)},onDragleave:f[3]||=function(){return S.onDragLeave&&S.onDragLeave.apply(S,arguments)},onDrop:f[4]||=function(){return S.onDrop&&S.onDrop.apply(S,arguments)}},s.ptm(`content`),{"data-p-highlight":!1}),[l(s.$slots,`content`,{files:x.files,uploadedFiles:x.uploadedFiles,removeUploadedFileCallback:S.removeUploadedFile,removeFileCallback:S.remove,progress:x.progress,messages:x.messages},function(){return[S.hasFiles?(r(),o(w,{key:0,value:x.progress,showValue:!1,unstyled:s.unstyled,pt:s.ptm(`pcProgressbar`)},null,8,[`value`,`unstyled`,`pt`])):u(``,!0),(r(!0),h(p,null,e(x.messages,function(e){return r(),o(T,{key:e,severity:`error`,onClose:S.onMessageClose,unstyled:s.unstyled,pt:s.ptm(`pcMessage`)},{default:a(function(){return[d(_(e),1)]}),_:2},1032,[`onClose`,`unstyled`,`pt`])}),128)),S.hasFiles?(r(),h(`div`,{key:1,class:g(s.cx(`fileList`))},[c(E,{files:x.files,onRemove:S.remove,badgeValue:S.pendingLabel,previewWidth:s.previewWidth,templates:s.$slots,unstyled:s.unstyled,pt:s.pt},null,8,[`files`,`onRemove`,`badgeValue`,`previewWidth`,`templates`,`unstyled`,`pt`])],2)):u(``,!0),S.hasUploadedFiles?(r(),h(`div`,{key:2,class:g(s.cx(`fileList`))},[c(E,{files:x.uploadedFiles,onRemove:S.removeUploadedFile,badgeValue:S.completedLabel,badgeSeverity:`success`,previewWidth:s.previewWidth,templates:s.$slots,unstyled:s.unstyled,pt:s.pt},null,8,[`files`,`onRemove`,`badgeValue`,`previewWidth`,`templates`,`unstyled`,`pt`])],2)):u(``,!0)]}),s.$slots.empty&&!S.hasFiles&&!S.hasUploadedFiles?(r(),h(`div`,y(t({key:0},s.ptm(`empty`))),[l(s.$slots,`empty`)],16)):u(``,!0)],16)],16)):S.isBasic?(r(),h(`div`,t({key:1,class:s.cx(`root`)},s.ptmi(`root`)),[(r(!0),h(p,null,e(x.messages,function(e){return r(),o(T,{key:e,severity:`error`,onClose:S.onMessageClose,unstyled:s.unstyled,pt:s.ptm(`pcMessage`)},{default:a(function(){return[d(_(e),1)]}),_:2},1032,[`onClose`,`unstyled`,`pt`])}),128)),m(`div`,t({class:s.cx(`basicContent`)},s.ptm(`basicContent`)),[c(C,t({class:S.chooseButtonClass,style:s.style,disabled:s.disabled,unstyled:s.unstyled,onMouseup:S.onBasicUploaderClick,onKeydown:D(S.choose,[`enter`]),onFocus:S.onFocus,onBlur:S.onBlur},s.chooseButtonProps,{pt:s.ptm(`pcChooseButton`)}),{default:a(function(){return[l(s.$slots,`chooseicon`,{},function(){return[(r(),o(i(s.chooseIcon?`span`:`Plus`),t({class:s.chooseIcon,"aria-hidden":`true`},s.ptm(`pcChooseButton`).icon),null,16,[`class`]))]}),d(` `+_(S.chooseButtonLabel),1)]}),_:3},16,[`class`,`style`,`disabled`,`unstyled`,`onMouseup`,`onKeydown`,`onFocus`,`onBlur`,`pt`]),s.auto?u(``,!0):l(s.$slots,`filelabel`,{class:g(s.cx(`filelabel`)),files:x.files},function(){return[m(`span`,{class:g(s.cx(`filelabel`))},_(S.basicFileChosenLabel),3)]},void 0,0),m(`input`,t({ref:`fileInput`,type:`file`,accept:s.accept,disabled:s.disabled,multiple:s.multiple,onChange:f[5]||=function(){return S.onFileSelect&&S.onFileSelect.apply(S,arguments)},onFocus:f[6]||=function(){return S.onFocus&&S.onFocus.apply(S,arguments)},onBlur:f[7]||=function(){return S.onBlur&&S.onBlur.apply(S,arguments)}},s.ptm(`input`)),null,16,ne)],16)],16)):u(``,!0)}$.render=re;export{F as n,$ as t};