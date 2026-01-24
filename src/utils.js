export function showMessage(text, type = "success") {
    const container = document.querySelector("#message-container");
    container.textContent = text;
    container.className = type;

    setTimeout(() => {
        container.textContent = "";
        container.className = "";
    }, 10000);
}
