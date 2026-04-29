// =====================
// DATA
// =====================

const dom = {
    projectList: document.getElementById("projects"),
    detailPanel: document.getElementById("detail_panel"),
    detailHeader: document.getElementById("detail_header"),
    detailImage: document.getElementById("detail_bgimg"),
    detailDescription: document.getElementById("detail_description"),
    detailEnterBtn: document.getElementById("detail_enterButton"),
};

const IMG = "javascript_collection/images";

const state = {
    currentCat: "",
    currentProj: "",
};

const projects = {
    games: {
        minesweeper: {
            id: "minesweeper",
            title: "Minesweeper",
            image: `${IMG}/project_minesweeper.png`,
            bgimage: `${IMG}/description_minesweeper.png`,
            description:
                "Minesweeper is a puzzle game where the player must reveal all tiles without hitting a mine",
            link: "./minesweeper/index.html",
        },
        snake: {
            id: "snake",
            title: "Snake",
            image: `${IMG}/images/project_snake.png`,
            bgimage: "",
            description: "somedescription",
            link: "somelink",
        },
    },

    tools: {
        romannumeralconverter: {
            id: "romannumeralconverter",
            title: "Roman Numeral Converter",
            image: `${IMG}/project_romannumeralconverter.png`,
            bgimage: "",
            description: "somedescription",
            link: "somelink",
        },
    },

    algorithms: {
        fibonaccisequence: {
            id: "fibonaccisequence",
            title: "Fibonacci Sequence",
            image: `${IMG}/category_algorithms.png`,
            bgimage: "",
            description: "somedescription",
            link: "somelink",
        },
    },
};

// =====================
// EVENT
// =====================

document.querySelectorAll(".cat").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        setCurrentCat(e.currentTarget);
        updateActiveCat();
    });
});

dom.projectList.addEventListener("click", (e) => {
    const proj = e.target.closest(".proj");
    if (!proj) return;

    setCurrentProj(proj);
    updateActiveProj();
});

dom.detailPanel.addEventListener("click", (e) => {
    const enter = e.target.closest("#detail_enterButton");
    if (!enter) return;

    enterProject();
});

// =====================
// LOGIC
// =====================

function setCurrentCat(el) {
    state.currentCat = el.dataset.category;
    displayProjList();
}

function setCurrentProj(target) {
    state.currentProj = target.dataset.name;
    displayProjDetails();
}

function enterProject() {
    window.location.href = projects[state.currentCat][state.currentProj].link;
}

// =====================
// RENDERING
// =====================

function displayProjList() {
    dom.projectList.innerHTML = "";

    const cat = state.currentCat;
    const fragment = document.createDocumentFragment();

    for (const item of Object.values(projects[cat])) {
        const div = document.createElement("div");

        div.classList.add("proj");
        div.dataset.name = item.id;
        div.textContent = item.title;
        div.style.backgroundImage = `url(${item.image})`;

        fragment.append(div);
    }

    dom.projectList.append(fragment);
}

function displayProjDetails() {
    const item = projects[state.currentCat][state.currentProj];

    dom.detailHeader.textContent = item.title;
    dom.detailImage.src = item.bgimage;
    dom.detailDescription.textContent = item.description;
    dom.detailEnterBtn.classList.remove("hidden");
}

function updateActiveCat() {
    document.querySelectorAll(".cat").forEach((btn) => {
        btn.classList.toggle("activeButton", btn.dataset.category === state.currentCat);
    });
}

function updateActiveProj() {
    document.querySelectorAll(".proj").forEach((btn) => {
        btn.classList.toggle("activeButton", btn.dataset.name === state.currentProj);
    });
}
