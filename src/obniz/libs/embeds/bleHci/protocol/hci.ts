/**
 * @packageDocumentation
 * @ignore
 */

// let debug = require('debug')('hci');
const debug: any = (...params: any[]) => {
  // console.log(...params);
};

import events = require("events");

namespace COMMANDS {
  export const HCI_COMMAND_PKT: any = 0x01;
  export const HCI_ACLDATA_PKT: any = 0x02;
  export const HCI_EVENT_PKT: any = 0x04;

  export const ACL_START_NO_FLUSH: any = 0x00;
  export const ACL_CONT: any = 0x01;
  export const ACL_START: any = 0x02;

  export const EVT_DISCONN_COMPLETE: any = 0x05;
  export const EVT_ENCRYPT_CHANGE: any = 0x08;
  export const EVT_CMD_COMPLETE: any = 0x0e;
  export const EVT_CMD_STATUS: any = 0x0f;
  export const EVT_NUMBER_OF_COMPLETED_PACKETS: any = 0x13;
  export const EVT_LE_META_EVENT: any = 0x3e;

  export const EVT_LE_CONN_COMPLETE: any = 0x01;
  export const EVT_LE_ADVERTISING_REPORT: any = 0x02;
  export const EVT_LE_CONN_UPDATE_COMPLETE: any = 0x03;

  export const OGF_LINK_CTL: any = 0x01;
  export const OCF_DISCONNECT: any = 0x0006;

  export const OGF_HOST_CTL: any = 0x03;
  export const OCF_SET_EVENT_MASK: any = 0x0001;
  export const OCF_RESET: any = 0x0003;
  export const OCF_READ_LE_HOST_SUPPORTED: any = 0x006c;
  export const OCF_WRITE_LE_HOST_SUPPORTED: any = 0x006d;

  export const OGF_INFO_PARAM: any = 0x04;
  export const OCF_READ_LOCAL_VERSION: any = 0x0001;
  export const OCF_READ_BUFFER_SIZE: any = 0x0005;
  export const OCF_READ_BD_ADDR: any = 0x0009;

  export const OGF_STATUS_PARAM: any = 0x05;
  export const OCF_READ_RSSI: any = 0x0005;

  export const OGF_LE_CTL: any = 0x08;
  export const OCF_LE_SET_EVENT_MASK: any = 0x0001;
  export const OCF_LE_READ_BUFFER_SIZE: any = 0x0002;
  export const OCF_LE_SET_ADVERTISING_PARAMETERS: any = 0x0006;
  export const OCF_LE_SET_ADVERTISING_DATA: any = 0x0008;
  export const OCF_LE_SET_SCAN_RESPONSE_DATA: any = 0x0009;
  export const OCF_LE_SET_ADVERTISE_ENABLE: any = 0x000a;
  export const OCF_LE_SET_SCAN_PARAMETERS: any = 0x000b;
  export const OCF_LE_SET_SCAN_ENABLE: any = 0x000c;
  export const OCF_LE_CREATE_CONN: any = 0x000d;
  export const OCF_LE_CONN_UPDATE: any = 0x0013;
  export const OCF_LE_START_ENCRYPTION: any = 0x0019;
  export const OCF_LE_LTK_NEG_REPLY: any = 0x001b;

  export const DISCONNECT_CMD: any = OCF_DISCONNECT | (OGF_LINK_CTL << 10);

