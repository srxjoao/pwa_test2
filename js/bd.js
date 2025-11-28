import { openDB } from "idb";

let db;

async function createDB() {
    db = await openDB('shoppingDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('shoppingList')) {
                const store = db.createObjectStore('shoppingList', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('name', 'name');
            }
        }
    });

    console.log("Banco de dados pronto.");
}

document.addEventListener("DOMContentLoaded", async () => {
    await createDB();
    getData();

    document.getElementById("addItem")
        .addEventListener("click", addData);
});

async function getData() {
    const tx = db.transaction('shoppingList', 'readonly');
    const store = tx.objectStore('shoppingList');
    const dados = await store.getAll();

    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";

    dados.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;

        const btn = document.createElement("button");
        btn.textContent = "❌";
        btn.onclick = () => removerItem(item.id);

        li.appendChild(btn);
        itemList.appendChild(li);
    });
}

async function addData() {
    const itemInput = document.getElementById("itemInput");
    const name = itemInput.value.trim();
    if (!name) return;

    const tx = db.transaction('shoppingList', 'readwrite');
    const store = tx.objectStore('shoppingList');
    await store.add({ name });

    itemInput.value = "";
    getData();
}

async function removerItem(id) {
    const tx = db.transaction('shoppingList', 'readwrite');
    const store = tx.objectStore('shoppingList');
    await store.delete(id);

    getData();
}
