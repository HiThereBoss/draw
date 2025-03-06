class Triangle {
    constructor(x, y, color) {
        this.x = 0;
        this.y = 0;
        this.ix = x;
        this.iy = y;
        this.color = color;
    }
    updateSize(x, y) {
        this.x = x - this.ix;
        this.y = y - this.iy;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.ix + this.x, this.iy + this.y);
        ctx.lineTo(this.ix + this.x, this.iy - this.y);
        ctx.lineTo(this.ix - this.x, this.iy + this.y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    export() {
        return {
            type: 'triangle',
            x: this.x,
            y: this.y,
            ix: this.ix,
            iy: this.iy,
            color: this.color
        }
    }
    static import(data) {
        let triangle = new Triangle(data.ix, data.iy, data.color);
        triangle.x = data.x;
        triangle.y = data.y;
        return triangle;
    }
}

class TriangleTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.color = '#000000';

        this.currentTriangle = null;

        this.tools = ["color"];
    }
    inputDown(x, y) {
        this.currentTriangle = new Triangle(x, y, this.color);
        this.objects.push(this.currentTriangle);
    }
    inputMove(x, y) {
        if (this.currentTriangle) {
            this.currentTriangle.updateSize(x, y);
        }
    }
    inputUp(x, y) {
        if (this.currentTriangle) {
            this.currentTriangle.updateSize(x, y);
            this.currentTriangle = null;
        }
    }
    changeColor(color) {
        this.color = color;

        if (this.currentTriangle) {
            this.currentTriangle.color = color;
        }
    }
    exportSettings() {
        return {
            color: this.color
        }
    }
    importSettings(settings) {
        this.color = settings.color;
    }
}

export { TriangleTool, Triangle };