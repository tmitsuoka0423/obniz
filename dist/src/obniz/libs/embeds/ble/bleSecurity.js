"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const emitter = require("eventemitter3");
const semver = require("semver");
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 */
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new emitter();
    }
    setModeLevel(mode, level) {
        let auth;
        let keys;
        let indicateSecurityLevel;
        if (mode === 1) {
            if (level === 1) {
                auth = [];
                indicateSecurityLevel = 0; // no pairing request
                keys = ["LTK", "IRK"];
            }
            else if (level === 2) {
                auth = ["bonding"];
                indicateSecurityLevel = 2;
                keys = ["LTK", "IRK"];
            }
            else if (level === 3) {
                // TODO
                // auth = ['bonding','mitm'];
                // indicateSecurityLevel = 3;
                // keys = ['LTK', 'IRK'];
            }
        }
        else if (mode === 2) {
            if (level === 1) {
                // TODO
                // auth = [];
                // keys = ['LTK', 'IRK','CSRK'];
            }
            else if (level === 2) {
                // TODO
                // auth = ['bonding'];
                // keys = ['LTK', 'IRK','CSRK'];
            }
        }
        if (auth !== undefined && indicateSecurityLevel !== undefined && keys !== undefined) {
            this.setAuth(auth);
            this.setIndicateSecurityLevel(indicateSecurityLevel);
            this.setEnableKeyTypes(keys);
        }
        else {
            const msg = `BLE security mode${mode}, level${level} is not available.`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    checkIntroducedFirmware(introducedVersion, functionName) {
        const results = semver.lt(this.Obniz.firmware_ver, introducedVersion);
        if (results) {
            const msg = `${functionName} is available obniz firmware ${introducedVersion}.( your obniz version is ${this.Obniz.firmware_ver})`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    setAuth(authTypes) {
        this.checkIntroducedFirmware("1.1.0", "setAuth");
        if (!Array.isArray(authTypes)) {
            authTypes = [authTypes];
        }
        const sendTypes = authTypes
            .map((elm) => {
            return elm.toLowerCase();
        })
            .filter((elm) => {
            return ["mitm", "secure_connection", "bonding"].includes(elm);
        });
        if (sendTypes.length !== authTypes.length) {
            throw new Error("unknown auth type");
        }
        this.Obniz.send({
            ble: {
                security: {
                    auth: authTypes,
                },
            },
        });
    }
    setIndicateSecurityLevel(level) {
        this.checkIntroducedFirmware("1.1.0", "setIndicateSecurityLevel");
        if (typeof level !== "number") {
            throw new Error("unknown secrity level : " + level);
        }
        this.Obniz.send({
            ble: {
                security: {
                    indicate_security_level: level,
                },
            },
        });
    }
    setEnableKeyTypes(keyTypes) {
        this.checkIntroducedFirmware("1.1.0", "setEnableKeyTypes");
        if (!Array.isArray(keyTypes)) {
            keyTypes = [keyTypes];
        }
        const sendTypes = keyTypes
            .map((elm) => {
            return elm.toLowerCase();
        })
            .filter((elm) => {
            return ["ltk", "csrk", "irk"].includes(elm);
        });
        if (sendTypes.length !== keyTypes.length) {
            throw new Error("unknown key type");
        }
        this.Obniz.send({
            ble: {
                security: {
                    key: { type: sendTypes },
                },
            },
        });
    }
    setKeyMaxSize(size) {
        this.checkIntroducedFirmware("1.1.0", "setKeyMaxSize");
        if (typeof size !== "number") {
            throw new Error("please provide key size in number");
        }
        this.Obniz.send({
            ble: {
                security: {
                    key: { max_size: size },
                },
            },
        });
    }
    clearBondingDevicesList() {
        this.Obniz.send({
            ble: {
                security: {
                    devices: { clear: true },
                },
            },
        });
    }
    onerror(params) { } // dummy
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onerror": {
                this.onerror(params);
                break;
            }
        }
    }
}
exports.default = BleSecurity;

//# sourceMappingURL=bleSecurity.js.map
