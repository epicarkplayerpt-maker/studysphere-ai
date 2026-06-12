"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) {
        console.warn(`Source folder does not exist: ${from}`);
        return;
    }
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        const stat = fs.lstatSync(fromPath);
        if (stat.isFile()) {
            try {
                fs.copyFileSync(fromPath, toPath);
            }
            catch (err) {
                if (err.code === 'EBUSY' && fs.existsSync(toPath)) {
                    console.warn(`Warning: File ${element} is locked/busy, but already exists in destination. Skipping copy.`);
                }
                else {
                    throw err;
                }
            }
        }
        else if (stat.isDirectory()) {
            copyFolderSync(fromPath, toPath);
        }
    });
}
const srcDir = path.join(__dirname, '../../src/generated/client');
const distDir = path.join(__dirname, '../../dist/generated/client');
console.log(`Copying Prisma Client from ${srcDir} to ${distDir}...`);
copyFolderSync(srcDir, distDir);
console.log('Prisma Client copied to dist successfully.');
