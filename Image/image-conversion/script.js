/* =========================================================
   SMARTTOOLKITS — IMAGE CONVERTER
   JS PART 1 — UPLOAD + ORIGINAL PREVIEW
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const imageInput = document.getElementById("imageInput");
const uploadCard = document.querySelector(".upload-card");

const originalPreview = document.getElementById("originalPreview");
const originalPlaceholder =
    document.getElementById("originalPlaceholder");

const originalResolution =
    document.getElementById("originalResolution");

const originalSize =
    document.getElementById("originalSize");

const originalFormat =
    document.getElementById("originalFormat");

const formatSelect =
    document.getElementById("formatSelect");

const convertBtn =
    document.getElementById("convertBtn");

const convertedPreview =
    document.getElementById("convertedPreview");

const convertedPlaceholder =
    document.getElementById("convertedPlaceholder");

const convertedResolution =
    document.getElementById("convertedResolution");

const convertedSize =
    document.getElementById("convertedSize");

const convertedFormat =
    document.getElementById("convertedFormat");

const downloadBtn =
    document.getElementById("downloadBtn");

const resultStatus =
    document.getElementById("resultStatus");

const conversionResult =
    document.querySelector(".conversion-result");


/* =========================================================
   STATE
   ========================================================= */

let originalFile = null;
let originalImage = null;
let originalImageURL = null;

let convertedBlob = null;
let convertedImageURL = null;


/* =========================================================
   INITIAL STATE
   ========================================================= */

if (conversionResult) {
    conversionResult.style.display = "none";
}

if (downloadBtn) {
    downloadBtn.disabled = true;
}

if (convertBtn) {
    convertBtn.disabled = true;
}


/* =========================================================
   FILE INPUT
   ========================================================= */

imageInput.addEventListener("change", handleFileSelection);

function handleFileSelection(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    loadImage(file);
}


/* =========================================================
   DRAG & DROP
   ========================================================= */

if (uploadCard) {

    uploadCard.addEventListener("dragover", handleDragOver);

    uploadCard.addEventListener("dragleave", handleDragLeave);

    uploadCard.addEventListener("drop", handleDrop);
}


function handleDragOver(event) {

    event.preventDefault();

    uploadCard.classList.add("drag-over");
}


function handleDragLeave() {

    uploadCard.classList.remove("drag-over");
}


function handleDrop(event) {

    event.preventDefault();

    uploadCard.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (!file) {
        return;
    }

    loadImage(file);
}


/* =========================================================
   LOAD IMAGE
   ========================================================= */

function loadImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image file.");

        return;
    }

    originalFile = file;

    /* Clear previous conversion */

    convertedBlob = null;

    if (convertedImageURL) {

        URL.revokeObjectURL(convertedImageURL);

        convertedImageURL = null;
    }

    downloadBtn.disabled = true;

    convertedPreview.removeAttribute("src");

    convertedPreview.style.display = "none";

    convertedPlaceholder.style.display = "flex";

    convertedResolution.textContent = "0 × 0";

    convertedSize.textContent = "0 KB";

    convertedFormat.textContent = "—";

    if (conversionResult) {
        conversionResult.style.display = "none";
    }


    /* Clear old original URL */

    if (originalImageURL) {

        URL.revokeObjectURL(originalImageURL);
    }


    /* Create new preview URL */

    originalImageURL =
        URL.createObjectURL(file);


    originalImage = new Image();


    originalImage.onload = function () {

        showOriginalPreview();

        updateOriginalInfo();

        convertBtn.disabled = false;
    };


    originalImage.onerror = function () {

        alert("Unable to load this image.");

        convertBtn.disabled = true;
    };


    originalImage.src = originalImageURL;
}


/* =========================================================
   ORIGINAL PREVIEW
   ========================================================= */

function showOriginalPreview() {

    originalPreview.src = originalImageURL;

    originalPreview.style.display = "block";

    originalPlaceholder.style.display = "none";
}


/* =========================================================
   ORIGINAL IMAGE INFORMATION
   ========================================================= */

function updateOriginalInfo() {

    originalResolution.textContent =
        `${originalImage.width} × ${originalImage.height}`;

    originalSize.textContent =
        formatBytes(originalFile.size);

    originalFormat.textContent =
        getFileFormat(originalFile);
}


