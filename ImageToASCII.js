class ImageToASCII {
    constructor(t = 100, e = "normal", i = 100, s = 100, h = 0, a = 9, r = !1, n = 100, l = 0, d = 0, o = 0, p = "none", g = "none", c = 128, _ = 1, $ = !1, u = 1, y = 0) {
        this.width = t,
            this.brightness = i,
            this.contrast = s,
            this.invert = h,
            this.sharpness = a,
            this.useSharpen = r,
            this.saturation = n,
            this.sepia = l,
            this.hue = d,
            this.grayscale = o,
            this.dithering = p,
            this.thresholdType = g,
            this.thresholdOffset = c,
            this.invertEdgeColors = !0,
            this.edgeIntensity = _,
            this.useEdgeDetection = $,
            this.spaceDensity = u,
            this.transparentFrame = y,
            this.outputDiv = document.getElementById("output"),
            this.asciiChars = {
                minimalist: "#+-.",
                normal: "@%#*+=-:.",
                normal2: "&$Xx+;:.",
                alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
                numerical: "0896452317",
                extended: "@%#{}[]()<>^*+=~-:.",
                math: "+-\xd7\xf7=≠≈∞√π",
                arrow: "↑↗→↘↓↙←↖",
                grayscale: "@$BWM#*oahkbdpwmZO0QCJYXzcvnxrjft/|()1{}[]-_+~<>i!lI;:,\"^`'.",
                max: "\xc6\xd1\xcaŒ\xd8M\xc9\xcb\xc8\xc3\xc2WQB\xc5\xe6#N\xc1\xfeE\xc4\xc0HKRŽœXg\xd0\xeaq\xdbŠ\xd5\xd4A€\xdfpm\xe3\xe2G\xb6\xf8\xf0\xe98\xda\xdc$\xebd\xd9\xfd\xe8\xd3\xde\xd6\xe5\xff\xd2b\xa5FD\xf1\xe1ZP\xe4š\xc7\xe0h\xfb\xa7\xddkŸ\xaeS9žUTe6\xb5Oyx\xce\xbef4\xf55\xf4\xfa&a\xfc™2\xf9\xe7w\xa9Y\xa30V\xcdL\xb13\xcf\xcc\xf3C@n\xf6\xf2s\xa2u‰\xbd\xbc‡zJƒ%\xa4Itoc\xeerjv1l\xed=\xef\xec<>i7†[\xbf?\xd7}*{+()/\xbb\xab•\xac|!\xa1\xf7\xa6\xaf—^\xaa„”“~\xb3\xba\xb2–\xb0\xad\xb9‹›;:’‘‚’˜ˆ\xb8…\xb7\xa8\xb4`",
                codepage437: "█▓▒░",
                blockelement: "█"
            },
            this.currentScale = e
    }
    // Main conversion method
    convert(t) {
        let e = document.createElement("canvas")
            , i = e.getContext("2d", {
                willReadFrequently: !0
            })
            , s = t.width / t.height
            , h = this.width
            , a = Math.floor(.55 * Math.floor(h / s));
        e.width = h + 2 * this.transparentFrame,
            e.height = a + 2 * this.transparentFrame,
            this.transparentFrame > 0 && (i.fillStyle = "rgba(0, 0, 0, 0)",
                i.fillRect(0, 0, h + 2 * this.transparentFrame, a + 2 * this.transparentFrame)),
            i.filter = `brightness(${this.brightness}%)`,
            i.filter += ` contrast(${this.contrast}%)`,
            i.filter += ` saturate(${this.saturation}%)`,
            i.filter += ` sepia(${this.sepia}%)`,
            i.filter += ` hue-rotate(${this.hue}deg)`,
            i.filter += ` grayscale(${this.grayscale}%)`,
            i.filter += ` invert(${this.invert}%)`,
            i.drawImage(t, this.transparentFrame, this.transparentFrame, h - 2 * this.transparentFrame, a - 2 * this.transparentFrame),
            this.useEdgeDetection && this.applyEdgeDetection(i, e),
            this.useSharpen && this.applySharpen(i, e, this.sharpness);
        let r = i.getImageData(0, 0, this.width, a)
            , n = r.data;
        "simply" === this.thresholdType && this.applySimpleThresholding(n, h, a, this.thresholdOffset);
        let l = "";
        for (let d = 0; d < a; d++) {
            for (let o = 0; o < h; o++) {
                let p = (d * h + o) * 4
                    , g = n[p]
                    , c = n[p + 1]
                    , _ = n[p + 2]
                    , $ = n[p + 3];
                if ($ < 16) {
                    l += " ";
                    continue
                }
                let u = .3 * g + .59 * c + .11 * _;
                "FloydSteinberg" === this.dithering ? u = this.applyFloydSteinbergDithering(o, d, u, h, n) : "JJN" === this.dithering ? u = this.applyJJNDithering(o, d, u, h, n) : "Stucki" === this.dithering ? u = this.applyStuckiDithering(o, d, u, h, n) : "Atkinson" === this.dithering && (u = this.applyAtkinsonDithering(o, d, u, h, n));
                let y = this.getAsciiChar(u);
                l += y
            }
            l += "\n"
        }
        this.outputDiv.textContent = l;
        let C = document.getElementById("image-preview")
            , f = C.getContext("2d", {
                willReadFrequently: !0
            })
            , v = 400 - 2 * this.transparentFrame  // Changed from 300 to 400
            , F = Math.floor(v / s) - 2 * this.transparentFrame;
        if (C.width = v + 2 * this.transparentFrame,
            C.height = F + 2 * this.transparentFrame,
            this.transparentFrame > 0 && (i.fillStyle = "rgba(0, 0, 0, 0)",
                i.fillRect(0, 0, v + 2 * this.transparentFrame, F + 2 * this.transparentFrame)),
            f.filter = i.filter,
            f.drawImage(t, this.transparentFrame, this.transparentFrame, v, F),
            this.useEdgeDetection && this.applyEdgeDetection(f, C),
            this.useSharpen && this.applySharpen(f, C, this.sharpness),
            "simply" === this.thresholdType) {
            let I = f.getImageData(0, 0, v, F)
                , m = I.data;
            this.applySimpleThresholding(m, v, F, this.thresholdOffset),
                f.putImageData(I, 0, 0)
        }
    }
    applyEdgeDetection(t, e) {
        let i = t.getImageData(0, 0, e.width, e.height)
            , s = i.data
            , h = i.width
            , a = i.height
            , r = new Uint8ClampedArray(s.length)
            , n = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
            , l = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        for (let d = 0; d < a; d++)
            for (let o = 0; o < h; o++) {
                let p = 0
                    , g = 0;
                if (0 === o || 0 === d || o === h - 1 || d === a - 1) {
                    let c = (d * h + o) * 4;
                    r[c] = r[c + 1] = r[c + 2] = 255,
                        r[c + 3] = 255;
                    continue
                }
                for (let _ = -1; _ <= 1; _++)
                    for (let $ = -1; $ <= 1; $++) {
                        let u = ((d + _) * h + (o + $)) * 4
                            , y = .3 * s[u] + .59 * s[u + 1] + .11 * s[u + 2];
                        p += y * n[(_ + 1) * 3 + ($ + 1)],
                            g += y * l[(_ + 1) * 3 + ($ + 1)]
                    }
                let C = Math.sqrt(p * p + g * g) * this.edgeIntensity | 0
                    , f = this.invertEdgeColors ? 255 - C : C
                    , v = (d * h + o) * 4;
                r[v] = r[v + 1] = r[v + 2] = f,
                    r[v + 3] = 255
            }
        let F = new ImageData(r, h, a);
        t.putImageData(F, 0, 0)
    }
    applySimpleThresholding(t, e, i, s) {
        for (let h = 0; h < i; h++)
            for (let a = 0; a < e; a++) {
                let r = (h * e + a) * 4
                    , n = .3 * t[r] + .59 * t[r + 1] + .11 * t[r + 2];
                n < s ? t[r] = t[r + 1] = t[r + 2] = 0 : t[r] = t[r + 1] = t[r + 2] = 255
            }
    }
    applyFloydSteinbergDithering(t, e, i, s, h) {
        let a = Math.round(i / 255 * 14) / 14 * 255
            , r = i - a;
        for (let { dx: n, dy: l, weight: d } of [{
            dx: 1,
            dy: 0,
            weight: 7 / 16
        }, {
            dx: -1,
            dy: 1,
            weight: 3 / 16
        }, {
            dx: 0,
            dy: 1,
            weight: 5 / 16
        }, {
            dx: 1,
            dy: 1,
            weight: 1 / 16
        },]) {
            let o = ((e + l) * s + (t + n)) * 4;
            o >= 0 && o < h.length && (h[o] += r * d)
        }
        return a
    }
    applyJJNDithering(t, e, i, s, h) {
        let a = Math.round(i / 255 * 14) / 14 * 255
            , r = i - a;
        for (let { dx: n, dy: l, weight: d } of [{
            dx: 1,
            dy: 0,
            weight: 7 / 48
        }, {
            dx: 2,
            dy: 0,
            weight: 5 / 48
        }, {
            dx: -2,
            dy: 1,
            weight: 3 / 48
        }, {
            dx: -1,
            dy: 1,
            weight: 5 / 48
        }, {
            dx: 0,
            dy: 1,
            weight: 7 / 48
        }, {
            dx: 1,
            dy: 1,
            weight: 5 / 48
        }, {
            dx: 2,
            dy: 1,
            weight: 3 / 48
        }, {
            dx: -2,
            dy: 2,
            weight: 1 / 48
        }, {
            dx: -1,
            dy: 2,
            weight: 3 / 48
        }, {
            dx: 0,
            dy: 2,
            weight: 5 / 48
        }, {
            dx: 1,
            dy: 2,
            weight: 3 / 48
        }, {
            dx: 2,
            dy: 2,
            weight: 1 / 48
        },]) {
            let o = ((e + l) * s + (t + n)) * 4;
            o >= 0 && o < h.length && (h[o] += r * d)
        }
        return a
    }
    applyStuckiDithering(t, e, i, s, h) {
        let a = Math.round(i / 255 * 14) / 14 * 255
            , r = i - a;
        for (let { dx: n, dy: l, weight: d } of [{
            dx: 1,
            dy: 0,
            weight: 8 / 42
        }, {
            dx: 2,
            dy: 0,
            weight: 4 / 42
        }, {
            dx: -2,
            dy: 1,
            weight: 2 / 42
        }, {
            dx: -1,
            dy: 1,
            weight: 4 / 42
        }, {
            dx: 0,
            dy: 1,
            weight: 8 / 42
        }, {
            dx: 1,
            dy: 1,
            weight: 4 / 42
        }, {
            dx: 2,
            dy: 1,
            weight: 2 / 42
        }, {
            dx: -2,
            dy: 2,
            weight: 1 / 42
        }, {
            dx: -1,
            dy: 2,
            weight: 2 / 42
        }, {
            dx: 0,
            dy: 2,
            weight: 4 / 42
        }, {
            dx: 1,
            dy: 2,
            weight: 2 / 42
        }, {
            dx: 2,
            dy: 2,
            weight: 1 / 42
        },]) {
            let o = ((e + l) * s + (t + n)) * 4;
            o >= 0 && o < h.length && (h[o] += r * d)
        }
        return a
    }
    applyAtkinsonDithering(t, e, i, s, h) {
        let a = Math.round(i / 255 * 14) / 14 * 255
            , r = i - a;
        for (let { dx: n, dy: l, weight: d } of [{
            dx: 1,
            dy: 0,
            weight: 1 / 8
        }, {
            dx: 2,
            dy: 0,
            weight: 1 / 8
        }, {
            dx: -1,
            dy: 1,
            weight: 1 / 8
        }, {
            dx: 0,
            dy: 1,
            weight: 1 / 8
        }, {
            dx: 1,
            dy: 1,
            weight: 1 / 8
        }, {
            dx: 0,
            dy: 2,
            weight: 1 / 8
        },]) {
            let o = ((e + l) * s + (t + n)) * 4;
            o >= 0 && o < h.length && (h[o] += r * d)
        }
        return a
    }
    applySharpen(t, e, i) {
        let s = t.getImageData(0, 0, e.width, e.height)
            , h = s.data
            , a = s.width
            , r = [-1, -1, -1, -1, i, -1, -1, -1, -1]
            , n = r.length
            , l = Math.sqrt(n)
            , d = Math.floor(l / 2)
            , o = new Uint8ClampedArray(h.length);
        for (let p = 0; p < s.height; p++)
            for (let g = 0; g < s.width; g++) {
                let c = 0
                    , _ = 0
                    , $ = 0;
                for (let u = 0; u < l; u++)
                    for (let y = 0; y < l; y++) {
                        let C = p + u - d
                            , f = g + y - d;
                        if (C >= 0 && C < s.height && f >= 0 && f < s.width) {
                            let v = (C * a + f) * 4;
                            c += h[v] * r[u * l + y],
                                _ += h[v + 1] * r[u * l + y],
                                $ += h[v + 2] * r[u * l + y]
                        }
                    }
                let F = (p * a + g) * 4;
                o[F] = c,
                    o[F + 1] = _,
                    o[F + 2] = $,
                    o[F + 3] = h[F + 3]
            }
        let I = new ImageData(o, s.width, s.height);
        t.putImageData(I, 0, 0)
    }

    // Utility methods
    getAsciiChar(t) {
        let e = this.asciiChars[this.currentScale] + " ".repeat(this.spaceDensity);
        let i = Math.floor(t * (e.length - 1) / 255);
        return e[i];
    }

    getAsciiText() {
        return this.outputDiv.textContent;
    }

    // Setter methods
    setAsciiWidth(t) {
        this.width = t
    }
    setScale(t) {
        this.asciiChars.hasOwnProperty(t) && (this.currentScale = t)
    }
    setDithering(t) {
        this.dithering = t
    }
    setBrightness(t) {
        this.brightness = t
    }
    setContrast(t) {
        this.contrast = t
    }
    setInvert(t) {
        this.invert = t
    }
    setSharpness(t) {
        this.sharpness = t
    }
    setUseSharpen(t) {
        this.useSharpen = t
    }
    setSaturation(t) {
        this.saturation = t
    }
    setSepia(t) {
        this.sepia = t
    }
    setHue(t) {
        this.hue = t
    }
    setGrayscale(t) {
        this.grayscale = t
    }
    setThresholdType(t) {
        this.thresholdType = t
    }
    setThresholdOffset(t) {
        this.thresholdOffset = t
    }
    setEdgeIntensity(t) {
        this.edgeIntensity = t
    }
    setEdgeDetection(t) {
        this.useEdgeDetection = t
    }
    setSpaceDensity(t) {
        this.spaceDensity = t
    }
    setTransparentFrame(t) {
        this.transparentFrame = t
    }
}


// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageToASCII;
}
