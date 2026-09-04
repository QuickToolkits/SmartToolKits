/* ==================================================
   SMARTTOOLKITS
   UNIVERSAL IMAGE CONVERTER
   PART 1
================================================== */


/* ==================================================
   DOM ELEMENTS
================================================== */


/* Upload */

const imageInput =
    document.getElementById("imageInput");


/* Preview */

const originalPreview =
    document.getElementById("originalPreview");

const convertedPreview =
    document.getElementById("convertedPreview");


const originalPlaceholder =
    document.getElementById("originalPlaceholder");

const convertedPlaceholder =
    document.getElementById("convertedPlaceholder");


/* Information */

const originalResolution =
    document.getElementById("originalResolution");

const originalSize =
    document.getElementById("originalSize");

const originalFormat =
    document.getElementById("originalFormat");


const convertedResolution =
    document.getElementById("convertedResolution");

const convertedSize =
    document.getElementById("convertedSize");

const convertedFormat =
    document.getElementById("convertedFormat");


/* Settings */

const formatSelect =
    document.getElementById("formatSelect");

const qualitySlider =
    document.getElementById("qualitySlider");

const qualityValue =
    document.getElementById("qualityValue");

const backgroundColor =
    document.getElementById("backgroundColor");

const keepMetadata =
    document.getElementById("keepMetadata");


/* Buttons */

const convertBtn =
    document.getElementById("convertBtn");

const downloadBtn =
    document.getElementById("downloadBtn");


/* Stats */

const statFormat =
    document.getElementById("statFormat");

const statResolution =
    document.getElementById("statResolution");

const statSize =
    document.getElementById("statSize");


/* ==================================================
   GLOBAL STATE
================================================== */

let originalFile = null;

let originalImage = null;

let convertedBlob = null;

let convertedURL = null;


/* Current Image */

let imageWidth = 0;

let imageHeight = 0;


/* Output */

let outputMimeType = "image/png";


/* ==================================================
   INITIAL STATE
================================================== */

convertBtn.disabled = true;

downloadBtn.disabled = true;


/* ==================================================
   QUALITY LABEL
================================================== */

qualitySlider.addEventListener("input", () => {

    qualityValue.textContent =
        `${qualitySlider.value}%`;

});
/* ==================================================
   PART 2
   IMAGE UPLOAD
================================================== */

imageInput.addEventListener("change", handleImageUpload);


/* ==================================================
   HANDLE IMAGE
================================================== */

function handleImageUpload(event){

    const file = event.target.files[0];

    if(!file) return;


    /* =========================
       VALIDATION
    ========================= */

    if(!file.type.startsWith("image/")){

        alert("Please select a valid image.");

        imageInput.value="";

        return;

    }


    originalFile=file;


    /* Remove old preview */

    if(convertedURL){

        URL.revokeObjectURL(convertedURL);

        convertedURL=null;

    }

    convertedBlob=null;


    /* =========================
       LOAD IMAGE
    ========================= */

    const reader=new FileReader();

    reader.onload=function(e){

        const img=new Image();

        img.onload=function(){

            originalImage=img;

            imageWidth=img.naturalWidth;

            imageHeight=img.naturalHeight;


            /* Preview */

            originalPreview.src=e.target.result;

            originalPreview.style.display="block";

            originalPlaceholder.style.display="none";


            /* Information */

            originalResolution.textContent=

                `${imageWidth} × ${imageHeight}`;

            originalSize.textContent=

                formatFileSize(file.size);

            originalFormat.textContent=

                detectFormat(file.type);


            /* Reset output */

            resetOutput();


            /* Enable Convert */

            convertBtn.disabled=false;

        };

        img.src=e.target.result;

    };

    reader.readAsDataURL(file);

}


/* ==================================================
   FORMAT DETECTION
================================================== */

function detectFormat(type){

    switch(type){

        case "image/jpeg":

            return "JPG";

        case "image/png":

            return "PNG";

        case "image/webp":

            return "WEBP";

        case "image/avif":

            return "AVIF";

        case "image/bmp":

            return "BMP";

        case "image/gif":

            return "GIF";

        case "image/tiff":

            return "TIFF";

        case "image/x-icon":

        case "image/vnd.microsoft.icon":

            return "ICO";

        default:

            return "IMAGE";

    }

}


/* ==================================================
   FILE SIZE
================================================== */

function formatFileSize(bytes){

    if(bytes<1024){

        return bytes+" Bytes";

    }

    if(bytes<1024*1024){

        return (bytes/1024).toFixed(1)+" KB";

    }

    return (bytes/1024/1024).toFixed(2)+" MB";

}


/* ==================================================
   RESET OUTPUT
================================================== */

