import "./styles.css";
import loader from "@monaco-editor/loader";
import { emmetHTML } from "emmet-monaco-es";

// Write Javascript code!
// const appDiv = document.getElementById('app');
// Initial data
const HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
</head>
<body>
   <div class="p-4">
   <div class="alert alert-warning" role="alert">
      Bootstrap 5 CSS injected
   </div>

   <div class="card">
      <div class="card-body">
         <h5 class="card-title">Special title treatment</h5>
         <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
         <a href="https://triputra-ard.vercel.app" class="btn btn-primary">Go somewhere</a>
      </div>
   </div>
</div>
</body>
</html>
`;
const CSS_LINKS = [
  `https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css`,
];

// Elements
const editorCode = document.getElementById("editorCode");
const editorPreview =
  document.getElementById("editorPreview").contentWindow.document;
const editorCopyButton = document.getElementById("editorCopyClipboard");
const editorFormatter = document.getElementById("formatter");

// <iframe> inject CSS
CSS_LINKS.forEach((linkURL) => {
  const link = document.createElement("link");
  link.href = linkURL;
  link.rel = "stylesheet";
  editorPreview.head.appendChild(link);
});

// Monaco loader
// loader.config({
//   paths: { vs: './node_modules/monaco-editor/min/vs' },
// });

loader.init().then((monaco) => {
  createEditor(editorCode);
  emmetHTML();
});

function createEditor(editorContainer) {
  let editor = monaco.editor.create(editorContainer, {
    value: HTML_CODE,
    language: "html",
    minimap: { enabled: true },
    autoIndent: true,
    formatOnPaste: true,
    formatOnType: true,
    automaticLayout: true,
    contextmenu: false,
    fontSize: 12,
    theme: "vs-light",
    scrollbar: {
      useShadows: false,
      vertical: "visible",
      horizontal: "visible",
      horizontalScrollbarSize: 12,
      verticalScrollbarSize: 12,
    },
  });

  //   emmetHTML(editor);
  editorPreview.body.innerHTML = HTML_CODE;

  editor.onDidChangeModelContent(() => {
    editorPreview.body.innerHTML = editor.getValue();
  });

  setTimeout(() => {
    editor.getAction("editor.action.formatDocument").run();
    editor.trigger("anyString", "editor.action.formatDocument");
  }, 1000);

  editorFormatter.onclick = () => {
    editor.getAction("editor.action.formatDocument").run();
  };
  editorCopyButton.onclick = () => {
    console.log(editor.getValue());
    copyToClipboard(editor.getValue());
    const editorCopyButtonText = editorCopyButton.innerHTML;
    editorCopyButton.innerHTML = "Copied!";
    editorCopyButton.disabled = true;
    setTimeout(() => {
      editorCopyButton.disabled = false;
      editorCopyButton.innerHTML = editorCopyButtonText;
    }, 500);
  };
}

function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
