import BN from 'bn.js';

import { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } from 'ethers/utils'

export function getDomainTypeHash() {
    return keccak256(
        toUtf8Bytes('EIP712Domain(string name,uint256 chainId,address verifyingContract)')
    );
}

export function getDelegationTypeHash() {
    return keccak256(
        toUtf8Bytes('Delegation(address delegatee,uint256 nonce,uint256 expiry)')
    );
}

export function getDomainSeparator(bullAddress: string, name: string) {
    return keccak256(
        defaultAbiCoder.encode(
            ['bytes32', 'bytes32', 'uint256', 'address'],
            [
                getDomainTypeHash(),
                keccak256(toUtf8Bytes(name)),
                1,
                bullAddress
            ]
        )
    );
}

export function getStructHash(delegatee: string, nonce: string, expiry: string) {
    return keccak256(
        defaultAbiCoder.encode(
            ['bytes32', 'address', 'uint256', 'uint256'],
            [
                getDelegationTypeHash(),
                delegatee,
                nonce,
                expiry
            ]
        )
    );
}

export function nowInSeconds(addedSeconds: number) :BN {
    return new BN(Math.round(Date.now() / 1000) + addedSeconds);
}

export async function getDigest(
    domainSeparator: string,
    structHash: string,
): Promise<string> {
    return keccak256(
        solidityPack(
            ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
            ['0x19', '0x01', domainSeparator, structHash]
        )
    );
}