function resetOutput(){

    convertedPreview.removeAttribute("src");

    convertedPreview.style.display="none";

    convertedPlaceholder.style.display="flex";


    convertedResolution.textContent="0 × 0";

    convertedSize.textContent="0 KB";

    convertedFormat.textContent="—";


    statFormat.textContent="—";

    statResolution.textContent="0 × 0";

    statSize.textContent="0 KB";


    downloadBtn.disabled=true;

}
/* ==================================================
   PART 3
   CONVERT IMAGE
================================================== */

convertBtn.addEventListener(
    "click",
    convertImage
);

async function convertImage(){

    if(!originalImage) return;


    convertBtn.disabled=true;

    convertBtn.innerHTML=

        `<i class="fa-solid fa-spinner fa-spin"></i>
         Converting...`;


    try{

        const canvas=
            document.createElement("canvas");

        const ctx=
            canvas.getContext("2d");


        canvas.width=imageWidth;
        canvas.height=imageHeight;


        /* =====================================
           OUTPUT FORMAT
        ===================================== */

        const format=
            formatSelect.value.toLowerCase();


        switch(format){

            case "jpg":
            case "jpeg":

                outputMimeType="image/jpeg";

                break;

            case "png":

                outputMimeType="image/png";

                break;

            case "webp":

                outputMimeType="image/webp";

                break;

            case "avif":

                outputMimeType="image/avif";

                break;

            case "bmp":

                outputMimeType="image/bmp";

                break;

            case "tiff":

                outputMimeType="image/tiff";

                break;

            case "ico":

                outputMimeType="image/x-icon";

                break;

            default:

                outputMimeType="image/png";

        }


        /* =====================================
           JPG BACKGROUND
        ===================================== */

        if(outputMimeType==="image/jpeg"){

            ctx.fillStyle=

                backgroundColor.value;

            ctx.fillRect(

                0,
                0,

                canvas.width,

                canvas.height

            );

        }


        /* =====================================
           DRAW IMAGE
        ===================================== */

        ctx.drawImage(

            originalImage,

            0,
            0,

            canvas.width,

            canvas.height

        );


        /* =====================================
           QUALITY
        ===================================== */

        const quality=

            qualitySlider.value/100;


        /* =====================================
           EXPORT
        ===================================== */

        canvas.toBlob(

            function(blob){

                if(!blob){

                    alert(

                        "This image format is not supported by your browser."

                    );

                    resetConvertButton();

                    return;

                }

                convertedBlob=blob;

                showConvertedImage(blob);

            },

            outputMimeType,

            quality

        );

    }

    catch(error){

        console.error(error);

        alert(

            "Conversion failed."

        );

        resetConvertButton();

    }

}
/* ==================================================
   PART 4
   SHOW CONVERTED IMAGE
================================================== */

function showConvertedImage(blob){

    /* Remove old preview */

    if(convertedURL){

        URL.revokeObjectURL(convertedURL);

    }

    convertedURL = URL.createObjectURL(blob);


    /* =========================
       SHOW PREVIEW
    ========================= */

    convertedPreview.src = convertedURL;

    convertedPreview.style.display = "block";

    convertedPlaceholder.style.display = "none";


    /* =========================
       IMAGE LOADED
    ========================= */

    convertedPreview.onload = function(){

        convertedResolution.textContent =
            `${convertedPreview.naturalWidth} × ${convertedPreview.naturalHeight}`;

        convertedSize.textContent =
            formatFileSize(blob.size);

        convertedFormat.textContent =
            detectFormat(outputMimeType);


        /* Stats */

        statFormat.textContent =
            detectFormat(outputMimeType);

        statResolution.textContent =
            `${convertedPreview.naturalWidth} × ${convertedPreview.naturalHeight}`;

        statSize.textContent =
            formatFileSize(blob.size);


        downloadBtn.disabled = false;

        resetConvertButton();

    };

}


/* ==================================================
   RESET BUTTON
================================================== */

function resetConvertButton(){

    convertBtn.disabled = false;

    convertBtn.innerHTML =

    `<i class="fa-solid fa-arrows-rotate"></i>
     Convert Image`;

}


/* ==================================================
   DOWNLOAD
================================================== */

downloadBtn.addEventListener(
    "click",
    downloadImage
);


function downloadImage(){

    if(!convertedBlob) return;


    const link =
        document.createElement("a");


    link.href = convertedURL;


    const format =
        formatSelect.value.toLowerCase();


    const fileName =

        originalFile.name.replace(

            /\.[^/.]+$/,

            ""

        );


    link.download =

        `${fileName}-converted.${format}`;


    document.body.appendChild(link);

    link.click();

    link.remove();

}