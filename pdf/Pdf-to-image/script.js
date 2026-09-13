/* =========================================================
   PDF TO IMAGE — JAVASCRIPT
   PART 1 — ELEMENTS + STATE + BASIC HELPERS
   ========================================================= */


/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */

const pdfInput =
    document.getElementById("pdfInput");

const convertBtn =
    document.getElementById("convertBtn");

const downloadAllBtn =
    document.getElementById("downloadAllBtn");

const output =
    document.getElementById("output");

const processingStatus =
    document.getElementById("processingStatus");


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let selectedPdfFile = null;

let generatedPages = [];

let currentZip = null;

let currentFormat = "png";

let isConverting = false;


/* =========================================================
   STATUS HELPER
   ========================================================= */

function updateStatus(message, type = "info") {

    if (!processingStatus) {
        return;
    }

    const icon =
        processingStatus.querySelector("i");

    const text =
        processingStatus.querySelector("span");


    if (text) {
        text.textContent = message;
    }


    if (icon) {

        icon.className =
            "fa-solid fa-circle-info";

        if (type === "success") {
            icon.className =
                "fa-solid fa-circle-check";
        }

        if (type === "error") {
            icon.className =
                "fa-solid fa-circle-exclamation";
        }

        if (type === "loading") {
            icon.className =
                "fa-solid fa-spinner fa-spin";
        }
    }
}


/* =========================================================
   BUTTON STATE HELPER
   ========================================================= */

function setConvertButtonState(
    loading = false
) {

    isConverting = loading;

    convertBtn.disabled = loading;


    const icon =
        convertBtn.querySelector("i");

    const text =
        convertBtn.querySelector("span");


    if (loading) {

        if (icon) {
            icon.className =
                "fa-solid fa-spinner fa-spin";
        }

        if (text) {
            text.textContent =
                "Converting PDF...";
        }

        return;
    }


    if (icon) {
        icon.className =
            "fa-solid fa-wand-magic-sparkles";
    }

    if (text) {
        text.textContent =
            "Convert to Images";
    }
}


/* =========================================================
   OUTPUT RESET
   ========================================================= */

function resetOutput() {

    generatedPages = [];

    currentZip = null;

    output.innerHTML = `
        <div class="pdf-output-placeholder">

            <div class="pdf-placeholder-icon">
                <i class="fa-regular fa-images"></i>
            </div>

            <h3>
                Your converted pages will appear here
            </h3>

            <p>
                Upload a PDF and click
                “Convert to Images” to begin.
            </p>

        </div>
    `;


    downloadAllBtn.style.display =
        "none";
}


/* =========================================================
   FILE VALIDATION
   ========================================================= */

function isValidPdf(file) {

    if (!file) {
        return false;
    }


    const fileName =
        file.name.toLowerCase();


    return (
        file.type === "application/pdf" ||
        fileName.endsWith(".pdf")
    );
}


/* =========================================================
   INITIAL STATE
   ========================================================= */

resetOutput();

updateStatus(
    "Upload a PDF to get started."
);
/* =========================================================
   JS PART 2 — PDF SELECTION + DRAG & DROP + FORMAT
   ========================================================= */


/* =========================================================
   UPLOAD CARD
   ========================================================= */

const uploadCard =
    document.querySelector(".pdf-upload-card");


/* =========================================================
   HANDLE SELECTED PDF
   ========================================================= */

function handlePdfSelection(file) {

    if (!file) {
        return;
    }


    if (!isValidPdf(file)) {

        selectedPdfFile = null;

        pdfInput.value = "";

        updateStatus(
            "Please select a valid PDF file.",
            "error"
        );

        return;
    }


    selectedPdfFile = file;


    resetOutput();


    updateStatus(
        `${file.name} selected. Ready to convert.`,
        "success"
    );
}


/* =========================================================
   FILE INPUT CHANGE
   ========================================================= */

pdfInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        handlePdfSelection(file);
    }
);


/* =========================================================
   DRAG OVER
   ========================================================= */

