/**
 * Authors: Emre Bozkurt, Sreyo Biswas
 * Student Numbers: 400555259, 400
 * Date Created: 01-03-2025
 * 
 * This file is the main entry point for the application.
 * It holds the initialization, rendering, and input handling logic.
 */

// Importing the tools (abstracted into separate files for organization)
import { BrushTool, Stroke } from './brushTool.js';
import { RectangleTool, Rectangle } from './rectangleTool.js';
import { CircleTool, Circle } from './circleTool.js';
import { TriangleTool, Triangle } from './triangleTool.js';
import { LineTool, Line } from './lineTool.js';

// Classes

// Creates object to clear the canvas
class ClearBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Draws the clear rect based on the properties of the object
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    /**
     * Exports the object's properties to a JSON-friendly format
     *
     * @returns {Object}
     */
    export() {
        return {
            type: 'clear',
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
    /**
     * Imports the object's properties from a JSON-friendly format
     * 
     * @param {Object} data
     * @returns {ClearBox}
     */
    static import(data) {
        return new ClearBox(data.x, data.y, data.width, data.height);
    }
}

// Main application class
class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.sizeField = document.getElementById('size');
        this.sizeContainer = document.getElementById('size-container');
        this.sizeLabel = document.getElementById('size-label');
        this.colorField = document.getElementById('color');
        this.clearButton = document.getElementById('clear');
        this.undoButton = document.getElementById('undo');
        this.redoButton = document.getElementById('redo');
        this.saveButton = document.getElementById('save');
        this.exportButton = document.getElementById('export');

        this.objects = [];
        this.objectsMemory = [];

        this.brushButton = document.getElementById('brush');
        this.brushTool = new BrushTool(this);

        this.rectangleButton = document.getElementById('rectangle');
        this.rectangleTool = new RectangleTool(this);

        this.circleButton = document.getElementById('circle');
        this.circleTool = new CircleTool(this);

        this.triangleButton = document.getElementById('triangle');
        this.triangleTool = new TriangleTool(this);

        this.lineButton = document.getElementById('line');
        this.lineTool = new LineTool(this);

        this.render = this.render.bind(this);

        this.load();
        this.setTool(this.brushTool);
        this.listen();

        setInterval(this.render, 1000 / 60);
    }

    /**
     * Adds event listeners to the canvas and UI elements
     * to handle user input
     */
    listen() {
        // Get the local coordinates relative to the canvas of the mouse pos
        // Returns an object containing the calculated x and y coordinates.
        const getLocalCoordinates = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);

            // Each tool must have an inputDown method that takes the x and y coordinates
            this.currentTool.inputDown(x, y);

            // Clear the redo memory
            this.objectsMemory.splice(0, this.objectsMemory.length);

            this.save();
        });
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);

            // Each tool must have an inputMove method that takes the x and y coordinates
            this.currentTool.inputMove(x, y);

            this.save();
        });
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);

            // Each tool must have an inputUp method that takes the x and y coordinates
            this.currentTool.inputUp(x, y);

            this.save();
        });

        // Add mouseup event listener to the window object to stop the brush from drawing even if
        // the mouse is released outside the canvas
        window.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);
            this.currentTool.inputUp(x, y);
        });

        // If the current tool has a size property, its internal size property should change.
        this.sizeField.addEventListener('change', () => { 
            this.currentTool.changeSize(this.sizeField.value);
            this.save();
        });
        this.sizeField.addEventListener('input', () => { this.sizeLabel.innerHTML = "Size: " + this.sizeField.value; });

        // If the current tool has a color property, its internal color property should change.
        this.colorField.addEventListener('change', () => { 
            this.currentTool.changeColor(this.colorField.value); 
            this.save();
        });

        this.clearButton.addEventListener('click', this.clear.bind(this));
        this.undoButton.addEventListener('click', this.undo.bind(this));
        this.redoButton.addEventListener('click', this.redo.bind(this));
        this.saveButton.addEventListener('click', this.save.bind(this));
        this.exportButton.addEventListener('click', this.exportToImage.bind(this));

        this.brushButton.addEventListener('click', this.setTool.bind(this, this.brushTool));
        this.rectangleButton.addEventListener('click', this.setTool.bind(this, this.rectangleTool));
        this.circleButton.addEventListener('click', this.setTool.bind(this, this.circleTool));
        this.triangleButton.addEventListener('click', this.setTool.bind(this, this.triangleTool));
        this.lineButton.addEventListener('click', this.setTool.bind(this, this.lineTool));

        // Add keyboard shortcuts for undo and redo
        window.addEventListener('keydown', (e) => {
            if (e.key === 'z' && e.ctrlKey) {
                this.undo();
            }
            if (e.key === 'y' && e.ctrlKey) {
                this.redo();
            }
        });

        // Add keyboard shortcuts for changing the tool
        window.addEventListener('keydown', (e) => {
            if (e.key === 'b') {
                this.setTool(this.brushTool);
            }
            if (e.key === 'r') {
                this.setTool(this.rectangleTool);
            }
            if (e.key === 'c') {
                this.setTool(this.circleTool);
            }
            if (e.key === 't') {
                this.setTool(this.triangleTool);
            }
            if (e.key === 'l') {
                this.setTool(this.lineTool);
            }
        });
    }
    /**
     * Sets the current tool to the provided tool
     *
     * @param {Tool} tool
     */
    setTool(tool) {
        this.currentTool = tool;

        // Update the UI
        this.colorField.style.display = 'none';
        this.sizeContainer.style.display = 'none';

        for (let prop of this.currentTool.tools) {
            switch (prop) {
                case "color":
                    this.colorField.style.display = 'block';
                    this.colorField.value = this.currentTool.color;
                    break;
                case "size":
                    this.sizeContainer.style.display = 'block';
                    this.sizeField.value = this.currentTool.size;
                    this.sizeLabel.innerHTML = "Size: " + this.sizeField.value;
                    break;
            }
        }

        // Update the active tool button visually
        this.brushButton.classList.remove('active');
        this.rectangleButton.classList.remove('active');
        this.circleButton.classList.remove('active');
        this.triangleButton.classList.remove('active');
        this.lineButton.classList.remove('active');
        
        switch (this.currentTool) {
            case this.brushTool:
                this.brushButton.classList.add('active');
                break;
            case this.rectangleTool:
                this.rectangleButton.classList.add('active');
                break;
            case this.circleTool:
                this.circleButton.classList.add('active');
                break;
            case this.triangleTool:
                this.triangleButton.classList.add('active');
                break;
            case this.lineTool:
                this.lineButton.classList.add('active');
                break;
        }
    }

    /**
     * Undo the last action
     */
    undo() {
        if (this.objects.length === 0) {
            return;
        }
        this.objectsMemory.push(this.objects.pop());
        this.save();
    }

    /**
     * Redo the last undone action
     */
    redo() {
        if (this.objectsMemory.length === 0) {
            return;
        }
        this.objects.push(this.objectsMemory.pop());
        this.save();
    }

    /**
     * Clears the canvas by making an new ClearBox object
     * and adding it to the objects array
     */
    clear() {
        let clearBox = new ClearBox(0, 0, this.width, this.height);
        this.objects.push(clearBox);
        this.save();
    }

    /**
     * Renders all objects on the canvas
     * by clearing the canvas and redrawing all objects
     */
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let obj of this.objects) {
            obj.draw(this.ctx);
        }
    }

    /**
     * Saves the current state of the application to local storage
     */
    save() {
        let data = {
            memory: [],
            objects: [],
            toolSettings: {}
        };
        for (let obj of this.objects) {
            data.objects.push(obj.export());
        }
        for (let obj of this.objectsMemory) {
            data.memory.push(obj.export());
        }

        data.toolSettings.BrushTool = this.brushTool.exportSettings();
        data.toolSettings.RectangleTool = this.rectangleTool.exportSettings();
        data.toolSettings.CircleTool = this.circleTool.exportSettings();
        data.toolSettings.TriangleTool = this.triangleTool.exportSettings();
        data.toolSettings.LineTool = this.lineTool.exportSettings();

        localStorage.setItem('saveData', JSON.stringify(data));
    }

    /**
     * Loads the saved state of the application from local storage
     */
    load() {
        let data = JSON.parse(localStorage.getItem('saveData'));
        if (!data) {
            return;
        }

        // Loop through the objects in the save data and create new objects based on their type
        for (let obj of data.objects) {
            let newObj = null;
            switch (obj.type) {
                case 'stroke':
                    newObj = Stroke.import(obj);
                    this.objects.push(newObj);
                    break;
                case 'rectangle':
                    newObj = Rectangle.import(obj);
                    this.objects.push(newObj);
                    break;
                case 'circle':
                    newObj = Circle.import(obj);
                    this.objects.push(newObj);
                    break;
                case 'triangle':
                    newObj = Triangle.import(obj);
                    this.objects.push(newObj);
                    break;
                case 'line':
                    newObj = Line.import(obj);
                    this.objects.push(newObj);
                    break;
            }
        }

        // Loop through the "memory" objects in the save data and create new objects based on their type
        // This is to allow the program to remember the objects that were undone
        for (let obj of data.memory) {
            let newObj = null;
            switch (obj.type) {
                case 'stroke':
                    newObj = Stroke.import(obj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'rectangle':
                    newObj = Rectangle.import(obj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'circle':
                    newObj = Circle.import(obj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'triangle':
                    newObj = Triangle.import(obj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'line':
                    newObj = Line.import(obj);
                    this.objectsMemory.push(newObj);
                    break;
            }
        }

        // Import the tool settings
        if (data.toolSettings.BrushTool)
            this.brushTool.importSettings(data.toolSettings.BrushTool);
        if (data.toolSettings.RectangleTool)
            this.rectangleTool.importSettings(data.toolSettings.RectangleTool);
        if (data.toolSettings.CircleTool)
            this.circleTool.importSettings(data.toolSettings.CircleTool);
        if (data.toolSettings.TriangleTool)
            this.triangleTool.importSettings(data.toolSettings.TriangleTool);
        if (data.toolSettings.LineTool)
            this.lineTool.importSettings(data.toolSettings.LineTool);
    }

    /**
     * Exports the canvas to a png image file
     */
    exportToImage() {
        let a = document.createElement('a');

        a.download = 'image.png';
        a.href = this.canvas.toDataURL('image/png');

        a.click();
        a.remove();
    }
}

// Initialize the application
window.onload = function() {
    let app = new App();
}