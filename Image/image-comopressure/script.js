const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const resultInfo = document.getElementById("resultInfo");
const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const uploadBox = document.querySelector(".upload-box");

let originalFile = null;
let compressedBlob = null;

/*==============================
      Quality Slider
==============================*/

qualitySlider.addEventListener("input", () => {

    qualityValue.textContent = qualitySlider.value + "%";

});

/*==============================
      File Upload
==============================*/

imageInput.addEventListener("change", (e) => {

    if (!e.target.files.length) return;

    loadImage(e.target.files[0]);

});

/*==============================
      Drag & Drop
==============================*/

uploadBox.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadBox.classList.add("drag-active");

});

uploadBox.addEventListener("dragleave", () => {

    uploadBox.classList.remove("drag-active");

});

uploadBox.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadBox.classList.remove("drag-active");

    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Please upload an image.");

        return;

    }

    loadImage(file);

});

/*==============================
      Load Image
==============================*/

function loadImage(file){

    originalFile = file;

    const reader = new FileReader();

    reader.onload = function(e){

        previewContainer.innerHTML = `

        <div class="preview-card">

            <img src="${e.target.result}" alt="Preview">

            <div class="preview-title">

                Original Image

            </div>

            <div class="preview-size">

                ${(file.size/1024/1024).toFixed(2)} MB

            </div>

        </div>

        `;

        resultInfo.innerHTML = "";

        downloadBtn.style.display = "none";

    }

    reader.readAsDataURL(file);

}
/*==========================================
        Compress Image
==========================================*/

compressBtn.addEventListener("click", () => {

    if (!originalFile) {

        alert("Please upload an image first.");

        return;

    }

    const quality = qualitySlider.value / 100;

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = new Image();

        img.onload = function () {

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            canvas.width = img.width;

            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(

                function (blob) {

                    compressedBlob = blob;

                    const compressedURL = URL.createObjectURL(blob);

                    previewContainer.innerHTML = `

                    <div class="preview-card">

                        <img src="${e.target.result}">

                        <div class="preview-title">

                            Original Image

                        </div>

                        <div class="preview-size">

                            ${(originalFile.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                    </div>

                    <div class="preview-card">

                        <img src="${compressedURL}">

                        <div class="preview-title">

                            Compressed Image

                        </div>

                        <div class="preview-size">

                            ${(blob.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                    </div>

                    `;

                    const saved = (

                        ((originalFile.size - blob.size) /

                            originalFile.size) *

                        100

                    ).toFixed(1);

                    resultInfo.innerHTML = `

                    <div class="result-card">

                        <div class="result-label">

                            Original Size

                        </div>

                        <div class="result-value">

                            ${(originalFile.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                    </div>

                    <div class="result-card">

                        <div class="result-label">

                            Compressed Size

                        </div>

                        <div class="result-value">

                            ${(blob.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                    </div>

                    <div class="result-card">

                        <div class="result-label">

                            Space Saved

                        </div>

                        <div class="result-value">

                            ${saved}%

                        </div>

                    </div>

                    `;

                    downloadBtn.style.display = "block";

                },

                originalFile.type,

                quality

            );

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(originalFile);

});