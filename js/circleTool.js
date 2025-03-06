class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.ix = x;
        this.iy = y;
        this.radius = 0;
        this.color = color;
    }
    updateSize(x, y) {
        this.radius = Math.sqrt(Math.pow(x - this.ix, 2) + Math.pow(y - this.iy, 2));
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.ix, this.iy, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    export() {
        return {
            type: 'circle',
            x: this.x,
            y: this.y,
            ix: this.ix,
            iy: this.iy,
            radius: this.radius,
            color: this.color
        }
    }
    static import(data) {
        let circle = new Circle(data.ix, data.iy, data.color);
        circle.radius = data.radius;
        return circle;
    }
}

class CircleTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.color = '#000000';

        this.currentCircle = null;

        this.tools = ["color"];
    }
    inputDown(x, y) {
        this.currentCircle = new Circle(x, y, this.color);
        this.objects.push(this.currentCircle);
    }
    inputMove(x, y) {
        if (this.currentCircle) {
            this.currentCircle.updateSize(x, y);
        }
    }
    inputUp(x, y) {
        if (this.currentCircle) {
            this.currentCircle.updateSize(x, y);
            this.currentCircle = null;
        }
    }
    changeColor(color) {
        this.color = color;

        if (this.currentCircle) {
            this.currentCircle.color = color;
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

export { CircleTool, Circle };