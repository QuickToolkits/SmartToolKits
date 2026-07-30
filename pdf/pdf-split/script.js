const pdfInput = document.getElementById("pdfInput");
const fileInfo = document.getElementById("fileInfo");
const pageRange = document.getElementById("pageRange");
const splitBtn = document.getElementById("splitBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedPDF = null;
let splitPdfBytes = null;
let totalPages = 0;

pdfInput.addEventListener("change", async () => {

    selectedPDF = pdfInput.files[0];

    if (!selectedPDF) return;

    const bytes = await selectedPDF.arrayBuffer();

    const pdfDoc = await PDFLib.PDFDocument.load(bytes);

    totalPages = pdfDoc.getPageCount();

    fileInfo.innerHTML = `

        <div class="file-card">

            <div class="icon">📄</div>

            <div>

                <div class="name">${selectedPDF.name}</div>

                <div class="size">

                    ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB

                    •

                    ${totalPages} Pages

                </div>

            </div>

        </div>

    `;

});
splitBtn.addEventListener("click", async () => {

    if (!selectedPDF) {

        alert("Please select a PDF first.");

        return;

    }

    const range = pageRange.value.trim();

    if (!range) {

        alert("Enter a page number or range.");

        return;

    }

    let startPage, endPage;

    if (range.includes("-")) {

        const parts = range.split("-");

        startPage = parseInt(parts[0]);
        endPage = parseInt(parts[1]);

    } else {

        startPage = parseInt(range);
        endPage = startPage;

    }

    if (
        isNaN(startPage) ||
        isNaN(endPage) ||
        startPage < 1 ||
        endPage > totalPages ||
        startPage > endPage
    ) {

        alert(`Enter a valid page range between 1 and ${totalPages}`);

        return;

    }

    const existingPdfBytes = await selectedPDF.arrayBuffer();

    const existingPdf = await PDFLib.PDFDocument.load(existingPdfBytes);

    const newPdf = await PDFLib.PDFDocument.create();

    const pageIndexes = [];

    for (let i = startPage - 1; i <= endPage - 1; i++) {

        pageIndexes.push(i);

    }

    const copiedPages = await newPdf.copyPages(
        existingPdf,
        pageIndexes
    );

    copiedPages.forEach(page => newPdf.addPage(page));

    splitPdfBytes = await newPdf.save();

    downloadBtn.style.display = "inline-block";

    alert("PDF Split Successfully!");

});downloadBtn.addEventListener("click", () => {

    if (!splitPdfBytes) return;

    const blob = new Blob(
        [splitPdfBytes],
        {
            type: "application/pdf"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Split_PDF.pdf";

    a.click();

    URL.revokeObjectURL(url);

});