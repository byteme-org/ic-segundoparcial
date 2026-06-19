// Funciones de codificación de señales
function nrz_l(data, start_level) {
    let encoded = [start_level, start_level, start_level];
    for (let bit of data) {
        encoded.push(bit === '0' ? 1 : -1);
        encoded.push(bit === '0' ? 1 : -1);
    }
    return encoded;
}

function nrz_i(data, start_level) {
    let level = start_level;
    let encoded = [level, level, level];
    for (let bit of data) {
        if (bit === '1') {
            level = -level;
        }
        encoded.push(level);
        encoded.push(level);
    }
    return encoded;
}

function manchester(data, start_level) {
    let encoded = [];
    for (let bit of data) {
        if (bit === '1') {
            encoded.push(1, -1);
        } else {
            encoded.push(-1, 1);
        }
    }
    return encoded.map(val => val * start_level);
}

function diff_manchester(data, start_level) {
    let level = start_level;
    let encoded = [];
    for (let bit of data) {
        if (bit === '1') {
            level = -level;
        }
        encoded.push(level, -level);
    }
    return encoded;
}

// NUEVA FUNCIÓN: Codificación Bipolar (AMI)
function bipolar(data, start_level) {
    let encoded = [0, 0, 0]; // Empezamos en voltaje 0 (reposo)
    let next_one_level = start_level;

    for (let bit of data) {
        if (bit === '0') {
            encoded.push(0);
            encoded.push(0);
        } else if (bit === '1') {
            encoded.push(next_one_level);
            encoded.push(next_one_level);
            next_one_level = -next_one_level; // Invertimos polaridad para el siguiente 1
        }
    }
    return encoded;
}

// Función para trazar las señales estándar (nrz-l, nrz-i, bipolar)
function plot_signal(signal, data, title) {
    let x = Array.from({length: signal.length}, (_, i) => Math.floor(i / 2) + 1);

    let trace1 = {
        x: x,
        y: signal.map(val => val),
        mode: 'lines',
        type: 'scatter',
        name: 'Signal',
        hoverinfo: 'none',
        line: { width: 4, color: '#3b82f6' } // Color azul brillante (Tailwind blue-500)
    };

    let trace2 = {
        x: x.filter((_, i) => i % 2 === 0).map(val => val + 1.5),
        y: Array(data.length).fill(-1.5),
        mode: 'text',
        type: 'scatter',
        text: data.split(''),
        hoverinfo: 'none',
        showlegend: false,
        textfont: { color: '#e5e7eb' }
    };

    let layout = {
        title: { text: title, font: { color: '#e5e7eb' } },
        paper_bgcolor: '#1f2937', // Color oscuro de Tailwind bg-gray-800
        plot_bgcolor: '#1f2937',
        xaxis: {
            title: { text: 'Tiempo', font: { color: '#9ca3af' } },
            showgrid: true,
            gridcolor: '#374151',
            zeroline: false,
            gridwidth: 1,
            scaleanchor: "y",
            range: [0, signal.length / 2 + 2],
            tickvals: Array.from({length: Math.ceil(signal.length / 2)}, (_, i) => i + 1),
            tickfont: { color: '#9ca3af' },
            fixedrange: true
        },
        yaxis: {
            title: { text: 'Amplitud', font: { color: '#9ca3af' } },
            showline: true,
            linecolor: '#374151',
            gridcolor: '#374151',
            zerolinecolor: '#4b5563',
            zeroline: true,
            gridwidth: 1,
            range: [-3, 3],
            tickfont: { color: '#9ca3af' },
            fixedrange: true
        },
        shapes: [{
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: -3,
            x1: 1,
            y1: -3,
            line: {
                color: '#4b5563', // Línea gris en lugar de negra para que se vea en el fondo oscuro
                width: 2
            }
        }],
        autosize: true,
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 10 },
        staticPlot: true,
        showlegend: false
    };

    Plotly.newPlot('myDiv', [trace1, trace2], layout, {displayModeBar: false});
}

