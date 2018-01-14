class CircularAudioWave {
    constructor(elem, opts={}) {
        // check if the default naming is enabled, if not use the chrome one.
        if (!window.AudioContext) {
            if (!window.webkitAudioContext) {
                alert('Your browser does not support AudioContext');
            }
            window.AudioContext = window.webkitAudioContext;
        }
        else {
            this.context = new AudioContext();
            this.sourceNode = this.context.createBufferSource();
        }
        this.elem = elem;
        this.opts = opts;
        this.lastMaxR = 0;
        this.maxChartValue = 200;
        this.minChartValue = 60;
        this.chart = echarts.init(this.elem);
        this.playing = false;
        this.defaultChartOption = {
            color: ['#22C3AA'],
            angleAxis: {
                type: 'value',
                clockwise: false,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            radiusAxis: {
                min: 0,
                max: this.maxChartValue + 50,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            polar: {
                radius: '100%',
            },
            series: [
                {
                    coordinateSystem: 'polar',
                    name: 'line',
                    type: 'line',
                    showSymbol: false,
                    data: Array.apply(null, { length: 361 }).map(Function.call, i => {
                        return [this.minChartValue, i];
                    })
                },
                {
                    coordinateSystem: 'polar',
                    name: 'ripple',
                    type: 'line',
                    showSymbol: false,
                    data: []
                },
                {
                    coordinateSystem: 'polar',
                    name: 'maxbar',
                    type: 'line',
                    showSymbol: false,
                    data: Array.apply(null, { length: 361 }).map(Function.call, i => {
                        return [this.minChartValue, i];
                    })
                }
                // {
                //     type: 'pie',
                //     data: labelData,
                //     radius: [100, 180],
                //     zlevel: -2,
                //     itemStyle: {
                //         normal: {
                //             color: '#22C3AA',
                //             borderColor: 'white'
                //         }
                //     },
                //     label: {
                //         normal: {
                //             position: 'inside'
                //         }
                //     }
                // },
            ]
        };
        this.chartOption = JSON.parse(JSON.stringify(this.defaultChartOption));
    }
    loadAudio(filePath) {
        return new Promise((resolve, reject) => {
            this.filePath = filePath;
            this._setupAudioNodes();
            console.log(filePath);
            var request = new XMLHttpRequest();
            request.open('GET', filePath, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                this.context.decodeAudioData(
                    request.response, 
                    buffer => {
                        this.sourceNode.buffer = buffer;
                        this.generateWave();
                        resolve();
                    },
                    e => console.log(e)
                );
            };
            request.send();
        });
    }
    generateWave() {
        this.chart.setOption(this.chartOption);
    }
    play() {
        if (this.sourceNode && this.sourceNode.buffer) {
            this.playing = true;
            this.sourceNode.start(0);
        }
        else {
            alert('Audio is not ready');
        }
    }
    // TODO
    pause() {
       
    }
    destroy() {
        this.chart.dispose();
    }
    reset() {
        this.chartOption = JSON.parse(JSON.stringify(this.defaultChartOption));
        this.generateWave();
    }
    // TODO: Allow callback
    onended() {
        this.playing = false;
        this.context.close();
        this.sourceNode.buffer = null;
        this.reset();

        this.context = new AudioContext();
        this.sourceNode = this.context.createBufferSource();
        this.loadAudio(this.filePath)
        .then(() => {
            this.opts.loop && this.play();
        });
    }
    _setupAudioNodes() {
        let javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
        javascriptNode.connect(this.context.destination);

        let analyser = this.context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 2048;

        this.sourceNode.connect(analyser);

        analyser.connect(javascriptNode);

        this.sourceNode.connect(this.context.destination);
        this.sourceNode.onended = this.onended.bind(this);
        
        javascriptNode.onaudioprocess = () => {
            var freqData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqData);
            this._draw(freqData);
        }
    }
    _draw(freqData) {
        if (this.playing) {
            let waveData = this._generateWaveData(freqData);
            this.chartOption.series[0].data = waveData.data;

            if (waveData.maxR > this.lastMaxR) {
                this.lastMaxR = waveData.maxR;
            }
            else {
                this.lastMaxR -= 4;
            }

            this.chartOption.series[2].data = Array.apply(null, { length: 361 }).map(Function.call, (i) => {
                return [this.lastMaxR, i];
            });
            this.chart.setOption(this.chartOption);
        }
    }
    _generateWaveData(data) {
        let waveData = [];
        let maxR = 0;
        for (let i = 0; i <= 360; i++) {
            // (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
            let freq = data[i];
            var r = (((freq - 0) * (this.maxChartValue - this.minChartValue)) / (255 - 0)) + this.minChartValue;
            if (r > maxR) {
                maxR = r;
            }
            waveData.push([r, i]);
        }
        waveData.push([waveData[0][0], 360]);
        return { maxR: maxR, data: waveData };
    };
}