  export const SET_EVENT_MASK_CMD: any = OCF_SET_EVENT_MASK | (OGF_HOST_CTL << 10);
  export const RESET_CMD: any = OCF_RESET | (OGF_HOST_CTL << 10);
  export const READ_LE_HOST_SUPPORTED_CMD: any = OCF_READ_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);
  export const WRITE_LE_HOST_SUPPORTED_CMD: any = OCF_WRITE_LE_HOST_SUPPORTED | (OGF_HOST_CTL << 10);

  export const READ_LOCAL_VERSION_CMD: any = OCF_READ_LOCAL_VERSION | (OGF_INFO_PARAM << 10);
  export const READ_BUFFER_SIZE_CMD: any = OCF_READ_BUFFER_SIZE | (OGF_INFO_PARAM << 10);
  export const READ_BD_ADDR_CMD: any = OCF_READ_BD_ADDR | (OGF_INFO_PARAM << 10);

  export const READ_RSSI_CMD: any = OCF_READ_RSSI | (OGF_STATUS_PARAM << 10);

  export const LE_SET_EVENT_MASK_CMD: any = OCF_LE_SET_EVENT_MASK | (OGF_LE_CTL << 10);
  export const LE_READ_BUFFER_SIZE_CMD: any = OCF_LE_READ_BUFFER_SIZE | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_PARAMETERS_CMD: any = OCF_LE_SET_SCAN_PARAMETERS | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_ENABLE_CMD: any = OCF_LE_SET_SCAN_ENABLE | (OGF_LE_CTL << 10);
  export const LE_CREATE_CONN_CMD: any = OCF_LE_CREATE_CONN | (OGF_LE_CTL << 10);
  export const LE_CONN_UPDATE_CMD: any = OCF_LE_CONN_UPDATE | (OGF_LE_CTL << 10);
  export const LE_START_ENCRYPTION_CMD: any = OCF_LE_START_ENCRYPTION | (OGF_LE_CTL << 10);
  export const LE_SET_ADVERTISING_PARAMETERS_CMD: any = OCF_LE_SET_ADVERTISING_PARAMETERS | (OGF_LE_CTL << 10);

  export const LE_SET_ADVERTISING_DATA_CMD: any = OCF_LE_SET_ADVERTISING_DATA | (OGF_LE_CTL << 10);
  export const LE_SET_SCAN_RESPONSE_DATA_CMD: any = OCF_LE_SET_SCAN_RESPONSE_DATA | (OGF_LE_CTL << 10);
  export const LE_SET_ADVERTISE_ENABLE_CMD: any = OCF_LE_SET_ADVERTISE_ENABLE | (OGF_LE_CTL << 10);
  export const LE_LTK_NEG_REPLY_CMD: any = OCF_LE_LTK_NEG_REPLY | (OGF_LE_CTL << 10);

  export const HCI_OE_USER_ENDED_CONNECTION: any = 0x13;
}

/**
 * @ignore
 */
const STATUS_MAPPER: any = require("./hci-status");

/**
 * @ignore
 */
class Hci extends events.EventEmitter {
  public static STATUS_MAPPER: any;
  public _obnizHci: any;
  public _state: any;
  public _handleBuffers: any;
  public on: any;
  public _socket: any;
  public once: any;
  public _handleAclsInProgress: any;
  public _aclOutQueue: any;
  public _aclMtu: any;
  public _aclMaxInProgress: any;
  public addressType: any;
  public address: any;

  constructor(obnizHci: any) {
    super();
    this._obnizHci = obnizHci;
    this._state = null;

    this._handleBuffers = {};

    this.on("stateChange", this.onStateChange.bind(this));

    this._socket = {
      write: (data: any) => {
        const arr: any = Array.from(data);
        this._obnizHci.write(arr);
      },
    };
    this._obnizHci.onread = this.onSocketData.bind(this);
  }

  public async initWait() {
    this.reset();
    // this.setEventMask();
    // this.setLeEventMask();
    // this.readLocalVersion();
    // this.writeLeHostSupported();
    // this.readLeHostSupported();
    // this.readBdAddr();

    return new Promise((resolve: any) => {
      this.once("stateChange", () => {
        // console.log('te');
        resolve();
      });
    });
  }

  public setEventMask() {
    const cmd: any = Buffer.alloc(12);
    const eventMask: any = Buffer.from("fffffbff07f8bf3d", "hex");

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.SET_EVENT_MASK_CMD, 1);

    // length
    cmd.writeUInt8(eventMask.length, 3);

    eventMask.copy(cmd, 4);

