import{C as e,M as t,O as n,c as r,g as i,j as a,l as o,nt as s,s as c,u as l,vt as u,y as d,yt as f}from"./runtime-core.esm-bundler-B90NJl9l.js";import{at as p,i as m,l as h,ot as g}from"./basecomponent-DkSX2u9k.js";import{r as _}from"./ripple-PQoHU2qI.js";import{t as v}from"./baseinput-BIPFu1ge.js";import{t as y}from"./check-BiSwPznz.js";var b={name:`minus`,meta:{tags:[`minus`,`remove`,`subtract`,`decrease`,`less`]},svg:{xmlns:`http://www.w3.org/2000/svg`,width:20,height:20,viewBox:`0 0 20 20`,fill:`none`},nodes:[[`path`,{d:`M17 9.25C17.4142 9.25 17.75 9.58579 17.75 10C17.75 10.4142 17.4142 10.75 17 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H17Z`,fill:`currentColor`,key:`iu8x2q`}]]},x=i({name:`Minus`,inheritAttrs:!1,__name:`minus`,setup(e){let{Icon:t}=_(b);return(e,i)=>(n(),r(s(t),f(d(e.$attrs)),null,16))}}),S=m.extend({name:`checkbox`,style:`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        color: dt('checkbox.icon.color');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .p-checkbox-icon,
    .p-checkbox-indicator svg,
    .p-checkbox-indicator i {
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
        font-size: dt('checkbox.icon.size');
        transition-duration: dt('checkbox.transition.duration');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon,
    .p-checkbox-sm .p-checkbox-indicator svg,
    .p-checkbox-sm .p-checkbox-indicator i {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon,
    .p-checkbox-lg .p-checkbox-indicator svg,
    .p-checkbox-lg .p-checkbox-indicator i {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-checkbox p-component`,{"p-checkbox-checked":t.checked,"p-disabled":n.disabled,"p-invalid":t.$pcCheckboxGroup?t.$pcCheckboxGroup.$invalid:t.$invalid,"p-variant-filled":t.$variant===`filled`,"p-checkbox-sm p-inputfield-sm":n.size===`small`,"p-checkbox-lg p-inputfield-lg":n.size===`large`}]},box:`p-checkbox-box`,indicator:`p-checkbox-indicator`,input:`p-checkbox-input`,icon:`p-checkbox-icon`}}),C={name:`BaseCheckbox`,extends:v,props:{value:null,binary:Boolean,indeterminate:{type:Boolean,default:!1},trueValue:{type:null,default:!0},falseValue:{type:null,default:!1},readonly:{type:Boolean,default:!1},required:{type:Boolean,default:!1},tabindex:{type:Number,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:S,provide:function(){return{$pcCheckbox:this,$parentInstance:this}}};function w(e){"@babel/helpers - typeof";return w=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},w(e)}function T(e,t,n){return(t=E(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function E(e){var t=D(e,`string`);return w(t)==`symbol`?t:t+``}function D(e,t){if(w(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(w(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function O(e){return M(e)||j(e)||A(e)||k()}function k(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function A(e,t){if(e){if(typeof e==`string`)return N(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?N(e,t):void 0}}function j(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function M(e){if(Array.isArray(e))return N(e)}function N(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var P={name:`Checkbox`,extends:C,inheritAttrs:!1,emits:[`change`,`focus`,`blur`,`update:indeterminate`],inject:{$pcCheckboxGroup:{default:void 0}},data:function(){return{d_indeterminate:this.indeterminate}},watch:{indeterminate:function(e){this.d_indeterminate=e,this.updateIndeterminate()}},mounted:function(){this.updateIndeterminate()},updated:function(){this.updateIndeterminate()},methods:{getPTOptions:function(e){return(e===`root`?this.ptmi:this.ptm)(e,{context:{checked:this.checked,indeterminate:this.d_indeterminate,disabled:this.disabled}})},onChange:function(e){var t=this;if(!this.disabled&&!this.readonly){var n=this.$pcCheckboxGroup?this.$pcCheckboxGroup.d_value:this.d_value,r=this.binary?this.d_indeterminate?this.trueValue:this.checked?this.falseValue:this.trueValue:this.checked||this.d_indeterminate?n.filter(function(e){return!g(e,t.value)}):n?[].concat(O(n),[this.value]):[this.value];this.d_indeterminate&&(this.d_indeterminate=!1,this.$emit(`update:indeterminate`,this.d_indeterminate)),this.$pcCheckboxGroup?this.$pcCheckboxGroup.writeValue(r,e):this.writeValue(r,e),this.$emit(`change`,e)}},onFocus:function(e){this.$emit(`focus`,e)},onBlur:function(e){var t,n;this.$emit(`blur`,e),(t=(n=this.formField).onBlur)==null||t.call(n,e)},updateIndeterminate:function(){this.$refs.input&&(this.$refs.input.indeterminate=this.d_indeterminate)}},computed:{groupName:function(){return this.$pcCheckboxGroup?this.$pcCheckboxGroup.groupName:this.$formName},checked:function(){var e=this.$pcCheckboxGroup?this.$pcCheckboxGroup.d_value:this.d_value;return this.d_indeterminate?!1:this.binary?e===this.trueValue:p(this.value,e)},dataP:function(){return h(T({invalid:this.$invalid,checked:this.checked,disabled:this.disabled,filled:this.$variant===`filled`},this.size,this.size))}},components:{Check:y,Minus:x}},F=[`data-p-checked`,`data-p-indeterminate`,`data-p-disabled`,`data-p`],I=[`id`,`value`,`name`,`checked`,`tabindex`,`disabled`,`readonly`,`required`,`aria-labelledby`,`aria-label`,`aria-invalid`],L=[`data-p`],R=[`data-p`];function z(i,s,d,f,p,m){var h=t(`Check`),g=t(`Minus`);return n(),l(`div`,e({class:i.cx(`root`)},m.getPTOptions(`root`),{"data-p-checked":m.checked,"data-p-indeterminate":p.d_indeterminate||void 0,"data-p-disabled":i.disabled,"data-p":m.dataP}),[c(`input`,e({ref:`input`,id:i.inputId,type:`checkbox`,class:[i.cx(`input`),i.inputClass],style:i.inputStyle,value:i.value,name:m.groupName,checked:m.checked,tabindex:i.tabindex,disabled:i.disabled,readonly:i.readonly,required:i.required,"aria-labelledby":i.ariaLabelledby,"aria-label":i.ariaLabel,"aria-invalid":i.invalid||void 0,onFocus:s[0]||=function(){return m.onFocus&&m.onFocus.apply(m,arguments)},onBlur:s[1]||=function(){return m.onBlur&&m.onBlur.apply(m,arguments)},onChange:s[2]||=function(){return m.onChange&&m.onChange.apply(m,arguments)}},m.getPTOptions(`input`)),null,16,I),c(`div`,e({class:i.cx(`box`)},m.getPTOptions(`box`),{"data-p":m.dataP}),[c(`span`,e({class:i.cx(`indicator`)},m.getPTOptions(`indicator`),{"data-p":m.dataP}),[a(i.$slots,`icon`,{checked:m.checked,indeterminate:p.d_indeterminate,class:u(i.cx(`icon`)),dataP:m.dataP},function(){return[m.checked?(n(),r(h,e({key:0,class:i.cx(`icon`)},m.getPTOptions(`icon`),{"data-p":m.dataP}),null,16,[`class`,`data-p`])):p.d_indeterminate?(n(),r(g,e({key:1,class:i.cx(`icon`)},m.getPTOptions(`icon`),{"data-p":m.dataP}),null,16,[`class`,`data-p`])):o(``,!0)]})],16,R)],16,L)],16,F)}P.render=z;export{P as t};