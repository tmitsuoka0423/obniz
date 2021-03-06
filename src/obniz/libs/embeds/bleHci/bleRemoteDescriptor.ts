/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
import BleRemoteValueAttributeAbstract from "./bleRemoteValueAttributeAbstract";

/**
 * @category Use as Central
 */
export default class BleRemoteDescriptor extends BleRemoteValueAttributeAbstract<BleRemoteCharacteristic, null> {
  public characteristic!: BleRemoteCharacteristic;

  constructor(params: any) {
    super(params);
  }

  /**
   * @ignore
   */
  get parentName(): string | null {
    return "characteristic";
  }

  /**
   * Read data from descriptor.
   *
   * The return value appears in the callback function [[onread]].
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   peripheral.getService("FF00").getCharacteristic("FF01").read();
   *
   *   peripheral.getService("FF00").getCharacteristic("FF01").onread = (dataArray)=>{
   *   console.log(dataArray);
   *
   *   }
   * }
   * ```
   *
   */
  public read() {
    this.characteristic.service.peripheral.obnizBle.centralBindings.readValue(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
    );
  }

  /**
   * Read data from descriptor.
   *
   * The return value appears in the callback function [[onread]].
   * If reading succeeds an Array with data will be returned.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
   *   console.log(dataArray);
   * }
   * ```
   *
   */
  public readWait(): Promise<number[]> {
    return super.readWait();
  }

  /**
   * This writes dataArray to descriptor.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = [0x02, 0xFF];
   *   peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").write(dataArray);
   * }
   * ```
   *
   * @param data
   */
  public write(data: number[]) {
    this.characteristic.service.peripheral.obnizBle.centralBindings.writeValue(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
      Buffer.from(data),
    );
  }

  /**
   * This writes dataArray to descriptor.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = [0x02, 0xFF];
   *   await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
   *   console.log("write success");
   * }
   * ```
   *
   * @param data
   * @param needResponse
   */
  public writeWait(data: number[], needResponse: boolean): Promise<void> {
    return super.writeWait(data, needResponse);
  }
}
