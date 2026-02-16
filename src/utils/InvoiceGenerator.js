
export const generateInvoice = (order) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice #${(order._id || order.id).slice(-6).toUpperCase()}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                .company-name { font-size: 28px; font-weight: bold; letter-spacing: -1px; }
                .invoice-title { font-size: 24px; color: #666; font-weight: 300; }
                
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                .info-box h3 { font-size: 14px; text-transform: uppercase; color: #999; margin: 0 0 10px 0; letter-spacing: 1px; }
                .info-box p { margin: 0; line-height: 1.6; font-size: 15px; }
                
                 table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                th { text-align: left; padding: 15px; border-bottom: 2px solid #eee; font-size: 14px; text-transform: uppercase; color: #666; }
                td { padding: 15px; border-bottom: 1px solid #eee; font-size: 15px; }
                td:last-child, th:last-child { text-align: right; }
                
                .totals { display: flex; justify-content: flex-end; }
                .totals-box { width: 300px; }
                .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
                .grand-total { border-top: 2px solid #333; padding-top: 15px; font-weight: bold; font-size: 18px; margin-top: 10px; }
                
                .footer { margin-top: 60px; text-align: center; color: #999; font-size: 13px; border-top: 1px solid #eee; padding-top: 20px; }
                
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <div class="company-name">KICKS<span style="color: #3b82f6;">.</span></div>
                <div class="invoice-title">INVOICE</div>
            </div>

            <div class="info-grid">
                <div class="info-box">
                    <h3>Billed To</h3>
                    <p><strong>${order.customer}</strong></p>
                    ${order.email ? `<p>${order.email}</p>` : ''}
                    <p>123 Fashion Street, Suite 404</p>
                    <p>Mumbai, MH 400001</p>
                </div>
                <div class="info-box">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> #${(order._id || order.id).slice(-6).toUpperCase()}</p>
                    <p><strong>Date:</strong> ${formatDate(order.date || order.createdAt)}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod || 'Cash on Delivery'}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th width="50%">Item Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                <strong>${item.name}</strong><br>
                                <span style="font-size: 13px; color: #777;">Size: ${item.size}</span>
                            </td>
                            <td>${item.quantity}</td>
                            <td>${formatPrice(item.price)}</td>
                            <td>${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="totals">
                <div class="totals-box">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>${formatPrice((order.amount || 0) + (order.discount || 0))}</span>
                    </div>
                    ${order.discount > 0 ? `
                        <div class="total-row" style="color: #10b981;">
                            <span>Discount (${order.coupon || 'Promo'})</span>
                            <span>-${formatPrice(order.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="total-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Total Due</span>
                        <span>${formatPrice(order.amount)}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for shopping with KICKS.</p>
                <p>For support, email support@kicks.com or call +91-123-456-7890</p>
            </div>

            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    } else {
        alert("Please allow pop-ups to view the invoice.");
    }
};
