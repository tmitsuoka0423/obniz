"use strict";
// var debug = require('debug')('bindings');
const debug = () => { };
let events = require('events');
let os = require('os');
let AclStream = require('./acl-stream');
let Gap = require('./gap');
let Gatt = require('./gatt');
class BlenoBindings extends events.EventEmitter {
    constructor(hciProtocol) {
        super();
        this._state = null;
        this._advertising = false;
        this._hci = hciProtocol;
        this._gap = new Gap(this._hci);
        this._gatt = new Gatt(this._hci);
        this._address = null;
        this._handle = null;
        this._aclStream = null;
    }
    startAdvertising(name, serviceUuids) {
        this._advertising = true;
        this._gap.startAdvertising(name, serviceUuids);
    }
    startAdvertisingIBeacon(data) {
        this._advertising = true;
        this._gap.startAdvertisingIBeacon(data);
    }
    startAdvertisingWithEIRData(advertisementData, scanData) {
        this._advertising = true;
        this._gap.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    stopAdvertising() {
        this._advertising = false;
        this._gap.stopAdvertising();
    }
    setServices(services) {
        this._gatt.setServices(services);
        this.emit('servicesSet');
    }
    disconnect() {
        if (this._handle) {
            debug('disconnect by server');
            this._hci.disconnect(this._handle);
        }
    }
    updateRssi() {
        if (this._handle) {
            this._hci.readRssi(this._handle);
        }
    }
    init() {
        this._gap.on('advertisingStart', this.onAdvertisingStart.bind(this));
        this._gap.on('advertisingStop', this.onAdvertisingStop.bind(this));
        this._gatt.on('mtuChange', this.onMtuChange.bind(this));
        this._hci.on('stateChange', this.onStateChange.bind(this));
        this._hci.on('addressChange', this.onAddressChange.bind(this));
        this._hci.on('readLocalVersion', this.onReadLocalVersion.bind(this));
        this._hci.on('leConnComplete', this.onLeConnComplete.bind(this));
        this._hci.on('leConnUpdateComplete', this.onLeConnUpdateComplete.bind(this));
        this._hci.on('rssiRead', this.onRssiRead.bind(this));
        this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
        this._hci.on('encryptChange', this.onEncryptChange.bind(this));
        this._hci.on('leLtkNegReply', this.onLeLtkNegReply.bind(this));
        this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));
        this.emit('platform', os.platform());
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === 'unauthorized') {
            console.log('bleno warning: adapter state unauthorized, please run as root or with sudo');
            console.log('               or see README for information on running without root/sudo:');
            console.log('               https://github.com/sandeepmistry/bleno#running-on-linux');
        }
        else if (state === 'unsupported') {
            console.log('bleno warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).');
            console.log('               Try to run with environment variable:');
            console.log('               [sudo] BLENO_HCI_DEVICE_ID=x node ...');
        }
        this.emit('stateChange', state);
    }
    onAddressChange(address) {
        this.emit('addressChange', address);
    }
    onReadLocalVersion(hciVer, hciRev, lmpVer, manufacturer, lmpSubVer) { }
    onAdvertisingStart(error) {
        this.emit('advertisingStart', error);
    }
    onAdvertisingStop() {
        this.emit('advertisingStop');
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 1) {
            // not slave, ignore
            return;
        }
        this._address = address;
        this._handle = handle;
        this._aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
        this._gatt.setAclStream(this._aclStream);
        this.emit('accept', address);
    }
    onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
        // no-op
    }
    onDisconnComplete(handle, reason) {
        if (this._handle !== handle) {
            return; //not peripheral
        }
        if (this._aclStream) {
            this._aclStream.push(null, null);
        }
        let address = this._address;
        this._address = null;
        this._handle = null;
        this._aclStream = null;
        if (address) {
            this.emit('disconnect', address); // TODO: use reason
        }
        if (this._advertising) {
            this._gap.restartAdvertising();
        }
    }
    onEncryptChange(handle, encrypt) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.pushEncrypt(encrypt);
        }
    }
    onLeLtkNegReply(handle) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.pushLtkNegReply();
        }
    }
    onMtuChange(mtu) {
        this.emit('mtuChange', mtu);
    }
    onRssiRead(handle, rssi) {
        this.emit('rssiUpdate', rssi);
    }
    onAclDataPkt(handle, cid, data) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.push(cid, data);
        }
    }
}
module.exports = BlenoBindings;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvcGVyaXBoZXJhbC9iaW5kaW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTRDO0FBQzVDLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztBQUV2QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXZCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUV4QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTdCLE1BQU0sYUFBYyxTQUFRLE1BQU0sQ0FBQyxZQUFZO0lBQzdDLFlBQVksV0FBVztRQUNyQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBRTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWTtRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FB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VUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzVCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvcGVyaXBoZXJhbC9iaW5kaW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2JpbmRpbmdzJyk7XG5jb25zdCBkZWJ1ZyA9ICgpID0+IHt9O1xuXG5sZXQgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5sZXQgb3MgPSByZXF1aXJlKCdvcycpO1xuXG5sZXQgQWNsU3RyZWFtID0gcmVxdWlyZSgnLi9hY2wtc3RyZWFtJyk7XG5cbmxldCBHYXAgPSByZXF1aXJlKCcuL2dhcCcpO1xubGV0IEdhdHQgPSByZXF1aXJlKCcuL2dhdHQnKTtcblxuY2xhc3MgQmxlbm9CaW5kaW5ncyBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihoY2lQcm90b2NvbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5fYWR2ZXJ0aXNpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX2hjaSA9IGhjaVByb3RvY29sO1xuICAgIHRoaXMuX2dhcCA9IG5ldyBHYXAodGhpcy5faGNpKTtcbiAgICB0aGlzLl9nYXR0ID0gbmV3IEdhdHQodGhpcy5faGNpKTtcblxuICAgIHRoaXMuX2FkZHJlc3MgPSBudWxsO1xuICAgIHRoaXMuX2hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fYWNsU3RyZWFtID0gbnVsbDtcbiAgfVxuXG4gIHN0YXJ0QWR2ZXJ0aXNpbmcobmFtZSwgc2VydmljZVV1aWRzKSB7XG4gICAgdGhpcy5fYWR2ZXJ0aXNpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5fZ2FwLnN0YXJ0QWR2ZXJ0aXNpbmcobmFtZSwgc2VydmljZVV1aWRzKTtcbiAgfVxuXG4gIHN0YXJ0QWR2ZXJ0aXNpbmdJQmVhY29uKGRhdGEpIHtcbiAgICB0aGlzLl9hZHZlcnRpc2luZyA9IHRydWU7XG5cbiAgICB0aGlzLl9nYXAuc3RhcnRBZHZlcnRpc2luZ0lCZWFjb24oZGF0YSk7XG4gIH1cblxuICBzdGFydEFkdmVydGlzaW5nV2l0aEVJUkRhdGEoYWR2ZXJ0aXNlbWVudERhdGEsIHNjYW5EYXRhKSB7XG4gICAgdGhpcy5fYWR2ZXJ0aXNpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5fZ2FwLnN0YXJ0QWR2ZXJ0aXNpbmdXaXRoRUlSRGF0YShhZHZlcnRpc2VtZW50RGF0YSwgc2NhbkRhdGEpO1xuICB9XG5cbiAgc3RvcEFkdmVydGlzaW5nKCkge1xuICAgIHRoaXMuX2FkdmVydGlzaW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLl9nYXAuc3RvcEFkdmVydGlzaW5nKCk7XG4gIH1cblxuICBzZXRTZXJ2aWNlcyhzZXJ2aWNlcykge1xuICAgIHRoaXMuX2dhdHQuc2V0U2VydmljZXMoc2VydmljZXMpO1xuXG4gICAgdGhpcy5lbWl0KCdzZXJ2aWNlc1NldCcpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICBpZiAodGhpcy5faGFuZGxlKSB7XG4gICAgICBkZWJ1ZygnZGlzY29ubmVjdCBieSBzZXJ2ZXInKTtcblxuICAgICAgdGhpcy5faGNpLmRpc2Nvbm5lY3QodGhpcy5faGFuZGxlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVSc3NpKCkge1xuICAgIGlmICh0aGlzLl9oYW5kbGUpIHtcbiAgICAgIHRoaXMuX2hjaS5yZWFkUnNzaSh0aGlzLl9oYW5kbGUpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fZ2FwLm9uKCdhZHZlcnRpc2luZ1N0YXJ0JywgdGhpcy5vbkFkdmVydGlzaW5nU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fZ2FwLm9uKCdhZHZlcnRpc2luZ1N0b3AnLCB0aGlzLm9uQWR2ZXJ0aXNpbmdTdG9wLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5fZ2F0dC5vbignbXR1Q2hhbmdlJywgdGhpcy5vbk10dUNoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuX2hjaS5vbignc3RhdGVDaGFuZ2UnLCB0aGlzLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdhZGRyZXNzQ2hhbmdlJywgdGhpcy5vbkFkZHJlc3NDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdyZWFkTG9jYWxWZXJzaW9uJywgdGhpcy5vblJlYWRMb2NhbFZlcnNpb24uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLl9oY2kub24oJ2xlQ29ubkNvbXBsZXRlJywgdGhpcy5vbkxlQ29ubkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgICdsZUNvbm5VcGRhdGVDb21wbGV0ZScsXG4gICAgICB0aGlzLm9uTGVDb25uVXBkYXRlQ29tcGxldGUuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5faGNpLm9uKCdyc3NpUmVhZCcsIHRoaXMub25Sc3NpUmVhZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oJ2Rpc2Nvbm5Db21wbGV0ZScsIHRoaXMub25EaXNjb25uQ29tcGxldGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdlbmNyeXB0Q2hhbmdlJywgdGhpcy5vbkVuY3J5cHRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdsZUx0a05lZ1JlcGx5JywgdGhpcy5vbkxlTHRrTmVnUmVwbHkuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdhY2xEYXRhUGt0JywgdGhpcy5vbkFjbERhdGFQa3QuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmVtaXQoJ3BsYXRmb3JtJywgb3MucGxhdGZvcm0oKSk7XG4gIH1cblxuICBvblN0YXRlQ2hhbmdlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSBzdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXG4gICAgaWYgKHN0YXRlID09PSAndW5hdXRob3JpemVkJykge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdibGVubyB3YXJuaW5nOiBhZGFwdGVyIHN0YXRlIHVuYXV0aG9yaXplZCwgcGxlYXNlIHJ1biBhcyByb290IG9yIHdpdGggc3VkbydcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJyAgICAgICAgICAgICAgIG9yIHNlZSBSRUFETUUgZm9yIGluZm9ybWF0aW9uIG9uIHJ1bm5pbmcgd2l0aG91dCByb290L3N1ZG86J1xuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnICAgICAgICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3NhbmRlZXBtaXN0cnkvYmxlbm8jcnVubmluZy1vbi1saW51eCdcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ3Vuc3VwcG9ydGVkJykge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdibGVubyB3YXJuaW5nOiBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgQmx1ZXRvb3RoIExvdyBFbmVyZ3kgKEJMRSwgQmx1ZXRvb3RoIFNtYXJ0KS4nXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coJyAgICAgICAgICAgICAgIFRyeSB0byBydW4gd2l0aCBlbnZpcm9ubWVudCB2YXJpYWJsZTonKTtcbiAgICAgIGNvbnNvbGUubG9nKCcgICAgICAgICAgICAgICBbc3Vkb10gQkxFTk9fSENJX0RFVklDRV9JRD14IG5vZGUgLi4uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdzdGF0ZUNoYW5nZScsIHN0YXRlKTtcbiAgfVxuXG4gIG9uQWRkcmVzc0NoYW5nZShhZGRyZXNzKSB7XG4gICAgdGhpcy5lbWl0KCdhZGRyZXNzQ2hhbmdlJywgYWRkcmVzcyk7XG4gIH1cblxuICBvblJlYWRMb2NhbFZlcnNpb24oaGNpVmVyLCBoY2lSZXYsIGxtcFZlciwgbWFudWZhY3R1cmVyLCBsbXBTdWJWZXIpIHt9XG5cbiAgb25BZHZlcnRpc2luZ1N0YXJ0KGVycm9yKSB7XG4gICAgdGhpcy5lbWl0KCdhZHZlcnRpc2luZ1N0YXJ0JywgZXJyb3IpO1xuICB9XG5cbiAgb25BZHZlcnRpc2luZ1N0b3AoKSB7XG4gICAgdGhpcy5lbWl0KCdhZHZlcnRpc2luZ1N0b3AnKTtcbiAgfVxuXG4gIG9uTGVDb25uQ29tcGxldGUoXG4gICAgc3RhdHVzLFxuICAgIGhhbmRsZSxcbiAgICByb2xlLFxuICAgIGFkZHJlc3NUeXBlLFxuICAgIGFkZHJlc3MsXG4gICAgaW50ZXJ2YWwsXG4gICAgbGF0ZW5jeSxcbiAgICBzdXBlcnZpc2lvblRpbWVvdXQsXG4gICAgbWFzdGVyQ2xvY2tBY2N1cmFjeVxuICApIHtcbiAgICBpZiAocm9sZSAhPT0gMSkge1xuICAgICAgLy8gbm90IHNsYXZlLCBpZ25vcmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRyZXNzID0gYWRkcmVzcztcbiAgICB0aGlzLl9oYW5kbGUgPSBoYW5kbGU7XG4gICAgdGhpcy5fYWNsU3RyZWFtID0gbmV3IEFjbFN0cmVhbShcbiAgICAgIHRoaXMuX2hjaSxcbiAgICAgIGhhbmRsZSxcbiAgICAgIHRoaXMuX2hjaS5hZGRyZXNzVHlwZSxcbiAgICAgIHRoaXMuX2hjaS5hZGRyZXNzLFxuICAgICAgYWRkcmVzc1R5cGUsXG4gICAgICBhZGRyZXNzXG4gICAgKTtcbiAgICB0aGlzLl9nYXR0LnNldEFjbFN0cmVhbSh0aGlzLl9hY2xTdHJlYW0pO1xuXG4gICAgdGhpcy5lbWl0KCdhY2NlcHQnLCBhZGRyZXNzKTtcbiAgfVxuXG4gIG9uTGVDb25uVXBkYXRlQ29tcGxldGUoaGFuZGxlLCBpbnRlcnZhbCwgbGF0ZW5jeSwgc3VwZXJ2aXNpb25UaW1lb3V0KSB7XG4gICAgLy8gbm8tb3BcbiAgfVxuXG4gIG9uRGlzY29ubkNvbXBsZXRlKGhhbmRsZSwgcmVhc29uKSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZSAhPT0gaGFuZGxlKSB7XG4gICAgICByZXR1cm47IC8vbm90IHBlcmlwaGVyYWxcbiAgICB9XG4gICAgaWYgKHRoaXMuX2FjbFN0cmVhbSkge1xuICAgICAgdGhpcy5fYWNsU3RyZWFtLnB1c2gobnVsbCwgbnVsbCk7XG4gICAgfVxuXG4gICAgbGV0IGFkZHJlc3MgPSB0aGlzLl9hZGRyZXNzO1xuXG4gICAgdGhpcy5fYWRkcmVzcyA9IG51bGw7XG4gICAgdGhpcy5faGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLl9hY2xTdHJlYW0gPSBudWxsO1xuXG4gICAgaWYgKGFkZHJlc3MpIHtcbiAgICAgIHRoaXMuZW1pdCgnZGlzY29ubmVjdCcsIGFkZHJlc3MpOyAvLyBUT0RPOiB1c2UgcmVhc29uXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2FkdmVydGlzaW5nKSB7XG4gICAgICB0aGlzLl9nYXAucmVzdGFydEFkdmVydGlzaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgb25FbmNyeXB0Q2hhbmdlKGhhbmRsZSwgZW5jcnlwdCkge1xuICAgIGlmICh0aGlzLl9oYW5kbGUgPT09IGhhbmRsZSAmJiB0aGlzLl9hY2xTdHJlYW0pIHtcbiAgICAgIHRoaXMuX2FjbFN0cmVhbS5wdXNoRW5jcnlwdChlbmNyeXB0KTtcbiAgICB9XG4gIH1cblxuICBvbkxlTHRrTmVnUmVwbHkoaGFuZGxlKSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZSA9PT0gaGFuZGxlICYmIHRoaXMuX2FjbFN0cmVhbSkge1xuICAgICAgdGhpcy5fYWNsU3RyZWFtLnB1c2hMdGtOZWdSZXBseSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTXR1Q2hhbmdlKG10dSkge1xuICAgIHRoaXMuZW1pdCgnbXR1Q2hhbmdlJywgbXR1KTtcbiAgfVxuXG4gIG9uUnNzaVJlYWQoaGFuZGxlLCByc3NpKSB7XG4gICAgdGhpcy5lbWl0KCdyc3NpVXBkYXRlJywgcnNzaSk7XG4gIH1cblxuICBvbkFjbERhdGFQa3QoaGFuZGxlLCBjaWQsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5faGFuZGxlID09PSBoYW5kbGUgJiYgdGhpcy5fYWNsU3RyZWFtKSB7XG4gICAgICB0aGlzLl9hY2xTdHJlYW0ucHVzaChjaWQsIGRhdGEpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZW5vQmluZGluZ3M7XG4iXX0=
