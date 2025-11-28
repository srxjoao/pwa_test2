// Verifica Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            await navigator.serviceWorker.register('/sw.js', { type: "module" });
            console.log('Service worker registrado com sucesso');
        } catch (err) {
            console.log('Falha ao registrar o service worker:', err);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const cameraView = document.getElementById("camera-view");
    const cameraSensor = document.getElementById("camera-sensor");
    const cameraOutputContainer = document.getElementById("camera-output-container");

    const cameraButton = document.getElementById("cameraButton");
    const captureButton = document.getElementById("captureButton");

    const addItemButton = document.getElementById("addItem");
    const itemInput = document.getElementById("itemInput");
    const itemList = document.getElementById("itemList");

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    // Configurar câmera
    function cameraStart() {
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" }, audio: false })
            .then(stream => {
                cameraView.srcObject = stream;
            })
            .catch(error => {
                console.error("Erro ao acessar a câmera:", error);
            });
    }

    // Capturar imagem
    function capturarImagem() {
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;

        cameraSensor.getContext("2d")
            .drawImage(cameraView, 0, 0, cameraSensor.width, cameraSensor.height);

        const img = document.createElement("img");
        img.src = cameraSensor.toDataURL("image/webp");
        img.style.width = "120px";
        img.style.border = "1px solid #000";

        cameraOutputContainer.appendChild(img);
    }

    // Atualizar lista
    function atualizarLista() {
        itemList.innerHTML = "";
        shoppingList.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = item;

            const btn = document.createElement("button");
            btn.textContent = "Remover";
            btn.onclick = () => removerItem(index);

            li.appendChild(btn);
            itemList.appendChild(li);
        });
    }

    function adicionarItem() {
        const item = itemInput.value.trim();
        if (!item) return;

        shoppingList.push(item);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));

        itemInput.value = "";
        atualizarLista();
    }

    function removerItem(index) {
        shoppingList.splice(index, 1);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        atualizarLista();
    }

    // Eventos
    cameraButton.addEventListener("click", cameraStart);
    captureButton.addEventListener("click", capturarImagem);
    addItemButton.addEventListener("click", adicionarItem);

    atualizarLista();
});
