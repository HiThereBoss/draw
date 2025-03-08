/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400
 * Date Created: 01-03-2025
 * 
 * Contains the TriangleTool class and the Triangle class.
 */

/**
 * Represents a triangle drawn by the user.
 * 
 * @property {number} x - The x-coordinate of the edge of the triangle.
 * @property {number} y - The y-coordinate of the edge of the triangle.
 * @property {number} ix - The initial x-coordinate which represents the center of the triangle.
 * @property {number} iy - The initial y-coordinate which represents the center of the triangle.
 * @property {string} color - The color of the triangle.
 */
class Triangle {
    constructor(x, y, color) {
        this.x = 0;
        this.y = 0;
        this.ix = x;
        this.iy = y;
        this.color = color;
    }
    /**
     * Updates the size of the triangle based on the given coordinates.
     * 
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    updateSize(x, y) {
        this.x = x - this.ix;
        this.y = y - this.iy;
    }

    /**
     * Draws the triangle on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.ix + this.x, this.iy + this.y);
        ctx.lineTo(this.ix + this.x, this.iy - this.y);
        ctx.lineTo(this.ix - this.x, this.iy + this.y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * Exports the triangle to a JSON-friendly object.
     *
     * @returns {Object}
     */
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

    /**
     * Imports a triangle from an object.
     *
     * @param {Object} data - The object containing the triangle data.
     * @returns {Triangle}
     */
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

        this.currentTriangle = null;

        this.tools = ["color"];
    }

    /**
     * Creates a new triangle when the mouse is pressed down.
     * 
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    inputDown(x, y) {
        this.currentTriangle = new Triangle(x, y, this.color);
        this.objects.push(this.currentTriangle);
    }

    /**
     * Resizes the triangle based on the mouse movement.
     * 
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    inputMove(x, y) {
        if (this.currentTriangle) {
            this.currentTriangle.updateSize(x, y);
        }
    }

    /**
     * Finishes up the triangle when the mouse is released.
     * 
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    inputUp(x, y) {
        if (this.currentTriangle) {
            this.currentTriangle.updateSize(x, y);
            this.currentTriangle = null;
        }
    }

    /**
     * Changes the color of the triangle.
     * 
     * @param {string} color - The new color of the triangle.
     */
    changeColor(color) {
        this.color = color;

        if (this.currentTriangle) {
            this.currentTriangle.color = color;
        }
    }

    /**
     * Exports the triangle tool settings to a JSON-friendly object.
     * 
     * @returns {Object}
     */
    exportSettings() {
        return {
            color: this.color
        }
    }

    /**
     * Imports the triangle tool settings from an object.
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

export { TriangleTool, Triangle };