// Función para trazar las señales manchester
function plot_signal_manchester(signal, data, title) {
    let x = [];
    for (let i = 0; i < signal.length; i++) {
        x.push(i / 2 + 1, i / 2 + 1.5);
    }

    let y = [];
    for (let i = 0; i < signal.length; i++) {
        y.push(signal[i], signal[i]);
    }

    let trace1 = {
        x: x,
        y: y,
        mode: 'lines',
        type: 'scatter',
        name: 'Signal',
        hoverinfo: 'none',
        line: { width: 4, color: '#3b82f6' }
    };

    let trace2 = {
        x: Array.from({length: data.length}, (_, i) => i + 1 + 0.5),
        y: Array(data.length).fill(-1.5),
        mode: 'text',
        type: 'scatter',
        text: data.split(''),
        hoverinfo: 'none',
        showlegend: false,
        textfont: { color: '#e5e7eb' }
    };

    let layout = {
        title: { text: title, font: { color: '#e5e7eb' } },
        paper_bgcolor: '#1f2937',
        plot_bgcolor: '#1f2937',
        xaxis: {
            title: { text: 'Tiempo', font: { color: '#9ca3af' } },
            showgrid: true,
            gridcolor: '#374151',
            zeroline: false,
            gridwidth: 1,
            scaleanchor: "y",
            range: [0, (Math.ceil(signal.length)/2) +1],
            tickvals: Array.from({length: Math.ceil(signal.length / 2) + 1}, (_, i) => i + 1),
            tickfont: { color: '#9ca3af' },
            fixedrange: true
        },
        yaxis: {
            title: { text: 'Amplitud', font: { color: '#9ca3af' } },
            showline: true,
            linecolor: '#374151',
            gridcolor: '#374151',
            zerolinecolor: '#4b5563',
            zeroline: true,
            gridwidth: 1,
            range: [-3, 3],
            tickfont: { color: '#9ca3af' },
            fixedrange: true
        },
        shapes: [{
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: -3,
            x1: 1,
            y1: -3,
            line: {
                color: '#4b5563',
                width: 2
            }
        }],
        autosize: true,
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 10 },
        staticPlot: true,
        showlegend: false
    };

    Plotly.newPlot('myDiv', [trace1, trace2], layout, {displayModeBar: false});
}

let isGraphDrawn = false;

// Función que se llama cuando se hace clic en el botón "Dibujar"
function drawSignal() {
    let data = document.getElementById('data').value;
    let startLevel = parseInt(document.getElementById('startLevel').value);
    let waveType = document.getElementById('waveType').value;

    if (!data) {
        showAlert('Por favor, ingrese los datos.');
        return;
    }

    if (!/^[01]+$/.test(data)) {
        showAlert('Los datos solo pueden contener 0 y 1.');
        return;
    }

    // Ocultar alertas previas
    document.getElementById('nrzi-alert').style.display = 'none';
    document.getElementById('alert').style.display = 'none';

    let signal;
    switch (waveType) {
        case 'NRZ-L':
            signal = nrz_l(data, startLevel);
            break;
        case 'NRZ-I':
            signal = nrz_i(data, startLevel);
            document.getElementById('nrzi-alert').style.display = 'block';
            break;
        case 'Manchester':
            signal = manchester(data, startLevel);
            break;
        case 'Manchester Diferencial':
            signal = diff_manchester(data, startLevel);
            break;
        case 'Bipolar':
            signal = bipolar(data, startLevel);
            break;
    }

    Plotly.purge('myDiv');
    if (waveType === 'Manchester' || waveType === 'Manchester Diferencial') {
        plot_signal_manchester(signal, data, waveType);
    } else {
        plot_signal(signal, data, waveType);
    }
    isGraphDrawn = true;
}

// Función que se llama cuando se hace clic en el botón "Exportar"
function exportGraph(size) {
    if (!isGraphDrawn) {
        showAlert('Por favor, dibuje el gráfico antes de exportarlo.');
        return;
    }
    let width = size.split('x')[0];
    let height = size.split('x')[1];
    let data = document.getElementById('data').value;
    let waveType = document.getElementById('waveType').value;

    let imageName = waveType.replace(/\s/g, '') + '-' + data + '.png';

    Plotly.toImage('myDiv', {format: 'png', width: width, height: height}).then(function(dataUrl) {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = dataUrl;
        link.click();
    });
}

