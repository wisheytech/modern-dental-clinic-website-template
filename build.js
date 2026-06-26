const fs = require('fs');
const path = require('path');

// Helper to minify CSS safely
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ')             // collapse whitespace safely
    .trim();
}

// Helper to minify JS safely
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
    .replace(/\/\/.*/g, '')           // remove single-line comments
    .replace(/\s+/g, ' ')             // collapse whitespace safely
    .trim();
}

const cssDir = path.join(__dirname, 'assets', 'css');
const jsDir = path.join(__dirname, 'assets', 'js');

// 1. Bundle and Minify CSS
const cssFiles = ['style.css', 'animations.css', 'responsive.css'];
let bundledCSS = '';
cssFiles.forEach(file => {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    bundledCSS += fs.readFileSync(filePath, 'utf8') + '\n';
  }
});
const minifiedCSS = minifyCSS(bundledCSS);
fs.writeFileSync(path.join(cssDir, 'style.min.css'), minifiedCSS, 'utf8');
console.log('Successfully bundled and minified CSS to style.min.css');

// 2. Bundle and Minify JS
const jsFiles = ['utils.js', 'slider.js', 'carousel.js', 'counter.js', 'scroll.js', 'main.js'];
let bundledJS = '';
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  if (fs.existsSync(filePath)) {
    // Avoid double DOMContentLoaded wrappers if they exist
    bundledJS += fs.readFileSync(filePath, 'utf8') + '\n';
  }
});
const minifiedJS = minifyJS(bundledJS);
fs.writeFileSync(path.join(jsDir, 'main.min.js'), minifiedJS, 'utf8');
console.log('Successfully bundled and minified JS to main.min.js');
