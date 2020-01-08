"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AMG8833 {
    constructor() {
        this.requiredKeys = [];
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'address'];
        this.ioKeys = ['vcc', 'gnd', 'sda', 'scl'];
        this.commands = {};
        this.commands.mode_normal = [0x00, 0x00];
        this.commands.reset_flag = [0x01, 0x30];
        this.commands.reset_initial = [0x01, 0x3f];
        this.commands.frameRate_10fps = [0x02, 0x00];
        this.commands.frameRate_1fps = [0x02, 0x01];
        this.commands.int_disable = [0x03, 0x00];
        this.commands.int_absVal = [0x03, 0x03];
        this.commands.int_diff = [0x03, 0x01];
        this.commands.stat = [0x04];
        this.commands.statClr_ovs = [0x05, 0x04];
        this.commands.statClr_int = [0x05, 0x02];
        this.commands.average_disable = [0x07, 0x00];
        this.commands.average_enable = [0x07, 0x10];
    }
    static info() {
        return {
            name: 'AMG8833',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.address = 0x69;
        if (this.params.address === 0x69) {
            this.address = 0x69;
        }
        else if (this.params.addressmode === 0x68) {
            this.address = 0x68;
        }
        else if (this.params.address !== undefined) {
            throw new Error('address must be 0x68 or 0x69');
        }
        this.params.clock = this.params.clock || 400 * 1000; //for i2c
        this.params.mode = this.params.mode || 'master'; //for i2c
        this.params.pull = this.params.pull || null; //for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(50);
        obniz.i2c0.write(this.address, this.commands.mode_normal);
        obniz.i2c0.write(this.address, this.commands.reset_flag);
        obniz.i2c0.write(this.address, this.commands.frameRate_10fps);
        obniz.i2c0.write(this.address, this.commands.int_disable);
    }
    getOnePixWait(pixel) {
        return __awaiter(this, void 0, void 0, function* () {
            let pixelAddrL = 0x80;
            let pixelAddrH = 0x81;
            if (pixel >= 0 && pixel <= 63) {
                pixelAddrL = 0x80 + pixel * 2;
                pixelAddrH = 0x81 + pixel * 2;
            }
            else {
                throw new Error('pixel number must be range of 0 to 63');
            }
            this.i2c.write(this.address, [pixelAddrL]);
            let dataL = yield this.i2c.readWait(this.address, 1);
            this.i2c.write(this.address, [pixelAddrH]);
            let dataH = yield this.i2c.readWait(this.address, 1);
            let temp12bit = (dataH << 8) | dataL;
            if (dataH & 0x08) {
                // negative temperature
                temp12bit = temp12bit - 1;
                temp12bit = 0xfff - temp12bit; // bit inverting
                return temp12bit * -0.25;
            }
            else {
                // positive temperature
                return temp12bit * 0.25;
            }
        });
    }
    getAllPixWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let tempArray = new Array(64);
            this.i2c.write(this.address, [0x80]);
            const datas = yield this.i2c.readWait(this.address, 64 * 2);
            for (let i = 0; i < 64; i++) {
                let temp12bit = (datas[i * 2 + 1] << 8) | datas[i * 2];
                let temp = 0;
                if (datas[i * 2 + 1] & 0x08) {
                    // negative temperature
                    temp12bit = temp12bit - 1;
                    temp12bit = 0xfff - temp12bit; // bit inverting
                    temp = temp12bit * -0.25;
                }
                else {
                    // positive temperature
                    temp = temp12bit * 0.25;
                }
                tempArray[i] = temp;
            }
            return tempArray;
        });
    }
}
if (typeof module === 'object') {
    module.exports = AMG8833;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQU1HODgzMy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxPQUFPO0lBQ1g7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxJ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QUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRTVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNCLElBQUksU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUMzQix1QkFBdUI7b0JBQ3ZCLFNBQVMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUMxQixTQUFTLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQjtvQkFDL0MsSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQztpQkFDMUI7cUJBQU07b0JBQ0wsdUJBQXVCO29CQUN2QixJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDekI7Z0JBQ0QsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNyQjtZQUVELE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7S0FBQTtDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDMUIiLCJmaWxlIjoicGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL0FNRzg4MzMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBTUc4ODMzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXTtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2RhJywgJ3NjbCcsICdhZGRyZXNzJ107XG5cbiAgICB0aGlzLmlvS2V5cyA9IFsndmNjJywgJ2duZCcsICdzZGEnLCAnc2NsJ107XG4gICAgdGhpcy5jb21tYW5kcyA9IHt9O1xuICAgIHRoaXMuY29tbWFuZHMubW9kZV9ub3JtYWwgPSBbMHgwMCwgMHgwMF07XG4gICAgdGhpcy5jb21tYW5kcy5yZXNldF9mbGFnID0gWzB4MDEsIDB4MzBdO1xuICAgIHRoaXMuY29tbWFuZHMucmVzZXRfaW5pdGlhbCA9IFsweDAxLCAweDNmXTtcbiAgICB0aGlzLmNvbW1hbmRzLmZyYW1lUmF0ZV8xMGZwcyA9IFsweDAyLCAweDAwXTtcbiAgICB0aGlzLmNvbW1hbmRzLmZyYW1lUmF0ZV8xZnBzID0gWzB4MDIsIDB4MDFdO1xuICAgIHRoaXMuY29tbWFuZHMuaW50X2Rpc2FibGUgPSBbMHgwMywgMHgwMF07XG4gICAgdGhpcy5jb21tYW5kcy5pbnRfYWJzVmFsID0gWzB4MDMsIDB4MDNdO1xuICAgIHRoaXMuY29tbWFuZHMuaW50X2RpZmYgPSBbMHgwMywgMHgwMV07XG4gICAgdGhpcy5jb21tYW5kcy5zdGF0ID0gWzB4MDRdO1xuICAgIHRoaXMuY29tbWFuZHMuc3RhdENscl9vdnMgPSBbMHgwNSwgMHgwNF07XG4gICAgdGhpcy5jb21tYW5kcy5zdGF0Q2xyX2ludCA9IFsweDA1LCAweDAyXTtcbiAgICB0aGlzLmNvbW1hbmRzLmF2ZXJhZ2VfZGlzYWJsZSA9IFsweDA3LCAweDAwXTtcbiAgICB0aGlzLmNvbW1hbmRzLmF2ZXJhZ2VfZW5hYmxlID0gWzB4MDcsIDB4MTBdO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdBTUc4ODMzJyxcbiAgICB9O1xuICB9XG5cbiAgd2lyZWQob2JuaXopIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5vYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsICc1dicpO1xuXG4gICAgdGhpcy5hZGRyZXNzID0gMHg2OTtcbiAgICBpZiAodGhpcy5wYXJhbXMuYWRkcmVzcyA9PT0gMHg2OSkge1xuICAgICAgdGhpcy5hZGRyZXNzID0gMHg2OTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLmFkZHJlc3Ntb2RlID09PSAweDY4KSB7XG4gICAgICB0aGlzLmFkZHJlc3MgPSAweDY4O1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMuYWRkcmVzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZHJlc3MgbXVzdCBiZSAweDY4IG9yIDB4NjknKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IHRoaXMucGFyYW1zLmNsb2NrIHx8IDQwMCAqIDEwMDA7IC8vZm9yIGkyY1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSB0aGlzLnBhcmFtcy5tb2RlIHx8ICdtYXN0ZXInOyAvL2ZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gdGhpcy5wYXJhbXMucHVsbCB8fCBudWxsOyAvL2ZvciBpMmNcbiAgICB0aGlzLmkyYyA9IG9ibml6LmdldEkyQ1dpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuICAgIHRoaXMub2JuaXoud2FpdCg1MCk7XG5cbiAgICBvYm5pei5pMmMwLndyaXRlKHRoaXMuYWRkcmVzcywgdGhpcy5jb21tYW5kcy5tb2RlX25vcm1hbCk7XG4gICAgb2JuaXouaTJjMC53cml0ZSh0aGlzLmFkZHJlc3MsIHRoaXMuY29tbWFuZHMucmVzZXRfZmxhZyk7XG4gICAgb2JuaXouaTJjMC53cml0ZSh0aGlzLmFkZHJlc3MsIHRoaXMuY29tbWFuZHMuZnJhbWVSYXRlXzEwZnBzKTtcbiAgICBvYm5pei5pMmMwLndyaXRlKHRoaXMuYWRkcmVzcywgdGhpcy5jb21tYW5kcy5pbnRfZGlzYWJsZSk7XG4gIH1cblxuICBhc3luYyBnZXRPbmVQaXhXYWl0KHBpeGVsKSB7XG4gICAgbGV0IHBpeGVsQWRkckwgPSAweDgwO1xuICAgIGxldCBwaXhlbEFkZHJIID0gMHg4MTtcbiAgICBpZiAocGl4ZWwgPj0gMCAmJiBwaXhlbCA8PSA2Mykge1xuICAgICAgcGl4ZWxBZGRyTCA9IDB4ODAgKyBwaXhlbCAqIDI7XG4gICAgICBwaXhlbEFkZHJIID0gMHg4MSArIHBpeGVsICogMjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwaXhlbCBudW1iZXIgbXVzdCBiZSByYW5nZSBvZiAwIHRvIDYzJyk7XG4gICAgfVxuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgW3BpeGVsQWRkckxdKTtcbiAgICBsZXQgZGF0YUwgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDEpO1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgW3BpeGVsQWRkckhdKTtcbiAgICBsZXQgZGF0YUggPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDEpO1xuICAgIGxldCB0ZW1wMTJiaXQgPSAoZGF0YUggPDwgOCkgfCBkYXRhTDtcbiAgICBpZiAoZGF0YUggJiAweDA4KSB7XG4gICAgICAvLyBuZWdhdGl2ZSB0ZW1wZXJhdHVyZVxuICAgICAgdGVtcDEyYml0ID0gdGVtcDEyYml0IC0gMTtcbiAgICAgIHRlbXAxMmJpdCA9IDB4ZmZmIC0gdGVtcDEyYml0OyAvLyBiaXQgaW52ZXJ0aW5nXG4gICAgICByZXR1cm4gdGVtcDEyYml0ICogLTAuMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBvc2l0aXZlIHRlbXBlcmF0dXJlXG4gICAgICByZXR1cm4gdGVtcDEyYml0ICogMC4yNTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRBbGxQaXhXYWl0KCkge1xuICAgIGxldCB0ZW1wQXJyYXkgPSBuZXcgQXJyYXkoNjQpO1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzB4ODBdKTtcbiAgICBjb25zdCBkYXRhcyA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgNjQgKiAyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgbGV0IHRlbXAxMmJpdCA9IChkYXRhc1tpICogMiArIDFdIDw8IDgpIHwgZGF0YXNbaSAqIDJdO1xuICAgICAgbGV0IHRlbXAgPSAwO1xuICAgICAgaWYgKGRhdGFzW2kgKiAyICsgMV0gJiAweDA4KSB7XG4gICAgICAgIC8vIG5lZ2F0aXZlIHRlbXBlcmF0dXJlXG4gICAgICAgIHRlbXAxMmJpdCA9IHRlbXAxMmJpdCAtIDE7XG4gICAgICAgIHRlbXAxMmJpdCA9IDB4ZmZmIC0gdGVtcDEyYml0OyAvLyBiaXQgaW52ZXJ0aW5nXG4gICAgICAgIHRlbXAgPSB0ZW1wMTJiaXQgKiAtMC4yNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBvc2l0aXZlIHRlbXBlcmF0dXJlXG4gICAgICAgIHRlbXAgPSB0ZW1wMTJiaXQgKiAwLjI1O1xuICAgICAgfVxuICAgICAgdGVtcEFycmF5W2ldID0gdGVtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcEFycmF5O1xuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IEFNRzg4MzM7XG59XG4iXX0=
