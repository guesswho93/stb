import { Address, Cell, beginCell, ContractProvider, Sender, SendMode, toNano } from 'ton-core';

export class CollectionContract {
    private readonly address: Address;

    constructor(collectionCode: Cell, ownerAddress: Address) {
        this.address = new Address(0, collectionCode.hash());
    }

    async deploy(provider: ContractProvider, sender: Sender, collectionCode : Cell) {
        const deployMessage = beginCell()
            .storeAddress(sender.address) 
            .storeRef(collectionCode) 
            .endCell();

        await provider.internal(sender, {
            value: toNano('0.05'), 
            body: deployMessage,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }

    async mint(provider: ContractProvider, sender: Sender, mintData: Array<{ toAddress: Address; stbData: Cell | null }>) {
        const mintMessage = beginCell();
    
        for (const { toAddress, stbData } of mintData) {
            if (!stbData || stbData.toBoc().byteLength === 0) {
                throw new Error("Invalid stbData provided."); 
            }
    
            mintMessage.storeAddress(toAddress);
            mintMessage.storeRef(stbData);
        }
    
        const mintCell = mintMessage.endCell(); 
    
        await provider.internal(sender, {
            value: toNano((0.02 * mintData.length).toString()),
            body: mintCell,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }
    
    

    getAddress(): Address {
        return this.address; 
    }
}
