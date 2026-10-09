import{Ct as e,M as t,k as n,l as r,m as i,s as a,u as o,w as s}from"./runtime-core.esm-bundler-Bp0EuTbW.js";import{r as c,s as l}from"./ripple-5D0YgQqF.js";var u=l.extend({name:`progressspinner`,style:`
.p-progressspinner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
}

.p-progressspinner-circle {
    width: 100%;
    height: 100%;
}

.p-progressspinner-circle-track {
    stroke: dt('content.border.color');
}

.p-progressspinner-circle-range {
    stroke: dt('progressspinner.color.one');
    stroke-linecap: round;
    transition: stroke-dashoffset 0.3s;
}

[data-state="determinate"] .p-progressspinner-circle-range {
    transform: rotate(-90deg);
    transform-origin: center;
}

[data-state="indeterminate"] .p-progressspinner-circle {
    animation: p-progressspinner-rotate 2s linear infinite;
    transform-origin: center;
}

[data-state="indeterminate"] .p-progressspinner-circle-range {
    stroke-dasharray: 1, 302;
    stroke-dashoffset: 0;
    animation:
        p-progressspinner-dash 1.5s ease-in-out infinite,
        p-progressspinner-color 6s ease-in-out infinite;
}

.p-progressspinner-value {
    fill: dt('text.muted.color');
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 302;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 136, 302;
        stroke-dashoffset: -54px;
    }
    100% {
        stroke-dasharray: 1, 302;
        stroke-dashoffset: -302px;
    }
}

@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: dt('progressspinner.color.one');
    }
    40% {
        stroke: dt('progressspinner.color.two');
    }
    66% {
        stroke: dt('progressspinner.color.three');
    }
    80%,
    90% {
        stroke: dt('progressspinner.color.four');
    }
}
`,classes:{root:`p-progressspinner`,circle:`p-progressspinner-circle`,circleTrack:`p-progressspinner-circle-track`,circleRange:`p-progressspinner-circle-range`,value:`p-progressspinner-value`}}),d={name:`ProgressSpinner`,extends:{name:`BaseProgressSpinner`,extends:c,props:{value:{type:Number,default:null},strokeWidth:{type:Number,default:4},animationDuration:{type:String,default:`2s`},min:{type:Number,default:0},max:{type:Number,default:100}},style:u,provide:function(){return{$pcProgressSpinner:this,$parentInstance:this}}},inheritAttrs:!1,computed:{isDeterminate:function(){return Number.isFinite(this.value)},determinateState:function(){return this.isDeterminate?`determinate`:`indeterminate`},validRange:function(){return Number.isFinite(this.min)&&Number.isFinite(this.max)&&this.max>this.min},clampedValue:function(){if(!this.isDeterminate)return 0;if(!this.validRange)return Number.isFinite(this.min)?this.min:0;var e=Number.isFinite(this.value)?this.value:this.min;return Math.min(Math.max(e,this.min),this.max)},percent:function(){return!this.isDeterminate||!this.validRange?0:(this.clampedValue-this.min)/(this.max-this.min)*100},roundedPercent:function(){return Math.round(this.percent)},radius:function(){return(100-this.strokeWidth)/2},circumference:function(){return 2*Math.PI*this.radius},dashOffset:function(){return this.circumference-this.percent/100*this.circumference},svgStyle:function(){return{"animation-duration":this.animationDuration}}}},f=[`aria-valuemin`,`aria-valuemax`,`aria-valuenow`,`data-state`,`data-value`],p=[`r`,`stroke-width`],m=[`r`,`stroke-width`,`stroke-dasharray`,`stroke-dashoffset`];function h(c,l,u,d,h,g){return n(),o(`div`,s({class:c.cx(`root`),role:`progressbar`,"aria-valuemin":c.min,"aria-valuemax":c.max,"aria-valuenow":g.isDeterminate?g.clampedValue:void 0,"data-state":g.determinateState,"data-value":g.isDeterminate?g.clampedValue:void 0},c.ptmi(`root`)),[(n(),o(`svg`,s({class:c.cx(`circle`),viewBox:`0 0 100 100`,style:g.svgStyle},c.ptm(`circle`)),[a(`circle`,s({class:c.cx(`circleTrack`),cx:`50`,cy:`50`,r:g.radius,fill:`none`,"stroke-width":c.strokeWidth},c.ptm(`circleTrack`)),null,16,p),a(`circle`,s({class:c.cx(`circleRange`),cx:`50`,cy:`50`,r:g.radius,fill:`none`,"stroke-width":c.strokeWidth,"stroke-dasharray":g.isDeterminate?g.circumference:void 0,"stroke-dashoffset":g.isDeterminate?g.dashOffset:void 0},c.ptm(`circleRange`)),null,16,m),g.isDeterminate?(n(),o(`text`,s({key:0,class:c.cx(`value`),x:`50`,y:`50`,"text-anchor":`middle`,"dominant-baseline":`central`},c.ptm(`value`)),[t(c.$slots,`default`,{value:g.clampedValue,percent:g.roundedPercent},function(){return[i(e(g.roundedPercent)+`%`,1)]})],16)):r(``,!0)],16))],16,f)}d.render=h;export{d as t};