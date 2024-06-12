

let editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/s-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
});


let input = document.getElementById("input");
let output = document.getElementById("output");
let run = document.getElementById("run");
let option = document.getElementById("option");



option.addEventListener("change", () => {
    if (option.value == "Java") {
            
        editor.setOption("mode", "text/x-java")
    }
    else if (option.value == "python") {
        editor.setOption("mode", "text/x-python")
    }
    else if(option.value == "C++"){
        editor.setOption("mode", "text/x-c++src")
    }
});

let code = run.addEventListener("click", async () => {
    code = {
        code: editor.getValue(),
        input: input.value,
        lang: option.value
    }
    console.log(code)
    let oData = await fetch("http://localhost:4000/:username/:subject/assignments/:id/compile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(code)
    })
    let d = await oData.json()
    output.value = d.output
});

