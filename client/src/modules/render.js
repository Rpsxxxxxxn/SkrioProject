export class Render {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
    }

    getContext() {
        return this.context;
    }

    updateCanvasSize() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    }

    cleanup() {
        this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }

    setStrokeColor(color) {
        this.context.strokeStyle = color;
    }

    setFillColor(color) {
        this.context.fillStyle = color;
    }

    drawCircle(x, y, size) {
        this.context.arc(x, y, size, 0, Math.PI * 2, false);
    }

    drawFill() {
        this.context.fill();
    }

    drawStroke() {
        this.context.stroke();
    }

    startPath() {
        this.context.beginPath();
    }

    closePath() {
        this.context.closePath();
    }

    zoomScaling(position, zoom) {
        this.context.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.context.scale(zoom, zoom);
        this.context.translate(-position.x, -position.y);
    }

    save() {
        this.context.save();
    }

    restore() {
        this.context.restore();
    }

    drawGrid(position, zoom) {
        this.context.save();
        this.context.strokeStyle = "#ffffff";
        this.context.globalAlpha = .2;
        this.context.scale(zoom, zoom);
        var a = this.canvasWidth / zoom,
            b = this.canvasHeight / zoom;
        for (var c = -.5 + (-position.x + a / 2) % 50; c < a; c += 50) {
            this.context.beginPath();
            this.context.moveTo(c, 0);
            this.context.lineTo(c, b);
            this.context.stroke();
        }
        for (c = -.5 + (-position.y + b / 2) % 50; c < b; c += 50) {
            this.context.beginPath();
            this.context.moveTo(0, c);
            this.context.lineTo(a, c);
            this.context.stroke();
        }
        this.context.restore()
    }
}