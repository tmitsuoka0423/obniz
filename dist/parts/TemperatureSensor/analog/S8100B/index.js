"use strict";
const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');
//sensor resopnse not found
class S8100B extends AnalogTemperatureSensor {
    calc(voltage) {
        return 30 + (1.508 - voltage) / -0.08; //Temp(Celsius) =
    }
    static info() {
        return {
            name: 'S8100B',
        };
    }
}
if (typeof module === 'object') {
    module.exports = S8100B;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9hbmFsb2cvUzgxMDBCL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRXRFLDJCQUEyQjtBQUUzQixNQUFNLE1BQU8sU0FBUSx1QkFBdUI7SUFDMUMsSUFBSSxDQUFDLE9BQU87UUFDVixPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQjtJQUMxRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Q0FDekIiLCJmaWxlIjoicGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvYW5hbG9nL1M4MTAwQi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yID0gcmVxdWlyZSgnLi4vQW5hbG9nVGVtcGVyYXR1cmVTZW5zb3InKTtcblxuLy9zZW5zb3IgcmVzb3Buc2Ugbm90IGZvdW5kXG5cbmNsYXNzIFM4MTAwQiBleHRlbmRzIEFuYWxvZ1RlbXBlcmF0dXJlU2Vuc29yIHtcbiAgY2FsYyh2b2x0YWdlKSB7XG4gICAgcmV0dXJuIDMwICsgKDEuNTA4IC0gdm9sdGFnZSkgLyAtMC4wODsgLy9UZW1wKENlbHNpdXMpID1cbiAgfVxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1M4MTAwQicsXG4gICAgfTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBTODEwMEI7XG59XG4iXX0=
