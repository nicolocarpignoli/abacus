window.onload = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera error');
        return;
    }

    const hint = {
        audio: false,
        video: {
            width: { ideal: 4096 },
            height: { ideal: 2160 },
            facingMode: 'environment',
        },
    };

    let interval;

    navigator.mediaDevices.getUserMedia(hint)
        .then((stream) => {
            const video = document.getElementById('video-stream');
            video.style.display = 'block';
            video.srcObject = stream;

            video.addEventListener('loadeddata', () => {
                interval = setInterval(() => {
                    translate(video);
                }, 100);
                video.play();
            })
        })

    const span = document.querySelector('.translated');
    const spanArabic = document.querySelector('.translated-arabic');

    const translate = (video) => {
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var string = OCRAD(imageData);
        string = string.replace(/[^A-Za-z]/g, "")

        if (string == '') {
            return;
        }

        clearInterval(interval);

        const translated = roman2arabic(string);

        if (Number.isInteger(translated)) {
            span.innerText = 'Roman: ' + string;
            spanArabic.innerText = 'Arabic: ' + translated;

            setTimeout(() => {
                interval = setInterval(() => {
                    translate(video);
                }, 100);
            }, 2000);
        } else {
            interval = setInterval(() => {
                translate(video);
            }, 100);
        }
    }
};

const roman2arabic = s => {
    const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    return [...s].reduce((r, c, i, s) => map[s[i + 1]] > map[c] ? r - map[c] : r + map[c], 0);
};
