const fileInput = document.getElementById("imageInput");
const convertBtn = document.getElementById("convertBtn");

convertBtn.addEventListener("click", async () => {
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const imgData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });

        const img = new Image();
        img.src = imgData;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (img.height * pageWidth) / img.width;

        if (i > 0) pdf.addPage();

        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    }

    pdf.save("converted.pdf");
});