/* =========================================================
   FILE FORMAT
   ========================================================= */

function getFileFormat(file) {

    if (!file || !file.type) {
        return "—";
    }

    return file.type
        .replace("image/", "")
        .toUpperCase();
}


/* =========================================================
   FILE SIZE FORMAT
   ========================================================= */

function formatBytes(bytes) {

    if (bytes < 1024) {

        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";
    }

    return (
        bytes / (1024 * 1024)
    ).toFixed(2) + " MB";
}
/* =========================================================
   JS PART 2 — QUALITY + FORMAT + CONVERT BUTTON
   ========================================================= */


/* =========================================================
   QUALITY SLIDER
   ========================================================= */

const qualitySlider =
    document.getElementById("qualitySlider");

const qualityValue =
    document.getElementById("qualityValue");


if (qualitySlider && qualityValue) {

    qualitySlider.addEventListener(
        "input",
        updateQualityValue
    );

    updateQualityValue();
}


function updateQualityValue() {

    const quality =
        Number(qualitySlider.value);

    qualityValue.textContent =
        quality + "%";
}


/* =========================================================
   FORMAT SELECTION
   ========================================================= */

formatSelect.addEventListener(
    "change",
    handleFormatChange
);


function handleFormatChange() {

    /*
     * A new format selection means
     * the previous conversion is no longer
     * the current result.
     */

    convertedBlob = null;

    if (convertedImageURL) {

        URL.revokeObjectURL(convertedImageURL);

        convertedImageURL = null;
    }

    convertedPreview.removeAttribute("src");

    convertedPreview.style.display = "none";

    convertedPlaceholder.style.display = "flex";

    convertedResolution.textContent =
        "0 × 0";

    convertedSize.textContent =
        "0 KB";

    convertedFormat.textContent =
        "—";

    downloadBtn.disabled = true;

    if (conversionResult) {
        conversionResult.style.display = "none";
    }

    if (resultStatus) {
        resultStatus.textContent = "Ready";
    }
}


/* =========================================================
   CONVERT BUTTON
   ========================================================= */

convertBtn.addEventListener(
    "click",
    startConversion
);


async function startConversion() {

    if (!originalImage || !originalFile) {

        alert("Please upload an image first.");

        return;
    }


    /* Disable button while processing */

    convertBtn.disabled = true;


    /* Show processing state */

    convertBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Converting...</span>
    `;


    if (resultStatus) {
        resultStatus.textContent = "Converting...";
    }


    try {

        await convertImage();

        updateConvertedResult();

        if (resultStatus) {
            resultStatus.textContent = "Completed";
        }

    } catch (error) {

        console.error(
            "Image conversion failed:",
            error
        );

        alert(
            "Something went wrong while converting the image."
        );

        if (resultStatus) {
            resultStatus.textContent = "Failed";
        }

    } finally {

        convertBtn.disabled = false;

        convertBtn.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Convert Image</span>
        `;
    }
}
/* =========================================================
   JS PART 3 — IMAGE CONVERSION ENGINE
   ========================================================= */


/* =========================================================
   CONVERT IMAGE
   ========================================================= */

