// app.js

async function loadSvg() {
  const response = await fetch('img/certificate-template.svg');
  return await response.text();
}

function replacePlaceholders(svgContent, values) {
  return svgContent.replace(/{\w+}/g, function(match) {
    return values[match.slice(1, -1)] || match;
  });
}

function generateCertificate() {
  const recipientName = document.getElementById('recipient').value;
  const achievement = document.getElementById('achievement').value;
  const certificateId = document.getElementById('certificateId').value;
  const certificateDate = document.getElementById('certificateDate').value;

  // Load SVG and manipulate content
  loadSvg().then(svgContent => {
    const values = {
      recipientName: recipientName,
      achievement: achievement,
      certificateId: certificateId,
      certificateDate: certificateDate,
      // add more key-value pairs if needed
    };

    document.getElementById('certificate-container').innerHTML = replacePlaceholders(svgContent, values);
  });
}

function getSvgViewBoxDimensions(svgElement){
  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) {
    let [x, y, w, h] = viewBox.split(' ').map(Number);
    return [x, y, w, h];
  } else {
    return [0, 0, 843, 596];
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  const certificateContainer = document.getElementById('certificate-container');
  const downloadBtn = document.getElementById('download-pdf');

  downloadBtn.addEventListener('click', () => {
    const svgElement = certificateContainer.querySelector('svg');
    const [x, y, originalWidth, originalHeight] = getSvgViewBoxDimensions(svgElement);
    console.log(`Original width: ${originalWidth}, height: ${originalHeight}`);

    certificateContainer.style.width = `${originalWidth}px`;
    certificateContainer.style.height = `${originalHeight}px`;

    html2canvas(certificateContainer, { width: originalWidth, height: originalHeight}).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const {jsPDF} = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [originalWidth, originalHeight]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, originalWidth, originalHeight);
      pdf.save('certificate.pdf');
    }).catch(error => console.error('Error generating PDF', error));
  });
});
