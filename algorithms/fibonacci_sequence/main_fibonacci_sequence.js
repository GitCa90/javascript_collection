const sequenceSection = document.getElementById("sequence-section");
const userInput = document.getElementById("userInput");

userInput.addEventListener("input", validateInput);

function validateInput() {
    let input = Number(userInput.value);

    if (input < 0) return;
    if (input > 50) input = 50;

    renderSequence(input);
}

function renderSequence(input) {
    sequenceSection.innerHTML = "";

    const sequence = calculateSequence(input);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < sequence.length; i++) {
        const box = document.createElement("div");
        box.classList.add("numBox");

        const fNum = document.createElement("div");
        fNum.textContent = `F${i}`;

        const value = document.createElement("div");
        value.textContent = sequence[i];

        box.append(fNum, value);
        fragment.append(box);
    }

    sequenceSection.append(fragment);
}

function calculateSequence(num) {
    let sequence = [0, 1];

    if (num <= 2) return sequence;

    for (let i = 2; i < num; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }

    return sequence;
}

renderSequence(0);
