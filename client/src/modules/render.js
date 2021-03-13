export class Render {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
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
}