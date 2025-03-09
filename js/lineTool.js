/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400566085
 * Date Created: 08-03-2025
 * 
 * Contains the LineTool class and Line class.
 */

/**
 * Represents a line drawn by the user.
 * 
 * @property {number} x1 - The x-coordinate of the starting point of the line.
 * @property {number} y1 - The y-coordinate of the starting point of the line.
 * @property {number} x2 - The x-coordinate of the ending point of the line.
 * @property {number} y2 - The y-coordinate of the ending point of the line.
 * @property {number} size - The size of the line.
 * @property {string} color - The color of the line.
 */
class Line {
    constructor(x, y, size, color) {
        this.size = size
        this.color = color;
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y;
    }

    /**
     * Updates the ending point of the line based on the given coordinates.
     */
    update(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    /**
     * Draws the line on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    /**
     * Exports the line to a JSON friendly object.
     *
     * @returns {Object}
     */
    export() {
        return {
            type: 'line',
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2,
            size: this.size,
            color: this.color
        }
    }
    static import(data) {
        let line = new Line(data.x1, data.y1, data.size, data.color);
        line.x2 = data.x2;
        line.y2 = data.y2;
        return line;
    }
}

class LineTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.currentLine = null;

        this.tools = ["color", "size"];
    }
    inputDown(x, y) {
        this.currentLine = new Line(x, y, this.size, this.color);
        this.objects.push(this.currentLine);
    }
    inputMove(x, y) {
        if (this.currentLine) {
            this.currentLine.update(x, y);
        }
    }
    inputUp(x, y) {
        if (this.currentLine) {
            this.currentLine.update(x, y);
            this.currentLine = null;
        }
    }
    changeSize(size) {
        this.size = size;
    }
    changeColor(color) {
        this.color = color;

        if (this.currentLine) {
            this.currentLine.color = color;
        }
    }
    exportSettings() {
        return {
            size: this.size,
            color: this.color
        }
    }
    importSettings(settings) {
        if (settings.size) {
            this.size = settings.size;
        }
        else {
            this.size = 1;
        }
        if (settings.color) {
            this.color = settings.color;
        }
        else {
            this.color = '#000000';
        }
    }
}

export { LineTool, Line };