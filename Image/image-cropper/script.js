/* ==================================================
   IMAGE CROPPER
   PART 1 — DOM SETUP + STATE
================================================== */


/* =========================
   FILE INPUT
========================= */

const imageInput = document.getElementById("imageInput");


/* =========================
   WORKSPACE
========================= */

const cropWorkspace = document.getElementById("cropWorkspace");

const cropImage = document.getElementById("cropImage");

const workspacePlaceholder =
    document.getElementById("workspacePlaceholder");


/* =========================
   ORIGINAL IMAGE INFO
========================= */

const originalResolution =
    document.getElementById("originalResolution");

const originalSize =
    document.getElementById("originalSize");

const imageFormat =
    document.getElementById("imageFormat");


/* =========================
   CROP CONTROLS
========================= */

const ratioButtons =
    document.querySelectorAll(".ratio-btn");

const cropWidth =
    document.getElementById("cropWidth");

const cropHeight =
    document.getElementById("cropHeight");


/* =========================
   ACTION BUTTONS
========================= */

const cropBtn =
    document.getElementById("cropBtn");

const resetBtn =
    document.getElementById("resetBtn");


/* =========================
   RESULT
========================= */

const croppedPreview =
    document.getElementById("croppedPreview");

const resultPlaceholder =
    document.getElementById("resultPlaceholder");

const croppedResolution =
    document.getElementById("croppedResolution");

const croppedSize =
    document.getElementById("croppedSize");

const croppedFormat =
    document.getElementById("croppedFormat");

const downloadBtn =
    document.getElementById("downloadBtn");


/* ==================================================
   GLOBAL STATE
================================================== */

let originalFile = null;

let originalFileName = "";

let originalMimeType = "";

let naturalWidth = 0;

let naturalHeight = 0;


/* Current aspect ratio

   null = Free Crop
   1 = 1:1
   4/3 = 4:3
   16/9 = 16:9
*/

let selectedRatio = null;


/* Crop selection coordinates

   IMPORTANT:
   These values represent coordinates relative
   to the DISPLAYED image.
*/

let cropX = 0;

let cropY = 0;

let cropSelectionWidth = 0;

let cropSelectionHeight = 0;


/* Crop Box DOM Element */

let cropBox = null;


/* Drag / Resize State */

let isDragging = false;

let isResizing = false;

let activeHandle = null;

let startMouseX = 0;

let startMouseY = 0;

let startCropX = 0;

let startCropY = 0;

let startCropWidth = 0;

let startCropHeight = 0;


/* Output */

let croppedBlob = null;

let croppedPreviewURL = null;


/* ==================================================
   INITIAL STATE
================================================== */

cropBtn.disabled = true;

resetBtn.disabled = true;

downloadBtn.disabled = true;
/* ==================================================
   PART 2 — IMAGE UPLOAD
================================================== */

imageInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;


    /* =========================
       FILE TYPE VALIDATION
    ========================= */

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


    /* =========================
       SAVE FILE INFORMATION
    ========================= */

    originalFile = file;

    originalFileName = file.name;

    originalMimeType = file.type;


    /* =========================
       LOAD IMAGE
    ========================= */

    const reader = new FileReader();

    reader.onload = function (e) {

        cropImage.onload = function () {

            naturalWidth = cropImage.naturalWidth;

            naturalHeight = cropImage.naturalHeight;


            /* =========================
               SHOW IMAGE
            ========================= */

            cropImage.style.display = "block";

            workspacePlaceholder.style.display = "none";


            /* =========================
               ORIGINAL IMAGE INFO
            ========================= */

            originalResolution.textContent =
                `${naturalWidth} × ${naturalHeight}`;

            originalSize.textContent =
                formatFileSize(file.size);

            imageFormat.textContent =
                getImageFormat(file.type);


            /* =========================
               ENABLE CONTROLS
            ========================= */

            cropBtn.disabled = false;

            resetBtn.disabled = false;

            downloadBtn.disabled = true;


            /* =========================
               RESET PREVIOUS OUTPUT
            ========================= */

            resetOutput();


            /* =========================
               WAIT FOR IMAGE LAYOUT
            ========================= */

            requestAnimationFrame(() => {

                createCropBox();

            });

        };


        cropImage.src = e.target.result;

    };


    reader.readAsDataURL(file);

});


