var audioContext = new window.AudioContext() || new window.webkitAudioContext();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function startProcess(width, height, context, buffer) {
  var data = buffer.getChannelData(0);
  console.log(data);

  const samples = width / 2;
  const blockSize = Math.floor(data.length / samples);
  let filteredData = [];
  for (let i = 0; i < samples; i++) {
    filteredData.push(data[i * blockSize]);
  }

  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);

    return filteredData.map((n) => n * multiplier);
    // return filteredData.map((n) => getRandomNumberBetween(1, 1.5));
  };

  let normalizedData = normalizeData(filteredData);
  console.log(Math.min(...filteredData));
  //   draw(filteredData);
  draw(normalizedData);

  //   var step = Math.ceil(data.length / width);
  //   var amp = height / 2;
  //   for (var i = 0; i < width; i++) {
  //     var min = 1.0;
  //     var max = -1.0;
  //     for (var j = 0; j < step; j++) {
  //       var datum = data[i * step + j];
  //       if (datum < min) min = datum;
  //       if (datum > max) max = datum;
  //     }
  //     context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
  //   }
}

function draw(normalizedData) {
  let canvas = document.getElementById("view1");
  const dpr = window.devicePixelRatio || 1;
  const padding = 1;
  //   canvas.width = canvas.offsetWidth * dpr;
  //   canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  const ctx = canvas.getContext("2d");
  //   ctx.scale(dpr, 1);
  ctx.translate(0, canvas.offsetHeight / 2);

  // draw the line segments
  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i + 2;
    let height = normalizedData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
      height = 10;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2;
    }
    // if (i % 2 === 0) {
    drawLineSegment(ctx, x, height, width, (i + 1) % 2, canvas);
    // }
  }
}

const drawLineSegment = (ctx, x, y, width, isEven, canvas) => {
  ctx.rect(x, canvas.height / 18 - y / 2, 0.5, y);
  ctx.fill();

  return;
  ctx.lineWidth = 1; // how thick the line is
  ctx.strokeStyle = "#000"; // what color our line is
  ctx.beginPath();
  y = isEven ? y : -y;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, y);
  //   ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, isEven);
  //   ctx.lineTo(x + width, 0);
  //   ctx.stroke();
};

function initAudio() {
  var audioRequest = new XMLHttpRequest();
  audioRequest.open("GET", "sounds/fightclub.ogg", true);
  audioRequest.responseType = "arraybuffer";
  audioRequest.onload = function () {
    audioContext.decodeAudioData(audioRequest.response, function (buffer) {
      console.log(buffer);
      var canvas = document.getElementById("view1");
      canvas.width = window.innerWidth / 2;
      startProcess(
        canvas.width,
        canvas.height,
        canvas.getContext("2d"),
        buffer
      );
    });
  };
  audioRequest.send();
}

window.addEventListener("load", initAudio);
