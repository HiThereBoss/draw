/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400566085
 * Date Created: 01-03-2025
 * 
 * Contains the CircleTool class and Circle class.
 */

/**
 * Represents a circle drawn by the user.
 * 
 * @property {number} x - The x-coordinate of the edge of the circle.
 * @property {number} y - The y-coordinate of the edge of the circle
 * @property {number} ix - The initial x-coordinate which represents the center of the circle.
 * @property {number} iy - The initial y-coordinate which represents the center of the circle.
 * @property {number} radius - The radius of the circle.
 * @property {string} color - The color of the circle.
 */
class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.ix = x;
        this.iy = y;
        this.radius = 0;
        this.color = color;
    }

    /**
     * Updates the size of the circle based on the given coordinates.
     * 
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    updateSize(x, y) {
        this.radius = Math.sqrt(Math.pow(x - this.ix, 2) + Math.pow(y - this.iy, 2));
    }

    /**
     * Draws the circle on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.ix, this.iy, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    /**
     * Exports the circle to a JSON object.
     *
     * @returns {Object}
     */
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

    /**
     * Imports a circle from an object.
     *
     * @param {Object} data - The object to import.
     * @returns {Circle}
     */
    static import(data) {
        let circle = new Circle(data.ix, data.iy, data.color);
        circle.radius = data.radius;
        circle.x = data.x;
        circle.y = data.y;
        return circle;
    }
}

/**
 * Represents the circle tool.
 *
 * @property {CanvasRenderingContext2D} ctx - The canvas context.
 * @property {Array} objects - The array of objects on the canvas.
 * @property {Circle} currentCircle - The current circle being drawn.
 * @property {Array} tools - The controls available for the circle tool.
 * @property {string} color - The color of the circle to be drawn.
 */
class CircleTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.currentCircle = null;

        this.tools = ["color"];
    }

    /**
     * Initializes a circle and adds it to the objects array.
     *
     * @param {number} x - The x-coordinate of the circle.
     * @param {number} y - The y-coordinate of the circle.
     */
    inputDown(x, y) {
        this.currentCircle = new Circle(x, y, this.color);
        this.objects.push(this.currentCircle);
    }

    /**
     * Updates the size of the circle based on the given coordinates.
     * 
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    inputMove(x, y) {
        if (this.currentCircle) {
            this.currentCircle.updateSize(x, y);
        }
    }

    /**
     * Updates the size of the circle based on the given coordinates.
     *
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    inputUp(x, y) {
        if (this.currentCircle) {
            this.currentCircle.updateSize(x, y);
            this.currentCircle = null;
        }
    }

    /**
     * Changes the color of the circle.
     *
     * @param {string} color - The new color of the circle.
     */
    changeColor(color) {
        this.color = color;

        if (this.currentCircle) {
            this.currentCircle.color = color;
        }
    }

    /**
     * Exports the circle tool settings to a JSON-friendly object.
     *
     * @returns {Object}
     */
    exportSettings() {
        return {
            color: this.color
        }
    }

    /**
     * Imports the circle tool settings from an object.
     *
     * @param {Object} settings - The settings to import.
     */
    importSettings(settings) {
        if (settings.color) {
            this.color = settings.color;
        }
        else {
            this.color = '#000000';
        }
    }
}

export { CircleTool, Circle };