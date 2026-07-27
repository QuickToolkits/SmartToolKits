const pdfInput = document.getElementById("pdfInput");
const convertBtn = document.getElementById("convertBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");

convertBtn.addEventListener("click", () => {

    const file = pdfInput.files[0];

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = async function () {

        const typedArray = new Uint8Array(reader.result);

        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        const output = document.getElementById("output");
        output.innerHTML = "";

        const zip = new JSZip();

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

            const page = await pdf.getPage(pageNum);

            const viewport = page.getViewport({
                scale: 2
            });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            output.appendChild(canvas);

            const downloadBtn = document.createElement("button");
            downloadBtn.innerText = `Download Page ${pageNum}`;

            downloadBtn.style.display = "block";
            downloadBtn.style.margin = "10px auto 30px";

            downloadBtn.onclick = () => {

                const format = document.querySelector(
                    'input[name="format"]:checked'
                ).value;

                const link = document.createElement("a");

                if (format === "png") {

                    link.download = `page${pageNum}.png`;
                    link.href = canvas.toDataURL("image/png");

                } else {

                    link.download = `page${pageNum}.jpg`;
                    link.href = canvas.toDataURL("image/jpeg", 1.0);

                }

                link.click();

            };

            output.appendChild(downloadBtn);

            const format = document.querySelector(
                'input[name="format"]:checked'
            ).value;
                        if (format === "png") {

                zip.file(
                    `page${pageNum}.png`,
                    canvas.toDataURL("image/png").split(",")[1],
                    {
                        base64: true
                    }
                );

            } else {

                zip.file(
                    `page${pageNum}.jpg`,
                    canvas.toDataURL("image/jpeg", 1.0).split(",")[1],
                    {
                        base64: true
                    }
                );

            }

        }

        downloadAllBtn.style.display = "inline-block";

        downloadAllBtn.onclick = async () => {

            const content = await zip.generateAsync({
                type: "blob"
            });

            const link = document.createElement("a");

            link.href = URL.createObjectURL(content);

            link.download = "PDF-Images.zip";

            link.click();

            URL.revokeObjectURL(link.href);

        };
            };

    reader.readAsArrayBuffer(file);

});