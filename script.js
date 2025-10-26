// Color Palette Generator
class PaletteGenerator {
    constructor() {
        this.colors = [];
        this.lockedColors = new Set();
        this.init();
    }

    init() {
        this.generatePalette();
        this.setupEventListeners();
    }

    generatePalette() {
        const paletteDiv = document.getElementById('palette');
        paletteDiv.innerHTML = '';

        // Generate 5 colors
        for (let i = 0; i < 5; i++) {
            if (!this.lockedColors.has(i)) {
                this.colors[i] = this.generateRandomColor();
            }
            this.createColorCard(this.colors[i], i);
        }
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
        const lightness = Math.floor(Math.random() * 30) + 40; // 40-70%
        return this.hslToHex(hue, saturation, lightness);
    }

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    createColorCard(color, index) {
        const paletteDiv = document.getElementById('palette');
        const card = document.createElement('div');
        card.className = 'color-card';
        if (this.lockedColors.has(index)) {
            card.classList.add('locked');
        }
        card.style.backgroundColor = color;
        
        const rgb = this.hexToRgb(color);
        const info = document.createElement('div');
        info.className = 'color-info';
        info.innerHTML = `
            <div class="color-hex">${color}</div>
            <div class="color-rgb">RGB(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
        `;
        
        const lockIndicator = document.createElement('div');
        lockIndicator.className = 'lock-indicator';
        lockIndicator.textContent = '🔒';
        
        card.appendChild(info);
        card.appendChild(lockIndicator);
        
        card.addEventListener('click', () => this.toggleLock(index));
        
        paletteDiv.appendChild(card);
    }

    toggleLock(index) {
        if (this.lockedColors.has(index)) {
            this.lockedColors.delete(index);
        } else {
            this.lockedColors.add(index);
        }
        this.generatePalette();
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generatePalette();
        });

        document.getElementById('lockAllBtn').addEventListener('click', () => {
            for (let i = 0; i < 5; i++) {
                this.lockedColors.add(i);
            }
            this.generatePalette();
        });

        document.getElementById('unlockAllBtn').addEventListener('click', () => {
            this.lockedColors.clear();
            this.generatePalette();
        });

        document.getElementById('exportCSSBtn').addEventListener('click', () => {
            this.exportAsCSS();
        });

        document.getElementById('exportJSONBtn').addEventListener('click', () => {
            this.exportAsJSON();
        });

        document.getElementById('exportImageBtn').addEventListener('click', () => {
            this.exportAsImage();
        });

        document.getElementById('copyCodeBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Spacebar to generate new palette
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.generatePalette();
            }
        });
    }

    exportAsCSS() {
        let css = ':root {\n';
        this.colors.forEach((color, index) => {
            css += `  --color-${index + 1}: ${color};\n`;
        });
        css += '}';

        this.showCode(css);
    }

    exportAsJSON() {
        const json = JSON.stringify({
            palette: this.colors.map((color, index) => ({
                name: `color-${index + 1}`,
                hex: color,
                rgb: this.hexToRgb(color)
            }))
        }, null, 2);

        this.showCode(json);
    }

    exportAsImage() {
        // Create a canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Draw colors
        const colorWidth = canvas.width / this.colors.length;
        this.colors.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height);
        });

        // Download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'color-palette.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    showCode(code) {
        const codeOutput = document.getElementById('codeOutput');
        const codeContent = document.getElementById('codeContent');
        codeContent.textContent = code;
        codeOutput.classList.remove('hidden');
        codeOutput.scrollIntoView({ behavior: 'smooth' });
    }

    copyToClipboard() {
        const codeContent = document.getElementById('codeContent');
        navigator.clipboard.writeText(codeContent.textContent).then(() => {
            const btn = document.getElementById('copyCodeBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new PaletteGenerator();
});
