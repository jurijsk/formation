var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BoundingBox {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadAllPagesAsync();
        const pages = figma.root.children;
        let firstPage = pages[0];
        let bb = getContentBounds(firstPage);
        figma.closePlugin();
        const gap = 400;
        let y = bb.height + gap;
        for (let i = 1; i < pages.length; i++) {
            let x = bb.x;
            let maxY = 0;
            const page = pages[i];
            let children = Array.from(page.children);
            for (let j = 0; j < children.length; j++) {
                const child = children[j];
                child.visible = true;
                maxY = Math.max(maxY, child.height);
                firstPage.appendChild(child);
                child.x = x;
                child.y = y;
                x += child.width + gap / 2;
            }
            y += maxY + gap;
        }
        removeEmptyPages();
        figma.closePlugin();
    });
}
run();
function getContentBounds(page) {
    const boundingBox = new BoundingBox(0, 0, 0, 0);
    const children = page.children;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        minX = Math.min(minX, child.x);
        maxX = Math.max(maxX, child.x + child.width);
        minY = Math.min(minY, child.y);
        maxY = Math.max(maxY, child.y + child.height);
    }
    boundingBox.x = minX;
    boundingBox.y = minY;
    boundingBox.width = maxX - minX;
    boundingBox.height = maxY - minY;
    return boundingBox;
}
function removeEmptyPages() {
    const pages = Array.from(figma.root.children);
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (page.children.length === 0) {
            page.remove();
        }
    }
}
