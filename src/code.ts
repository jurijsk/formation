class BoundingBox {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) {
    }
}



async function run (){
	await figma.loadAllPagesAsync();



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
}


run();

function getContentBounds(page: PageNode) : BoundingBox {
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