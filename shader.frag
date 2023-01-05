#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_size;
uniform vec2 u_blob0;
uniform vec2 u_blob1;
uniform vec2 u_blob2;
uniform vec2 u_blob3;
uniform vec2 u_blob4;
uniform vec2 u_blob5;
uniform vec2 u_blob6;
uniform vec2 u_blob7;

void main() {

    vec2 uv = 1. * (gl_FragCoord.xy / u_resolution.xy);

    vec2 blob0_uv = u_blob0.xy / u_resolution.xy;
    vec2 blob1_uv = u_blob1.xy / u_resolution.xy;
    vec2 blob2_uv = u_blob2.xy / u_resolution.xy;
    vec2 blob3_uv = u_blob3.xy / u_resolution.xy;
    vec2 blob4_uv = u_blob4.xy / u_resolution.xy;
    vec2 blob5_uv = u_blob5.xy / u_resolution.xy;
    vec2 blob6_uv = u_blob6.xy / u_resolution.xy;
    vec2 blob7_uv = u_blob7.xy / u_resolution.xy;

    float r = u_size;
    float sum = 0.;

    vec2 diff0 = uv.xy - blob0_uv;
    float d0 = length(diff0);
    sum += 1. * r / d0;

    vec2 diff1 = uv.xy - blob1_uv;
    float d1 = length(diff1);
    sum += 1. * r / d1;

    vec2 diff2 = uv.xy - blob2_uv;
    float d2 = length(diff2);
    sum += 1. * r / d2;

    vec2 diff3 = uv.xy - blob3_uv;
    float d3 = length(diff3);
    sum += 1. * r / d3;

    vec2 diff4 = uv.xy - blob4_uv;
    float d4 = length(diff4);
    sum += 1. * r / d4;

    vec2 diff5 = uv.xy - blob5_uv;
    float d5 = length(diff5);
    sum += 1. * r / d5;

    vec2 diff6 = uv.xy - blob6_uv;
    float d6 = length(diff6);
    sum += 1. * r / d6;

    vec2 diff7 = uv.xy - blob7_uv;
    float d7 = length(diff7);
    sum += 1. * r / d7;

    vec3 color = vec3(sum, .3, sum/r);
    // vec3 color = vec3(sum/r, .8, sum);
    gl_FragColor = vec4(color, .6);

}