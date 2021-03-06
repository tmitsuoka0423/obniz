/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
import BleDescriptor from "./bleDescriptor";
import BleHelper from "./bleHelper";

/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Peripheral
 */
export default class BleCharacteristic extends BleAttributeAbstract {
  public addDescriptor: any;
  public addChild: any;
  public getDescriptor: any;
  public getChild: any;
  public properties: any;
  public permissions: any;
  public children: any;
  public service: any;
  public uuid: any;

  constructor(obj: any) {
    super(obj);

    this.addDescriptor = this.addChild;
    this.getDescriptor = this.getChild;

    this.properties = obj.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName(): string {
    return "service";
  }

  get childrenClass(): any {
    return BleDescriptor;
  }

  get childrenName(): string {
    return "descriptors";
  }

  get descriptors() {
    return this.children;
  }

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  public addProperty(param: any) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  public removeProperty(param: any) {
    this.properties = this.properties.filter((elm: any) => {
      return elm !== param;
    });
  }

  public addPermission(param: any) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  public removePermission(param: any) {
    this.permissions = this.permissions.filter((elm: any) => {
      return elm !== param;
    });
  }

  public write(data: any) {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
            data,
          },
        },
      },
    });
  }

  public read() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
  }

  public notify() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          notify_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
  }
}
