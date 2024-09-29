import { Blockchain } from '@ton-community/sandbox';
import { compile } from '@ton-community/blueprint';
import { beginCell, Address, Cell } from 'ton-core';
import { Sender, SenderArguments } from 'ton-core'; 
import { CollectionContract } from '../wrappers/CollectionContract';

describe('STB Minting', () => {
    let blockchain: Blockchain;
    let owner: any;
    let user1: any;
    let user2: any;
    let collection: CollectionContract;
    let collectionCode: Cell;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        owner = await blockchain.treasury('owner');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');

        collectionCode = await compile('/STBContract'); 
        collection = new CollectionContract(collectionCode, owner.address);
    });

    it('should mint multiple STBs', async () => {
        const send: Sender = {
            address: owner.address,
            send: async (args: SenderArguments) => {
                const { to, value, init } = args;
                await owner.send({
                    to: to as Address,
                    value: BigInt(value), 
                    init: init, 
                });
            },
        };

        await collection.deploy(blockchain.provider(owner.address), send, collectionCode);

        const stbData1 = beginCell().storeBuffer(Buffer.from('STB Data 1')).endCell();
        const stbData2 = beginCell().storeBuffer(Buffer.from('STB Data 2')).endCell();

        const mintData = [
            { toAddress: user1.address, stbData: stbData1 },
            { toAddress: user2.address, stbData: stbData2 },
        ];
        
        await collection.mint(blockchain.provider(owner.address), send, mintData);
    });

    it('should mint another STB for the same user', async () => {
        const send: Sender = {
            address: owner.address,
            send: async (args: SenderArguments) => {
                const { to, value, init } = args;
                await owner.send({
                    to: to as Address,
                    value: BigInt(value), 
                    init: init, 
                });
            },
        };

        const stbData3 = beginCell().storeBuffer(Buffer.from('STB Data 3')).endCell();

        const mintData = [
            { toAddress: user1.address, stbData: stbData3 },
        ];
        
        await collection.mint(blockchain.provider(owner.address), send, mintData);
    });


    it('should not mint STB without valid stbData', async () => {
    const send: Sender = {
        address: owner.address,
        send: async (args: SenderArguments) => {
            const { to, value, init } = args;
            await owner.send({
                to: to as Address,
                value: BigInt(value), 
                init: init, 
            });
        },
    };

    const mintData = [
        { toAddress: user1.address, stbData: null }, 
    ];

    await expect(collection.mint(blockchain.provider(owner.address), send, mintData)).rejects.toThrow("Invalid stbData provided.");
});

});

