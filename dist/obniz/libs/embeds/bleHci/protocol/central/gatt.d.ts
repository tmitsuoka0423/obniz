/// <reference types="node" />
export = Gatt;
declare const Gatt_base: typeof import("events").EventEmitter;
declare class Gatt extends Gatt_base {
    constructor(address: any, aclStream: any);
    _address: any;
    _aclStream: any;
    _services: {};
    _characteristics: {};
    _descriptors: {};
    _currentCommand: any;
    _commandQueue: any[];
    _mtu: number;
    _security: string;
    onAclStreamDataBinded: (cid: any, data: any) => void;
    onAclStreamEncryptBinded: (encrypt: any) => void;
    onAclStreamEncryptFailBinded: () => void;
    onAclStreamEndBinded: () => void;
    onAclStreamData(cid: any, data: any): void;
    onAclStreamEncrypt(encrypt: any): void;
    onAclStreamEncryptFail(): void;
    onAclStreamEnd(): void;
    writeAtt(data: any): void;
    errorResponse(opcode: any, handle: any, status: any): Buffer;
    _queueCommand(buffer: any, callback: any, writeCallback: any): void;
    mtuRequest(mtu: any): Buffer;
    readByGroupRequest(startHandle: any, endHandle: any, groupUuid: any): Buffer;
    readByTypeRequest(startHandle: any, endHandle: any, groupUuid: any): Buffer;
    readRequest(handle: any): Buffer;
    readBlobRequest(handle: any, offset: any): Buffer;
    findInfoRequest(startHandle: any, endHandle: any): Buffer;
    writeRequest(handle: any, data: any, withoutResponse: any): Buffer;
    prepareWriteRequest(handle: any, offset: any, data: any): Buffer;
    executeWriteRequest(handle: any, cancelPreparedWrites: any): Buffer;
    handleConfirmation(): Buffer;
    exchangeMtu(mtu: any): void;
    discoverServices(uuids: any): void;
    discoverIncludedServices(serviceUuid: any, uuids: any): void;
    discoverCharacteristics(serviceUuid: any, characteristicUuids: any): void;
    read(serviceUuid: any, characteristicUuid: any): void;
    write(serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;
    longWrite(serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;
    broadcast(serviceUuid: any, characteristicUuid: any, broadcast: any): void;
    notify(serviceUuid: any, characteristicUuid: any, notify: any): void;
    discoverDescriptors(serviceUuid: any, characteristicUuid: any): void;
    readValue(serviceUuid: any, characteristicUuid: any, descriptorUuid: any): void;
    writeValue(serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): void;
    readHandle(handle: any): void;
    writeHandle(handle: any, data: any, withoutResponse: any): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    on(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    once(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    off(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    removeAllListeners(event?: string | symbol | undefined): Gatt;
    setMaxListeners(n: number): Gatt;
}
