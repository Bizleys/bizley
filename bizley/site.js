class Design {
    static menuBarWidthEm = 4;
    static activeMenuSectionIndex = 0;
}

class Artist {
    static createElement(classList) {
        const element = document.createElement("div");
        element.classList = classList;
        return element;
    }

    static emToPx(em) {
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return em * rootFontSize;
    }
}

class Page {
    // ext is optional image extension (including the dot, e.g. '.png').
    constructor(name, backgroundImage, offset, element, ext = null) {
        this.name = name;
        this.offset = offset;
        this.backgroundImage = backgroundImage;
        this.element = element;
        // If an explicit extension is provided, use it; otherwise fall back to .jpg
        this.imageExt = ext || '.jpg';
    }
}

class MenuSection {
    constructor(parentNode, page, index, menu) {
        this.page = page;
        this.index = index;
        this.element = Artist.createElement("menu-section");
        
        // Preload image with robust case/format fallbacks and set background once loaded
        const img = new Image();
        const base = "bizley/assets/images/" + page.backgroundImage;
        const baseLower = "bizley/assets/images/" + page.backgroundImage.toLowerCase();
        
        // Build comprehensive list of case and extension variants
        const candidates = [
            base + page.imageExt,       // e.g., Matt.png
            baseLower + page.imageExt.toLowerCase(),  // e.g., matt.png
            base + '.png',
            baseLower + '.png',
            base + '.PNG',
            baseLower + '.PNG',
            base + '.jpg',
            baseLower + '.jpg',
            base + '.JPG',
            baseLower + '.JPG',
            base + '.jpeg',
            baseLower + '.jpeg',
            base + '.JPEG',
            baseLower + '.JPEG',
            base + '.webp',
            baseLower + '.webp',
            base + '.WEBP',
            baseLower + '.WEBP'
        ];

        let chosen = null;
        const tryLoad = (i) => {
            if (i >= candidates.length) {
                console.error("All image candidates failed for", base);
                this.element.style.backgroundColor = "rgba(0,0,0,0.7)";
                this.element.style.opacity = "1"; // show overlay even if image fails
                return;
            }
            const path = candidates[i];
            img.onload = () => {
                chosen = path;
                console.log("✓ Image loaded successfully:", path);
                this.element.style.backgroundImage = `url('${path}')`;
                this.element.style.opacity = "1";
            };
            img.onerror = () => {
                console.log(`✗ Failed [${i+1}/${candidates.length}]:`, path);
                tryLoad(i + 1);
            };
            img.src = path;
        };

        // Set initial state and kick off loading
        this.element.style.opacity = "0";
        this.element.style.backgroundColor = "rgba(0,0,0,0.5)";
        tryLoad(0);
        
        // append the page content inside the section
        this.element.appendChild(page.element);
        parentNode.appendChild(this.element);
        this.element.style.width = Design.menuBarWidthEm + "em";
        this.element.onclick = (event) => {
            Design.activeMenuSectionIndex = index;
            menu.arrange();
        }
    }
}

class Menu {
    constructor(parentNode, pages) {
        this.parentNode = parentNode;
        this.element = Artist.createElement("menu");
        parentNode.appendChild(this.element);
        this.menuSections = [];
        pages.forEach((page, index) => {
            const menuSection = new MenuSection(this.element, page, index, this);
            this.menuSections.push(menuSection);
        });
    }

    arrange() {
        const totalWidth = window.innerWidth;
        const activeWidth = totalWidth * 0.7; // 70% of screen
        const inactiveWidth = Design.menuBarWidthEm + "em"; // Fixed width for inactive
        let currentRight = 0;
        
        // Position sections from right to left for proper stacking
        for (let i = this.menuSections.length - 1; i >= 0; i--) {
            const menuSection = this.menuSections[i];
            menuSection.element.style.right = currentRight + "px";
            
            if (i === Design.activeMenuSectionIndex) {
                menuSection.element.classList.add("active");
                menuSection.element.style.width = activeWidth + "px";
                currentRight += activeWidth;
            } else {
                menuSection.element.classList.remove("active");
                menuSection.element.style.width = inactiveWidth;
                currentRight += Artist.emToPx(Design.menuBarWidthEm);
            }
        }
    }
}

class App {
    constructor(rootNode) {
    const bizleysPage = new Page("The Bizleys", "bizleys", 420, document.getElementById("bizleys-page"), '.png');
    const samPage = new Page("Sam", "sam", 600, document.getElementById("sam-page"), '.png');
    const clairePage = new Page("Claire", "Claire", 500, document.getElementById("claire-page"), '.png');
    const mattPage = new Page("Matt", "Matt", 480, document.getElementById("matt-page"), '.png');
    const abigailPage = new Page("Abigail", "Abigail", 360, document.getElementById("abigail-page"), '.png');
    const kyranPage = new Page("Kyran", "Kyran", 520, document.getElementById("kyran-page"), '.png');
    const davidPage = new Page("David", "David", 440, document.getElementById("david-page"), '.png');

        const menu = new Menu(rootNode, [
            bizleysPage,
            samPage,
            clairePage,
            mattPage,
            abigailPage,
            kyranPage,
            davidPage
        ]);

        menu.arrange();

        window.onresize = (event) => {
            menu.arrange();
        }
    }
}

// Make App available globally
window.App = App;