const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ status: res.statusCode, data: data });
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function verifyWebsite() {
    try {
        console.log('Testing Website Improvements...\n');
        const response = await makeRequest('/');

        if (response.status !== 200) {
            console.log('❌ Failed to load index.html: HTTP ' + response.status);
            process.exit(1);
        }

        console.log('✅ index.html loaded successfully\n');

        // Check for improvements
        const checks = [
            { pattern: /aria-label="Toggle navigation menu"/, name: 'Hamburger accessibility (aria-label)' },
            { pattern: /aria-expanded="false"/, name: 'Hamburger accessibility (aria-expanded)' },
            { pattern: /data-section="home"/, name: 'Nav links use data-section attributes' },
            { pattern: /class="page-panel"/, name: 'Page panels exist' },
            { pattern: /role="dialog"/, name: 'Modal accessibility (role="dialog")' },
            { pattern: /aria-modal="true"/, name: 'Modal accessibility (aria-modal)' },
            { pattern: /&mdash;/, name: 'HTML entities (em dashes)' },
            { pattern: /&amp;/, name: 'HTML entities (ampersands)' },
            { pattern: /aria-label="Four Marketeers/, name: 'Logo link accessibility' }
        ];

        let allPassed = true;
        checks.forEach(check => {
            if (check.pattern.test(response.data)) {
                console.log('✅ ' + check.name);
            } else {
                console.log('❌ ' + check.name);
                allPassed = false;
            }
        });

        console.log('\n');

        // Check CSS
        const cssResponse = await makeRequest('/styles.css');
        if (cssResponse.status === 200) {
            const cssChecks = [
                { pattern: /--color-accent:\s*#0066FF/, name: 'CSS variable --color-accent defined' },
                { pattern: /body\.panel-open/, name: 'CSS rule for preventing body scroll' },
                { pattern: /@media \(prefers-reduced-motion/, name: 'Prefers-reduced-motion support' },
                { pattern: /\.page-panel\.panel-active/, name: 'Panel animation styles' },
                { pattern: /focus-visible/, name: 'Focus-visible styles' }
            ];

            cssChecks.forEach(check => {
                if (check.pattern.test(cssResponse.data)) {
                    console.log('✅ ' + check.name);
                } else {
                    console.log('❌ ' + check.name);
                    allPassed = false;
                }
            });
        }

        console.log('\n');

        // Check JS
        const jsResponse = await makeRequest('/script.js');
        if (jsResponse.status === 200) {
            const jsChecks = [
                { pattern: /function openPanel/, name: 'Panel open function' },
                { pattern: /function closePanel/, name: 'Panel close function' },
                { pattern: /initializeFromHash/, name: 'Deep linking support' },
                { pattern: /panel-open/, name: 'Body scroll prevention' },
                { pattern: /if \(e\.key === 'Escape'/, name: 'Escape key handler' },
                { pattern: /updateUrl/, name: 'URL update function' },
                { pattern: /getAttribute\('data-section'\)/, name: 'Data-section attribute reading' }
            ];

            jsChecks.forEach(check => {
                if (check.pattern.test(jsResponse.data)) {
                    console.log('✅ ' + check.name);
                } else {
                    console.log('❌ ' + check.name);
                    allPassed = false;
                }
            });
        }

        console.log('\n');

        if (allPassed) {
            console.log('✅ ALL IMPROVEMENTS VERIFIED');
            process.exit(0);
        } else {
            console.log('❌ SOME CHECKS FAILED');
            process.exit(1);
        }
    } catch (error) {
        console.log('❌ Error: ' + error.message);
        process.exit(1);
    }
}

// Wait for server, then verify
setTimeout(verifyWebsite, 500);
