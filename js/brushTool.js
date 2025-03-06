class Stroke {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.points = [];
        this.lastPoint = null;
    }
    addPoint(x, y, size, color) {
        this.points.push({ x: x, y: y, size: size, color: color });
    }
    draw(ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < this.points.length - 1; i++) {
            const point = this.points[i];
            const nextPoint = this.points[i + 1];
            ctx.strokeStyle = point.color;
            ctx.lineWidth = point.size;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
        }
        ctx.stroke();
    }
    export() {
        return {
            type: 'stroke',
            x: this.x,
            y: this.y,
            points: this.points
        }
    }
    static import(data) {
        let stroke = new Stroke(data.x, data.y);
        stroke.points = data.points;
        return stroke;
    }
}

class BrushTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.size = app.sizeField.value;
        this.color = '#000000';

        this.currentStroke = null;

        this.tools = ["color", "size"];
    }
    inputDown(x, y) {
        this.currentStroke = new Stroke(x, y);
        this.objects.push(this.currentStroke);
        this.currentStroke.addPoint(x, y, this.size, this.color); // Add the initial point
    }
    inputMove(x, y) {
        if (this.currentStroke) {
            this.currentStroke.addPoint(x, y, this.size, this.color);
        }
    }
    inputUp(x, y) {
        if (this.currentStroke) {
            this.currentStroke.addPoint(x, y, this.size, this.color);
            this.currentStroke = null;
        }
    }
    changeSize(size) {
        this.size = size;
    }
    changeColor(color) {
        this.color = color;
    }
    exportSettings() {
        return {
            size: this.size,
            color: this.color
        }
    }
    importSettings(settings) {
        this.size = settings.size;
        this.color = settings.color;
    }
}

export { BrushTool, Stroke };