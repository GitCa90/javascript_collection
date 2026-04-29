// =====================
// DATA
// =====================

const dom = {
    projectList: document.getElementById("projects"),
    detailEmbed: document.getElementById("detail_embed"),
    detailInfo: document.getElementById("detail_info"),
    detailPanel: document.getElementById("detail_panel"),
    detailHeader: document.getElementById("detail_header"),
    detailImage: document.getElementById("detail_bgimg"),
    detailDescription: document.getElementById("detail_description"),
    detailEnterBtn: document.getElementById("detail_enterButton"),
};

//Consider save state to local storage
const state = {
    currentCat: "",
    currentProj: "",
};

//Some info not ready - More to come
const projects = {
    games: {
        minesweeper: {
            id: "minesweeper",
            title: "Minesweeper",
            image: `/javascript_collection/images/project_minesweeper.png`,
            bgimage: `/javascript_collection/images/description_minesweeper.png`,
            description:
                "Minesweeper is a puzzle game where the player must reveal all tiles without hitting a mine",
            link: "./minesweeper/index.html",
        },
        snake: {
            id: "snake",
            title: "Snake",
            image: `/javascript_collection/images/project_snake.png`,
            bgimage: "",
            description: "Game of Snake",
            link: "./snake/index.html",
        },
    },

    tools: {
        romannumeralconverter: {
            id: "romannumeralconverter",
            title: "Roman Numeral Converter",
            image: `/javascript_collection/images/project_romannumeralconverter.png`,
            bgimage: "",
            embed: true,
            description: "somedescription",
            link: "./roman_numeral_converter/index.html",
        },
    },

    algorithms: {
        fibonaccisequence: {
            id: "fibonaccisequence",
            title: "Fibonacci Sequence",
            image: `/javascript_collection/images/category_algorithms.png`,
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

    resetProjDetails();

    if (item.embed) {
        dom.detailEmbed.src = item.link;
        dom.detailEmbed.classList.remove("hidden");
        dom.detailInfo.classList.add("hidden");
    } else {
        dom.detailEmbed.src = "";
        dom.detailEmbed.classList.add("hidden");
        dom.detailInfo.classList.remove("hidden");
        dom.detailEnterBtn.classList.remove("hidden")
       
        dom.detailHeader.textContent = item.title;
        dom.detailImage.src = item.bgimage;
        dom.detailDescription.textContent = item.description;
        
    }
}

function resetProjDetails() {
    dom.detailHeader.textContent = "";
    dom.detailImage.src = "";
    dom.detailDescription.textContent = "";
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
