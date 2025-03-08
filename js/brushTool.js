/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400
 * Date Created: 01-03-2025
 * 
 * Contains the BrushTool class and Stroke class.
 */

/**
 * Represents a stroke drawn by the user.
 * 
 * @property {number} x - The x-coordinate of the starting point of the stroke.
 * @property {number} y - The y-coordinate of the starting point of the stroke.
 * @property {Array} points - An array of points that make up the stroke.
 * @property {Object} lastPoint - The last point added to the stroke.
 */
class Stroke {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.points = [];
        this.lastPoint = null;
    }

    /**
     * Adds a point to the stroke.
     * 
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @param {number} size - The size of the point.
     * @param {string} color - The color of the point.
     */
    addPoint(x, y, size, color) {
        this.points.push({ x: x, y: y, size: size, color: color });
    }

    /**
     * Draws the stroke on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
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

    /**
     * Exports the stroke to a JSON-friendly object.
     * 
     * @returns {Object}
     */
    export() {
        return {
            type: 'stroke',
            x: this.x,
            y: this.y,
            points: this.points
        }
    }

    /**
     * Imports a stroke from a JSON object.
     * 
     * @param {Object} data - The object data to import from.
     * @returns {Stroke} The initialized stroke.
     */
    static import(data) {
        let stroke = new Stroke(data.x, data.y);
        stroke.points = data.points;
        return stroke;
    }
}

/**
 * Represents a brush tool that allows the user to draw on the canvas.
 * 
 * @property {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @property {Array} objects - The array of objects drawn on the canvas (reference to the main app objects array).
 * @property {Stroke} currentStroke - The current stroke being drawn.
 * @property {Array} tools - The controls that can be used with the brush tool.
 */
class BrushTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.currentStroke = null;

        this.tools = ["color", "size"];
    }

    /**
     * Initializes a stroke and adds it to the objects array
     */
    inputDown(x, y) {
        this.currentStroke = new Stroke(x, y);
        this.objects.push(this.currentStroke);
        this.currentStroke.addPoint(x, y, this.size, this.color); // Add the initial point
    }

    /**
     * Adds a point to the current stroke every mouse poll
     */
    inputMove(x, y) {
        if (this.currentStroke) {
            this.currentStroke.addPoint(x, y, this.size, this.color);
        }
    }

    /**
     * Ends the current stroke
     */
    inputUp(x, y) {
        if (this.currentStroke) {
            this.currentStroke.addPoint(x, y, this.size, this.color);
            this.currentStroke = null;
        }
    }

    /**
     * Setter for the brush size
     * 
     * @param {number} size - The size of the brush
     */
    changeSize(size) {
        this.size = size;
    }

    /**
     * Setter for the brush color
     * 
     * @param {string} color - The color of the brush
     */
    changeColor(color) {
        this.color = color;
    }

    /**
     * Exports the brush tool settings to a JSON object.
     * 
     * @returns {Object}
     */
    exportSettings() {
        return {
            size: this.size,
            color: this.color
        }
    }

    /**
     * Imports the brush tool settings from an object.
     * 
     * @param {Object} settings - The object data to import from.
     */
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

export { BrushTool, Stroke };