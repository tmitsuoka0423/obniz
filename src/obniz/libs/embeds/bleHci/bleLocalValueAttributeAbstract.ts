/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleHelper from "./bleHelper";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
import BleService from "./bleService";

/**
 * @category Use as Peripheral
 */
export default class BleLocalValueAttributeAbstract<ParentClass, ChildrenClass> extends BleLocalAttributeAbstract<
  ParentClass,
  ChildrenClass
> {
  constructor(params: any) {
    super(params);
  }

  /**
   * @ignore
   * @param dataArray
   */
  public write(dataArray: number[]) {
    this.data = dataArray;
    this.notifyFromServer("onwrite", { result: "success" });
  }

  /**
   * @ignore
   * @param dataArray
   */
  public read() {
    this.notifyFromServer("onread", { data: this.data });
  }

  /**
   * This writes dataArray.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * await attr.writeWait([0xf0,0x27]);
   * console.log("write success");
   * ```
   *
   * @param data
   */
  public writeWait(data: any): Promise<void> {
    return super.writeWait(data);
  }

  /**
   * It reads data.
   *
   * Even you wrote string or number, it returns binary array.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * let data =  await attr.readWait()
   *  console.log("data: " , data );
   * ```
   */
  public readWait(): Promise<number[]> {
    return super.readWait();
  }
}
