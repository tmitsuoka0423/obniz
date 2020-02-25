import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import PeripheralSPI from "../../../obniz/libs/io_peripherals/spi";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstructOptions} from "../../i2cParts";

export interface MatrixLED_HT16K33Options extends I2cPartsAbstructOptions {
}

export default class MatrixLED_HT16K33 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "MatrixLED_HT16K33",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;
  public address: any;
  public width: number = 0;
  public height: number = 0;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;
  private command: any;
  private blink_mode: any;
  private vram: number[];

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c", "address"];
    this.requiredKeys = [];
    this.command = {};
    this.command.blink = 0x80;
    this.command.brightness = 0xE0;

    this.blink_mode = {};
    this.blink_mode.display_on = 0x01;
    this.blink_mode.blink_off = 0x00;
    this.blink_mode.blink_2hz = 0x01;
    this.blink_mode.blink_1hz = 0x02;
    this.blink_mode.blink_halfhz = 0x03;
    this.vram = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.address = this.params.address || 0x70;
    this.params.pull = "5v";
    this.params.mode = "master";
    this.params.clock = this.params.clock || 400 * 1000;
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(1000);
  }

  public init(width: number) { // 8 or 16
    console.log(width);
    this.width = width;
    this.height = 8; // IC static setting
    this.prepareVram(width, this.height);
    this.i2c.write(this.address, [0x21]);
    this.blinkRate(this.blink_mode.blink_off);
    this.brightness(15);
    this.obniz.wait(10);
  }

  public blinkRate(val: number) {
    if (val < 0) {
      val = 0;
    }
    if (val > 3) {
      val = 3;
    }
    this.i2c.write(this.address, [this.command.blink | this.blink_mode.display_on | (val << 1)]);
  }

  public brightness(val: number) {
    if (val < 0) {
      val = 0;
    }
    if (val > 15) {
      val = 15;
    }
    this.i2c.write(this.address, [this.command.brightness | val]);
  }

  public clear() {
    for (let i = 0; i < this.height; i++) {
      this.vram[i] = 0x00;
    }
    this.writeVram();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < this.height; i++) {
      this.vram[i] = 0;
      for (let j = 0; j < this.width; j++) {
        const pos = i * this.height * 4 + j * 4;
        const brightness = 0.34 * data[pos] + 0.5 * data[pos + 1] + 0.16 * data[pos + 2];
        this.vram[i] =  this.vram[i] << 1;
        if (brightness > 0x7f) {
          this.vram[i] |= 0x1;
        }
      }
      this.vram[i] =  this.vram[i] << 16 - this.width;
    }
    this.writeVram();
  }

  private prepareVram(width: number, height: number) {
    this.vram = [];
    for (let i = 0; i < height; i++) {
      this.vram.push(0);
    }
  }

  private writeVram() {
    const data = [0x00];
    for (let i = 0; i < 8; i++) {
      data.push((this.vram[i] >> 8) & 0xFF);
      data.push(this.vram[i] & 0xFF);
    }
    this.i2c.write(this.address, data);
  }

}