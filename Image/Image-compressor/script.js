/*=========================================
  SmartToolKits Image Compressor
  JS Part 1 - Upload & Preview
=========================================*/

"use strict";

/*========== Elements ==========*/

const imageInput = document.getElementById("imageInput");
const uploadCard = document.getElementById("uploadCard");

const originalPreview = document.getElementById("originalPreview");
const originalPlaceholder = document.getElementById("originalPlaceholder");

const originalSize = document.getElementById("originalSize");
const originalResolution = document.getElementById("originalResolution");
const originalFormat = document.getElementById("originalFormat");

/*========== State ==========*/

let originalFile = null;
let originalImage = null;
let originalImageURL = null;

/*========== Events ==========*/

imageInput.addEventListener("change", handleFileSelection);

uploadCard.addEventListener("dragover", handleDragOver);

uploadCard.addEventListener("dragleave", handleDragLeave);

uploadCard.addEventListener("drop", handleDrop);

/*========== Upload ==========*/

function handleFileSelection(event){

    const file = event.target.files[0];

    if(!file){

        return;

    }

    loadImage(file);

}

/*========== Drag & Drop ==========*/

function handleDragOver(event){

    event.preventDefault();

    uploadCard.classList.add("drag-over");

}

function handleDragLeave(){

    uploadCard.classList.remove("drag-over");

}

function handleDrop(event){

    event.preventDefault();

    uploadCard.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if(!file){

        return;

    }

    loadImage(file);

}

/*========== Load Image ==========*/

function loadImage(file){

    if(!file.type.startsWith("image/")){

        alert("Please select a valid image.");

        return;

    }

    originalFile = file;

    if(originalImageURL){

        URL.revokeObjectURL(originalImageURL);

    }

    originalImageURL = URL.createObjectURL(file);

    originalImage = new Image();

    originalImage.onload = function(){

        showOriginalPreview();

        updateOriginalInfo();

    };

    originalImage.src = originalImageURL;

}

/*========== Preview ==========*/

function showOriginalPreview(){

    originalPreview.src = originalImageURL;

    originalPreview.style.display = "block";

    originalPlaceholder.style.display = "none";

}

/*========== File Info ==========*/

function updateOriginalInfo(){

    originalSize.textContent = formatBytes(originalFile.size);

    originalResolution.textContent =
    `${originalImage.width} × ${originalImage.height}`;

    originalFormat.textContent =
    originalFile.type.replace("image/","").toUpperCase();

}

/*========== Helpers ==========*/

