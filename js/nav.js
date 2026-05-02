export function setBackButton(selector) {
    const backButton = document.querySelector(selector);

    if (!backButton) return;

    backButton.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}
