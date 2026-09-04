const pdfInput = document.getElementById("pdfInput");
const fileInfo = document.getElementById("fileInfo");
const rotateBtn = document.getElementById("rotateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const rotationAngle = document.getElementById("rotationAngle");

let uploadedPdf = null;
let rotatedPdfBytes = null;

pdfInput.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    uploadedPdf = file;

    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const totalPages = pdfDoc.getPageCount();

    fileInfo.style.display = "block";

    fileInfo.innerHTML = `
        <strong>📄 File:</strong> ${file.name}<br>
        <strong>📏 Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
        <strong>📑 Total Pages:</strong> ${totalPages}
    `;

    downloadBtn.style.display = "none";

});
rotateBtn.addEventListener("click", async () => {

    if (!uploadedPdf) {

        alert("Please upload a PDF first.");

        return;

    }

    const arrayBuffer = await uploadedPdf.arrayBuffer();

    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const angle = parseInt(rotationAngle.value);

    const pages = pdfDoc.getPages();

    pages.forEach(page => {

        const currentRotation = page.getRotation().angle;

        page.setRotation(PDFLib.degrees(currentRotation + angle));

    });

    rotatedPdfBytes = await pdfDoc.save();

    downloadBtn.style.display = "inline-block";

    alert("✅ PDF rotated successfully!");

});

downloadBtn.addEventListener("click", () => {

    if (!rotatedPdfBytes) return;

    const blob = new Blob([rotatedPdfBytes], {

        type: "application/pdf"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    const originalName = uploadedPdf.name.replace(/\.pdf$/i, "");

a.download = `${originalName}_rotated.pdf`;

    a.click();

    URL.revokeObjectURL(url);

});