if (uploadCard) {

    uploadCard.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            this.classList.add(
                "is-dragging"
            );
        }
    );


    /* =====================================================
       DRAG LEAVE
       ===================================================== */

    uploadCard.addEventListener(
        "dragleave",
        function () {

            this.classList.remove(
                "is-dragging"
            );
        }
    );


    /* =====================================================
       DROP
       ===================================================== */

    uploadCard.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            this.classList.remove(
                "is-dragging"
            );


            const file =
                event.dataTransfer.files[0];


            handlePdfSelection(file);
        }
    );

}


/* =========================================================
   OUTPUT FORMAT
   ========================================================= */

const formatInputs =
    document.querySelectorAll(
        'input[name="format"]'
    );


formatInputs.forEach(
    function (input) {

        input.addEventListener(
            "change",
            function () {

                currentFormat =
                    this.value;

                updateStatus(
                    selectedPdfFile
                        ? `${selectedPdfFile.name} selected. Ready to convert.`
                        : "Upload a PDF to get started.",
                    selectedPdfFile
                        ? "success"
                        : "info"
                );
            }
        );

    }
);


/* =========================================================
   INITIAL FORMAT
   ========================================================= */

const initialFormat =
    document.querySelector(
        'input[name="format"]:checked'
    );


if (initialFormat) {

    currentFormat =
        initialFormat.value;
}
/* =========================================================
   JS PART 3 — PDF.JS CONVERSION ENGINE
   ========================================================= */


/* =========================================================
   CONVERT PDF
   ========================================================= */

convertBtn.addEventListener(
    "click",
    async function () {

        if (isConverting) {
            return;
        }


        if (!selectedPdfFile) {

            updateStatus(
                "Please select a PDF file first.",
                "error"
            );

            return;
        }


        if (!isValidPdf(selectedPdfFile)) {

            updateStatus(
                "Please select a valid PDF file.",
                "error"
            );

            return;
        }


        setConvertButtonState(true);

        updateStatus(
            "Reading your PDF...",
            "loading"
        );


        resetOutput();


        try {

            const arrayBuffer =
                await selectedPdfFile.arrayBuffer();


            const typedArray =
                new Uint8Array(arrayBuffer);


            const pdf =
                await pdfjsLib
                    .getDocument({
                        data: typedArray
                    })
                    .promise;


            const totalPages =
                pdf.numPages;


            currentZip =
                new JSZip();


            generatedPages = [];


            for (
                let pageNum = 1;
                pageNum <= totalPages;
                pageNum++
            ) {

                updateStatus(
                    `Converting page ${pageNum} of ${totalPages}...`,
                    "loading"
                );


                const page =
                    await pdf.getPage(pageNum);


                const viewport =
                    page.getViewport({
                        scale: 2
                    });


                const canvas =
                    document.createElement("canvas");


                const context =
                    canvas.getContext("2d", {
                        alpha: false
                    });


                canvas.width =
                    Math.ceil(viewport.width);

                canvas.height =
                    Math.ceil(viewport.height);


                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;


                output.appendChild(canvas);


                let imageData;


                if (currentFormat === "jpg") {

                    imageData =
                        canvas.toDataURL(
                            "image/jpeg",
                            1.0
                        );

                } else {

                    imageData =
                        canvas.toDataURL(
                            "image/png"
                        );
                }


                const extension =
                    currentFormat === "jpg"
                        ? "jpg"
                        : "png";


                currentZip.file(
                    `page${pageNum}.${extension}`,
                    imageData.split(",")[1],
                    {
                        base64: true
                    }
                );


                generatedPages.push({

                    pageNumber:
                        pageNum,

                    canvas:
                        canvas,

                    dataUrl:
                        imageData,

                    extension:
                        extension

                });

            }


            /* =============================================
               ADD INDIVIDUAL DOWNLOAD BUTTONS
               ============================================= */

            addPageDownloadButtons();


            /* =============================================
               SHOW DOWNLOAD ALL BUTTON
               ============================================= */

            downloadAllBtn.style.display =
                "inline-flex";


            updateStatus(
                `${totalPages} page${totalPages === 1 ? "" : "s"} converted successfully.`,
                "success"
            );


        } catch (error) {

            console.error(
                "PDF conversion error:",
                error
            );


            generatedPages = [];

            currentZip = null;


            downloadAllBtn.style.display =
                "none";


            output.innerHTML = `
                <div class="pdf-output-placeholder">

                    <div class="pdf-placeholder-icon">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>

                    <h3>
                        Conversion failed
                    </h3>

                    <p>
                        We could not convert this PDF.
                        Please try another PDF file.
                    </p>

                </div>
            `;


            updateStatus(
                "Unable to convert this PDF. Please try again.",
                "error"
            );

        } finally {

            setConvertButtonState(false);

        }

    }
);
/* =========================================================
   JS PART 4 — INDIVIDUAL PAGE DOWNLOADS
   ========================================================= */


