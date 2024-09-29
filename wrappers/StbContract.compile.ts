import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/stb_contract.fc'],
};

export const compileCollection: CompilerConfig = {
    lang: 'func',
    targets: [
        'contracts/collection_contract.fc',
    ],
};