async function convertImage() {

    if (!originalImage || !originalFile) {
        throw new Error("No image selected.");
    }


    const selectedFormat =
        formatSelect.value.toLowerCase();


    /*
     * Canvas is used so the image can be
     * processed locally in the browser.
     */

    const canvas =
        document.createElement("canvas");

    const ctx =
        canvas.getContext("2d", {
            alpha: true
        });


    if (!ctx) {
        throw new Error(
            "Canvas is not supported by this browser."
        );
    }


    /* Keep original resolution */

    canvas.width =
        originalImage.naturalWidth ||
        originalImage.width;

    canvas.height =
        originalImage.naturalHeight ||
        originalImage.height;


    /*
     * JPG/BMP do not support transparency.
     * Use the selected background color for
     * those formats.
     */

    if (
        selectedFormat === "jpg" ||
        selectedFormat === "jpeg" ||
        selectedFormat === "bmp"
    ) {

        ctx.fillStyle =
            backgroundColor.value || "#ffffff";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }


    /* Draw source image */

    ctx.drawImage(
        originalImage,
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Get output MIME type */

    const mimeType =
        getOutputMimeType(
            selectedFormat
        );


    /*
     * Quality is mainly respected by
     * lossy formats such as JPG and WEBP.
     */

    const quality =
        Number(qualitySlider.value) / 100;


    /*
     * Convert canvas to Blob.
     */

    const blob =
        await canvasToBlob(
            canvas,
            mimeType,
            quality
        );


    if (!blob) {

        throw new Error(
            "This image format is not supported by your browser."
        );
    }


    convertedBlob = blob;


    return blob;
}


/* =========================================================
   MIME TYPE
   ========================================================= */

function getOutputMimeType(format) {

    switch (format) {

        case "jpg":
        case "jpeg":
            return "image/jpeg";

        case "png":
            return "image/png";

        case "webp":
            return "image/webp";

        case "avif":
            return "image/avif";

        case "bmp":
            return "image/bmp";

        default:
            return "image/png";
    }
}


/* =========================================================
   CANVAS → BLOB
   ========================================================= */

function canvasToBlob(
    canvas,
    mimeType,
    quality
) {

    return new Promise((resolve) => {

        canvas.toBlob(
            (blob) => {
                resolve(blob);
            },
            mimeType,
            quality
        );

    });
}


/* =========================================================
   BACKGROUND COLOR
   ========================================================= */

const backgroundColor =
    document.getElementById(
        "backgroundColor"
    );


/*
 * Changing the background does not
 * automatically convert the image.
 * The selected color is simply used
 * during the next conversion.
 */

if (backgroundColor) {

    backgroundColor.addEventListener(
        "input",
        () => {

            if (
                resultStatus &&
                convertedBlob
            ) {
                resultStatus.textContent =
                    "Settings Changed";
            }

        }
    );
}
/* =========================================================
   JS PART 4 — CONVERTED RESULT + PREVIEW
   ========================================================= */


/* =========================================================
   UPDATE CONVERTED RESULT
   ========================================================= */

function updateConvertedResult() {

    if (!convertedBlob || !originalImage) {
        throw new Error(
            "Converted image is not available."
        );
    }


    /* Revoke previous preview URL */

    if (convertedImageURL) {

        URL.revokeObjectURL(
            convertedImageURL
        );

        convertedImageURL = null;
    }


    /* Create new preview URL */

    convertedImageURL =
        URL.createObjectURL(
            convertedBlob
        );


    /* Show converted image */

    convertedPreview.src =
        convertedImageURL;

    convertedPreview.style.display =
        "block";

    convertedPlaceholder.style.display =
        "none";


    /* Update resolution */

    convertedResolution.textContent =
        `${originalImage.width} × ${originalImage.height}`;


    /* Update file size */

    convertedSize.textContent =
        formatBytes(
            convertedBlob.size
        );


    /* Update format */

    convertedFormat.textContent =
        formatOutputFormat(
            formatSelect.value
        );


    /* Enable download */

    downloadBtn.disabled = false;


    /* Show result section */

    if (conversionResult) {

        conversionResult.style.display =
            "block";
    }


    /* Scroll smoothly to result */

    setTimeout(() => {

        if (conversionResult) {

            conversionResult.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);
}


/* =========================================================
   FORMAT DISPLAY NAME
   ========================================================= */

function formatOutputFormat(format) {

    if (!format) {
        return "—";
    }

    const normalizedFormat =
        format.toLowerCase();


    switch (normalizedFormat) {

        case "jpg":
            return "JPG";

        case "jpeg":
            return "JPEG";

        case "png":
            return "PNG";

        case "webp":
            return "WEBP";

        case "avif":
            return "AVIF";

        case "bmp":
            return "BMP";

        case "tiff":
            return "TIFF";

        case "ico":
            return "ICO";

        default:
            return normalizedFormat.toUpperCase();
    }
}


/* =========================================================
   RESULT PREVIEW ERROR HANDLING
   ========================================================= */

if (convertedPreview) {

    convertedPreview.addEventListener(
        "error",
        () => {

            convertedPreview.style.display =
                "none";

            convertedPlaceholder.style.display =
                "flex";

            convertedPlaceholder.querySelector(
                "p"
            ).textContent =
                "Preview could not be displayed.";

        }
    );
}
/* =========================================================
   JS PART 5 — DOWNLOAD CONVERTED IMAGE
   ========================================================= */


/* =========================================================
   DOWNLOAD BUTTON
   ========================================================= */

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        downloadConvertedImage
    );

}


/* =========================================================
   DOWNLOAD FUNCTION
   ========================================================= */

function downloadConvertedImage() {

    if (!convertedBlob) {

        alert(
            "Please convert the image first."
        );

        return;
    }


    if (!originalFile) {

        alert(
            "Original image information is missing."
        );

        return;
    }


    const selectedFormat =
        formatSelect.value.toLowerCase();


    /*
     * Create temporary download URL.
     */

    const downloadURL =
        URL.createObjectURL(
            convertedBlob
        );


    /*
     * Remove the original extension
     * from the filename.
     */

    const originalName =
        originalFile.name
            .replace(/\.[^/.]+$/, "");


    /*
     * Create final filename.
     */

    const fileName =
        `${originalName}-converted.${getFileExtension(selectedFormat)}`;


    /*
     * Create temporary download link.
     */

    const link =
        document.createElement("a");

    link.href =
        downloadURL;

    link.download =
        fileName;


    /*
     * Trigger browser download.
     */

    document.body.appendChild(link);

    link.click();

    link.remove();


    /*
     * Clean temporary URL.
     */

    setTimeout(() => {

        URL.revokeObjectURL(
            downloadURL
        );

    }, 1000);


    /*
     * Update status.
     */

    if (resultStatus) {

        resultStatus.textContent =
            "Downloaded";

    }

}


/* =========================================================
   FILE EXTENSION
   ========================================================= */

function getFileExtension(format) {

    switch (format) {

        case "jpeg":
            return "jpg";

        case "jpg":
            return "jpg";

        case "png":
            return "png";

        case "webp":
            return "webp";

        case "avif":
            return "avif";

        case "bmp":
            return "bmp";

        case "tiff":
            return "tiff";

        case "ico":
            return "ico";

        default:
            return "png";
    }

}
/* =========================================================
   JS PART 6 — FINALIZATION + CLEANUP + COMPATIBILITY
   ========================================================= */


/* =========================================================
   KEEP METADATA
   ========================================================= */

const keepMetadata =
    document.getElementById(
        "keepMetadata"
    );


/*
 * Canvas conversion cannot reliably preserve
 * every original metadata field.
 *
 * The checkbox is therefore treated as a
 * user preference and only metadata that the
 * browser/output format can preserve is kept.
 */

if (keepMetadata) {

    keepMetadata.addEventListener(
        "change",
        () => {

            if (
                convertedBlob &&
                resultStatus
            ) {

                resultStatus.textContent =
                    "Settings Changed";

            }

        }
    );

}


/* =========================================================
   BROWSER FORMAT SUPPORT CHECK
   ========================================================= */

function isFormatSupported(format) {

    const mimeType =
        getOutputMimeType(
            format
        );


    const canvas =
        document.createElement("canvas");


    if (!canvas.toDataURL) {
        return false;
    }


    try {

        const dataURL =
            canvas.toDataURL(
                mimeType
            );


        return dataURL.startsWith(
            `data:${mimeType}`
        );

    } catch (error) {

        return false;

    }

}


/* =========================================================
   FORMAT CHANGE SUPPORT CHECK
   ========================================================= */

if (formatSelect) {

    formatSelect.addEventListener(
        "change",
        checkSelectedFormatSupport
    );

}


function checkSelectedFormatSupport() {

    const selectedFormat =
        formatSelect.value.toLowerCase();


    /*
     * These formats require browser support
     * through Canvas.
     */

    const supported =
        isFormatSupported(
            selectedFormat
        );


    if (!supported) {

        if (resultStatus) {

            resultStatus.textContent =
                "Format Not Supported";

        }

    } else {

        if (
            !convertedBlob &&
            resultStatus
        ) {

            resultStatus.textContent =
                "Ready";

        }

    }

}


/* =========================================================
   PAGE CLEANUP
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (originalImageURL) {

            URL.revokeObjectURL(
                originalImageURL
            );

        }


        if (convertedImageURL) {

            URL.revokeObjectURL(
                convertedImageURL
            );

        }

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

function initializeConverter() {

    if (originalPreview) {

        originalPreview.style.display =
            "none";

    }


    if (originalPlaceholder) {

        originalPlaceholder.style.display =
            "flex";

    }


    if (convertedPreview) {

        convertedPreview.style.display =
            "none";

    }


    if (convertedPlaceholder) {

        convertedPlaceholder.style.display =
            "flex";

    }


    if (conversionResult) {

        conversionResult.style.display =
            "none";

    }


    if (convertBtn) {

        convertBtn.disabled =
            true;

    }


    if (downloadBtn) {

        downloadBtn.disabled =
            true;

    }


    if (resultStatus) {

        resultStatus.textContent =
            "Ready";

    }

}


/* =========================================================
   START CONVERTER
   ========================================================= */

initializeConverter();
/* =========================================================
   JS PART 7 — FORMAT VALIDATION + SAFE CONVERSION
   ========================================================= */


/* =========================================================
   SUPPORTED BROWSER FORMATS
   ========================================================= */

const browserSupportedFormats = [
    "jpg",
    "png",
    "webp",
    "avif",
    "bmp"
];


/* =========================================================
   CHECK REAL FORMAT SUPPORT
   ========================================================= */

function canConvertFormat(format) {

    if (!browserSupportedFormats.includes(format)) {
        return false;
    }

    const mimeType =
        getOutputMimeType(format);

    const testCanvas =
        document.createElement("canvas");

    testCanvas.width = 1;
    testCanvas.height = 1;

    try {

        const dataURL =
            testCanvas.toDataURL(mimeType);

        return dataURL.startsWith(
            `data:${mimeType}`
        );

    } catch (error) {

        return false;

    }
}


/* =========================================================
   REPLACE CONVERT IMAGE WITH SAFE VERSION
   ========================================================= */

const originalConvertImage =
    convertImage;


async function safeConvertImage() {

    const selectedFormat =
        formatSelect.value.toLowerCase();


    /*
     * TIFF and ICO are not handled by
     * the browser Canvas conversion engine.
     */

    if (
        selectedFormat === "tiff" ||
        selectedFormat === "ico"
    ) {

        throw new Error(
            `${selectedFormat.toUpperCase()} conversion is not supported by the current browser conversion engine.`
        );
    }


    /*
     * Check actual browser support for
     * AVIF and BMP as well.
     */

    if (
        !canConvertFormat(
            selectedFormat
        )
    ) {

        throw new Error(
            `${selectedFormat.toUpperCase()} conversion is not supported by your browser.`
        );
    }


    return await originalConvertImage();
}


/* =========================================================
   USE SAFE CONVERTER
   ========================================================= */

convertImage =
    safeConvertImage;


/* =========================================================
   BETTER ERROR MESSAGE
   ========================================================= */

const originalStartConversion =
    startConversion;


startConversion = async function () {

    if (!originalImage || !originalFile) {

        alert(
            "Please upload an image first."
        );

        return;
    }


    convertBtn.disabled = true;

    convertBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Converting...</span>
    `;


    if (resultStatus) {

        resultStatus.textContent =
            "Converting...";

    }


    try {

        await convertImage();

        updateConvertedResult();

        if (resultStatus) {

            resultStatus.textContent =
                "Completed";

        }

    } catch (error) {

        console.error(
            "Image conversion failed:",
            error
        );


        alert(
            error.message ||
            "This image format cannot be converted in your browser."
        );


        if (resultStatus) {

            resultStatus.textContent =
                "Not Supported";

        }


    } finally {

        convertBtn.disabled = false;

        convertBtn.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Convert Image</span>
        `;

    }

};


/* =========================================================
   DISABLE UNSUPPORTED OUTPUT FORMATS
   ========================================================= */

function updateFormatOptions() {

    const options =
        formatSelect.querySelectorAll(
            "option"
        );


    options.forEach((option) => {

        const format =
            option.value.toLowerCase();


        const supported =
            canConvertFormat(format);


        /*
         * TIFF and ICO are explicitly
         * unavailable in this browser engine.
         */

        if (
            format === "tiff" ||
            format === "ico"
        ) {

            option.disabled = true;

        } else {

            option.disabled =
                !supported;

        }

    });


    /*
     * Select JPG as the safe default
     * if the current format is unavailable.
     */

    if (
        formatSelect.options[
            formatSelect.selectedIndex
        ]?.disabled
    ) {

        formatSelect.value = "jpg";

    }

}


/* =========================================================
   RUN FORMAT CHECK
   ========================================================= */

updateFormatOptions();