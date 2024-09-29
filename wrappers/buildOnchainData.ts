import { beginCell, Cell } from "ton";
import { Dictionary } from "ton-core";
import { sha256_sync } from "@ton/crypto"

const ONCHAIN_CONTENT_PREFIX = 0x00;

const toKey = (key: string) => {
    const result = BigInt(`0x${sha256_sync(key).toString("hex")}`);
    // console.log(key, result);
    return result;
};


export function buildOnchainMetadata(data: any): Cell {
    let dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    );

    dict.set(toKey('title'), beginCell().storeUint(0, 8).storeStringTail(data.title).endCell());
    dict.set(toKey('description'), beginCell().storeUint(0, 8).storeStringTail(data.description).endCell());
    dict.set(toKey('image'), beginCell().storeUint(0, 8).storeStringTail("https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuna.voicemod.net%2Fsound%2F026950bb-be88-473c-a015-f3ae63758031&psig=AOvVaw3H2pt22K28bjSUqDlbNExT&ust=1727452623134000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJj909L84IgDFQAAAAAdAAAAABAE").endCell());
    
    dict.set(toKey('stream_number'), beginCell().storeUint(0, 8).storeStringTail(data.stream_number).endCell());
    dict.set(toKey('telegram_nickname'), beginCell().storeUint(0, 8).storeStringTail(data.telegram_nickname).endCell());
    
    Object.entries(data).forEach(([key, value]) => {
        dict.set(toKey(key), beginCell().storeUint(0,8).storeStringTail(value as string).endCell());
    });

    return beginCell()
        .storeInt(ONCHAIN_CONTENT_PREFIX, 8)
        .storeDict(dict)
        .endCell();
}