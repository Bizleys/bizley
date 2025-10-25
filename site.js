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
    constructor(name, backgroundImage, offset, element) {
        this.name = name;
        this.offset = offset;
        this.backgroundImage = backgroundImage
        this.element = element;
    }
}

class MenuSection {
    constructor(parentNode, page, index, menu) {
        this.page = page;
        this.index = index;
        this.element = Artist.createElement("menu-section");
        this.element.style.backgroundImage = "url('./assets/images/" + page.backgroundImage + ".png')";
        parentNode.appendChild(this.element);
        this.element.appendChild(page.element);
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
        this.menuSections = []
        pages.forEach((page, index) => {
            const menuSection = new MenuSection(this.element, page, index, this);
            this.menuSections.push(menuSection);
            this.element.appendChild(menuSection.element);
        });
    }

    arrange() {
        const barWidthPx = Artist.emToPx(Design.menuBarWidthEm);
        let contentSpacePx = window.innerWidth - (barWidthPx * this.menuSections.length);
        this.menuSections.forEach((menuSection, index) => {
            menuSection.page.element.style.width = (contentSpacePx + barWidthPx) + "px";
            if (index == Design.activeMenuSectionIndex) {
                menuSection.element.style.width = (contentSpacePx + barWidthPx) + "px";
                menuSection.element.style.backgroundPosition = "center";
            } else {
                menuSection.element.style.width = (Design.menuBarWidthEm) + "em";
                menuSection.element.style.backgroundPosition = "-" + menuSection.page.offset + "px 0px";
            }
            menuSection.element.classList.toggle("active", Design.activeMenuSectionIndex === index);
        });
    }
}

class App {
    constructor(rootNode) {
        const bizleysPage = new Page("The Bizleys", "bizleys", 420, document.getElementById("bizleys-page"));
        const samPage = new Page("Sam", "sam", 600, document.getElementById("sam-page"));
        const mattPage = new Page("Matt", "matt", 500, document.getElementById("matt-page"));

        const menu = new Menu(rootNode, [
            bizleysPage,
            samPage,
            mattPage
        ]);

        menu.arrange();

        window.onresize = (event) => {
            menu.arrange();
        }
    }
}

new App(document.getElementById("app"));