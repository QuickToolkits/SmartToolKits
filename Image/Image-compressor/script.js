// =========================================
// F2CONVERT IMAGE COMPRESSOR
// JAVASCRIPT PART 1 — ELEMENTS + STATE
// =========================================


// =========================================
// DOM ELEMENTS
// =========================================

const imageInput = document.getElementById("imageInput");

const uploadDropZone = document.getElementById("uploadDropZone");

const browseButton = document.getElementById("browseButton");

const previewSection = document.getElementById("previewSection");

const compressedImage = document.getElementById("compressedImage");

const originalSize = document.getElementById("originalSize");

const compressedSize = document.getElementById("compressedSize");

const savedSize = document.getElementById("savedSize");

const compressionPercentage =
    document.getElementById("compressionPercentage");

const compressionControls =
    document.getElementById("compressionControls");

const qualitySlider =
    document.getElementById("qualitySlider");

const qualityValue =
    document.getElementById("qualityValue");

const compressButton =
    document.getElementById("compressButton");

const downloadSection =
    document.getElementById("downloadSection");

const downloadButton =
    document.getElementById("downloadButton");

const resetButton =
    document.getElementById("resetButton");

const mobileMenuButton =
    document.querySelector(".mobile-menu-button");


// =========================================
// APPLICATION STATE
// =========================================

let selectedFile = null;

let compressedBlob = null;

let compressedUrl = null;

let originalImageUrl = null;


// =========================================
// INITIAL QUALITY VALUE
// =========================================

if (qualitySlider && qualityValue) {

    qualityValue.textContent =
        qualitySlider.value;

}
// =========================================
// JAVASCRIPT PART 2 — FILE SELECTION
// =========================================


// =========================================
// BROWSE BUTTON
// =========================================

if (browseButton && imageInput) {

    browseButton.addEventListener("click", function (event) {

        event.stopPropagation();

        imageInput.click();

    });

}


// =========================================
// UPLOAD AREA CLICK
// =========================================

if (uploadDropZone && imageInput) {

    uploadDropZone.addEventListener("click", function (event) {

        // Button ke click ko dobara trigger nahi karna
        if (event.target.closest(".browse-button")) {
            return;
        }

        imageInput.click();

    });

}


// =========================================
// KEYBOARD ACCESS
// =========================================

if (uploadDropZone && imageInput) {

    uploadDropZone.addEventListener("keydown", function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            imageInput.click();

        }

    });

}


// =========================================
// FILE INPUT CHANGE
// =========================================

if (imageInput) {

    imageInput.addEventListener("change", function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        handleSelectedFile(file);

    });

}


// =========================================
// HANDLE SELECTED FILE
// =========================================

function handleSelectedFile(file) {

    // Supported image types
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    // File type validation
    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please select a JPG, JPEG, PNG or WebP image."
        );

        resetFileInput();

        return;
    }


    // Empty file check
    if (file.size <= 0) {

        alert(
            "This image file appears to be empty."
        );

        resetFileInput();

        return;
    }


    // Save selected file
    selectedFile = file;


    // Create temporary URL
    if (originalImageUrl) {

        URL.revokeObjectURL(originalImageUrl);

    }

    originalImageUrl =
        URL.createObjectURL(file);


    // Show compression controls
    if (compressionControls) {

        compressionControls.hidden = false;

    }


    // Hide old download result
    if (downloadSection) {

        downloadSection.hidden = true;

    }


    // Hide preview until compression
    if (previewSection) {

        previewSection.hidden = true;

    }


    // Reset old compressed data
    compressedBlob = null;


    if (compressedUrl) {

        URL.revokeObjectURL(compressedUrl);

        compressedUrl = null;

    }

}


// =========================================
// RESET FILE INPUT
// =========================================

function resetFileInput() {

    if (imageInput) {

        imageInput.value = "";

    }

    selectedFile = null;

}
// =========================================
// JAVASCRIPT PART 3 — DRAG & DROP
// =========================================


// =========================================
// DRAG ENTER
// =========================================

if (uploadDropZone) {

    uploadDropZone.addEventListener("dragenter", function (event) {

        event.preventDefault();

        event.stopPropagation();

        uploadDropZone.classList.add("drag-over");

    });


    // =========================================
    // DRAG OVER
    // =========================================

    uploadDropZone.addEventListener("dragover", function (event) {

        event.preventDefault();

        event.stopPropagation();

        uploadDropZone.classList.add("drag-over");

    });


    // =========================================
    // DRAG LEAVE
    // =========================================

    uploadDropZone.addEventListener("dragleave", function (event) {

        event.preventDefault();

        event.stopPropagation();

        uploadDropZone.classList.remove("drag-over");

    });


    // =========================================
    // DROP
    // =========================================

    uploadDropZone.addEventListener("drop", function (event) {

        event.preventDefault();

        event.stopPropagation();

        uploadDropZone.classList.remove("drag-over");


        const files = event.dataTransfer.files;


        if (!files || files.length === 0) {
            return;
        }


        const file = files[0];


        handleSelectedFile(file);


        // Keep file input synchronized
        try {

            const dataTransfer = new DataTransfer();

            dataTransfer.items.add(file);

            imageInput.files = dataTransfer.files;

        } catch (error) {

            // Some browsers may not allow
            // programmatic file input assignment.

        }

    });

}
// =========================================
// JAVASCRIPT PART 4 — QUALITY SLIDER
// =========================================


