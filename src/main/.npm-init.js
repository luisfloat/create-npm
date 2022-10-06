const prompts = require("./prompts");

function genInitObjFromPrompts() {
    const init = {};
    
    for(let k in prompts) {
        const p = prompts[k];
        init[k] = prompt(p.message, p.def || p.default, p.filter);
    }

    return init;
}

module.exports = genInitObjFromPrompts();