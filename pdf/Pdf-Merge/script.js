const pdfInput = document.getElementById("pdfInput");
const fileList = document.getElementById("fileList");
const mergeBtn = document.getElementById("mergeBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFiles = [];
let mergedPdfBytes = null;

pdfInput.addEventListener("change", () => {

    selectedFiles = [...pdfInput.files];

    showFiles();

});

function formatSize(bytes){

    if(bytes < 1024) return bytes + " B";

    if(bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

function showFiles(){

    fileList.innerHTML = "";

    if(selectedFiles.length === 0) return;

    selectedFiles.forEach((file,index)=>{

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `

            <div class="file-info">

                <div class="file-icon">📄</div>

                <div>

                    <div class="file-name">${index+1}. ${file.name}</div>

                    <div class="file-size">${formatSize(file.size)}</div>

                </div>

            </div>

        `;

        fileList.appendChild(item);

    });

}
mergeBtn.addEventListener("click", async () => {

    if (selectedFiles.length < 2) {
        alert("Please select at least 2 PDF files.");
        return;
    }

    const { PDFDocument } = PDFLib;

    const mergedPdf = await PDFDocument.create();

    for (const file of selectedFiles) {

        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        pages.forEach(page => mergedPdf.addPage(page));
    }

    mergedPdfBytes = await mergedPdf.save();

    downloadBtn.style.display = "inline-block";

    alert("PDFs merged successfully!");

});
downloadBtn.addEventListener("click", () => {

    if (!mergedPdfBytes) return;

    const blob = new Blob([mergedPdfBytes], {
        type: "application/pdf"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Merged_PDF.pdf";

    a.click();

    URL.revokeObjectURL(url);

});