/* =========================================================
   ADD DOWNLOAD BUTTONS
   ========================================================= */

function addPageDownloadButtons() {

    if (!generatedPages.length) {
        return;
    }


    generatedPages.forEach(
        function (pageData) {

            const downloadBtn =
                document.createElement("button");


            downloadBtn.type =
                "button";


            downloadBtn.className =
                "page-download-button";


            downloadBtn.innerHTML = `
                <i class="fa-solid fa-download"></i>
                <span>
                    Download Page ${pageData.pageNumber}
                </span>
            `;


            downloadBtn.addEventListener(
                "click",
                function () {

                    const link =
                        document.createElement("a");


                    link.href =
                        pageData.dataUrl;


                    link.download =
                        `page${pageData.pageNumber}.${pageData.extension}`;


                    document.body.appendChild(link);


                    link.click();


                    link.remove();


                    updateStatus(
                        `Page ${pageData.pageNumber} downloaded.`,
                        "success"
                    );

                }
            );


            output.appendChild(
                downloadBtn
            );

        }
    );

}
/* =========================================================
   JS PART 5 — DOWNLOAD ALL ZIP
   ========================================================= */


/* =========================================================
   DOWNLOAD ALL BUTTON
   ========================================================= */

downloadAllBtn.addEventListener(
    "click",
    async function () {

        if (!currentZip || !generatedPages.length) {

            updateStatus(
                "Please convert a PDF first.",
                "error"
            );

            return;
        }


        if (downloadAllBtn.disabled) {
            return;
        }


        downloadAllBtn.disabled = true;


        const originalContent =
            downloadAllBtn.innerHTML;


        downloadAllBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Preparing ZIP...</span>
        `;


        updateStatus(
            "Preparing your ZIP file...",
            "loading"
        );


        try {

            const content =
                await currentZip.generateAsync({
                    type: "blob"
                });


            const url =
                URL.createObjectURL(content);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                `PDF-Images-${currentFormat.toUpperCase()}.zip`;


            document.body.appendChild(link);


            link.click();


            link.remove();


            URL.revokeObjectURL(url);


            updateStatus(
                "ZIP file downloaded successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "ZIP generation error:",
                error
            );


            updateStatus(
                "Unable to create the ZIP file. Please try again.",
                "error"
            );


        } finally {

            downloadAllBtn.disabled =
                false;

            downloadAllBtn.innerHTML =
                originalContent;

        }

    }
);
/* =========================================================
   JS PART 6 — FINAL CLEANUP + SAFETY
   ========================================================= */


/* =========================================================
   RESET WHEN NEW PDF IS SELECTED
   ========================================================= */

pdfInput.addEventListener(
    "click",
    function () {

        if (isConverting) {
            return;
        }

    }
);


/* =========================================================
   PREVENT ACCIDENTAL FORM-LIKE SUBMISSION
   ========================================================= */

convertBtn.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
        }

    }
);


/* =========================================================
   DOWNLOAD ALL BUTTON KEYBOARD SAFETY
   ========================================================= */

downloadAllBtn.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter" && downloadAllBtn.disabled) {
            event.preventDefault();
        }

    }
);


/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "PDF tool error:",
            event.error || event.message
        );

    }
);


/* =========================================================
   INITIAL BUTTON STATE
   ========================================================= */

setConvertButtonState(false);


downloadAllBtn.disabled =
    false;


downloadAllBtn.style.display =
    "none";


/* =========================================================
   FINAL STATUS
   ========================================================= */

if (!selectedPdfFile) {

    updateStatus(
        "Upload a PDF to get started.",
        "info"
    );

}