import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

// Directorio que contiene los archivos HTML
const filesHtmlPath = join(import.meta.dirname, '../elements');
const jsonHtmlPath = join(import.meta.dirname, '../src/elements.json');


// Función para leer y procesar archivos HTML
function processHTMLFiles() {
  const files = readdirSync(filesHtmlPath);
  const result = [];

  for (const file of files) {
    const isHtmlFile = !(extname(file).toLowerCase() === '.html')
    if (isHtmlFile) continue

    const filePath = join(filesHtmlPath, file);
    const content = readFileSync(filePath, 'utf8');

    // Usar JSDOM para extraer componente y CSS
    const dom = new JSDOM(content);
    const component = dom.window.document.querySelector('.box')?.outerHTML;
    const css = dom.window.document.querySelector('style').textContent;

    result.push({
      fileName: file,
      component: component,
      css: css,
      fullContent: content
    });
  }

  // Guardar el resultado en un archivo JSON
  const nullReplace = (key, value) => value === undefined ? null : value
  writeFileSync(jsonHtmlPath, JSON.stringify(result, nullReplace, 2), 'utf8');
}

processHTMLFiles();
