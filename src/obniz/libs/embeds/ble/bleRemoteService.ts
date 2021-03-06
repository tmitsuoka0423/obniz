/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleHelper from "./bleHelper";
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
export default class BleRemoteService extends BleRemoteAttributeAbstract {
  public children: any;
  public addChild: any;
  public getChild: any;
  public discoverChildrenWait: any;
  public peripheral: any;
  public uuid: any;
  public parent: any;

  constructor(obj: any) {
    super(obj);
  }

  get parentName(): string | null {
    return "peripheral";
  }

  get childrenClass(): any {
    return BleRemoteCharacteristic;
  }

  get childrenName(): string | null {
    return "characteristics";
  }

  get characteristics() {
    return this.children;
  }

  public addCharacteristic(params: any) {
    return this.addChild(params);
  }

  public getCharacteristic(params: any) {
    return this.getChild(params);
  }

  public discoverAllCharacteristics() {
    return this.discoverChildren();
  }

  public discoverAllCharacteristicsWait() {
    return this.discoverChildrenWait();
  }

  public discoverChildren() {
    const obj: any = {
      ble: {
        get_characteristics: {
          address: this.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.parent.Obniz.send(obj);
  }

  public ondiscover(characteristic: any) {
    this.ondiscovercharacteristic(characteristic);
  }

  public ondiscoverfinished(characteristics: any) {
    this.ondiscovercharacteristicfinished(characteristics);
  }

  public ondiscovercharacteristic(characteristic: any) {}

  public ondiscovercharacteristicfinished(characteristics: any[]) {}
}
