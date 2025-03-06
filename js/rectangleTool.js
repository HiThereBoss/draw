class Rectangle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.color = color;
    }
    updateSize(x, y) {
        this.width = x - this.x;
        this.height = y - this.y;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    export() {
        return {
            type: 'rectangle',
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color
        }
    }
    static import(data) {
        let rectangle = new Rectangle(data.x, data.y, data.color);
        rectangle.width = data.width;
        rectangle.height = data.height;
        return rectangle;
    }
}

class RectangleTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.color = '#000000';

        this.currentRectangle = null;

        this.tools = ["color"];
    }
    inputDown(x, y) {
        this.currentRectangle = new Rectangle(x, y, this.color);
        this.objects.push(this.currentRectangle);
    }
    inputMove(x, y) {
        if (this.currentRectangle) {
            this.currentRectangle.updateSize(x, y);
        }
    }
    inputUp(x, y) {
        if (this.currentRectangle) {
            this.currentRectangle.updateSize(x, y);
            this.currentRectangle = null;
        }
    }
    changeColor(color) {
        this.color = color;

        if (this.currentRectangle) {
            this.currentRectangle.color = color;
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

export { RectangleTool, Rectangle };