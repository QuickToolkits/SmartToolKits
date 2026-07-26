const pdfInput = document.getElementById("pdfInput");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
convertBtn.addEventListener("click", () => {

    const file = pdfInput.files[0];

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    const reader = new FileReader();

reader.onload = async function () {

    const typedArray = new Uint8Array(reader.result);

    const pdf = await pdfjsLib.getDocument(typedArray).promise;

   const page = await pdf.getPage(1);

const viewport = page.getViewport({ scale: 2 });

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = viewport.width;
canvas.height = viewport.height;

await page.render({
    canvasContext: context,
    viewport: viewport
}).promise;

const output = document.getElementById("output");

output.innerHTML = "";

output.appendChild(canvas);
downloadBtn.style.display = "inline-block";
downloadBtn.onclick = () => {

    const link = document.createElement("a");

    link.download = "page1.jpg";

    link.href = canvas.toDataURL("image/jpeg", 1.0);

    link.click();

};
};

reader.readAsArrayBuffer(file);

});