function formatBytes(bytes){

    if(bytes < 1024){

        return bytes + " B";

    }

    if(bytes < 1024 * 1024){

        return (bytes / 1024).toFixed(1) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}
/*=========================================
  JS Part 2A - Quality Slider
=========================================*/

const qualitySlider = document.getElementById("qualitySlider");
const qualityValue = document.getElementById("qualityValue");
const estimatedOutput = document.getElementById("estimatedOutput");

qualitySlider.addEventListener("input", updateQuality);

function updateQuality(){

    const quality = Number(qualitySlider.value);

    qualityValue.textContent = quality + "%";

    updateEstimate();

}

function updateEstimate(){

    if(!originalFile){

        estimatedOutput.textContent = "--";

        return;

    }

    const estimatedBytes = originalFile.size * (qualitySlider.value / 100);

    estimatedOutput.textContent = formatBytes(estimatedBytes);

}

updateQuality();
/*=========================================
  JS Part 2B - Compress Button
=========================================*/

const compressBtn = document.getElementById("compressBtn");

compressBtn.addEventListener("click", startCompression);

async function startCompression(){

    if(!originalImage){

        alert("Please upload an image first.");

        return;

    }

    compressBtn.disabled = true;

    compressBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Compressing...</span>
    `;

    try{

        if(compressionMode==="target"){

            const targetBytes=getTargetBytes();

            if(targetBytes){

                await compressToTarget(targetBytes);

            }else{

                await compressCurrentImage();

            }

        }else{

            await compressCurrentImage();

        }

        updateCompressedPreview();

        updateStatistics();

        downloadBtn.disabled=false;

    }

    catch(error){

        console.error(error);

        alert("Compression failed.");

    }

    finally{

        compressBtn.disabled=false;

        compressBtn.innerHTML=`
            <i class="fa-solid fa-compress"></i>
            <span>Compress Image</span>
        `;

    }

}
/*=========================================
  JS Part 2C - Compression Engine
=========================================*/

const outputFormat = document.getElementById("outputFormat");

let compressedBlob = null;

/*========== Compression ==========*/

async function compressCurrentImage(){

    const quality = Number(qualitySlider.value) / 100;

    compressedBlob = await compressAtQuality(quality);

}

/*========== Output Format ==========*/

function getOutputMimeType(){

    switch(outputFormat.value){

        case "jpeg":

            return "image/jpeg";

        case "png":

            return "image/png";

        case "webp":

            return "image/webp";

        default:

            return originalFile.type;

    }

}
/*=========================================
  JS Part 2D - Compressed Preview
=========================================*/

const compressedPreview = document.getElementById("compressedPreview");
const compressedPlaceholder = document.getElementById("compressedPlaceholder");

const compressedSize = document.getElementById("compressedSize");
const compressedFormat = document.getElementById("compressedFormat");
const savedPercent = document.getElementById("savedPercent");

let compressedImageURL = null;

/*========== Update Preview ==========*/

function updateCompressedPreview(){

    if(!compressedBlob){

        return;

    }

    if(compressedImageURL){

        URL.revokeObjectURL(compressedImageURL);

    }

    compressedImageURL = URL.createObjectURL(compressedBlob);

    compressedPreview.src = compressedImageURL;

    compressedPreview.style.display = "block";

    compressedPlaceholder.style.display = "none";

    compressedSize.textContent = formatBytes(compressedBlob.size);

    compressedFormat.textContent =
    getOutputMimeType()
    .replace("image/","")
    .toUpperCase();

    const saved =
    ((originalFile.size-compressedBlob.size)
/originalFile.size)*100;

    savedPercent.textContent =
    Math.max(0,saved).toFixed(1)+"%";

}
/*=========================================
  JS Part 2E - Download & Reset
=========================================*/

const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

/*========== Download ==========*/

downloadBtn.addEventListener("click", downloadImage);

function downloadImage(){

    if(!compressedBlob){

        return;

    }

    const link = document.createElement("a");

    const downloadURL = URL.createObjectURL(compressedBlob);

    link.href = downloadURL;

    const extension =
    getOutputMimeType().replace("image/","");

    link.download =
    "compressed-image." + extension;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(downloadURL);

}

/*========== Reset ==========*/

resetBtn.addEventListener("click", resetTool);

function resetTool(){

    imageInput.value = "";

    originalFile = null;

    originalImage = null;

    compressedBlob = null;

    estimatedOutput.textContent = "--";

    qualitySlider.value = 80;

    qualityValue.textContent = "80%";

    outputFormat.value = "original";

    originalPreview.removeAttribute("src");

    compressedPreview.removeAttribute("src");

    originalPreview.style.display = "none";

    compressedPreview.style.display = "none";

    originalPlaceholder.style.display = "block";

    compressedPlaceholder.style.display = "block";

    originalSize.textContent = "--";

    originalResolution.textContent = "--";

    originalFormat.textContent = "--";

    compressedSize.textContent = "--";

    compressedFormat.textContent = "--";

    savedPercent.textContent = "0%";

    downloadBtn.disabled = true;

    statOriginal.textContent="0 KB";

statCompressed.textContent="0 KB";

statSaved.textContent="0%";

statRatio.textContent="0%";
}
/*=========================================
  JS Part 3A - Live Statistics
=========================================*/

const statOriginal = document.getElementById("statOriginal");
const statCompressed = document.getElementById("statCompressed");
const statSaved = document.getElementById("statSaved");
const statRatio = document.getElementById("statRatio");

function updateStatistics(){

    if(!originalFile || !compressedBlob){

        return;

    }

    statOriginal.textContent =
    formatBytes(originalFile.size);

    statCompressed.textContent =
    formatBytes(compressedBlob.size);

    const saved =
    ((originalFile.size-compressedBlob.size)
/originalFile.size)*100;

    statSaved.textContent =
    Math.max(saved,0).toFixed(1)+"%";

    const ratio =
    (compressedBlob.size/originalFile.size)*100;

    statRatio.textContent =
    ratio.toFixed(1)+"%";

}
/*=========================================
  JS Part 3B - Output Format
=========================================*/

outputFormat.addEventListener("change", handleFormatChange);

function handleFormatChange(){

    if(!originalFile){

        return;

    }

    const selected = outputFormat.value;

    if(selected === "original"){

        estimatedOutput.textContent =
        formatBytes(
            originalFile.size * (qualitySlider.value / 100)
        );

        return;

    }

    estimateOutput();

}
/*=========================================
  JS Part 4A - Target Size Mode
=========================================*/

const targetSize = document.getElementById("targetSize");
const targetUnit = document.getElementById("targetUnit");

const qualityModeBtn = document.getElementById("qualityModeBtn");
const targetModeBtn = document.getElementById("targetModeBtn");

let compressionMode = "quality";

/*========== Mode Buttons ==========*/

qualityModeBtn.addEventListener("click", () => {

    compressionMode = "quality";

    qualityModeBtn.classList.add("active");
    targetModeBtn.classList.remove("active");

});

targetModeBtn.addEventListener("click", () => {

    compressionMode = "target";

    targetModeBtn.classList.add("active");
    qualityModeBtn.classList.remove("active");

});

/*========== Auto Switch ==========*/

targetSize.addEventListener("input", () => {

    if(targetSize.value.trim() !== ""){

        compressionMode = "target";

        targetModeBtn.classList.add("active");
        qualityModeBtn.classList.remove("active");

    }

});

/*========== Target Bytes ==========*/

function getTargetBytes(){

    if(targetSize.value.trim()===""){

        return null;

    }

    const value = Number(targetSize.value);

    if(isNaN(value) || value<=0){

        return null;

    }

    if(targetUnit.value==="KB"){

        return value*1024;

    }

    return value*1024*1024;

}
/*=========================================
  JS Part 4B - Compression Helpers
=========================================*/

async function compressAtQuality(quality){

    return new Promise((resolve,reject)=>{

        if(!originalImage){

            reject("Image not loaded");

            return;

        }

        const canvas=document.createElement("canvas");

        const ctx=canvas.getContext("2d");

        canvas.width=originalImage.width;

        canvas.height=originalImage.height;

        ctx.drawImage(

            originalImage,

            0,

            0,

            canvas.width,

            canvas.height

        );

        canvas.toBlob(

            blob=>{

                if(blob){

                    resolve(blob);

                }else{

                    reject("Compression failed");

                }

            },

            getOutputMimeType(),

            quality

        );

    });

}
/*=========================================
  JS Part 4C - Binary Search Target Size
=========================================*/

async function compressToTarget(targetBytes){

    let minQuality = 0.05;

    let maxQuality = 1;

    let bestBlob = null;

    let bestDifference = Infinity;

    for(let i = 0; i < 12; i++){

        const quality = (minQuality + maxQuality) / 2;

        const blob = await compressAtQuality(quality);

        const difference = Math.abs(blob.size - targetBytes);

        if(difference < bestDifference){

            bestDifference = difference;

            bestBlob = blob;

        }

        if(blob.size > targetBytes){

            maxQuality = quality;

        }else{

            minQuality = quality;

        }

    }

    compressedBlob = bestBlob;

}