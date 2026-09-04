const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedImages = [];
let pdfBlob = null;

imageInput.addEventListener("change", () => {

    selectedImages = [...imageInput.files];

    showPreview();

});

function showPreview() {

    preview.innerHTML = "";

    if (selectedImages.length === 0) return;

    selectedImages.forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const card = document.createElement("div");
            card.className = "preview-card";

            card.innerHTML = `
                <img src="${e.target.result}" alt="Preview">

                <p>
                    ${index + 1}. ${file.name}
                </p>
            `;

            preview.appendChild(card);

        };

        reader.readAsDataURL(file);

    });

}
convertBtn.addEventListener("click", async () => {

    if (selectedImages.length === 0) {

        alert("Please select at least one image.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    for (let i = 0; i < selectedImages.length; i++) {

        const file = selectedImages[i];

        const imageData = await readFile(file);

        const img = await loadImage(imageData);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const ratio = Math.min(
            pageWidth / img.width,
            pageHeight / img.height
        );

        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (i !== 0) {

            pdf.addPage();

        }

        pdf.addImage(
            imageData,
            "JPEG",
            x,
            y,
            imgWidth,
            imgHeight
        );

    }

    pdfBlob = pdf;

    downloadBtn.style.display = "inline-block";

    alert("PDF Created Successfully!");

});

function readFile(file) {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target.result);

        reader.readAsDataURL(file);

    });

}

function loadImage(src) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.src = src;

    });

}
downloadBtn.addEventListener("click", () => {

    if (pdfBlob) {

        pdfBlob.save("SmartToolKits_Image_to_PDF.pdf");

    }

});