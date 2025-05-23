import { Injectable, BadRequestException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class LinkedinScraperService {
    private linkedInEmail = process.env.LINKEDIN_EMAIL || ""
    private linkedInPassword = process.env.LINKEDIN_PASSWORD || ""

    async scrapeProfile(linkedinUrl: string) {
        if (!this.linkedInEmail || !this.linkedInPassword) {
            throw new BadRequestException('LinkedIn credentials are not configured');
        }
        console.log("LinkedIn URL to scrape:", linkedinUrl);

        // Debug credentials (partial for security)
        const emailPrefix = this.linkedInEmail.substring(0, 3);
        const emailDomain = this.linkedInEmail.includes('@') ? this.linkedInEmail.substring(this.linkedInEmail.indexOf('@')) : '';
        console.log(`Using LinkedIn email: ${emailPrefix}...${emailDomain}`);
        console.log("Password configured:", this.linkedInPassword ? "Yes" : "No");

        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            defaultViewport: null, // Use default browser viewport
        });

        const page = await browser.newPage();

        // Set a user agent to appear more like a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');

        page.setDefaultNavigationTimeout(60000); // Set timeout to 60 seconds instead of 0

        try {
            console.log("Step 1: Going to LinkedIn login page");
            // 1. Go to login page
            await page.goto('https://www.linkedin.com/login', {
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            console.log('Reached login page, current URL:', page.url());

            // Take screenshot of login page for debugging
            // await page.screenshot({ path: 'linkedin-login-page.png' });

            console.log("Step 2: Entering credentials");
            // 2. Type credentials and login
            await page.type('#username', this.linkedInEmail, { delay: 100 });
            await page.type('#password', this.linkedInPassword, { delay: 100 });

            console.log("Step 3: Clicking login button");
            // Click the login button
            try {
                await page.click('button[type="submit"]');
                console.log("Login button clicked");
            } catch (e) {
                console.log("Failed to click submit button, trying alternate selector");
                await page.click('[type="submit"]');
                console.log("Alternate submit button clicked");
            }

            // Wait for navigation to complete
            console.log("Waiting for navigation after login...");
            await page.waitForNavigation({ timeout: 60000 }) // 
                .catch(e => console.log("Navigation timeout after login, continuing anyway:", e.message));

            console.log('After login, current URL:', page.url());
            // await page.screenshot({ path: 'linkedin-after-login.png' });

            // Check if we're still on the login page
            if (page.url().includes('/login')) {
                console.log('Still on login page - login likely failed');
                // Try to check for error messages
                const errorElement = await page.$('.form__label--error');
                if (errorElement) {
                    const errorText = await page.evaluate(el => el.textContent, errorElement);
                    console.log('Login error:', errorText);
                }
                throw new Error('Login failed - still on login page');
            }

            // Handle security verification or other intermediate screens
            if (page.url().includes('checkpoint') ||
                page.url().includes('add-phone') ||
                page.url().includes('security-verification')) {
                console.log('LinkedIn requires additional verification. Waiting for manual input...');
                // Wait for manual verification to complete (2 minutes max)
                await page.waitForNavigation({ timeout: 120000 })
                    .catch(() => console.log('Manual verification waiting period ended'));
                console.log('After verification, URL:', page.url());
            }

            // 3. Now go to target profile page (with delay to avoid rate limiting)
            console.log("Step 4: Waiting before navigating to profile");
            await new Promise(r => setTimeout(r, 3000)); // 3 second delay
            console.log('Navigating to profile:', linkedinUrl);

            // Navigate directly to the profile URL with a longer timeout
            try {
                await page.goto(linkedinUrl, {
                    waitUntil: 'networkidle2',
                    timeout: 10000 // 20 seconds for profile page
                });
                console.log('Reached profile page, current URL:', page.url());
                // await page.screenshot({ path: 'linkedin-profile-page.png' });
            } catch (e) {
                console.error('Error navigating to profile URL:', e.message);
                // await page.screenshot({ path: 'linkedin-navigation-error.png' });
                // Try once more with a different approach
                console.log('Retrying profile navigation with direct URL...');
                await page.goto(linkedinUrl, { timeout: 60000 });
            }

            // Check if we're actually on the profile page and not redirected elsewhere
            console.log('Checking current URL:', page.url());
            if (!page.url().includes('/in/')) {
                console.log('Not on a profile page. URL contains:', page.url());
                throw new Error('Could not access the LinkedIn profile. Redirected to ' + page.url());
            }

            // 4. Wait for profile page elements with increased timeout
            console.log('Waiting for profile elements to load...');
            await page.waitForSelector('.pv-top-card, .profile-background-image, .text-heading-xlarge', {
                timeout: 60000
            }).catch(e => {
                console.log('Profile selector timeout:', e.message);
                console.log('Continuing anyway to try extraction');
            });

            // 5. Take screenshot for debugging
            // await page.screenshot({ path: 'linkedin-profile-loaded.png' });

            // 6. Extract profile data with more robust selectors
            console.log('Extracting profile data...');
            const data = await page.evaluate(() => {
                // Try multiple possible selectors for each piece of data
                const fullName =
                    document.querySelector('.text-heading-xlarge')?.textContent?.trim() ||
                    document.querySelector('.pv-top-card--list')?.querySelector('h1')?.textContent?.trim() ||
                    document.querySelector('h1.t-24')?.textContent?.trim() ||
                    document.querySelector('.pv-top-card-section__name')?.textContent?.trim() ||
                    'Name not found';

                const headline =
                    document.querySelector('.text-body-medium.break-words')?.textContent?.trim() ||
                    document.querySelector('.pv-top-card-section__headline')?.textContent?.trim() ||
                    document.querySelector('.text-body-small.break-words')?.textContent?.trim() ||
                    'Headline not found';

                const profilePictureElement =
                    document.querySelector('.pv-top-card-profile-picture__image') ||
                    document.querySelector('img.profile-photo-edit__preview') ||
                    document.querySelector('.pv-top-card__photo') ||
                    document.querySelector('.presence-entity__image');

                const profilePicture =
                    profilePictureElement instanceof HTMLImageElement ? profilePictureElement.src :
                        profilePictureElement?.getAttribute('src') ||
                        'Profile picture not found';

                return {
                    fullName,
                    profilePicture,
                    headline,
                };
            });

            console.log('Extracted data:', data);
            await browser.close();
            return data;
        } catch (err) {
            console.error('LinkedIn scraper error:', err);
            // try {
            //     // await page.screenshot({ path: 'linkedin-error.png' });
            //     // console.log('Error screenshot saved to linkedin-error.png');
            // } catch (screenshotErr) {
            //     console.error('Failed to take error screenshot:', screenshotErr);
            // }

            // Check if we're still on the login page
            let currentUrl = 'unknown';
            try {
                currentUrl = page.url();
            } catch (e) {
                console.error('Could not get current URL:', e);
            }
            console.error('Final URL before error:', currentUrl);

            await browser.close();

            // Return default data instead of throwing an error
            return {
                fullName: 'Could not retrieve from LinkedIn',
                profilePicture: null,
                headline: 'Could not retrieve from LinkedIn'
            };
        }
    }
}
