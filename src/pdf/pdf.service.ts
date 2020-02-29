import * as appRoot from 'app-root-path';
import * as puppeteer from 'puppeteer';

class PdfService {
    baseUrl = 'http://127.0.0.1:3000/api/v1';

    async payment(paymentId: string): Promise<string> {
        return this.saveAsPdf(`${this.baseUrl}/views/payment/${paymentId}`, 'paiement');
    }

    private async saveAsPdf(url: string, fileName: string): Promise<string> {
        const now = Date.now();
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.pdf({
            path: `${appRoot}/public/${fileName}-${now}.pdf`,
            format: 'A4',
            printBackground: true,
            scale: 0.7
        });
        await browser.close();
        return `${fileName}-${now}.pdf`;
    }
}

export const pdfService = new PdfService();
