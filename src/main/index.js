#!/usr/bin/env node

const pkgName = package.name || basename;

module.exports = {
    name: prompt("package name", pkgName),
    version: prompt("version", "0.0.0"),
    description: prompt("description", ""),
    main: prompt("entry point", "index.js"),
    keywords: prompt((s) => { return s.split(/\s+/) }),
    author: prompt("author", "Luis Float <contact@luisfloat.com> (https://luisfloat.com)"),
    license: prompt("license", "UNLICENSED"),
    repository: prompt("github repository url", `github:luisfloat/${pkgName}`),
    homepage: prompt("homepage", `https://github.com/luisfloat/${pkgName}#readme`),
    bugs: prompt("bugs", `https://github.com/luisfloat/${pkgName}/issues`),
};