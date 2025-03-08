/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400
 * Date Created: 01-03-2025
 * 
 * Contains the RectangleTool class and Rectangle class.
 */

/**
 * Represents a rectangle drawn by the user.
 *
 * @property {number} x - The x-coordinate of the initial corner of the rectangle.
 * @property {number} y - The y-coordinate of the initial corner of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 * @property {string} color - The color of the rectangle.
 */
class Rectangle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.color = color;
    }

    /**
     * Updates the size of the rectangle based on the given coordinates.
     * 
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    updateSize(x, y) {
        this.width = x - this.x;
        this.height = y - this.y;
    }

    /**
     * Draws the rectangle on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Exports the rectangle to a JSON object.
     *
     * @returns {Object}
     */
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

    /**
     * Imports a rectangle from an object.
     *
     * @param {Object} data - The object to import.
     * @returns {Rectangle}
     */
    static import(data) {
        let rectangle = new Rectangle(data.x, data.y, data.color);
        rectangle.width = data.width;
        rectangle.height = data.height;
        return rectangle;
    }
}

/**
 * Represents the rectangle drawing tool.
 *
 * @property {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
 * @property {Array} objects - The array of objects on the canvas.
 * @property {Rectangle} currentRectangle - The rectangle currently being drawn.
 * @property {string} color - The color of the rectangle.
 */
class RectangleTool {
    constructor(app) {
        this.ctx = app.ctx;
        this.objects = app.objects;

        this.currentRectangle = null;

        this.tools = ["color"];
    }

    /**
     * Initializes a rectangle and adds it to the objects array.
     * 
     * @param {number} x - The x-coordinate of the initial corner of the rectangle.
     * @param {number} y - The y-coordinate of the initial corner of the rectangle.
     */
    inputDown(x, y) {
        this.currentRectangle = new Rectangle(x, y, this.color);
        this.objects.push(this.currentRectangle);
    }

    /**
     * Updates the size of the rectangle as the user drags the mouse.
     *
     * @param {number} x - The x-coordinate of the new point.
     * @param {number} y - The y-coordinate of the new point.
     */
    inputMove(x, y) {
        if (this.currentRectangle) {
            this.currentRectangle.updateSize(x, y);
        }
    }

    /**
     * Finalizes the rectangle size when the user releases the mouse.
     *
     * @param {number} x - The x-coordinate of the final corner of the rectangle.
     * @param {number} y - The y-coordinate of the final corner of the rectangle.
     */
    inputUp(x, y) {
        if (this.currentRectangle) {
            this.currentRectangle.updateSize(x, y);
            this.currentRectangle = null;
        }
    }

    /**
     * Changes the color of the rectangle.
     *
     * @param {string} color - The new color for the rectangle.
     */
    changeColor(color) {
        this.color = color;

        if (this.currentRectangle) {
            this.currentRectangle.color = color;
        }
    }

    /**
     * Exports the rectangle tool settings to a JSON object.
     *
     * @returns {Object}
     */
    exportSettings() {
        return {
            color: this.color
        }
    }

    /**
     * Imports the rectangle tool settings from an object.
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

export { RectangleTool, Rectangle };