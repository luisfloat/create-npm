#!/usr/bin/env node

const colorette = require("colorette");
const { cyan } = colorette;
const inquirer = require("inquirer");
const { readPkg, writePkg } = require("./pkg.js");
const prompts = require("./prompts.js");

const pkg = readPkg();

const input = async (name, message, def) => (await inquirer.prompt({
    type: "input",
    name,
    message: message + ":",
    filter: prompts[name].filter,
    default: (prompts[name].default && prompts[name].default(pkg[name])) || pkg[name] || def,
}))[name];
const confirm = async () => {
    const prompt = await inquirer.prompt({
        type: "confirm",
        default: true,
        name: "confirm",
        message: "Is this OK?",
    });

    return prompt.confirm;
}

async function genPkgFromInputs() {
    const newPkg = { ...pkg };
    
    for(let k in prompts) {
        const p = prompts[k];
        newPkg[k] = await input(k, p.message, p.def);
    }

    return newPkg;
}

async function run() {
    const newPkg = await genPkgFromInputs(); 
    const json = JSON.stringify(newPkg, null, 2);
    
    console.log(cyan(`${json}`));

    if(await confirm()) {
        writePkg(json);
        return;
    }

    console.log("Aborted.");
}

run();