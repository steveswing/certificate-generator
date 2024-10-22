// script.js

document.addEventListener('DOMContentLoaded', (event) => {
  const certificateContainer = document.getElementById('certificate-container');
  const downloadBtn = document.getElementById('download-pdf');

  // Function to fill the certificate with dynamic data
  function fillCertificate(name, description, certId, date) {
    document.getElementById('cert-name').textContent = name;
    document.getElementById('cert-description').textContent = description;
    document.getElementById('cert-id').textContent = certId;
    document.getElementById('cert-date').textContent = date;
  }

  // Example data, replace with actual data
  const name = "Jane Doe";
  const description = "Completion of Advanced Programming Course";
  const certId = "C123456789";
  const date = new Date().toLocaleDateString();

  fillCertificate(name, description, certId, date);

  downloadBtn.addEventListener('click', () => {
    html2canvas(certificateContainer).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const {jsPDF} = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1000, 700]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
      pdf.save('certificate.pdf');
    }).catch(error => console.error('Error generating PDF', error));
  });
});