    debug("set event mask - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public reset() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.OCF_RESET | (COMMANDS.OGF_HOST_CTL << 10), 1);

    // length
    cmd.writeUInt8(0x00, 3);

    debug("reset - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public resetBuffers() {
    this._handleAclsInProgress = {};
    this._handleBuffers = {};
    this._aclOutQueue = [];
  }

  public readLocalVersion() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_LOCAL_VERSION_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    debug("read local version - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public readBdAddr() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_BD_ADDR_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    debug("read bd addr - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setLeEventMask() {
    const cmd: any = Buffer.alloc(12);
    const leEventMask: any = Buffer.from("1f00000000000000", "hex");

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_EVENT_MASK_CMD, 1);

    // length
    cmd.writeUInt8(leEventMask.length, 3);

    leEventMask.copy(cmd, 4);

    debug("set le event mask - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public readLeHostSupported() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_LE_HOST_SUPPORTED_CMD, 1);

    // length
    cmd.writeUInt8(0x00, 3);

    debug("read LE host supported - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public writeLeHostSupported() {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt8(0x01, 4); // le
    cmd.writeUInt8(0x00, 5); // simul

    debug("write LE host supported - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setScanParameters(isActiveScan: boolean) {
    const cmd: any = Buffer.alloc(11);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD, 1);

    // length
    cmd.writeUInt8(0x07, 3);

    // data
    cmd.writeUInt8(isActiveScan ? 0x01 : 0x00, 4); // type: 0 -> passive, 1 -> active
    cmd.writeUInt16LE(0x0010, 5); // internal, ms * 1.6
    cmd.writeUInt16LE(0x0010, 7); // window, ms * 1.6
    cmd.writeUInt8(0x00, 9); // own address type: 0 -> public, 1 -> random
    cmd.writeUInt8(0x00, 10); // filter: 0 -> all event types

    debug("set scan parameters - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setScanEnabled(enabled: boolean, filterDuplicates: boolean) {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_ENABLE_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
    cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // duplicates: 0 -> duplicates, 0 -> duplicates

    debug("set scan enabled - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public createLeConn(address: any, addressType: any) {
    const cmd: any = Buffer.alloc(29);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_CREATE_CONN_CMD, 1);

    // length
    cmd.writeUInt8(0x19, 3);

    // data
    cmd.writeUInt16LE(0x0060, 4); // interval
    cmd.writeUInt16LE(0x0030, 6); // window
    cmd.writeUInt8(0x00, 8); // initiator filter

    cmd.writeUInt8(addressType === "random" ? 0x01 : 0x00, 9); // peer address type
    Buffer.from(
      address
        .split(":")
        .reverse()
        .join(""),
      "hex",
    ).copy(cmd, 10); // peer address

    cmd.writeUInt8(0x00, 16); // own address type

    cmd.writeUInt16LE(0x0006, 17); // min interval
    cmd.writeUInt16LE(0x000c, 19); // max interval
    cmd.writeUInt16LE(0x0000, 21); // latency
    cmd.writeUInt16LE(0x00c8, 23); // supervision timeout
    cmd.writeUInt16LE(0x0004, 25); // min ce length
    cmd.writeUInt16LE(0x0006, 27); // max ce length

    debug("create le conn - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public connUpdateLe(handle: any, minInterval: any, maxInterval: any, latency: any, supervisionTimeout: any) {
    const cmd: any = Buffer.alloc(18);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_CONN_UPDATE_CMD, 1);

    // length
    cmd.writeUInt8(0x0e, 3);

    // data
    cmd.writeUInt16LE(handle, 4);
    cmd.writeUInt16LE(Math.floor(minInterval / 1.25), 6); // min interval
    cmd.writeUInt16LE(Math.floor(maxInterval / 1.25), 8); // max interval
    cmd.writeUInt16LE(latency, 10); // latency
    cmd.writeUInt16LE(Math.floor(supervisionTimeout / 10), 12); // supervision timeout
    cmd.writeUInt16LE(0x0000, 14); // min ce length
    cmd.writeUInt16LE(0x0000, 16); // max ce length

    debug("conn update le - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public startLeEncryption(handle: any, random: any, diversifier: any, key: any) {
    const cmd: any = Buffer.alloc(32);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_START_ENCRYPTION_CMD, 1);

    // length
    cmd.writeUInt8(0x1c, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle
    random.copy(cmd, 6);
    diversifier.copy(cmd, 14);
    key.copy(cmd, 16);

    debug("start le encryption - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public disconnect(handle: any, reason: any) {
    const cmd: any = Buffer.alloc(7);

    reason = reason || COMMANDS.HCI_OE_USER_ENDED_CONNECTION;

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.DISCONNECT_CMD, 1);

    // length
    cmd.writeUInt8(0x03, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle
    cmd.writeUInt8(reason, 6); // reason

    debug("disconnect - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public readRssi(handle: any) {
    const cmd: any = Buffer.alloc(6);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_RSSI_CMD, 1);

    // length
    cmd.writeUInt8(0x02, 3);

    // data
    cmd.writeUInt16LE(handle, 4); // handle

    debug("read rssi - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public writeAclDataPkt(handle: any, cid: any, data: any) {
    const pkt: any = Buffer.alloc(9 + data.length);

    // header
    pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
    pkt.writeUInt16LE(handle | (COMMANDS.ACL_START_NO_FLUSH << 12), 1);
    pkt.writeUInt16LE(data.length + 4, 3); // data length 1
    pkt.writeUInt16LE(data.length, 5); // data length 2
    pkt.writeUInt16LE(cid, 7);

    data.copy(pkt, 9);

    debug("write acl data pkt - writing: " + pkt.toString("hex"));
    this._socket.write(pkt);
  }

  public setAdvertisingParameters() {
    const cmd: any = Buffer.alloc(19);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD, 1);

    // length
    cmd.writeUInt8(15, 3);

    const advertisementInterval: any = Math.floor(
      (process.env.BLENO_ADVERTISING_INTERVAL ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL) : 100) * 1.6,
    );

    // data
    cmd.writeUInt16LE(advertisementInterval, 4); // min interval
    cmd.writeUInt16LE(advertisementInterval, 6); // max interval
    cmd.writeUInt8(0x00, 8); // adv type
    cmd.writeUInt8(0x00, 9); // own addr typ
    cmd.writeUInt8(0x00, 10); // direct addr type
    Buffer.from("000000000000", "hex").copy(cmd, 11); // direct addr
    cmd.writeUInt8(0x07, 17);
    cmd.writeUInt8(0x00, 18);

    debug("set advertisement parameters - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setAdvertisingData(data: any) {
    const cmd: any = Buffer.alloc(36);

    cmd.fill(0x00);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_DATA_CMD, 1);

    // length
    cmd.writeUInt8(32, 3);

    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);

    debug("set advertisement data - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setScanResponseData(data: any) {
    const cmd: any = Buffer.alloc(36);

    cmd.fill(0x00);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD, 1);

    // length
    cmd.writeUInt8(32, 3);

    // data
    cmd.writeUInt8(data.length, 4);
    data.copy(cmd, 5);

    debug("set scan response data - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public setAdvertiseEnable(enabled: any) {
    const cmd: any = Buffer.alloc(5);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD, 1);

    // length
    cmd.writeUInt8(0x01, 3);

    // data
    cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled

    debug("set advertise enable - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public leReadBufferSize() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.LE_READ_BUFFER_SIZE_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    debug("le read buffer size - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public readBufferSize() {
    const cmd: any = Buffer.alloc(4);

    // header
    cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
    cmd.writeUInt16LE(COMMANDS.READ_BUFFER_SIZE_CMD, 1);

    // length
    cmd.writeUInt8(0x0, 3);

    debug("read buffer size - writing: " + cmd.toString("hex"));
    this._socket.write(cmd);
  }

  public queueAclDataPkt(handle: any, cid: any, data: any) {
    let hf: any = handle | (COMMANDS.ACL_START_NO_FLUSH << 12);
    // l2cap pdu may be fragmented on hci level
    let l2capPdu: any = Buffer.alloc(4 + data.length);
    l2capPdu.writeUInt16LE(data.length, 0);
    l2capPdu.writeUInt16LE(cid, 2);
    data.copy(l2capPdu, 4);
    let fragId: any = 0;

    while (l2capPdu.length) {
      const frag: any = l2capPdu.slice(0, this._aclMtu);
      l2capPdu = l2capPdu.slice(frag.length);
      const pkt: any = Buffer.alloc(5 + frag.length);

      // hci header
      pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
      pkt.writeUInt16LE(hf, 1);
      hf |= COMMANDS.ACL_CONT << 12;
      pkt.writeUInt16LE(frag.length, 3); // hci pdu length

      frag.copy(pkt, 5);

      this._aclOutQueue.push({
        handle,
        pkt,
        fragId: fragId++,
      });
    }

    this.pushAclOutQueue();
  }

  public pushAclOutQueue() {
    debug("pushAclOutQueue");
    let inProgress: any = 0;
    for (const handle in this._handleAclsInProgress) {
      inProgress += this._handleAclsInProgress[handle];
    }
    debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
    while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
      inProgress++;
      this.writeOneAclDataPkt();
    }

    if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
      debug("acl out queue congested");
      debug("\tin progress = " + inProgress);
      debug("\twaiting = " + this._aclOutQueue.length);
    }
  }

  public writeOneAclDataPkt() {
    debug("writeOneAclDataPkt");
    const pkt: any = this._aclOutQueue.shift();
    this._handleAclsInProgress[pkt.handle]++;
    debug("write acl data pkt frag " + pkt.fragId + " handle " + pkt.handle + " - writing: " + pkt.pkt.toString("hex"));
    this._socket.write(pkt.pkt);
  }

  public onSocketData(array: any) {
    const data: any = Buffer.from(array);
    debug("onSocketData: " + data.toString("hex"));

    const eventType: any = data.readUInt8(0);

    debug("\tevent type = 0x" + eventType.toString(16));

    if (COMMANDS.HCI_EVENT_PKT === eventType) {
      const subEventType: any = data.readUInt8(1);

      debug("\tsub event type = 0x" + subEventType.toString(16));

      if (subEventType === COMMANDS.EVT_DISCONN_COMPLETE) {
        const handle: any = data.readUInt16LE(4);
        const reason: any = data.readUInt8(6);

        debug("\t\thandle = " + handle);
        debug("\t\treason = " + reason);

        delete this._handleAclsInProgress[handle];
        const aclOutQueue: any = [];
        let discarded: any = 0;
        for (const i in this._aclOutQueue) {
          if (this._aclOutQueue[i].handle !== handle) {
            aclOutQueue.push(this._aclOutQueue[i]);
          } else {
            discarded++;
          }
        }
        if (discarded) {
          debug("\t\tacls discarded = " + discarded);
        }
        this._aclOutQueue = aclOutQueue;
        this.pushAclOutQueue();

        this.emit("disconnComplete", handle, reason);
      } else if (subEventType === COMMANDS.EVT_ENCRYPT_CHANGE) {
        const handle: any = data.readUInt16LE(4);
        const encrypt: any = data.readUInt8(6);

        debug("\t\thandle = " + handle);
        debug("\t\tencrypt = " + encrypt);

        this.emit("encryptChange", handle, encrypt);
      } else if (subEventType === COMMANDS.EVT_CMD_COMPLETE) {
        const ncmd: any = data.readUInt8(3);
        const cmd: any = data.readUInt16LE(4);
        const status: any = data.readUInt8(6);
        const result: any = data.slice(7);

        debug("\t\tncmd = 0x" + ncmd.toString(16));
        debug("\t\tcmd = 0x" + cmd.toString(16));
        debug("\t\tstatus = 0x" + status.toString(16));
        debug("\t\tresult = 0x" + result.toString("hex"));

        this.processCmdCompleteEvent(cmd, status, result);
      } else if (subEventType === COMMANDS.EVT_CMD_STATUS) {
        const status: any = data.readUInt8(3);
        const cmd: any = data.readUInt16LE(5);

        debug("\t\tstatus = " + status);
        debug("\t\tcmd = " + cmd);

        this.processCmdStatusEvent(cmd, status);
      } else if (subEventType === COMMANDS.EVT_LE_META_EVENT) {
        const leMetaEventType: any = data.readUInt8(3);
        const leMetaEventStatus: any = data.readUInt8(4);
        const leMetaEventData: any = data.slice(5);

        debug("\t\tLE meta event type = " + leMetaEventType);
        debug("\t\tLE meta event status = " + leMetaEventStatus);
        debug("\t\tLE meta event data = " + leMetaEventData.toString("hex"));

        this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
      } else if (subEventType === COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS) {
        const handles: any = data.readUInt8(3);
        for (let i = 0; i < handles; i++) {
          const handle: any = data.readUInt16LE(4 + i * 4);
          const pkts: any = data.readUInt16LE(6 + i * 4);
          debug("\thandle = " + handle);
          debug("\t\tcompleted = " + pkts);
          if (this._handleAclsInProgress[handle] === undefined) {
            debug("\t\talready closed");
            continue;
          }
          if (pkts > this._handleAclsInProgress[handle]) {
            // Linux kernel may send acl packets by itself, so be ready for underflow
            this._handleAclsInProgress[handle] = 0;
          } else {
            this._handleAclsInProgress[handle] -= pkts;
          }
          debug("\t\tin progress = " + this._handleAclsInProgress[handle]);
        }
        this.pushAclOutQueue();
      }
    } else if (COMMANDS.HCI_ACLDATA_PKT === eventType) {
      const flags: any = data.readUInt16LE(1) >> 12;
      const handle: any = data.readUInt16LE(1) & 0x0fff;

      if (COMMANDS.ACL_START === flags) {
        const cid: any = data.readUInt16LE(7);

        const length: any = data.readUInt16LE(5);
        const pktData: any = data.slice(9);

        debug("\t\tcid = " + cid);

        if (length === pktData.length) {
          debug("\t\thandle = " + handle);
          debug("\t\tdata = " + pktData.toString("hex"));

          this.emit("aclDataPkt", handle, cid, pktData);
        } else {
          this._handleBuffers[handle] = {
            length,
            cid,
            data: pktData,
          };
        }
      } else if (COMMANDS.ACL_CONT === flags) {
        if (!this._handleBuffers[handle] || !this._handleBuffers[handle].data) {
          return;
        }

        this._handleBuffers[handle].data = Buffer.concat([this._handleBuffers[handle].data, data.slice(5)]);

        if (this._handleBuffers[handle].data.length === this._handleBuffers[handle].length) {
          this.emit("aclDataPkt", handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);

          delete this._handleBuffers[handle];
        }
      }
    } else if (COMMANDS.HCI_COMMAND_PKT === eventType) {
      const cmd: any = data.readUInt16LE(1);
      const len: any = data.readUInt8(3);

      debug("\t\tcmd = " + cmd);
      debug("\t\tdata len = " + len);

      if (cmd === COMMANDS.LE_SET_SCAN_ENABLE_CMD) {
        const enable: any = data.readUInt8(4) === 0x1;
        const filterDuplicates: any = data.readUInt8(5) === 0x1;

        debug("\t\t\tLE enable scan command");
        debug("\t\t\tenable scanning = " + enable);
        debug("\t\t\tfilter duplicates = " + filterDuplicates);

        this.emit("leScanEnableSetCmd", enable, filterDuplicates);
      }
    }
  }

  public onSocketError(error: any) {
    debug("onSocketError: " + error.message);

    if (error.message === "Operation not permitted") {
      this.emit("stateChange", "unauthorized");
    } else if (error.message === "Network is down") {
      // no-op
    }
  }

  public processCmdCompleteEvent(cmd: any, status: any, result: any) {
    if (cmd === COMMANDS.RESET_CMD) {
      this.resetBuffers();
      this.setEventMask();
      this.setLeEventMask();
      this.readLocalVersion();
      this.readBdAddr();
      this.writeLeHostSupported();
      this.readLeHostSupported();
      this.leReadBufferSize();
    } else if (cmd === COMMANDS.READ_LE_HOST_SUPPORTED_CMD) {
      if (status === 0) {
        const le: any = result.readUInt8(0);
        const simul: any = result.readUInt8(1);

        debug("\t\t\tle = " + le);
        debug("\t\t\tsimul = " + simul);
      }
    } else if (cmd === COMMANDS.READ_LOCAL_VERSION_CMD) {
      const hciVer: any = result.readUInt8(0);
      const hciRev: any = result.readUInt16LE(1);
      const lmpVer: any = result.readInt8(3);
      const manufacturer: any = result.readUInt16LE(4);
      const lmpSubVer: any = result.readUInt16LE(6);

      if (hciVer < 0x06) {
        this.emit("stateChange", "unsupported");
      } else if (this._state !== "poweredOn") {
        this.setScanEnabled(false, true);
        this.setScanParameters(false);
      }

      this.emit("readLocalVersion", hciVer, hciRev, lmpVer, manufacturer, lmpSubVer);
    } else if (cmd === COMMANDS.READ_BD_ADDR_CMD) {
      this.addressType = "public";
      this.address = result
        .toString("hex")
        .match(/.{1,2}/g)
        .reverse()
        .join(":");

      debug("address = " + this.address);

      this.emit("addressChange", this.address);
    } else if (cmd === COMMANDS.LE_SET_SCAN_PARAMETERS_CMD) {
      this.emit("stateChange", "poweredOn");

      this.emit("leScanParametersSet", status);
    } else if (cmd === COMMANDS.LE_SET_SCAN_ENABLE_CMD) {
      this.emit("leScanEnableSet", status);
    } else if (cmd === COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD) {
      this.emit("stateChange", "poweredOn");

      this.emit("leAdvertisingParametersSet", status);
    } else if (cmd === COMMANDS.LE_SET_ADVERTISING_DATA_CMD) {
      this.emit("leAdvertisingDataSet", status);
    } else if (cmd === COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD) {
      this.emit("leScanResponseDataSet", status);
    } else if (cmd === COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD) {
      this.emit("leAdvertiseEnableSet", status);
    } else if (cmd === COMMANDS.READ_RSSI_CMD) {
      const handle: any = result.readUInt16LE(0);
      const rssi: any = result.readInt8(2);

      debug("\t\t\thandle = " + handle);
      debug("\t\t\trssi = " + rssi);

      this.emit("rssiRead", handle, rssi);
    } else if (cmd === COMMANDS.LE_LTK_NEG_REPLY_CMD) {
      const handle: any = result.readUInt16LE(0);

      debug("\t\t\thandle = " + handle);
      this.emit("leLtkNegReply", handle);
    } else if (cmd === COMMANDS.LE_READ_BUFFER_SIZE_CMD) {
      if (!status) {
        this.processLeReadBufferSize(result);
      }
    } else if (cmd === COMMANDS.READ_BUFFER_SIZE_CMD) {
      if (!status) {
        const aclMtu: any = result.readUInt16LE(0);
        const aclMaxInProgress: any = result.readUInt16LE(3);
        // sanity
        if (aclMtu && aclMaxInProgress) {
          debug("br/edr acl mtu = " + aclMtu);
          debug("br/edr acl max pkts = " + aclMaxInProgress);
          this._aclMtu = aclMtu;
          this._aclMaxInProgress = aclMaxInProgress;
        }
      }
    }
  }

  public processLeMetaEvent(eventType: any, status: any, data: any) {
    if (eventType === COMMANDS.EVT_LE_CONN_COMPLETE) {
      this.processLeConnComplete(status, data);
    } else if (eventType === COMMANDS.EVT_LE_ADVERTISING_REPORT) {
      this.processLeAdvertisingReport(status, data);
    } else if (eventType === COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE) {
      this.processLeConnUpdateComplete(status, data);
    }
  }

  public processLeConnComplete(status: any, data: any) {
    const handle: any = data.readUInt16LE(0);
    const role: any = data.readUInt8(2);
    const addressType: any = data.readUInt8(3) === 0x01 ? "random" : "public";
    const address: any = data
      .slice(4, 10)
      .toString("hex")
      .match(/.{1,2}/g)
      .reverse()
      .join(":");
    const interval: any = data.readUInt16LE(10) * 1.25;
    const latency: any = data.readUInt16LE(12); // TODO: multiplier?
    const supervisionTimeout: any = data.readUInt16LE(14) * 10;
    const masterClockAccuracy: any = data.readUInt8(16); // TODO: multiplier?

    debug("\t\t\thandle = " + handle);
    debug("\t\t\trole = " + role);
    debug("\t\t\taddress type = " + addressType);
    debug("\t\t\taddress = " + address);
    debug("\t\t\tinterval = " + interval);
    debug("\t\t\tlatency = " + latency);
    debug("\t\t\tsupervision timeout = " + supervisionTimeout);
    debug("\t\t\tmaster clock accuracy = " + masterClockAccuracy);

    this._handleAclsInProgress[handle] = 0;

    this.emit(
      "leConnComplete",
      status,
      handle,
      role,
      addressType,
      address,
      interval,
      latency,
      supervisionTimeout,
      masterClockAccuracy,
    );
  }

  public processLeAdvertisingReport(count: any, data: any) {
    for (let i = 0; i < count; i++) {
      const type: any = data.readUInt8(0);
      const addressType: any = data.readUInt8(1) === 0x01 ? "random" : "public";
      const address: any = data
        .slice(2, 8)
        .toString("hex")
        .match(/.{1,2}/g)
        .reverse()
        .join(":");
      const eirLength: any = data.readUInt8(8);
      const eir: any = data.slice(9, eirLength + 9);
      const rssi: any = data.readInt8(eirLength + 9);

      debug("\t\t\ttype = " + type);
      debug("\t\t\taddress = " + address);
      debug("\t\t\taddress type = " + addressType);
      debug("\t\t\teir = " + eir.toString("hex"));
      debug("\t\t\trssi = " + rssi);

      this.emit("leAdvertisingReport", 0, type, address, addressType, eir, rssi);

      data = data.slice(eirLength + 10);
    }
  }

  public processLeConnUpdateComplete(status: any, data: any) {
    const handle: any = data.readUInt16LE(0);
    const interval: any = data.readUInt16LE(2) * 1.25;
    const latency: any = data.readUInt16LE(4); // TODO: multiplier?
    const supervisionTimeout: any = data.readUInt16LE(6) * 10;

    debug("\t\t\thandle = " + handle);
    debug("\t\t\tinterval = " + interval);
    debug("\t\t\tlatency = " + latency);
    debug("\t\t\tsupervision timeout = " + supervisionTimeout);

    this.emit("leConnUpdateComplete", status, handle, interval, latency, supervisionTimeout);
  }

  public processCmdStatusEvent(cmd: any, status: any) {
    if (cmd === COMMANDS.LE_CREATE_CONN_CMD) {
      if (status !== 0) {
        this.emit("leConnComplete", status);
      }
    }
  }

  public processLeReadBufferSize(result: any) {
    const aclMtu: any = result.readUInt16LE(0);
    const aclMaxInProgress: any = result.readUInt8(2);
    if (!aclMtu) {
      // as per Bluetooth specs
      debug("falling back to br/edr buffer size");
      this.readBufferSize();
    } else {
      debug("le acl mtu = " + aclMtu);
      debug("le acl max in progress = " + aclMaxInProgress);
      this._aclMtu = aclMtu;
      this._aclMaxInProgress = aclMaxInProgress;
    }
  }

  public onStateChange(state: any) {
    this._state = state;
  }
}

Hci.STATUS_MAPPER = STATUS_MAPPER;
export default Hci;
