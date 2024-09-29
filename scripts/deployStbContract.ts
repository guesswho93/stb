import { toNano } from '@ton/core';
import { StbContract } from '../wrappers/StbContract';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const stbContract = provider.open(StbContract.createFromConfig({}, await compile('StbContract')));

    await stbContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stbContract.address);

    // run methods on `stbContract`
}
