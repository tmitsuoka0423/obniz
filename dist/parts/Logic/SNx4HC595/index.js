"use strict";
class SNx4HC595 {
    constructor() {
        /* http://www.ti.com/lit/ds/symlink/sn74hc595.pdf */
        this.keys = [
            'gnd',
            'vcc',
            'ser',
            'srclk',
            'rclk',
            'oe',
            'srclr',
            'io_num',
            'enabled',
        ];
        this.requiredKeys = ['ser', 'srclk', 'rclk'];
        this.autoFlash = true;
    }
    static info() {
        return {
            name: 'SNx4HC595',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_ser = this.obniz.getIO(this.params.ser);
        this.io_srclk = this.obniz.getIO(this.params.srclk);
        this.io_rclk = this.obniz.getIO(this.params.rclk);
        this.io_ser.output(false);
        this.io_srclk.output(false);
        this.io_rclk.output(false);
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        if (this.obniz.isValidIO(this.params.srclr)) {
            this.io_srclr = this.obniz.getIO(this.params.srclr);
            this.io_srclr.output(true);
        }
        if (this.obniz.isValidIO(this.params.oe)) {
            this.io_oe = this.obniz.getIO(this.params.oe);
            this.io_oe.output(true);
        }
        if (this.obniz.isValidIO(this.params.vcc) ||
            this.obniz.isValidIO(this.params.gnd)) {
            this.obniz.wait(100);
        }
        if (typeof this.params.io_num !== 'number') {
            this.params.io_num = 8;
        }
        this.ioNum(this.params.io_num);
        if (typeof this.params.enabled !== 'boolean') {
            this.params.enabled = true;
        }
        if (this.io_oe && this.params.enabled) {
            this.io_oe.output(false);
        }
    }
    ioNum(num) {
        class SNx4HC595_IO {
            constructor(chip, id) {
                this.chip = chip;
                this.id = id;
                this.value = 0;
            }
            output(value) {
                this.chip.output(this.id, value);
            }
        }
        if (typeof num === 'number' && this._io_num !== num) {
            this._io_num = num;
            this.io = [];
            for (let i = 0; i < num; i++) {
                this.io.push(new SNx4HC595_IO(this, i));
            }
            this.flush();
        }
        else {
            throw new Error('io num should be a number');
        }
    }
    isValidIO(io) {
        return typeof io === 'number' && io >= 0 && io < this._io_num;
    }
    getIO(io) {
        if (!this.isValidIO(io)) {
            throw new Error('io ' + io + ' is not valid io');
        }
        return this.io[io];
    }
    output(id, value) {
        value = value == true;
        this.io[id].value = value;
        if (this.autoFlash) {
            this.flush();
        }
    }
    onece(operation) {
        if (typeof operation !== 'function') {
            throw new Error('please provide function');
        }
        const lastValue = this.autoFlash;
        this.autoFlash = false;
        operation();
        this.flush();
        this.autoFlash = lastValue;
    }
    setEnable(enable) {
        if (!this.io_oe && enable == false) {
            throw new Error('pin "oe" is not specified');
        }
        this.io_oe.output(!enable);
    }
    flush() {
        /* this code will works with 5v. But you should pay more attention when 3v. Timing is more tight. see chip reference */
        this.io_rclk.output(false);
        for (let i = this.io.length - 1; i >= 0; i--) {
            this.io_ser.output(this.io[i].value);
            this.io_srclk.output(true);
            this.io_srclk.output(false);
        }
        this.io_rclk.output(true);
    }
}
if (typeof module === 'object') {
    module.exports = SNx4HC595;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Mb2dpYy9TTng0SEM1OTUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sU0FBUztJQUNiO1FBQ0Usb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxPQUFPO1lBQ1AsTUFBTTtZQUNOLElBQUk7WUFDSixPQUFPO1lBQ1AsUUFBUTtZQUNSLFNBQVM7U0FDVixDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxXQUFXO1NBQ2xCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU3RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QjtRQUVELElBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFDckM7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QjtRQUVELElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJ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TSxJQUFJLEtBQUssRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLO1FBQ0gsdUhBQXVIO1FBQ3ZILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0NBQzVCIiwiZmlsZSI6InBhcnRzL0xvZ2ljL1NOeDRIQzU5NS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNOeDRIQzU5NSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qIGh0dHA6Ly93d3cudGkuY29tL2xpdC9kcy9zeW1saW5rL3NuNzRoYzU5NS5wZGYgKi9cbiAgICB0aGlzLmtleXMgPSBbXG4gICAgICAnZ25kJyxcbiAgICAgICd2Y2MnLFxuICAgICAgJ3NlcicsXG4gICAgICAnc3JjbGsnLFxuICAgICAgJ3JjbGsnLFxuICAgICAgJ29lJyxcbiAgICAgICdzcmNscicsXG4gICAgICAnaW9fbnVtJyxcbiAgICAgICdlbmFibGVkJyxcbiAgICBdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWydzZXInLCAnc3JjbGsnLCAncmNsayddO1xuXG4gICAgdGhpcy5hdXRvRmxhc2ggPSB0cnVlO1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdTTng0SEM1OTUnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIHRoaXMuaW9fc2VyID0gdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zZXIpO1xuICAgIHRoaXMuaW9fc3JjbGsgPSB0aGlzLm9ibml6LmdldElPKHRoaXMucGFyYW1zLnNyY2xrKTtcbiAgICB0aGlzLmlvX3JjbGsgPSB0aGlzLm9ibml6LmdldElPKHRoaXMucGFyYW1zLnJjbGspO1xuXG4gICAgdGhpcy5pb19zZXIub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLmlvX3NyY2xrLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5pb19yY2xrLm91dHB1dChmYWxzZSk7XG5cbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG5cbiAgICBpZiAodGhpcy5vYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMuc3JjbHIpKSB7XG4gICAgICB0aGlzLmlvX3NyY2xyID0gdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5zcmNscik7XG4gICAgICB0aGlzLmlvX3NyY2xyLm91dHB1dCh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMub2UpKSB7XG4gICAgICB0aGlzLmlvX29lID0gdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5vZSk7XG4gICAgICB0aGlzLmlvX29lLm91dHB1dCh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLm9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy52Y2MpIHx8XG4gICAgICB0aGlzLm9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5nbmQpXG4gICAgKSB7XG4gICAgICB0aGlzLm9ibml6LndhaXQoMTAwKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucGFyYW1zLmlvX251bSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMucGFyYW1zLmlvX251bSA9IDg7XG4gICAgfVxuICAgIHRoaXMuaW9OdW0odGhpcy5wYXJhbXMuaW9fbnVtKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5wYXJhbXMuZW5hYmxlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aGlzLnBhcmFtcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW9fb2UgJiYgdGhpcy5wYXJhbXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5pb19vZS5vdXRwdXQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGlvTnVtKG51bSkge1xuICAgIGNsYXNzIFNOeDRIQzU5NV9JTyB7XG4gICAgICBjb25zdHJ1Y3RvcihjaGlwLCBpZCkge1xuICAgICAgICB0aGlzLmNoaXAgPSBjaGlwO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBvdXRwdXQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5jaGlwLm91dHB1dCh0aGlzLmlkLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInICYmIHRoaXMuX2lvX251bSAhPT0gbnVtKSB7XG4gICAgICB0aGlzLl9pb19udW0gPSBudW07XG4gICAgICB0aGlzLmlvID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgIHRoaXMuaW8ucHVzaChuZXcgU054NEhDNTk1X0lPKHRoaXMsIGkpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbyBudW0gc2hvdWxkIGJlIGEgbnVtYmVyJyk7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZElPKGlvKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpbyA9PT0gJ251bWJlcicgJiYgaW8gPj0gMCAmJiBpbyA8IHRoaXMuX2lvX251bTtcbiAgfVxuXG4gIGdldElPKGlvKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRJTyhpbykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW8gJyArIGlvICsgJyBpcyBub3QgdmFsaWQgaW8nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW9baW9dO1xuICB9XG5cbiAgb3V0cHV0KGlkLCB2YWx1ZSkge1xuICAgIHZhbHVlID0gdmFsdWUgPT0gdHJ1ZTtcbiAgICB0aGlzLmlvW2lkXS52YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmF1dG9GbGFzaCkge1xuICAgICAgdGhpcy5mbHVzaCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uZWNlKG9wZXJhdGlvbikge1xuICAgIGlmICh0eXBlb2Ygb3BlcmF0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIGNvbnN0IGxhc3RWYWx1ZSA9IHRoaXMuYXV0b0ZsYXNoO1xuICAgIHRoaXMuYXV0b0ZsYXNoID0gZmFsc2U7XG4gICAgb3BlcmF0aW9uKCk7XG4gICAgdGhpcy5mbHVzaCgpO1xuICAgIHRoaXMuYXV0b0ZsYXNoID0gbGFzdFZhbHVlO1xuICB9XG5cbiAgc2V0RW5hYmxlKGVuYWJsZSkge1xuICAgIGlmICghdGhpcy5pb19vZSAmJiBlbmFibGUgPT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGluIFwib2VcIiBpcyBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuICAgIHRoaXMuaW9fb2Uub3V0cHV0KCFlbmFibGUpO1xuICB9XG5cbiAgZmx1c2goKSB7XG4gICAgLyogdGhpcyBjb2RlIHdpbGwgd29ya3Mgd2l0aCA1di4gQnV0IHlvdSBzaG91bGQgcGF5IG1vcmUgYXR0ZW50aW9uIHdoZW4gM3YuIFRpbWluZyBpcyBtb3JlIHRpZ2h0LiBzZWUgY2hpcCByZWZlcmVuY2UgKi9cbiAgICB0aGlzLmlvX3JjbGsub3V0cHV0KGZhbHNlKTtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5pby5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5pb19zZXIub3V0cHV0KHRoaXMuaW9baV0udmFsdWUpO1xuICAgICAgdGhpcy5pb19zcmNsay5vdXRwdXQodHJ1ZSk7XG4gICAgICB0aGlzLmlvX3NyY2xrLm91dHB1dChmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMuaW9fcmNsay5vdXRwdXQodHJ1ZSk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gU054NEhDNTk1O1xufVxuIl19
