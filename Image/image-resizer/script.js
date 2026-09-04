/*==================================================
                DOM ELEMENTS
==================================================*/

const imageInput = document.getElementById("imageInput");

const originalPreview = document.getElementById("originalPreview");
const resizedPreview = document.getElementById("resizedPreview");

const originalPlaceholder = document.getElementById("originalPlaceholder");
const resizedPlaceholder = document.getElementById("resizedPlaceholder");

const originalResolution = document.getElementById("originalResolution");
const originalSize = document.getElementById("originalSize");

const resizedResolution = document.getElementById("resizedResolution");
const resizedSize = document.getElementById("resizedSize");

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");

const lockAspect = document.getElementById("lockAspect");

const resizeBtn = document.getElementById("resizeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const newWidth = document.getElementById("newWidth");
const newHeight = document.getElementById("newHeight");
const newSize = document.getElementById("newSize");

const presetButtons = document.querySelectorAll(".preset-btn");


/*==================================================
                GLOBAL VARIABLES
==================================================*/

let originalImage = null;

let originalImageWidth = 0;
let originalImageHeight = 0;

let aspectRatio = 1;

let resizedBlob = null;
let originalFileName = "";
let originalMimeType = "";
let previewURL = null;


/*==================================================
                INITIAL STATE
==================================================*/

downloadBtn.disabled = true;
resizeBtn.disabled = true;
/*==================================================
            IMAGE UPLOAD & PREVIEW
==================================================*/

imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {

    const file = event.target.files[0];

    if (!file) return;
    originalFileName = file.name;
originalMimeType = file.type;

    // Allow only supported image types
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        alert("Please select a JPG, PNG or WEBP image.");

        imageInput.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = new Image();

        img.onload = function () {

            originalImage = img;

            originalImageWidth = img.width;
            originalImageHeight = img.height;

            aspectRatio = img.width / img.height;

            // Show original preview
            originalPreview.src = e.target.result;
            originalPreview.style.display = "block";
            originalPlaceholder.style.display = "none";

            // Original details
            originalResolution.textContent =
                `${img.width} × ${img.height}`;

            originalSize.textContent =
                formatFileSize(file.size);

            // Auto fill inputs
            widthInput.value = img.width;
            heightInput.value = img.height;

            // Reset output section
            resizedPreview.style.display = "none";
            resizedPlaceholder.style.display = "flex";

            resizedResolution.textContent = "0 × 0";
            resizedSize.textContent = "0 KB";

            newWidth.textContent = "0 px";
            newHeight.textContent = "0 px";
            newSize.textContent = "0 KB";

            downloadBtn.disabled = true;
            resizeBtn.disabled = false;

            resizedBlob = null;

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

/*==================================================
            FILE SIZE FORMATTER
==================================================*/

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} Bytes`;

    }

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(1)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

}/*==================================================
            ASPECT RATIO LOCK
==================================================*/

widthInput.addEventListener("input", () => {

    if (!lockAspect.checked || !originalImage) return;

    const width = Number(widthInput.value);

    if (width <= 0) return;

    heightInput.value = Math.round(width / aspectRatio);

});

heightInput.addEventListener("input", () => {

    if (!lockAspect.checked || !originalImage) return;

    const height = Number(heightInput.value);

    if (height <= 0) return;

    widthInput.value = Math.round(height * aspectRatio);

});


/*==================================================
                PRESET BUTTONS
==================================================*/

presetButtons.forEach(button => {

    button.addEventListener("click", () => {

        const width = Number(button.dataset.width);
        const height = Number(button.dataset.height);

        widthInput.value = width;
        heightInput.value = height;

    });

});
/*==================================================
            RESIZE IMAGE
==================================================*/

resizeBtn.addEventListener("click", resizeImage);

function resizeImage() {

    if (!originalImage) {

        alert("Please upload an image first.");

        return;

    }

    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    if (
        isNaN(width) ||
        isNaN(height) ||
        width <= 0 ||
        height <= 0
    ) {

        alert("Please enter valid width and height.");

        return;

    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    // Better rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
        originalImage,
        0,
        0,
        width,
        height
    );

const mimeType = originalMimeType || "image/png";
    canvas.toBlob(function(blob){

        if(!blob){

            alert("Failed to resize image.");

            return;

        }

        resizedBlob = blob;

        if (previewURL) {

    URL.revokeObjectURL(previewURL);

}

previewURL = URL.createObjectURL(blob);

resizedPreview.src = previewURL;

        // Show preview
        resizedPreview.style.display = "block";
        resizedPlaceholder.style.display = "none";

        // Update details
        resizedResolution.textContent =
            `${width} × ${height}`;

        resizedSize.textContent =
            formatFileSize(blob.size);

        newWidth.textContent =
            `${width} px`;

        newHeight.textContent =
            `${height} px`;

        newSize.textContent =
            formatFileSize(blob.size);

        downloadBtn.disabled = false;

    }, mimeType);

}
/*==================================================
                DOWNLOAD IMAGE
==================================================*/

downloadBtn.addEventListener("click", downloadImage);

function downloadImage() {

    if (!resizedBlob) return;

    const url = URL.createObjectURL(resizedBlob);

    const link = document.createElement("a");

    const dotIndex = originalFileName.lastIndexOf(".");

    const fileName =
        dotIndex !== -1
            ? originalFileName.substring(0, dotIndex)
            : "image";

    let extension = "png";

    switch (originalMimeType) {

        case "image/jpeg":
            extension = "jpg";
            break;

        case "image/webp":
            extension = "webp";
            break;

        case "image/png":
            extension = "png";
            break;

    }

    link.href = url;

    link.download =
        `${fileName}-resized.${extension}`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}