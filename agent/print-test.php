<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Collection Receipt</title>
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
</head>

<body>

<h2>Collection Receipt</h2>
<p><b>Store:</b> TH JEWELRY CENTRE</p>
<p><b>Agent:</b> Test_Agent</p>
<p><b>Date:</b> 08 Feb 2026</p>
<p><b>Target:</b> 0.00</p>

<h1>HELLO PRINT TEST</h1>
<p>If you see this, printing will work.</p>

<button id="printBtn">Print</button>

<script>
// In your print-test.php
document.addEventListener("DOMContentLoaded", function () {
    const printBtn = document.getElementById("printBtn");
    
    printBtn.addEventListener("click", async function () {
        try {
            // Check if we have the printer bridge
            if (!window.androidPrinter && !window.printerService) {
                alert("Printer service not available");
                return;
            }
            
            // Get assignment data (you can pass this from PHP)
            const assignmentData = {
                store_name: "<?php echo $assignment['store_name']; ?>",
                agent_name: "<?php echo $assignment['agent_name']; ?>",
                date: "<?php echo date('d M Y'); ?>",
                amount_collected: "<?php echo $amount_collected; ?>",
                pending_amount: "<?php echo $pending_amount; ?>",
                target_amount: "<?php echo $assignment['target_amount']; ?>"
            };
            
            // Connect to printer first (you might want to save connection settings)
            await window.printerService.connect({
                type: 'network', // or 'bluetooth'
                ip: '192.168.1.100', // Configure this
                port: 9100
            });
            
            // Print the receipt
            await window.printerService.printReceipt(assignmentData);
            
            alert("Receipt printed successfully!");
            
        } catch (error) {
            console.error("Print error:", error);
            alert("Print failed: " + error.message);
        }
    });
});
</script>

</body>
</html>
