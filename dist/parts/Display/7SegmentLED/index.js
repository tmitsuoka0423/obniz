"use strict";
class _7SegmentLED {
    constructor() {
        this.keys = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'dp',
            'common',
            'commonType',
        ];
        this.requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        this.digits = [
            0x3f,
            0x06,
            0x5b,
            0x4f,
            0x66,
            0x6d,
            0x7d,
            0x07,
            0x7f,
            0x6f,
            0x6f,
        ];
        this.displayIoNames = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e',
            f: 'f',
            g: 'g',
            dp: 'dp',
            common: 'com',
        };
    }
    static info() {
        return {
            name: '7SegmentLED',
        };
    }
    wired(obniz) {
        function getIO(io) {
            if (io && typeof io === 'object') {
                if (typeof io['output'] === 'function') {
                    return io;
                }
            }
            return obniz.getIO(io);
        }
        function isValidIO(io) {
            if (io && typeof io === 'object') {
                if (typeof io['output'] === 'function') {
                    return true;
                }
            }
            return obniz.isValidIO(io);
        }
        this.obniz = obniz;
        this.ios = [];
        this.ios.push(getIO(this.params.a));
        this.ios.push(getIO(this.params.b));
        this.ios.push(getIO(this.params.c));
        this.ios.push(getIO(this.params.d));
        this.ios.push(getIO(this.params.e));
        this.ios.push(getIO(this.params.f));
        this.ios.push(getIO(this.params.g));
        this.isCathodeCommon = this.params.commonType === 'anode' ? false : true;
        for (let i = 0; i < this.ios.length; i++) {
            this.ios[i].output(this.isCathodeCommon ? false : true);
        }
        if (isValidIO(this.params.dp)) {
            this.dp = getIO(this.params.dp);
            this.dp.output(false);
        }
        if (isValidIO(this.params.common)) {
            this.common = getIO(this.params.common);
            this.on();
        }
    }
    print(data) {
        if (typeof data === 'number') {
            data = parseInt(data);
            data = data % 10;
            for (let i = 0; i < 7; i++) {
                if (this.ios[i]) {
                    let val = this.digits[data] & (1 << i) ? true : false;
                    if (!this.isCathodeCommon) {
                        val = !val;
                    }
                    this.ios[i].output(val);
                }
            }
            this.on();
        }
    }
    printRaw(data) {
        if (typeof data === 'number') {
            for (let i = 0; i < 7; i++) {
                if (this.ios[i]) {
                    let val = data & (1 << i) ? true : false;
                    if (!this.isCathodeCommon) {
                        val = !val;
                    }
                    this.ios[i].output(val);
                }
            }
            this.on();
        }
    }
    dpState(show) {
        if (this.dp) {
            this.dp.output(this.isCathodeCommon ? show : !show);
        }
    }
    on() {
        this.common.output(this.isCathodeCommon ? false : true);
    }
    off() {
        this.common.output(this.isCathodeCommon ? true : false);
    }
}
if (typeof module === 'object') {
    module.exports = _7SegmentLED;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXNwbGF5LzdTZWdtZW50TEVEL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFlBQVk7SUFDaEI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsR0FBRztZQUNILEdBQUc7WUFDSCxHQUFHO1lBQ0gsR0FBRztZQUNILEdBQUc7WUFDSCxHQUFHO1lBQ0gsR0FBRztZQUNILElBQUk7WUFDSixRQUFRO1lBQ1IsWUFBWTtTQUNiLENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNaLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0wsQ0FBQztRQUVGLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsR0FBRztZQUNOLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsR0FBRztZQUNOLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLEdBQUc7WUFDTixFQUFFLEVBQUUsSUFBSTtZQUNSLE1BQU0sRUFBRSxLQUFLO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsU0FBUyxLQUFLLENBQUMsRUFBRTtZQUNmLElBQUksRUFBRSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtnQkFDaEMsSUFBSSxP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QyxFQUFFLEVBQUUsQ0FBQztTQUNYO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJO1FBQ1YsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUVELEVBQUU7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxHQUFHO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztDQUMvQiIsImZpbGUiOiJwYXJ0cy9EaXNwbGF5LzdTZWdtZW50TEVEL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgXzdTZWdtZW50TEVEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1xuICAgICAgJ2EnLFxuICAgICAgJ2InLFxuICAgICAgJ2MnLFxuICAgICAgJ2QnLFxuICAgICAgJ2UnLFxuICAgICAgJ2YnLFxuICAgICAgJ2cnLFxuICAgICAgJ2RwJyxcbiAgICAgICdjb21tb24nLFxuICAgICAgJ2NvbW1vblR5cGUnLFxuICAgIF07XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnXTtcblxuICAgIHRoaXMuZGlnaXRzID0gW1xuICAgICAgMHgzZixcbiAgICAgIDB4MDYsXG4gICAgICAweDViLFxuICAgICAgMHg0ZixcbiAgICAgIDB4NjYsXG4gICAgICAweDZkLFxuICAgICAgMHg3ZCxcbiAgICAgIDB4MDcsXG4gICAgICAweDdmLFxuICAgICAgMHg2ZixcbiAgICAgIDB4NmYsXG4gICAgXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7XG4gICAgICBhOiAnYScsXG4gICAgICBiOiAnYicsXG4gICAgICBjOiAnYycsXG4gICAgICBkOiAnZCcsXG4gICAgICBlOiAnZScsXG4gICAgICBmOiAnZicsXG4gICAgICBnOiAnZycsXG4gICAgICBkcDogJ2RwJyxcbiAgICAgIGNvbW1vbjogJ2NvbScsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnN1NlZ21lbnRMRUQnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIGZ1bmN0aW9uIGdldElPKGlvKSB7XG4gICAgICBpZiAoaW8gJiYgdHlwZW9mIGlvID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAodHlwZW9mIGlvWydvdXRwdXQnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBpbztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9ibml6LmdldElPKGlvKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNWYWxpZElPKGlvKSB7XG4gICAgICBpZiAoaW8gJiYgdHlwZW9mIGlvID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAodHlwZW9mIGlvWydvdXRwdXQnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JuaXouaXNWYWxpZElPKGlvKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5pb3MgPSBbXTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmEpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmIpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmMpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmQpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmUpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmYpKTtcbiAgICB0aGlzLmlvcy5wdXNoKGdldElPKHRoaXMucGFyYW1zLmcpKTtcblxuICAgIHRoaXMuaXNDYXRob2RlQ29tbW9uID0gdGhpcy5wYXJhbXMuY29tbW9uVHlwZSA9PT0gJ2Fub2RlJyA/IGZhbHNlIDogdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuaW9zW2ldLm91dHB1dCh0aGlzLmlzQ2F0aG9kZUNvbW1vbiA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzVmFsaWRJTyh0aGlzLnBhcmFtcy5kcCkpIHtcbiAgICAgIHRoaXMuZHAgPSBnZXRJTyh0aGlzLnBhcmFtcy5kcCk7XG4gICAgICB0aGlzLmRwLm91dHB1dChmYWxzZSk7XG4gICAgfVxuICAgIGlmIChpc1ZhbGlkSU8odGhpcy5wYXJhbXMuY29tbW9uKSkge1xuICAgICAgdGhpcy5jb21tb24gPSBnZXRJTyh0aGlzLnBhcmFtcy5jb21tb24pO1xuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaW50KGRhdGEpIHtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInKSB7XG4gICAgICBkYXRhID0gcGFyc2VJbnQoZGF0YSk7XG4gICAgICBkYXRhID0gZGF0YSAlIDEwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5pb3NbaV0pIHtcbiAgICAgICAgICBsZXQgdmFsID0gdGhpcy5kaWdpdHNbZGF0YV0gJiAoMSA8PCBpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICBpZiAoIXRoaXMuaXNDYXRob2RlQ29tbW9uKSB7XG4gICAgICAgICAgICB2YWwgPSAhdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlvc1tpXS5vdXRwdXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaW50UmF3KGRhdGEpIHtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5pb3NbaV0pIHtcbiAgICAgICAgICBsZXQgdmFsID0gZGF0YSAmICgxIDw8IGkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgIGlmICghdGhpcy5pc0NhdGhvZGVDb21tb24pIHtcbiAgICAgICAgICAgIHZhbCA9ICF2YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaW9zW2ldLm91dHB1dCh2YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG5cbiAgZHBTdGF0ZShzaG93KSB7XG4gICAgaWYgKHRoaXMuZHApIHtcbiAgICAgIHRoaXMuZHAub3V0cHV0KHRoaXMuaXNDYXRob2RlQ29tbW9uID8gc2hvdyA6ICFzaG93KTtcbiAgICB9XG4gIH1cblxuICBvbigpIHtcbiAgICB0aGlzLmNvbW1vbi5vdXRwdXQodGhpcy5pc0NhdGhvZGVDb21tb24gPyBmYWxzZSA6IHRydWUpO1xuICB9XG5cbiAgb2ZmKCkge1xuICAgIHRoaXMuY29tbW9uLm91dHB1dCh0aGlzLmlzQ2F0aG9kZUNvbW1vbiA/IHRydWUgOiBmYWxzZSk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gXzdTZWdtZW50TEVEO1xufVxuIl19