// =========================================
// UPDATE QUALITY VALUE
// =========================================

if (qualitySlider && qualityValue) {

    qualitySlider.addEventListener("input", function () {

        qualityValue.textContent =
            qualitySlider.value;

    });

}
// =========================================
// JAVASCRIPT PART 5 — IMAGE COMPRESSION
// =========================================


// =========================================
// COMPRESS BUTTON
// =========================================

if (compressButton) {

    compressButton.addEventListener("click", function () {

        compressSelectedImage();

    });

}


// =========================================
// COMPRESS SELECTED IMAGE
// =========================================

async function compressSelectedImage() {

    if (!selectedFile) {

        alert("Please select an image first.");

        return;

    }


    // Disable button while processing
    compressButton.disabled = true;

    compressButton.classList.add("is-loading");


    try {

        const quality =
            Number(qualitySlider.value) / 100;


        const image =
            await loadImage(selectedFile);


        // Create canvas
        const canvas =
            document.createElement("canvas");

        const context =
            canvas.getContext("2d");


        // Keep original dimensions
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;


        // Draw image
        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // PNG cannot use JPEG quality in the same way,
        // so PNG images are converted to JPEG for
        // stronger compression.
        const outputType =
            selectedFile.type === "image/png"
                ? "image/jpeg"
                : selectedFile.type;


        // Convert canvas to compressed Blob
        const blob =
            await canvasToBlob(
                canvas,
                outputType,
                quality
            );


        if (!blob) {

            throw new Error(
                "Image compression failed."
            );

        }


 // =========================================
// SMART COMPRESSION RESULT
// =========================================

// Use compressed file only if it is actually smaller
if (blob.size < selectedFile.size) {

    compressedBlob = blob;

} else {

    // Compression did not reduce the file size
    compressedBlob = selectedFile;

    if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
    }

    compressedUrl =
        URL.createObjectURL(selectedFile);

    if (compressedImage) {
        compressedImage.src =
            compressedUrl;
    }

    updateCompressionResults(
        selectedFile.size,
        selectedFile.size
    );

    if (previewSection) {
        previewSection.hidden = false;
    }

    if (downloadSection) {
        downloadSection.hidden = false;
    }

    prepareDownload(
        selectedFile,
        selectedFile.name
    );

    return;
}


// Remove previous object URL
if (compressedUrl) {
    URL.revokeObjectURL(compressedUrl);
}


// Create new compressed URL
compressedUrl =
    URL.createObjectURL(compressedBlob);


// Show compressed image
if (compressedImage) {
    compressedImage.src =
        compressedUrl;
}


// Update size information
updateCompressionResults(
    selectedFile.size,
    compressedBlob.size
);


// Show preview
if (previewSection) {
    previewSection.hidden = false;
}


// Show download section
if (downloadSection) {
    downloadSection.hidden = false;
}


// Prepare download
prepareDownload(
    compressedBlob,
    selectedFile.name
);

        // Scroll smoothly to result
        if (previewSection) {

            setTimeout(function () {

                previewSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }

    } catch (error) {

        console.error(
            "Compression error:",
            error
        );

        alert(
            "Something went wrong while compressing the image. Please try again."
        );

    } finally {

        compressButton.disabled = false;

        compressButton.classList.remove(
            "is-loading"
        );

    }

}


// =========================================
// LOAD IMAGE
// =========================================

function loadImage(file) {

    return new Promise(function (resolve, reject) {

        const image =
            new Image();


        image.onload = function () {

            resolve(image);

        };


        image.onerror = function () {

            reject(
                new Error("Unable to load image.")
            );

        };


        image.src =
            URL.createObjectURL(file);

    });

}


// =========================================
// CANVAS TO BLOB
// =========================================

function canvasToBlob(
    canvas,
    type,
    quality
) {

    return new Promise(function (resolve) {

        canvas.toBlob(
            function (blob) {

                resolve(blob);

            },
            type,
            quality
        );

    });

}
// =========================================
// JAVASCRIPT PART 6 — SIZE & RESULTS
// =========================================


// =========================================
// UPDATE COMPRESSION RESULTS
// =========================================

function updateCompressionResults(
    originalBytes,
    compressedBytes
) {

    // Original size
    if (originalSize) {

        originalSize.textContent =
            formatFileSize(originalBytes);

    }


    // Compressed size
    if (compressedSize) {

        compressedSize.textContent =
            formatFileSize(compressedBytes);

    }


    // Calculate saved bytes
    const savedBytes =
        Math.max(
            originalBytes - compressedBytes,
            0
        );


    // Saved size
    if (savedSize) {

        savedSize.textContent =
            formatFileSize(savedBytes);

    }


    // Calculate reduction percentage
    let reduction = 0;


    if (originalBytes > 0) {

        reduction =
            ((originalBytes - compressedBytes) /
                originalBytes) * 100;

    }


    // Don't show negative reduction
    reduction =
        Math.max(
            0,
            Math.min(100, reduction)
        );


    if (compressionPercentage) {

        compressionPercentage.textContent =
            `${reduction.toFixed(1)}%`;

    }

}


// =========================================
// FORMAT FILE SIZE
// =========================================

function formatFileSize(bytes) {

    if (!bytes || bytes <= 0) {
        return "0 B";
    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    const safeIndex =
        Math.min(
            index,
            units.length - 1
        );


    const size =
        bytes /
        Math.pow(1024, safeIndex);


    if (safeIndex === 0) {

        return `${Math.round(size)} ${units[safeIndex]}`;

    }


    return `${size.toFixed(2)} ${units[safeIndex]}`;

}
// =========================================
// JAVASCRIPT PART 7 — DOWNLOAD FUNCTIONALITY
// =========================================

function prepareDownload(blob, originalName) {

    if (!downloadButton) {
        return;
    }

    // Remove previous download URL
    if (compressedUrl) {
        // Keep compressedUrl for preview
        // Download uses the same object URL
    }

    // Detect correct extension
    let extension = "jpg";

    if (blob.type === "image/webp") {
        extension = "webp";
    } else if (blob.type === "image/png") {
        extension = "png";
    } else if (
        blob.type === "image/jpeg"
    ) {
        extension = "jpg";
    }

    // Remove old extension
    const baseName =
        originalName.replace(
            /\.[^/.]+$/,
            ""
        );

    // Create final download name
    const downloadName =
        `${baseName}-compressed.${extension}`;

    // Set download link
    downloadButton.href =
        compressedUrl;

    downloadButton.download =
        downloadName;

    // Make sure button is visible
    downloadButton.hidden = false;
}
// =========================================
// JAVASCRIPT PART 8 — RESET FUNCTIONALITY
// =========================================

if (resetButton) {
    resetButton.addEventListener(
        "click",
        function () {
            resetCompressor();
        }
    );
}


function resetCompressor() {

    // Clear selected file
    selectedFile = null;

    // Clear compressed blob
    compressedBlob = null;


    // Revoke original image URL
    if (originalImageUrl) {

        URL.revokeObjectURL(
            originalImageUrl
        );

        originalImageUrl = null;
    }


    // Revoke compressed image URL
    if (compressedUrl) {

        URL.revokeObjectURL(
            compressedUrl
        );

        compressedUrl = null;
    }


    // Reset file input
    if (imageInput) {
        imageInput.value = "";
    }


    // Reset compressed preview
    if (compressedImage) {
        compressedImage.src = "";
    }


    // Reset result values
    if (originalSize) {
        originalSize.textContent = "—";
    }

    if (compressedSize) {
        compressedSize.textContent = "—";
    }

    if (savedSize) {
        savedSize.textContent = "—";
    }

    if (compressionPercentage) {
        compressionPercentage.textContent = "0%";
    }


    // Reset quality
    if (qualitySlider) {
        qualitySlider.value = 80;
    }

    if (qualityValue) {
        qualityValue.textContent = "80";
    }


    // Hide sections
    if (previewSection) {
        previewSection.hidden = true;
    }

    if (compressionControls) {
        compressionControls.hidden = true;
    }

    if (downloadSection) {
        downloadSection.hidden = true;
    }


    // Reset download link
    if (downloadButton) {
        downloadButton.href = "#";
        downloadButton.removeAttribute(
            "download"
        );
    }


    // Scroll back to upload area
    if (uploadDropZone) {

        setTimeout(function () {

            uploadDropZone.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);
    }
}
// =========================================
// JAVASCRIPT PART 9 — MOBILE MENU
// =========================================

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        function () {

            const nav =
                document.querySelector(
                    ".main-navigation"
                );

            if (!nav) return;

            const isOpen =
                nav.classList.toggle(
                    "mobile-nav-open"
                );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );
}


// Close mobile menu when a link is clicked

document
    .querySelectorAll(
        ".main-navigation a"
    )
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                const nav =
                    document.querySelector(
                        ".main-navigation"
                    );

                if (nav) {
                    nav.classList.remove(
                        "mobile-nav-open"
                    );
                }

                if (mobileMenuButton) {
                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            }
        );

    });
    // =========================================
// JAVASCRIPT PART 10 — FINAL INITIALIZATION
// =========================================

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}