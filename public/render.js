const { ipcRenderer } = require("electron");

const isHTMLTextAreaElement = (element) =>
  element instanceof HTMLTextAreaElement;

const showToast = () => {
  const toast = document.getElementById("toast");

  toast?.classList.add("show");

  setTimeout(() => {
    toast?.classList.remove("show");
  }, 1500);
};

const getInputValue = (element) => {
  if (isHTMLTextAreaElement(element)) {
    return element.value;
  }

  throw new Error("HTMLElement is not HTMLTextAreaElement");
};

document.getElementById("generate")?.addEventListener("click", () => {
  const userConfig = getInputValue(document.getElementById("userConfig"));
  const submodulesList = getInputValue(
    document.getElementById("submodulesList")
  );

  ipcRenderer.send("generate", userConfig, submodulesList);
});

ipcRenderer.on("generated", (_, result) => {
  const outputInput = document.getElementById("output");

  if (isHTMLTextAreaElement(outputInput)) {
    const modal = document.getElementById("modal");

    outputInput.value = result;
    modal?.classList.add("show");
  }
});

document.getElementById("copy")?.addEventListener("click", () => {
  const resultText = getInputValue(document.getElementById("output"));

  ipcRenderer.send("copy", resultText);

  showToast();
});

document.getElementById("modal-close")?.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const resultInput = document.getElementById("output");

  modal?.classList.remove("show");
  resultInput.value = "";
});
