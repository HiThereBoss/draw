import { BrushTool, Stroke } from './brushTool.js';
import { RectangleTool, Rectangle } from './rectangleTool.js';
import { CircleTool, Circle } from './circleTool.js';

// Classes
class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.sizeField = document.getElementById('size');
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

        this.render = this.render.bind(this);

        this.load();
        this.setTool(this.brushTool);
        this.listen();

        setInterval(this.render, 1000 / 60);
    }
    listen() {
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
            this.currentTool.inputDown(x, y);

            // Clear the redo memory
            this.objectsMemory.splice(0, this.objectsMemory.length); // Clear the array without changing the reference
        });
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);
            this.currentTool.inputMove(x, y);
        });
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);
            this.currentTool.inputUp(x, y);
        });

        // Add mouseup event listener to the window object to stop the brush from drawing even if
        // the mouse is released outside the canvas
        window.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const { x, y } = getLocalCoordinates(e);
            this.currentTool.inputUp(x, y);
        });

        this.sizeField.addEventListener('change', () => { this.currentTool.changeSize(this.sizeField.value) });
        this.colorField.addEventListener('change', () => { this.currentTool.changeColor(this.colorField.value) });
        this.clearButton.addEventListener('click', this.clear.bind(this));
        this.undoButton.addEventListener('click', this.undo.bind(this));
        this.redoButton.addEventListener('click', this.redo.bind(this));
        this.saveButton.addEventListener('click', this.save.bind(this));
        this.exportButton.addEventListener('click', this.exportToImage.bind(this));

        this.brushButton.addEventListener('click', this.setTool.bind(this, this.brushTool));
        this.rectangleButton.addEventListener('click', this.setTool.bind(this, this.rectangleTool));
        this.circleButton.addEventListener('click', this.setTool.bind(this, this.circleTool));

        window.addEventListener('keydown', (e) => {
            if (e.key === 'z' && e.ctrlKey) {
                this.undo();
            }
            if (e.key === 'y' && e.ctrlKey) {
                this.redo();
            }
        });
    }
    setTool(tool) {
        this.currentTool = tool;

        // Update the UI
        this.colorField.style.display = 'none';
        this.sizeField.style.display = 'none';

        for (let prop of this.currentTool.tools) {
            switch (prop) {
                case "color":
                    this.colorField.style.display = 'block';
                    this.colorField.value = this.currentTool.color;
                    break;
                case "size":
                    this.sizeField.style.display = 'block';
                    this.sizeField.value = this.currentTool.size;
                    break;
            }
        }
    }
    undo() {
        if (this.objects.length === 0) {
            return;
        }
        this.objectsMemory.push(this.objects.pop());
    }
    redo() {
        if (this.objectsMemory.length === 0) {
            return;
        }
        this.objects.push(this.objectsMemory.pop());
    }
    clear() {
        this.objects.splice(0, this.objects.length); // Clear the array without changing the reference
    }
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let obj of this.objects) {
            obj.draw(this.ctx);
        }
    }
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

        localStorage.setItem('saveData', JSON.stringify(data));
    }
    load() {
        let data = JSON.parse(localStorage.getItem('saveData'));
        if (!data) {
            return;
        }
        for (let obj of data.objects) {
            let newObj = null;
            switch (obj.type) {
                case 'stroke':
                    newObj = Stroke.import(obj);
                    this.objects.push(newObj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'rectangle':
                    newObj = Rectangle.import(obj);
                    this.objects.push(newObj);
                    this.objectsMemory.push(newObj);
                    break;
                case 'circle':
                    newObj = Circle.import(obj);
                    this.objects.push(newObj);
                    this.objectsMemory.push(newObj);
                    break;
            }
        }

        if (data.toolSettings.BrushTool)
            this.brushTool.importSettings(data.toolSettings.BrushTool);
        if (data.toolSettings.RectangleTool)
            this.rectangleTool.importSettings(data.toolSettings.RectangleTool);
        if (data.toolSettings.CircleTool)
            this.circleTool.importSettings(data.toolSettings.CircleTool);
    }
    exportToImage() {
        let a = document.createElement('a');

        a.download = 'image.png';
        a.href = this.canvas.toDataURL('image/png');

        a.click();
        a.remove();
    }
}

window.onload = function() {
    let app = new App();
}