function showAlert(message) {
    let alertElement = document.getElementById('alert');
    let alertMessageElement = document.getElementById('alert-message');

    alertMessageElement.textContent = message;
    alertElement.style.display = 'block';
}

// Eventos tras cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Escuchar botón dibujar
    document.getElementById('drawButton').addEventListener('click', drawSignal);

    // Escuchar botón exportar (arreglado para Tailwind)
    document.getElementById('exportButton').addEventListener('click', function() {
        let size = document.getElementById('exportSize').value;
        exportGraph(size);
    });
});

function calcNyquist() {
    let cInput = document.getElementById('nyqC');
    let bInput = document.getElementById('nyqB');
    let mInput = document.getElementById('nyqM');
    let msg = document.getElementById('nyqMsg');

    let c = parseFloat(cInput.value);
    let b = parseFloat(bInput.value);
    let m = parseFloat(mInput.value);

    // Contamos cuántos campos están vacíos (NaN)
    let emptyCount = (isNaN(c) ? 1 : 0) + (isNaN(b) ? 1 : 0) + (isNaN(m) ? 1 : 0);

    if (emptyCount !== 1) {
        msg.innerText = "Error: Dejá exactamente UN campo en blanco.";
        msg.className = "text-sm text-center mt-2 text-red-400 font-semibold";
        return;
    }

    msg.innerText = "¡Cálculo exitoso!";
    msg.className = "text-sm text-center mt-2 text-green-400 font-semibold";

    // C = 2B * log2(M)
    if (isNaN(c)) {
        cInput.value = (2 * b * Math.log2(m)).toFixed(2);
    }
    // B = C / (2 * log2(M))
    else if (isNaN(b)) {
        bInput.value = (c / (2 * Math.log2(m))).toFixed(2);
    }
    // M = 2^(C / 2B)
    else if (isNaN(m)) {
        mInput.value = Math.pow(2, c / (2 * b)).toFixed(2);
    }
}

function limpiarNyquist() {
    document.getElementById('nyqC').value = '';
    document.getElementById('nyqB').value = '';
    document.getElementById('nyqM').value = '';
    document.getElementById('nyqMsg').innerText = '';
}

function calcShannon() {
    let cInput = document.getElementById('shanC');
    let bInput = document.getElementById('shanB');
    let snInput = document.getElementById('shanSN');
    let msg = document.getElementById('shanMsg');

    let c = parseFloat(cInput.value);
    let b = parseFloat(bInput.value);
    let sn = parseFloat(snInput.value);

    let emptyCount = (isNaN(c) ? 1 : 0) + (isNaN(b) ? 1 : 0) + (isNaN(sn) ? 1 : 0);

    if (emptyCount !== 1) {
        msg.innerText = "Error: Dejá exactamente UN campo en blanco.";
        msg.className = "text-sm text-center mt-2 text-red-400 font-semibold";
        return;
    }

    msg.innerText = "¡Cálculo exitoso!";
    msg.className = "text-sm text-center mt-2 text-green-400 font-semibold";

    // C = B * log2(1 + S/N)
    if (isNaN(c)) {
        cInput.value = (b * Math.log2(1 + sn)).toFixed(2);
    }
    // B = C / log2(1 + S/N)
    else if (isNaN(b)) {
        bInput.value = (c / Math.log2(1 + sn)).toFixed(2);
    }
    // S/N = 2^(C/B) - 1
    else if (isNaN(sn)) {
        snInput.value = (Math.pow(2, c / b) - 1).toFixed(2);
    }
}

function limpiarShannon() {
    document.getElementById('shanC').value = '';
    document.getElementById('shanB').value = '';
    document.getElementById('shanSN').value = '';
    document.getElementById('shanMsg').innerText = '';
}