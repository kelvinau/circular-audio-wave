# Circular Audio Wave
<img alt="Circular Wave" src="https://kelvinau.github.io/circular-audio-wave/demo/circular-wave.gif" width="50%"/><img alt="Sunburst" src="https://kelvinau.github.io/circular-audio-wave/demo/sunburst.gif?1" width="50%"/>

**Live Demo**  
Circular Wave: https://kelvinau.github.io/circular-audio-wave/demo/circular-wave.html  
Sunburst: https://kelvinau.github.io/circular-audio-wave/demo/sunburst.html

## Introduction
`CircularAudioWave` is a JS library for audio visualization in circular audio wave, based on frequencies and BPM (Beats Per Minute). It uses [ECharts](https://github.com/apache/incubator-echarts) for the rendering, which is combined into `dist/circular-audio-wave.min.js`.

*This library works only on browsers that supports Web Audio API.

## Installation
1\. NPM
```
npm install circular-audio-wave
```

and import `circular-audio-wave.min.js` from `dist`

2\. Download `circular-audio-wave.min.js` directly from [github](https://raw.githubusercontent.com/kelvinau/circular-audio-wave/master/dist/circular-audio-wave.min.js)

## Usage
Class `CircularAudioWave(elem, opts={})` where `elem` is an DOM element object and `opts` provides configuration.  
Configuration consists of:  
- `mode`: 'sunburst' for sunburst chart (default: false)
- `loop`: loop rendering the chart (default: false)

## Methods
- `loadAudio`: provides the path of the audio file
- `play`: plays audio and render chart

## Examples
See `circular-wave.html` and `sunburst.html` in `demo`.

## Acknowledgement
Sample demo tracks are obtained from:
- Nokia Scratch - https://www.zedge.net/ringtone/819255/
- IPL Stadium - https://www.zedge.net/ringtone/1039527/
- Break Drum - https://www.looperman.com/loops/detail/96932/break-drum-by-blueeskies-free-175bpm-drum-and-bass-drum-loop

Tempo detection is based on [José M. Pérez](https://jmperezperez.com/)'s research. See [here](https://jmperezperez.com/bpm-detection-javascript/) for more details.