/* ==================================================
   FORMAT FILE SIZE
================================================== */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} Bytes`;

    }

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(1)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

}


/* ==================================================
   GET IMAGE FORMAT
================================================== */

function getImageFormat(mimeType) {

    switch (mimeType) {

        case "image/jpeg":
            return "JPG";

        case "image/png":
            return "PNG";

        case "image/webp":
            return "WEBP";

        default:
            return "Image";

    }

}


/* ==================================================
   RESET OUTPUT
================================================== */

function resetOutput() {

    croppedBlob = null;

    downloadBtn.disabled = true;

    croppedPreview.style.display = "none";

    resultPlaceholder.style.display = "flex";

    croppedResolution.textContent = "0 × 0";

    croppedSize.textContent = "0 KB";

    croppedFormat.textContent = "—";


    /* Remove old preview URL */

    if (croppedPreviewURL) {

        URL.revokeObjectURL(croppedPreviewURL);

        croppedPreviewURL = null;

    }

}


/* ==================================================
   CREATE INITIAL CROP BOX
================================================== */

function createCropBox() {

    /* Remove previous crop box */

    if (cropBox) {

        cropBox.remove();

        cropBox = null;

    }


    const imageRect = cropImage.getBoundingClientRect();

    const workspaceRect =
        cropWorkspace.getBoundingClientRect();


    const displayedWidth = imageRect.width;

    const displayedHeight = imageRect.height;


    if (!displayedWidth || !displayedHeight) {

        return;

    }


    /* =========================
       INITIAL CROP SIZE
    ========================= */

    cropSelectionWidth =
        displayedWidth * 0.75;

    cropSelectionHeight =
        displayedHeight * 0.75;


    /* Keep selected aspect ratio */

    if (selectedRatio) {

        if (
            cropSelectionWidth /
            cropSelectionHeight >
            selectedRatio
        ) {

            cropSelectionWidth =
                cropSelectionHeight *
                selectedRatio;

        } else {

            cropSelectionHeight =
                cropSelectionWidth /
                selectedRatio;

        }

    }


    /* Center crop selection */

    cropX =
        (displayedWidth - cropSelectionWidth) / 2;

    cropY =
        (displayedHeight - cropSelectionHeight) / 2;


    /* =========================
       CREATE ELEMENT
    ========================= */

    cropBox = document.createElement("div");

    cropBox.className = "crop-box";


    /* Position crop box relative to workspace */

    const imageOffsetX =
        imageRect.left - workspaceRect.left;

    const imageOffsetY =
        imageRect.top - workspaceRect.top;


    cropBox.style.left =
        `${imageOffsetX + cropX}px`;

    cropBox.style.top =
        `${imageOffsetY + cropY}px`;

    cropBox.style.width =
        `${cropSelectionWidth}px`;

    cropBox.style.height =
        `${cropSelectionHeight}px`;


    cropWorkspace.appendChild(cropBox);


    /* =========================
       CREATE RESIZE HANDLES
    ========================= */

    const handles = [
        "nw",
        "n",
        "ne",
        "e",
        "se",
        "s",
        "sw",
        "w"
    ];


    handles.forEach(position => {

        const handle =
            document.createElement("div");

        handle.className =
            `crop-handle crop-handle-${position}`;

        handle.dataset.handle =
            position;

        cropBox.appendChild(handle);

    });


    updateCropDimensions();

}


/* ==================================================
   UPDATE CROP DIMENSIONS
================================================== */

function updateCropDimensions() {

    if (!cropImage.naturalWidth) return;


    const displayedWidth =
        cropImage.getBoundingClientRect().width;

    const displayedHeight =
        cropImage.getBoundingClientRect().height;


    if (!displayedWidth || !displayedHeight) {

        return;

    }


    const scaleX =
        naturalWidth / displayedWidth;

    const scaleY =
        naturalHeight / displayedHeight;


    const realWidth =
        Math.round(
            cropSelectionWidth * scaleX
        );

    const realHeight =
        Math.round(
            cropSelectionHeight * scaleY
        );


    cropWidth.textContent =
        `${realWidth} px`;

    cropHeight.textContent =
        `${realHeight} px`;

}
/* ==================================================
   PART 3 — MOVE / DRAG CROP BOX
================================================== */

cropWorkspace.addEventListener(
    "pointerdown",
    startCropInteraction
);

document.addEventListener(
    "pointermove",
    moveCropInteraction
);

document.addEventListener(
    "pointerup",
    endCropInteraction
);


/* ==================================================
   START INTERACTION
================================================== */

function startCropInteraction(event) {

    if (!cropBox) return;


    /* Resize handle clicked */

    const handle =
        event.target.closest(".crop-handle");

    if (handle) {

        return;

    }


    /* Only drag when crop box itself is clicked */

    if (
        event.target !== cropBox
    ) {

        return;

    }


    event.preventDefault();


    isDragging = true;


    startMouseX =
        event.clientX;

    startMouseY =
        event.clientY;


    startCropX =
        cropX;

    startCropY =
        cropY;


    cropBox.setPointerCapture?.(
        event.pointerId
    );

}


/* ==================================================
   MOVE INTERACTION
================================================== */

function moveCropInteraction(event) {

    if (!isDragging) return;

    if (!cropBox) return;


    const deltaX =
        event.clientX - startMouseX;

    const deltaY =
        event.clientY - startMouseY;


    let newX =
        startCropX + deltaX;

    let newY =
        startCropY + deltaY;


    const imageRect =
        cropImage.getBoundingClientRect();

    const workspaceRect =
        cropWorkspace.getBoundingClientRect();


    const displayedWidth =
        imageRect.width;

    const displayedHeight =
        imageRect.height;


    /* =========================
       KEEP CROP INSIDE IMAGE
    ========================= */

    newX = Math.max(
        0,
        Math.min(
            newX,
            displayedWidth -
            cropSelectionWidth
        )
    );


    newY = Math.max(
        0,
        Math.min(
            newY,
            displayedHeight -
            cropSelectionHeight
        )
    );


    cropX = newX;

    cropY = newY;


    const imageOffsetX =
        imageRect.left -
        workspaceRect.left;

    const imageOffsetY =
        imageRect.top -
        workspaceRect.top;


    cropBox.style.left =
        `${imageOffsetX + cropX}px`;

    cropBox.style.top =
        `${imageOffsetY + cropY}px`;

}


/* ==================================================
   END INTERACTION
================================================== */

function endCropInteraction(event) {

    if (!isDragging) return;


    isDragging = false;


    try {

        cropBox?.releasePointerCapture?.(
            event.pointerId
        );

    } catch (error) {

        /* Pointer may already be released */

    }

}
/* ==================================================
   PART 4 — RESIZE CROP BOX
================================================== */


/* Minimum crop box size */

const MIN_CROP_SIZE = 40;


/* ==================================================
   HANDLE POINTER DOWN
================================================== */

cropWorkspace.addEventListener("pointerdown", function (event) {

    const handle =
        event.target.closest(".crop-handle");

    if (!handle || !cropBox) return;


    event.preventDefault();
    event.stopPropagation();


    isResizing = true;

    activeHandle =
        handle.dataset.handle;


    startMouseX =
        event.clientX;

    startMouseY =
        event.clientY;


    startCropX =
        cropX;

    startCropY =
        cropY;

    startCropWidth =
        cropSelectionWidth;

    startCropHeight =
        cropSelectionHeight;


    handle.setPointerCapture?.(
        event.pointerId
    );

});


/* ==================================================
   RESIZE POINTER MOVE
================================================== */

document.addEventListener(
    "pointermove",
    resizeCropInteraction
);


function resizeCropInteraction(event) {

    if (!isResizing || !cropBox) return;


    event.preventDefault();


    const deltaX =
        event.clientX - startMouseX;

    const deltaY =
        event.clientY - startMouseY;


    const imageRect =
        cropImage.getBoundingClientRect();

    const displayedWidth =
        imageRect.width;

    const displayedHeight =
        imageRect.height;


    let newX =
        startCropX;

    let newY =
        startCropY;

    let newWidth =
        startCropWidth;

    let newHeight =
        startCropHeight;


    /* ==================================================
       FREE RESIZE
    ================================================== */

    if (!selectedRatio) {


        /* RIGHT */

        if (activeHandle.includes("e")) {

            newWidth =
                startCropWidth + deltaX;

        }


        /* LEFT */

        if (activeHandle.includes("w")) {

            newWidth =
                startCropWidth - deltaX;

            newX =
                startCropX + deltaX;

        }


        /* BOTTOM */

        if (activeHandle.includes("s")) {

            newHeight =
                startCropHeight + deltaY;

        }


        /* TOP */

        if (activeHandle.includes("n")) {

            newHeight =
                startCropHeight - deltaY;

            newY =
                startCropY + deltaY;

        }


        /* Minimum width */

        if (newWidth < MIN_CROP_SIZE) {

            if (activeHandle.includes("w")) {

                newX =
                    startCropX +
                    startCropWidth -
                    MIN_CROP_SIZE;

            }

            newWidth =
                MIN_CROP_SIZE;

        }


        /* Minimum height */

        if (newHeight < MIN_CROP_SIZE) {

            if (activeHandle.includes("n")) {

                newY =
                    startCropY +
                    startCropHeight -
                    MIN_CROP_SIZE;

            }

            newHeight =
                MIN_CROP_SIZE;

        }


        /* Keep inside LEFT */

        if (newX < 0) {

            newWidth += newX;

            newX = 0;

        }


        /* Keep inside TOP */

        if (newY < 0) {

            newHeight += newY;

            newY = 0;

        }


        /* Keep inside RIGHT */

        if (
            newX + newWidth >
            displayedWidth
        ) {

            newWidth =
                displayedWidth - newX;

        }


        /* Keep inside BOTTOM */

        if (
            newY + newHeight >
            displayedHeight
        ) {

            newHeight =
                displayedHeight - newY;

        }

    }


    /* ==================================================
       LOCKED ASPECT RATIO
    ================================================== */

    else {

        resizeWithAspectRatio(
            deltaX,
            deltaY,
            displayedWidth,
            displayedHeight
        );

        return;

    }


    /* Save values */

    cropX = newX;
    cropY = newY;

    cropSelectionWidth =
        newWidth;

    cropSelectionHeight =
        newHeight;


    updateCropBoxPosition();

    updateCropDimensions();

}


/* ==================================================
   RESIZE WITH ASPECT RATIO
================================================== */

function resizeWithAspectRatio(
    deltaX,
    deltaY,
    displayedWidth,
    displayedHeight
) {

    let newX =
        startCropX;

    let newY =
        startCropY;

    let newWidth =
        startCropWidth;

    let newHeight =
        startCropHeight;


    /*
       For horizontal handles,
       width controls the resize.

       For vertical handles,
       height controls the resize.

       Corners use the strongest movement.
    */


    /* RIGHT SIDE */

    if (activeHandle.includes("e")) {

        newWidth =
            startCropWidth + deltaX;

        newHeight =
            newWidth / selectedRatio;

    }


    /* LEFT SIDE */

    else if (activeHandle.includes("w")) {

        newWidth =
            startCropWidth - deltaX;

        newHeight =
            newWidth / selectedRatio;

        newX =
            startCropX +
            (startCropWidth - newWidth);

    }


    /* BOTTOM */

    else if (activeHandle === "s") {

        newHeight =
            startCropHeight + deltaY;

        newWidth =
            newHeight * selectedRatio;

    }


    /* TOP */

    else if (activeHandle === "n") {

        newHeight =
            startCropHeight - deltaY;

        newWidth =
            newHeight * selectedRatio;

        newY =
            startCropY +
            (startCropHeight - newHeight);

    }


    /* Minimum size */

    if (
        newWidth < MIN_CROP_SIZE ||
        newHeight < MIN_CROP_SIZE
    ) {

        return;

    }


    /* Keep crop box inside image */

    if (
        newX < 0 ||
        newY < 0 ||
        newX + newWidth > displayedWidth ||
        newY + newHeight > displayedHeight
    ) {

        return;

    }


    cropX = newX;
    cropY = newY;

    cropSelectionWidth =
        newWidth;

    cropSelectionHeight =
        newHeight;


    updateCropBoxPosition();

    updateCropDimensions();

}


/* ==================================================
   UPDATE CROP BOX POSITION
================================================== */

function updateCropBoxPosition() {

    if (!cropBox) return;


    const imageRect =
        cropImage.getBoundingClientRect();

    const workspaceRect =
        cropWorkspace.getBoundingClientRect();


    const imageOffsetX =
        imageRect.left -
        workspaceRect.left;

    const imageOffsetY =
        imageRect.top -
        workspaceRect.top;


    cropBox.style.left =
        `${imageOffsetX + cropX}px`;

    cropBox.style.top =
        `${imageOffsetY + cropY}px`;

    cropBox.style.width =
        `${cropSelectionWidth}px`;

    cropBox.style.height =
        `${cropSelectionHeight}px`;

}


/* ==================================================
   END RESIZE
================================================== */

document.addEventListener(
    "pointerup",
    function () {

        isResizing = false;

        activeHandle = null;

    }
);


/* ==================================================
   ASPECT RATIO BUTTONS
================================================== */

ratioButtons.forEach(button => {

    button.addEventListener("click", function () {


        /* Remove active class */

        ratioButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        /* Current button active */

        button.classList.add("active");


        const ratio =
            button.dataset.ratio;


        /* Free Crop */

        if (ratio === "free") {

            selectedRatio = null;

        }

        else {

            selectedRatio =
                Number(ratio);

        }


        /* Recreate crop box */

        if (originalFile) {

            createCropBox();

        }

    });

});
/* ==================================================
   PART 5 — ACTUAL IMAGE CROP
================================================== */

cropBtn.addEventListener("click", cropImageNow);


/* ==================================================
   CROP IMAGE
================================================== */

function cropImageNow() {

    if (!originalFile || !cropImage.naturalWidth) {

        alert("Please upload an image first.");

        return;

    }


    if (
        cropSelectionWidth <= 0 ||
        cropSelectionHeight <= 0
    ) {

        alert("Please select a valid crop area.");

        return;

    }


    /* ==================================================
       DISPLAYED IMAGE SIZE
    ================================================== */

    const imageRect =
        cropImage.getBoundingClientRect();

    const displayedWidth =
        imageRect.width;

    const displayedHeight =
        imageRect.height;


    if (
        displayedWidth <= 0 ||
        displayedHeight <= 0
    ) {

        alert("Unable to read image dimensions.");

        return;

    }


    /* ==================================================
       DISPLAYED PIXELS → ORIGINAL PIXELS
    ================================================== */

    const scaleX =
        naturalWidth / displayedWidth;

    const scaleY =
        naturalHeight / displayedHeight;


    let sourceX =
        Math.round(cropX * scaleX);

    let sourceY =
        Math.round(cropY * scaleY);

    let sourceWidth =
        Math.round(
            cropSelectionWidth * scaleX
        );

    let sourceHeight =
        Math.round(
            cropSelectionHeight * scaleY
        );


    /* ==================================================
       SAFETY — KEEP INSIDE ORIGINAL IMAGE
    ================================================== */

    sourceX =
        Math.max(
            0,
            Math.min(
                sourceX,
                naturalWidth - 1
            )
        );


    sourceY =
        Math.max(
            0,
            Math.min(
                sourceY,
                naturalHeight - 1
            )
        );


    sourceWidth =
        Math.min(
            sourceWidth,
            naturalWidth - sourceX
        );


    sourceHeight =
        Math.min(
            sourceHeight,
            naturalHeight - sourceY
        );


    if (
        sourceWidth <= 0 ||
        sourceHeight <= 0
    ) {

        alert("Invalid crop area.");

        return;

    }


    /* ==================================================
       CREATE OUTPUT CANVAS
    ================================================== */

    const canvas =
        document.createElement("canvas");

    canvas.width =
        sourceWidth;

    canvas.height =
        sourceHeight;


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        alert("Your browser could not process the image.");

        return;

    }


    /* High-quality rendering */

    ctx.imageSmoothingEnabled = true;

    ctx.imageSmoothingQuality =
        "high";


    /* ==================================================
       DRAW EXACT CROP
    ================================================== */

    ctx.drawImage(

        cropImage,

        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,

        0,
        0,
        sourceWidth,
        sourceHeight

    );


    /* ==================================================
       PRESERVE ORIGINAL FORMAT
    ================================================== */

    const outputType =
        originalMimeType || "image/png";


    let outputQuality;


    if (
        outputType === "image/jpeg" ||
        outputType === "image/webp"
    ) {

        outputQuality = 0.95;

    }


    /* ==================================================
       CREATE OUTPUT FILE
    ================================================== */

    canvas.toBlob(

        function (blob) {

            if (!blob) {

                alert("Failed to crop the image.");

                return;

            }


            croppedBlob = blob;


            /* Remove previous preview URL */

            if (croppedPreviewURL) {

                URL.revokeObjectURL(
                    croppedPreviewURL
                );

            }


            croppedPreviewURL =
                URL.createObjectURL(blob);


            /* ==================================================
               SHOW RESULT
            ================================================== */

            croppedPreview.src =
                croppedPreviewURL;

            croppedPreview.style.display =
                "block";

            resultPlaceholder.style.display =
                "none";


            /* ==================================================
               UPDATE RESULT INFORMATION
            ================================================== */

            croppedResolution.textContent =
                `${sourceWidth} × ${sourceHeight}`;

            croppedSize.textContent =
                formatFileSize(blob.size);

            croppedFormat.textContent =
                getImageFormat(outputType);


            /* Enable download */

            downloadBtn.disabled = false;

        },

        outputType,

        outputQuality

    );

}
/* ==================================================
   PART 6 — RESET CROP
================================================== */

resetBtn.addEventListener("click", resetCrop);

function resetCrop() {

    if (!originalFile) return;

    /* Reset aspect ratio */

    selectedRatio = null;

    ratioButtons.forEach(button => {

        button.classList.remove("active");

    });

    const freeButton =
        document.querySelector(
            '.ratio-btn[data-ratio="free"]'
        );

    if (freeButton) {

        freeButton.classList.add("active");

    }


    /* Reset previous result */

    resetOutput();


    /* Recreate default crop box */

    requestAnimationFrame(() => {

        createCropBox();

    });

}


/* ==================================================
   DOWNLOAD CROPPED IMAGE
================================================== */

downloadBtn.addEventListener(
    "click",
    downloadCroppedImage
);


function downloadCroppedImage() {

    if (!croppedBlob) return;


    const downloadURL =
        URL.createObjectURL(croppedBlob);


    const link =
        document.createElement("a");


    /* Remove original extension */

    const dotIndex =
        originalFileName.lastIndexOf(".");


    let baseName = originalFileName;


    if (dotIndex !== -1) {

        baseName =
            originalFileName.substring(
                0,
                dotIndex
            );

    }


    /* Determine correct extension */

    let extension = "png";


    switch (originalMimeType) {

        case "image/jpeg":

            extension = "jpg";

            break;


        case "image/png":

            extension = "png";

            break;


        case "image/webp":

            extension = "webp";

            break;

    }


    link.href =
        downloadURL;

    link.download =
        `${baseName}-cropped.${extension}`;


    document.body.appendChild(link);

    link.click();

    link.remove();


    /* Memory cleanup */

    setTimeout(() => {

        URL.revokeObjectURL(
            downloadURL
        );

    }, 100);

}


/* ==================================================
   WINDOW RESIZE SAFETY
================================================== */

let resizeTimer;


window.addEventListener("resize", () => {

    if (!originalFile || !cropImage.naturalWidth) {

        return;

    }


    clearTimeout(resizeTimer);


    resizeTimer = setTimeout(() => {

        /*
           Browser size changed, therefore displayed
           image dimensions may also have changed.

           Recreate the crop selection so coordinates
           remain valid.
        */

        createCropBox();

    }, 150);

});


/* ==================================================
   CLEANUP BEFORE PAGE CLOSE
================================================== */

window.addEventListener("beforeunload", () => {

    if (croppedPreviewURL) {

        URL.revokeObjectURL(
            croppedPreviewURL
        );

    }

});