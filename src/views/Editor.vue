<script>
// const docx2html = require('docx2html')
// import docx2html from "docx2html"
// import {docx2html} from "../plugins/docx2html/index";
import docx4js from "docx4js";
import VueDocumentEditor from "vue-document-editor";

export default {
  name: "Editor",
  components: {
    VueDocumentEditor,
  },
  // mounted() {
  //   const convertorScript = document.createElement("script");
  //   convertorScript.setAttribute(
  //       "src",
  //       "../plugins/convertor/docx2html/docs/index"
  //   );
  //   document.head.appendChild(convertorScript);
  // },
  data() {
    return {
      outputElement: [],
    };
  },
  methods: {
    toggle(el) {
      const dd = el.parentNode.parentNode.lastChild;
      if (dd) {
        dd.style.display = el.innerText == "+" ? "inherit" : "none";
        el.innerText = el.innerText == "+" ? "-" : "+";
      }
    },
    async test(input) {
      const file = input.target.files[0];
      const type = {
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          "pptx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
      }[file.type];
      const module = require("docx4js")[type];
      module.load(file).then(function (doc) {
        input.value = "";
        const element = doc.render((type, props, children) => {
          const hasChild = children && children.length;
          const el = document.createElement("div");
          el.innerHTML = `<dt><i>+</i><span>${type}</span></dt>`;
          if (hasChild) {
            el.append(document.createElement("dd"));
            children.forEach((child) => {
              el.querySelector("dd").append(child);
            });
          }
          return el;
        });

        const container = document.querySelector("#container");
        container.lastChild && container.removeChild(container.lastChild);
        container.appendChild(element);
      });
    },
    convert2Html($event) {
      const file = $event.target.files[0];
      console.log(file);
      const type = {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
      }[file.type];
      docx4js.docx.load(file).then(function (doc) {
        const element = doc.render((type, props, children) => {
          const hasChild = children && children.length;
          const el = document.createElement("dl");
          el.innerHTML = `<dt><i onclick="toggle(this)">+</i><span>${type}</span></dt>`;
          if (hasChild) {
            el.append(document.createElement("dd"));
            children.forEach((child) => {
              el.querySelector("dd").append(child);
            });
          }
          return el;
        });

        this.output;
        // const container = document.querySelector('#container')
        // container.lastChild && container.removeChild(container.lastChild)
        // container.appendChild(element)
      });
    },
  },
};
</script>

<template>
  <div>
    <h2>Select a file(docx/pptx/xlsx) to parse with docx4js</h2>
    <input type="file" @change="test" accept=".docx,.pptx,.xlsx" />
    <div
      id="container"
      style="
        margin: 10px;
        padding: 10px;
        border: 1px solid;
        text-align: left;
        min-height: 500px;
      "
    ></div>
    <div style="font-family: Avenir, sans-serif">
      <vue-document-editor v-model:content="outputElement" />
    </div>
  </div>
</template>

<style scoped>
i {
  cursor: default !important;
  display: inline-block !important;
  width: 10px !important;
}

dd {
  margin-left: 20px;
  display: none !important;
}

dl {
  margin: auto 5px !important;
}
</style>
